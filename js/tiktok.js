/* TikTok / GoonTok Feed App — live feed, ported from Ultimate Downloader.
 *
 * Source chain (mirrors `/api/goontok-feed` + `/api/extract` in server.js):
 *
 *   1. GoonTok creator pack -> 33 shards x 5000 rows of {url, creator, tags}
 *   2. TikWM              -> resolves each TikTok page URL into a watermark-free
 *                            mp4 plus cover, author, music and counters
 *
 * The shard host sends no `Access-Control-Allow-Origin`, so step 1 walks a ladder
 * of transports (same-origin proxy first, then public CORS relays) and remembers
 * whichever one answered. TikWM and the TikTok CDN both send `ACAO: *`, so every
 * step after that is a plain browser fetch.
 *
 * Clips resolve lazily — only the active card and `lookahead` neighbours hold a
 * loaded <video>; everything further out is torn back down to its poster.
 */

const GOONTOK = {
  origin: 'https://goontok.mochimiatechdom.workers.dev',
  shards: 33,
  batch: 30,        // clips appended per shard pull
  lookahead: 2,     // clips resolved ahead of the active one
  keepLoaded: 2,    // distance past which a <video> gives its buffer back
  tailroom: 5,      // clips left before the next shard is pulled
  tikwmGap: 1300,   // TikWM allows roughly one request per second
  tikwmRetries: 2,
};

const shardUrl = (n) => `${GOONTOK.origin}/data/creator-pack/shard-${String(n).padStart(3, '0')}.json`;

/* Ordered by preference. `/api/goontok-feed` exists when the page is served by
 * the Ultimate Downloader server (or a Pages Function); on a plain static host it
 * 404s and we fall through to a relay. */
const SHARD_TRANSPORTS = [
  { name: 'server', url: () => `/api/goontok-feed?limit=${GOONTOK.batch * 6}` },
  { name: 'direct', url: (abs) => abs },
  { name: 'corsproxy', url: (abs) => `https://corsproxy.io/?url=${encodeURIComponent(abs)}` },
  { name: 'allorigins', url: (abs) => `https://api.allorigins.win/raw?url=${encodeURIComponent(abs)}` },
];

/* Shown only when every transport fails, so the window is never a black box. */
const LOCAL_FALLBACK = [
  { url: '', creator: 'lujain_official', tags: ['offline'], media: 'assets/salah.gif', title: 'وضع محلي — تعذّر الوصول للمصدر' },
  { url: '', creator: 'big_sister_study', tags: ['offline'], media: 'assets/family/big-sister/studying.jpg', title: 'وضع محلي — تعذّر الوصول للمصدر' },
  { url: '', creator: 'mother_night_club', tags: ['offline'], media: 'assets/family/mother/in the club.jpg', title: 'وضع محلي — تعذّر الوصول للمصدر' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const compact = (n) => {
  n = Number(n) || 0;
  const cut = (v, u) => (v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')) + u;
  if (n >= 1e9) return cut(n / 1e9, 'B');
  if (n >= 1e6) return cut(n / 1e6, 'M');
  if (n >= 1e3) return cut(n / 1e3, 'K');
  return String(n);
};

const shuffle = (arr) => {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/* ── TikWM resolver ──────────────────────────────────────────────────────────
 * One request at a time, spaced by `tikwmGap`, results memoised per page URL.
 * A failed resolve drops out of the cache so the card's retry button works. */
const TikWM = (() => {
  const cache = new Map();
  let chain = Promise.resolve();
  let lastAt = 0;

  const absolutise = (u) => (u && u.startsWith('/') ? `https://www.tikwm.com${u}` : u);

  async function call(pageUrl) {
    let lastErr;
    for (let attempt = 0; attempt <= GOONTOK.tikwmRetries; attempt++) {
      const wait = GOONTOK.tikwmGap - (Date.now() - lastAt);
      if (wait > 0) await sleep(wait);
      lastAt = Date.now();
      try {
        const res = await fetch(`https://www.tikwm.com/api/?hd=1&url=${encodeURIComponent(pageUrl)}`, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`TikWM ${res.status}`);
        const body = await res.json();
        if (body.code !== 0 || !body.data) throw new Error(body.msg || 'TikWM rejected the clip');
        return body.data;
      } catch (err) {
        lastErr = err;
        await sleep(700 * (attempt + 1));
      }
    }
    throw lastErr;
  }

  return {
    resolve(pageUrl) {
      const hit = cache.get(pageUrl);
      if (hit) return hit;

      const job = () => call(pageUrl);
      const p = chain.then(job, job);          // a rejection must not poison the queue
      chain = p.catch(() => {});
      cache.set(pageUrl, p);
      p.catch(() => cache.delete(pageUrl));
      return p;
    },

    /* Flatten a TikWM payload into what a card needs. */
    normalise(d) {
      const music = d.music_info ? [d.music_info.title, d.music_info.author].filter(Boolean).join(' - ') : '';
      return {
        video: absolutise(d.hdplay || d.play || d.wmplay),
        cover: absolutise(d.origin_cover || d.cover),
        avatar: d.author?.avatar || 'assets/blog-pfp.png',
        user: d.author?.unique_id || d.author?.nickname || 'goontok',
        title: (d.title || '').trim(),
        sound: music ? `♫ ${music}` : '♫ Original Sound',
        duration: Number(d.duration) || 0,
        likes: compact(d.digg_count),
        comments: compact(d.comment_count),
        bookmarks: compact(d.collect_count),
        shares: compact(d.share_count),
      };
    },
  };
})();

/* ── Shard loader ────────────────────────────────────────────────────────── */
const Shards = (() => {
  let live = null;   // index of the transport that last worked

  return {
    get transport() {
      return live == null ? null : SHARD_TRANSPORTS[live].name;
    },

    async pull() {
      const shard = Math.floor(Math.random() * GOONTOK.shards);
      const abs = shardUrl(shard);
      const order = SHARD_TRANSPORTS.map((_, i) => i);
      if (live != null) order.sort((a, b) => (a === live ? -1 : b === live ? 1 : 0));

      for (const i of order) {
        try {
          const res = await fetch(SHARD_TRANSPORTS[i].url(abs, shard), { cache: 'no-store' });
          if (!res.ok) continue;
          const rows = await res.json();
          if (!Array.isArray(rows) || !rows.length) continue;
          live = i;
          return { shard, rows: rows.filter((r) => r && typeof r.url === 'string' && /tiktok\.com/i.test(r.url)) };
        } catch {
          /* try the next transport */
        }
      }
      return null;
    },
  };
})();

Apps.tiktok = {
  title: 'TikTok / GoonTok Feed',
  glyph: Icons.tiktok,
  width: 420,
  height: 720,

  async mount(body) {
    body.style.cssText = 'padding:0;margin:0;overflow:hidden';

    body.innerHTML = `
      <div class="tk-app" dir="rtl">
        <header class="tk-top-bar">
          <div class="tk-live-btn">GOONTOK</div>
          <div class="tk-status" title="مصدر البث">جارٍ الاتصال…</div>
          <button class="tk-icon-btn tk-refresh-btn" title="سحب دفعة جديدة">🔄</button>
          <button class="tk-icon-btn tk-mute-btn" title="الصوت">🔇</button>
          <button class="tk-autoscroll-toggle" title="تبديل التصفح التلقائي">
            <span class="tk-autoscroll-dot"></span>
            <span class="tk-autoscroll-text">تلقائي</span>
          </button>
        </header>

        <div class="tk-viewport">
          <div class="tk-feed-container"></div>
        </div>

        <div class="tk-control-bar">
          <div class="tk-progress-bar"><div class="tk-progress-fill"></div></div>
          <div class="tk-controls">
            <button class="tk-btn-ctrl tk-prev-btn" title="السابق">▲</button>
            <button class="tk-btn-ctrl tk-playpause-btn" title="تشغيل/إيقاف التصفح">❚❚</button>
            <button class="tk-btn-ctrl tk-next-btn" title="التالي">▼</button>
            <select class="tk-speed-select" title="سرعة التصفح التلقائي">
              <option value="clip" selected>طول المقطع</option>
              <option value="3000">3 ثوانٍ</option>
              <option value="5000">5 ثوانٍ</option>
              <option value="8000">8 ثوانٍ</option>
              <option value="12000">12 ثانية</option>
            </select>
          </div>
        </div>
      </div>`;

    const q = (s) => body.querySelector(s);
    const feed = q('.tk-feed-container');
    const statusEl = q('.tk-status');
    const refreshBtn = q('.tk-refresh-btn');
    const muteBtn = q('.tk-mute-btn');
    const autoBtn = q('.tk-autoscroll-toggle');
    const autoText = q('.tk-autoscroll-text');
    const autoDot = q('.tk-autoscroll-dot');
    const progressFill = q('.tk-progress-fill');
    const playPauseBtn = q('.tk-playpause-btn');
    const prevBtn = q('.tk-prev-btn');
    const nextBtn = q('.tk-next-btn');
    const speedSelect = q('.tk-speed-select');

    const items = [];            // {row, card, state, data}
    let currentIndex = 0;
    let autoScrolling = true;
    let speed = 'clip';          // 'clip' | milliseconds
    let muted = true;
    let progressTimer = null;
    let loadingMore = false;
    let offline = false;
    let closed = false;

    /* ── status line ─────────────────────────────────────────────────────── */
    function setStatus(text, tone = '') {
      statusEl.textContent = text;
      statusEl.dataset.tone = tone;
    }

    /* ── card scaffolding ────────────────────────────────────────────────── */
    function buildCard(entry, idx) {
      const { row } = entry;
      const tags = (row.tags || []).map((t) => `#${t}`).join(' ');
      const card = document.createElement('div');
      card.className = `tk-reel-card${idx === 0 ? ' active' : ''}`;
      card.dataset.index = idx;

      card.innerHTML = `
        <div class="tk-media-wrap">
          <div class="tk-card-state"><span class="tk-spinner"></span><span class="tk-state-text">بانتظار الدور…</span></div>
        </div>
        <div class="tk-overlay-shadow"></div>

        <div class="tk-actions-bar">
          <div class="tk-avatar-wrap">
            <img src="assets/blog-pfp.png" alt="${esc(row.creator)}" class="tk-avatar-img">
            <div class="tk-follow-plus">+</div>
          </div>
          <button class="tk-action-btn tk-like-btn" title="اعجاب">
            <span class="tk-icon">❤️</span><span class="tk-count">—</span>
          </button>
          <button class="tk-action-btn" title="تعليقات">
            <span class="tk-icon">💬</span><span class="tk-count">—</span>
          </button>
          <button class="tk-action-btn tk-bookmark-btn" title="حفظ">
            <span class="tk-icon">🔖</span><span class="tk-count">—</span>
          </button>
          <button class="tk-action-btn tk-open-btn" title="فتح المصدر">
            <span class="tk-icon">🔗</span><span class="tk-count">فتح</span>
          </button>
          <div class="tk-music-disc"><img src="assets/blog-pfp.png" alt="Sound"></div>
        </div>

        <div class="tk-info-bar">
          <div class="tk-user-name">@${esc(row.creator || 'goontok')} <span class="tk-verify-check">✓</span></div>
          <div class="tk-caption">${esc(tags || '#goontok')}</div>
          <div class="tk-sound-track">
            <span class="tk-note-icon">🎵</span>
            <div class="tk-sound-marquee">—</div>
          </div>
        </div>`;

      const likeBtn = card.querySelector('.tk-like-btn');
      likeBtn.onclick = (e) => {
        e.stopPropagation();
        likeBtn.classList.toggle('liked');
        const count = likeBtn.querySelector('.tk-count');
        count.textContent = likeBtn.classList.contains('liked') ? 'Liked ❤️' : (entry.data?.likes ?? '—');
      };

      card.querySelector('.tk-bookmark-btn').onclick = (e) => {
        e.stopPropagation();
        e.currentTarget.classList.toggle('bookmarked');
      };

      card.querySelector('.tk-open-btn').onclick = (e) => {
        e.stopPropagation();
        if (row.url) open(row.url, '_blank', 'noopener');
      };

      entry.card = card;
      return card;
    }

    function showState(entry, text, kind = 'busy') {
      const wrap = entry.card.querySelector('.tk-media-wrap');
      wrap.querySelector('video, img.tk-media')?.remove();
      let state = wrap.querySelector('.tk-card-state');
      if (!state) {
        state = document.createElement('div');
        state.className = 'tk-card-state';
        wrap.appendChild(state);
      }
      state.dataset.kind = kind;
      state.innerHTML = kind === 'busy'
        ? `<span class="tk-spinner"></span><span class="tk-state-text">${esc(text)}</span>`
        : `<span class="tk-state-text">${esc(text)}</span><button class="tk-retry-btn">إعادة المحاولة</button>`;
      state.querySelector('.tk-retry-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        entry.state = 'idle';
        resolveEntry(entry);
      });
    }

    /* ── metadata -> card ────────────────────────────────────────────────── */
    function paint(entry) {
      const { card, data, row } = entry;
      const tags = (row.tags || []).map((t) => `#${t}`).join(' ');

      card.querySelector('.tk-avatar-img').src = data.avatar;
      card.querySelector('.tk-music-disc img').src = data.avatar;
      card.querySelector('.tk-user-name').firstChild.textContent = `@${data.user || row.creator} `;
      card.querySelector('.tk-caption').textContent = [data.title, tags].filter(Boolean).join(' ');
      card.querySelector('.tk-sound-marquee').textContent = data.sound;

      const counts = card.querySelectorAll('.tk-action-btn .tk-count');
      counts[0].textContent = data.likes;
      counts[1].textContent = data.comments;
      counts[2].textContent = data.bookmarks;
    }

    /* Attach the <video> (or a still, for the offline fallback). */
    function attachMedia(entry) {
      const wrap = entry.card.querySelector('.tk-media-wrap');
      if (wrap.querySelector('video, img.tk-media')) return;
      wrap.querySelector('.tk-card-state')?.remove();

      if (entry.row.media) {                       // offline fallback still
        const img = document.createElement('img');
        img.className = 'tk-media';
        img.src = entry.row.media;
        img.alt = entry.row.title || '';
        wrap.appendChild(img);
        return;
      }

      const v = document.createElement('video');
      v.className = 'tk-media';
      v.playsInline = true;
      v.muted = muted;
      v.loop = speed !== 'clip';
      v.preload = 'auto';
      v.poster = entry.data.cover || '';
      v.src = entry.data.video;

      v.addEventListener('error', () => showState(entry, 'تعذّر تشغيل المقطع', 'error'));
      v.addEventListener('ended', () => {
        if (speed === 'clip' && autoScrolling && entry === items[currentIndex]) goTo(currentIndex + 1);
      });
      v.addEventListener('timeupdate', () => {
        if (speed !== 'clip' || entry !== items[currentIndex] || !v.duration) return;
        progressFill.style.transition = 'none';
        progressFill.style.width = `${(v.currentTime / v.duration) * 100}%`;
      });

      wrap.appendChild(v);
    }

    /* Give the buffer back for clips that scrolled far out of view. */
    function detachMedia(entry) {
      const v = entry.card.querySelector('video');
      if (!v) return;
      v.pause();
      v.removeAttribute('src');
      v.load();
      v.remove();
      if (entry.data?.cover) {
        const img = document.createElement('img');
        img.className = 'tk-media';
        img.src = entry.data.cover;
        img.alt = '';
        entry.card.querySelector('.tk-media-wrap').appendChild(img);
      }
    }

    async function resolveEntry(entry) {
      if (closed || entry.state === 'busy' || entry.state === 'done') return;

      if (entry.row.media) {                       // offline fallback needs no resolve
        entry.state = 'done';
        entry.data = { likes: '—', comments: '—', bookmarks: '—', sound: '♫ Local', cover: entry.row.media };
        entry.card.querySelector('.tk-caption').textContent = entry.row.title;
        attachMedia(entry);
        return;
      }

      entry.state = 'busy';
      showState(entry, 'جارٍ استخراج المقطع…');
      try {
        const data = TikWM.normalise(await TikWM.resolve(entry.row.url));
        if (closed) return;
        if (!data.video) throw new Error('no mp4');
        entry.data = data;
        entry.state = 'done';
        paint(entry);
        attachMedia(entry);
        if (entry === items[currentIndex]) { playActive(); resetProgress(); }
      } catch (err) {
        if (closed) return;
        entry.state = 'failed';
        showState(entry, `تعذّر الاستخراج: ${err.message || 'خطأ'}`, 'error');
        if (entry === items[currentIndex]) resetProgress();
      }
    }

    /* Resolve the active clip plus its lookahead, tear down the rest. */
    function syncWindow() {
      items.forEach((entry, i) => {
        const dist = i - currentIndex;
        if (dist >= 0 && dist <= GOONTOK.lookahead) {
          resolveEntry(entry);
        } else if (Math.abs(dist) > GOONTOK.keepLoaded && entry.state === 'done') {
          detachMedia(entry);
        }
      });
    }

    function playActive() {
      items.forEach((entry, i) => {
        const v = entry.card.querySelector('video');
        if (!v) return;
        if (i === currentIndex) {
          v.muted = muted;
          v.loop = speed !== 'clip';
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }

    function goTo(index) {
      if (!items.length) return;
      if (index < 0) index = items.length - 1;
      // Hold at the tail only while a batch is inbound; otherwise loop.
      if (index >= items.length) index = loadingMore ? items.length - 1 : 0;
      currentIndex = index;

      feed.style.transform = `translateY(-${currentIndex * 100}%)`;
      items.forEach((entry, i) => entry.card.classList.toggle('active', i === currentIndex));

      // Re-attach a clip we previously unloaded.
      const active = items[currentIndex];
      if (active.state === 'done' && !active.card.querySelector('video') && !active.row.media) {
        active.card.querySelector('.tk-media-wrap img.tk-media')?.remove();
        attachMedia(active);
      }

      syncWindow();
      playActive();
      resetProgress();

      if (!offline && currentIndex >= items.length - GOONTOK.tailroom) appendBatch();
    }

    function resetProgress() {
      clearTimeout(progressTimer);
      progressFill.style.transition = 'none';
      progressFill.style.width = '0%';
      if (!autoScrolling || !items.length) return;

      if (speed === 'clip') {
        /* Videos drive the bar from `timeupdate` and advance on `ended`. Stills
         * and dead clips get a plain fuse instead. A clip that is still resolving
         * gets nothing — resolveEntry re-arms this once it lands, so a slow
         * TikWM call is never mistaken for a dud and skipped. */
        const active = items[currentIndex];
        const settled = active && (active.state === 'done' || active.state === 'failed');
        if (settled && !active.card.querySelector('video')) {
          progressTimer = setTimeout(() => goTo(currentIndex + 1), 6000);
        }
        return;
      }

      setTimeout(() => {
        if (closed || !autoScrolling) return;
        progressFill.style.transition = `width ${speed}ms linear`;
        progressFill.style.width = '100%';
      }, 30);
      progressTimer = setTimeout(() => goTo(currentIndex + 1), speed);
    }

    function toggleAutoScroll(enable) {
      autoScrolling = enable ?? !autoScrolling;
      autoDot.classList.toggle('off', !autoScrolling);
      autoText.textContent = autoScrolling ? 'تلقائي' : 'موقوف';
      playPauseBtn.textContent = autoScrolling ? '❚❚' : '▶';
      resetProgress();
    }

    /* ── feed loading ────────────────────────────────────────────────────── */
    function appendRows(rows) {
      const start = items.length;
      const frag = document.createDocumentFragment();
      rows.forEach((row, i) => {
        const entry = { row, state: 'idle', data: null };
        frag.appendChild(buildCard(entry, start + i));
        items.push(entry);
      });
      feed.appendChild(frag);
    }

    async function appendBatch(first = false) {
      if (closed || loadingMore) return;
      loadingMore = true;
      if (first) setStatus('جارٍ سحب الدفعة…');

      const pulled = await Shards.pull();
      if (closed) return;

      if (!pulled || !pulled.rows.length) {
        if (first) {
          offline = true;
          appendRows(LOCAL_FALLBACK);
          setStatus('المصدر غير متاح — وضع محلي', 'error');
          goTo(0);
        }
        loadingMore = false;
        return;
      }

      appendRows(shuffle(pulled.rows).slice(0, GOONTOK.batch));
      setStatus(`shard-${String(pulled.shard).padStart(3, '0')} · ${items.length} مقطع · ${Shards.transport}`, 'ok');
      loadingMore = false;
      if (first) goTo(0);
      else syncWindow();
    }

    /* ── wiring ──────────────────────────────────────────────────────────── */
    autoBtn.onclick = () => toggleAutoScroll();
    playPauseBtn.onclick = () => toggleAutoScroll();
    prevBtn.onclick = () => goTo(currentIndex - 1);
    nextBtn.onclick = () => goTo(currentIndex + 1);

    speedSelect.onchange = (e) => {
      speed = e.target.value === 'clip' ? 'clip' : parseInt(e.target.value, 10);
      items.forEach((entry) => {
        const v = entry.card.querySelector('video');
        if (v) v.loop = speed !== 'clip';
      });
      resetProgress();
    };

    muteBtn.onclick = () => {
      muted = !muted;
      muteBtn.textContent = muted ? '🔇' : '🔊';
      muteBtn.classList.toggle('on', !muted);
      playActive();
    };

    refreshBtn.onclick = async () => {
      if (loadingMore) return;
      refreshBtn.classList.add('spinning');
      clearTimeout(progressTimer);
      items.length = 0;
      feed.innerHTML = '';
      feed.style.transform = 'translateY(0)';
      currentIndex = 0;
      offline = false;
      await appendBatch(true);
      refreshBtn.classList.remove('spinning');
    };

    const onKey = (e) => {
      if (!body.isConnected) return removeEventListener('keydown', onKey);
      if (e.key === 'ArrowDown') { e.preventDefault(); goTo(currentIndex + 1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); goTo(currentIndex - 1); }
      if (e.key === ' ') { e.preventDefault(); toggleAutoScroll(); }
    };
    addEventListener('keydown', onKey);

    let wheelLock = 0;
    feed.onwheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - wheelLock < 400) return;         // one card per gesture, not per tick
      if (Math.abs(e.deltaY) < 20) return;
      wheelLock = now;
      goTo(currentIndex + (e.deltaY > 0 ? 1 : -1));
    };

    let touchStartY = 0;
    feed.ontouchstart = (e) => { touchStartY = e.touches[0].clientY; };
    feed.ontouchend = (e) => {
      const diffY = touchStartY - e.changedTouches[0].clientY;
      if (diffY > 40) goTo(currentIndex + 1);
      else if (diffY < -40) goTo(currentIndex - 1);
    };

    await appendBatch(true);

    new MutationObserver((_, obs) => {
      if (body.isConnected) return;
      closed = true;
      clearTimeout(progressTimer);
      items.forEach(detachMedia);
      removeEventListener('keydown', onKey);
      obs.disconnect();
    }).observe(document.getElementById('windows'), { childList: true, subtree: true });
  },
};
