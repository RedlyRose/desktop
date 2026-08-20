/* مواقيت الصلاة — عرعر، السعودية.
 *
 * Times come from the Aladhan API (Umm al-Qura, method 4). A whole month is
 * fetched in one request and cached in DB, so re-opening the window is instant
 * and the app keeps working offline for the rest of the month.
 *
 * The panel sits over an optional background the user picks (Blobs 'salah-bg').
 * Backgrounds are never loaded at full size — see downscale() below.
 */

const SALAH = {
  city: 'عرعر',
  country: 'السعودية',
  lat: 30.9753,
  lon: 41.0381,
  method: 4,          // Umm al-Qura University, Makkah
  tz: 'Asia/Riyadh',
  bgWidth: 640,       // backgrounds are resampled to this width, max
  bgFrames: 150,      // and this many GIF frames, max
};

const PRAYERS = [
  ['Fajr', 'الفجر'],
  ['Sunrise', 'الشروق'],
  ['Dhuhr', 'الظهر'],
  ['Asr', 'العصر'],
  ['Maghrib', 'المغرب'],
  ['Isha', 'العشاء'],
];

/* ---------- time helpers ----------
 * Everything is computed in Asia/Riyadh regardless of where the browser is,
 * otherwise a machine set to another timezone shows the wrong "next prayer". */

function riyadhNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SALAH.tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date()).reduce((o, p) => (o[p.type] = p.value, o), {});

  return {
    y: +parts.year,
    m: +parts.month,
    d: +parts.day,
    secs: +parts.hour % 24 * 3600 + +parts.minute * 60 + +parts.second,
  };
}

const toSecs = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 3600 + m * 60;
};

const fmt12 = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h < 12 ? 'ص' : 'م';
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
};

const countdown = (secs) => {
  const s = Math.max(0, Math.round(secs));
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
};

/* ---------- data ---------- */

/* One calendar request per month, cached under salah.<YYYY-M>. */
async function monthTimings(year, month) {
  const key = `salah.${year}-${month}`;
  const hit = DB.setting(key);
  if (hit) return hit;

  const url = `https://api.aladhan.com/v1/calendar/${year}/${month}`
    + `?latitude=${SALAH.lat}&longitude=${SALAH.lon}&method=${SALAH.method}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`aladhan ${res.status}`);
  const { data } = await res.json();

  // Keep only what the UI reads — the raw payload is ~10x larger than needed.
  const days = data.map((day) => ({
    timings: Object.fromEntries(
      PRAYERS.map(([k]) => [k, day.timings[k].slice(0, 5)]),
    ),
    hijri: `${day.date.hijri.day} ${day.date.hijri.month.ar} ${day.date.hijri.year}`,
  }));

  DB.setting(key, days);
  return days;
}

/* ---------- background: never decode at full size ----------
 * A 1920px GIF costs ~7 MB of bitmap per frame. For GIFs we decode once with
 * WebCodecs, resample every frame down to SALAH.bgWidth, and play the small
 * frames back on a canvas. Still images take the plain canvas path. Anything
 * unsupported falls back to a normal <img>. */
async function downscale(blob, host) {
  const cap = SALAH.bgWidth;

  if (blob.type === 'image/gif' && 'ImageDecoder' in window) {
    try {
      const dec = new ImageDecoder({ data: await blob.arrayBuffer(), type: blob.type });
      await dec.completed;

      const track = dec.tracks.selectedTrack;
      const total = Math.min(track.frameCount, SALAH.bgFrames);
      const first = (await dec.decode({ frameIndex: 0 })).image;

      const scale = Math.min(1, cap / first.displayWidth);
      const w = Math.round(first.displayWidth * scale);
      const h = Math.round(first.displayHeight * scale);

      const off = new OffscreenCanvas(w, h);
      const octx = off.getContext('2d');
      const frames = [];

      for (let i = 0; i < total; i++) {
        const { image } = i === 0 ? { image: first } : await dec.decode({ frameIndex: i });
        octx.clearRect(0, 0, w, h);
        octx.drawImage(image, 0, 0, w, h);
        frames.push({ bitmap: await createImageBitmap(off), ms: (image.duration ?? 100000) / 1000 });
        image.close();
      }
      dec.close();

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.className = 'salah-bg';
      const ctx = canvas.getContext('2d');
      host.appendChild(canvas);

      let i = 0;
      let timer;
      const step = () => {
        const frame = frames[i];
        ctx.drawImage(frame.bitmap, 0, 0);
        i = (i + 1) % frames.length;
        timer = setTimeout(step, Math.max(20, frame.ms));
      };
      step();
      return () => { clearTimeout(timer); frames.forEach((f) => f.bitmap.close()); };
    } catch {
      /* fall through to <img> */
    }
  }

  const url = URL.createObjectURL(blob);

  if (!blob.type.includes('gif')) {
    // Static image: resample once, drop the original bitmap.
    try {
      const bitmap = await createImageBitmap(blob);
      const scale = Math.min(1, cap / bitmap.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.className = 'salah-bg';
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      URL.revokeObjectURL(url);
      host.appendChild(canvas);
      return () => {};
    } catch {
      /* fall through */
    }
  }

  const img = document.createElement('img');
  img.className = 'salah-bg';
  img.decoding = 'async';
  img.src = url;
  host.appendChild(img);
  return () => URL.revokeObjectURL(url);
}

/* ---------- app ---------- */

Apps.salah = {
  title: 'مواقيت الصلاة',
  glyph: Icons.salah,
  width: 560,
  height: 620,

  async mount(body) {
    body.style.padding = '0';
    body.innerHTML = `
      <div class="salah" dir="rtl">
        <div class="salah-stage"></div>

        <div class="salah-card">
          <header class="salah-head">
            <div>
              <b>${SALAH.city}</b>
              <small>${SALAH.country}</small>
            </div>
            <div class="salah-hijri">…</div>
          </header>

          <div class="salah-next">
            <small>الصلاة القادمة</small>
            <b class="salah-next-name">—</b>
            <div class="salah-clock">--:--:--</div>
          </div>

          <ul class="salah-list"></ul>

          <footer class="salah-foot">
            <span class="salah-status muted"></span>
          </footer>
        </div>
      </div>`;

    const $ = (sel) => body.querySelector(sel);
    const stage = $('.salah-stage');
    const list = $('.salah-list');
    const status = $('.salah-status');

    let disposeBg = () => {};
    let timer = null;
    let days = null;

    /* ----- background ----- */
    async function paintBg() {
      disposeBg();
      disposeBg = () => {};
      stage.innerHTML = '';
      let blob = await Blobs.get('salah-bg');
      if (!blob) {
        try {
          const res = await fetch('assets/salah.gif');
          if (res.ok) blob = await res.blob();
        } catch { /* fall back to empty */ }
      }
      if (!blob) return;
      disposeBg = await downscale(blob, stage);
    }

    /* ----- times ----- */
    function render() {
      const now = riyadhNow();
      const today = days?.[now.d - 1];
      if (!today) return;

      $('.salah-hijri').textContent = today.hijri;

      // Next prayer today, else tomorrow's Fajr (next month rolls over to day 1).
      const schedule = PRAYERS.map(([key, label]) => ({ key, label, at: toSecs(today.timings[key]) }));
      let next = schedule.find((p) => p.at > now.secs);
      let wait;

      if (next) {
        wait = next.at - now.secs;
      } else {
        const tomorrow = days[now.d] ?? days[0];
        next = { key: 'Fajr', label: 'الفجر', at: toSecs(tomorrow.timings.Fajr) };
        wait = 86400 - now.secs + next.at;
      }

      $('.salah-next-name').textContent = next.label;
      $('.salah-clock').textContent = countdown(wait);

      list.innerHTML = '';
      for (const p of schedule) {
        const li = document.createElement('li');
        li.className = 'salah-row' + (p.key === next.key && wait < 86400 - now.secs ? ' on' : '');
        li.innerHTML = '<span></span><time></time>';
        li.firstElementChild.textContent = p.label;
        li.lastElementChild.textContent = fmt12(today.timings[p.key]);
        list.appendChild(li);
      }
    }

    async function load() {
      const now = riyadhNow();
      status.textContent = 'جارٍ التحميل…';
      try {
        days = await monthTimings(now.y, now.m);
        status.textContent = '';
      } catch {
        status.textContent = 'تعذّر جلب المواقيت — تحقّق من الاتصال.';
        return;
      }
      render();
      timer = setInterval(render, 1000);
    }

    paintBg();
    load();

    // WM has no close event — stop the ticker when the window leaves the DOM.
    new MutationObserver((_, obs) => {
      if (body.isConnected) return;
      clearInterval(timer);
      disposeBg();
      obs.disconnect();
    }).observe(document.getElementById('windows'), { childList: true, subtree: true });
  },
};
