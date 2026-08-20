/* Dayouth osu! — Official MindSync Rhythm Engine & Song Select (Apps.osu)
 * Authentic port of official osu! interface & gameplay:
 * - Top Song Banner (Artist, Title, Length, BPM, Objects, Star Rating)
 * - Left Panel: Online Leaderboard Rankings (#1 - #5 with S rank badges)
 * - Right Panel: Slanted Pink/Orange Beatmap Carousel Cards
 * - Bottom Bar: Spiky Blue Back Button, Mod Selection, Random Map
 * - Bottom Right: Big Glowing Pink osu! Cookie Button (osu!)
 * - Background Video Layer & Canvas Hit Circles with shrinking approach rings
 * - 4-tier timing judgment (300 Perfect, 100 Great, 50 Good, MISS)
 * - Grade Results overlay screen (S/A/B/C/D)
 * - Keyboard Z/X & Mouse Click Support
 */

Apps.osu = {
  title: 'Dayouth osu!',
  glyph: Icons.targetApp,
  width: 960,
  height: 620,

  async mount(body) {
    body.style.padding = '0';
    body.style.margin = '0';
    body.style.overflow = 'hidden';
    body.style.background = '#000000';
    body.style.color = '#ffffff';
    body.style.fontFamily = 'var(--font-main, system-ui, sans-serif)';
    body.style.userSelect = 'none';

    body.innerHTML = `
      <div class="osu-app" dir="ltr">
        <!-- Top Beatmap Banner Bar -->
        <header class="osu-top-banner">
          <div class="osu-song-title-wrap">
            <b class="osu-active-title">David Wise - Crescent Island [Relaxed 1.2★]</b>
            <small class="osu-active-meta">Length: 03:42 | BPM: 60 | Rating: ⭐⭐⭐⭐⭐⭐⭐⭐ 8.6★</small>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <label class="osu-label" style="font-size:12px;color:#ff66aa;">
              <input type="checkbox" class="osu-music-toggle" checked>
              <span style="display:inline-flex;align-items:center;gap:4px">Beats ${Icons.music}</span>
            </label>
            <button class="osu-btn osu-close-btn" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:4px 10px;border-radius:6px;cursor:pointer;">Quit ✕</button>
          </div>
        </header>

        <!-- Main Song Selection Viewport -->
        <div class="osu-select-view" id="osu-select-view">

          <!-- Left Panel: Online Leaderboard Rankings -->
          <div class="osu-ranking-panel">
            <div class="osu-ranking-head">
              <span>Online Leaderboard</span>
              <span style="font-size:11px;color:#8cff5a;">● Global Rankings</span>
            </div>
            <div class="osu-rank-item">
              <div class="osu-rank-badge">S</div>
              <div style="flex:1">
                <b style="color:#fff">mrekk</b><br>
                <small style="color:#94a3b8">99.82% | 1,420pp</small>
              </div>
              <span style="font-weight:700;color:#ffcc38">#1</span>
            </div>
            <div class="osu-rank-item">
              <div class="osu-rank-badge">S</div>
              <div style="flex:1">
                <b style="color:#fff">Vaxei</b><br>
                <small style="color:#94a3b8">99.45% | 1,380pp</small>
              </div>
              <span style="font-weight:700;color:#cbd5e1">#2</span>
            </div>
            <div class="osu-rank-item">
              <div class="osu-rank-badge">S</div>
              <div style="flex:1">
                <b style="color:#fff">WhiteCat</b><br>
                <small style="color:#94a3b8">99.12% | 1,350pp</small>
              </div>
              <span style="font-weight:700;color:#cbd5e1">#3</span>
            </div>
            <div class="osu-rank-item">
              <div class="osu-rank-badge">A</div>
              <div style="flex:1">
                <b style="color:#fff">Cookiezi</b><br>
                <small style="color:#94a3b8">98.90% | 1,290pp</small>
              </div>
              <span style="font-weight:700;color:#cbd5e1">#4</span>
            </div>
            <div class="osu-rank-item">
              <div class="osu-rank-badge">A</div>
              <div style="flex:1">
                <b style="color:#fff">Dayouth Master</b><br>
                <small style="color:#94a3b8">98.50% | 1,210pp</small>
              </div>
              <span style="font-weight:700;color:#cbd5e1">#5</span>
            </div>
          </div>

          <!-- Right Panel: Slanted Beatmap Cards Carousel -->
          <div class="osu-carousel-panel">
            <div class="osu-map-card active" data-img="resources/bbc/download.png" data-video="resources/Game 1/1784101884338624.webm" data-bpm="60" data-name="David Wise - Crescent Island" data-diff="Relaxed 1.2★">
              <div style="display:flex;align-items:center;gap:10px;transform:skewX(6deg)">
                <img src="resources/bbc/download.png" style="width:36px;height:36px;border-radius:6px;object-fit:cover;border:1px solid #fff;">
                <div class="osu-map-card-info" style="transform:none">
                  <b>David Wise - Crescent Island</b>
                  <small>BBC Mode 1 | Slow & Easy 60 BPM</small>
                </div>
              </div>
              <span style="font-size:16px;">🖼️</span>
            </div>
            <div class="osu-map-card" data-img="resources/bbc/download (1).png" data-video="resources/Game 1/1784146609353181.webm" data-bpm="75" data-name="David Wise - Jib Jig" data-diff="Chill 2.0★">
              <div style="display:flex;align-items:center;gap:10px;transform:skewX(6deg)">
                <img src="resources/bbc/download (1).png" style="width:36px;height:36px;border-radius:6px;object-fit:cover;border:1px solid #fff;">
                <div class="osu-map-card-info" style="transform:none">
                  <b>David Wise - Jib Jig</b>
                  <small>BBC Mode 2 | Chill 75 BPM</small>
                </div>
              </div>
              <span style="font-size:16px;">🖼️</span>
            </div>
            <div class="osu-map-card" data-img="resources/bbc/download (2).png" data-video="resources/Game 1/1784167026742146.mp4" data-bpm="85" data-name="DJ Sharpnel - Solitude Sun" data-diff="Smooth 2.8★">
              <div style="display:flex;align-items:center;gap:10px;transform:skewX(6deg)">
                <img src="resources/bbc/download (2).png" style="width:36px;height:36px;border-radius:6px;object-fit:cover;border:1px solid #fff;">
                <div class="osu-map-card-info" style="transform:none">
                  <b>DJ Sharpnel - Solitude Sun</b>
                  <small>BBC Mode 3 | Smooth 85 BPM</small>
                </div>
              </div>
              <span style="font-size:16px;">🖼️</span>
            </div>
            <div class="osu-map-card" data-img="resources/bbc/download (3).png" data-video="resources/Game 1/1784214340050945.webm" data-bpm="90" data-name="dj TAKA - V2" data-diff="Rhythm 3.2★">
              <div style="display:flex;align-items:center;gap:10px;transform:skewX(6deg)">
                <img src="resources/bbc/download (3).png" style="width:36px;height:36px;border-radius:6px;object-fit:cover;border:1px solid #fff;">
                <div class="osu-map-card-info" style="transform:none">
                  <b>dj TAKA - V2</b>
                  <small>BBC Mode 4 | Rhythm 90 BPM</small>
                </div>
              </div>
              <span style="font-size:16px;">🖼️</span>
            </div>
            <div class="osu-map-card" data-img="resources/bbc/download (4).png" data-video="resources/Game 1/1784101884338624.webm" data-bpm="100" data-name="ESTI - OblivioN" data-diff="Moderate 3.8★">
              <div style="display:flex;align-items:center;gap:10px;transform:skewX(6deg)">
                <img src="resources/bbc/download (4).png" style="width:36px;height:36px;border-radius:6px;object-fit:cover;border:1px solid #fff;">
                <div class="osu-map-card-info" style="transform:none">
                  <b>ESTI - OblivioN</b>
                  <small>BBC Mode 5 | Moderate 100 BPM</small>
                </div>
              </div>
              <span style="font-size:16px;">⭐</span>
            </div>
          </div>
        </div>

        <!-- Gameplay Canvas Viewport -->
        <main class="osu-viewport">
          <div class="osu-bg-img" style="position:absolute;top:0;left:0;width:100%;height:100%;background-size:cover;background-position:center;z-index:0;opacity:0.45;filter:blur(3px);"></div>
          <video class="osu-bg-video" autoplay loop muted playsinline style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:1;opacity:0.55;"></video>
          <canvas class="osu-canvas" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:all;"></canvas>

          <!-- In-Game HUD Overlays -->
          <div class="osu-ingame-combo" id="osu-ingame-combo">0x</div>

          <!-- Game Over Results Screen Overlay -->
          <div class="osu-overlay osu-results-overlay hidden" style="z-index:35;">
            <div class="osu-results-card">
              <h2 style="display:inline-flex;align-items:center;gap:8px">${Icons.target} Round Clear!</h2>
              <div class="osu-grade-badge">S</div>
              <div class="osu-res-grid">
                <div><span>Score:</span> <b class="res-final-score">0</b></div>
                <div><span>Max Combo:</span> <b class="res-max-combo">0x</b></div>
                <div><span>Accuracy:</span> <b class="res-accuracy">100%</b></div>
                <div><span>Perfect (300):</span> <b class="res-count-300">0</b></div>
                <div><span>Great (100):</span> <b class="res-count-100">0</b></div>
                <div><span>Good (50):</span> <b class="res-count-50">0</b></div>
                <div><span>Misses:</span> <b class="res-count-miss">0</b></div>
              </div>
              <button class="osu-play-btn osu-retry-btn" style="display:inline-flex;align-items:center;justify-content:center;gap:6px">Play Again ${Icons.refresh}</button>
            </div>
          </div>
        </main>

        <!-- Bottom Controls Bar -->
        <footer class="osu-bottom-bar">
          <button class="osu-back-btn" id="osu-back-btn">Back</button>
          <div style="display:flex;gap:10px;font-size:12px;">
            <button class="osu-btn" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:6px 14px;border-radius:6px;cursor:pointer;">Mod Selection</button>
            <button class="osu-btn" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:6px 14px;border-radius:6px;cursor:pointer;" id="osu-random-btn">Random Map</button>
            <button class="osu-btn" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:6px 14px;border-radius:6px;cursor:pointer;">Beatmap Options</button>
          </div>
          <div style="width:90px;"></div>
        </footer>

        <!-- Big Pink osu! Cookie Button (Bottom Right) -->
        <div class="osu-cookie-btn" id="osu-cookie-btn" title="Start Play Beatmap!">osu!</div>
      </div>`;

    const canvas = body.querySelector('.osu-canvas');
    const ctx = canvas.getContext('2d');
    const bgVideo = body.querySelector('.osu-bg-video');
    const selectView = body.querySelector('#osu-select-view');
    const resultsOverlay = body.querySelector('.osu-results-overlay');
    const activeTitle = body.querySelector('.osu-active-title');
    const activeMeta = body.querySelector('.osu-active-meta');

    const ingameCombo = body.querySelector('#osu-ingame-combo');
    const cookieBtn = body.querySelector('#osu-cookie-btn');
    const backBtn = body.querySelector('#osu-back-btn');
    const randomBtn = body.querySelector('#osu-random-btn');
    const closeBtn = body.querySelector('.osu-close-btn');
    const retryBtn = body.querySelector('.osu-retry-btn');
    const musicToggle = body.querySelector('.osu-music-toggle');
    const mapCards = body.querySelectorAll('.osu-map-card');

    // Results fields
    const resFinalScore = body.querySelector('.res-final-score');
    const resMaxCombo = body.querySelector('.res-max-combo');
    const resAccuracy = body.querySelector('.res-accuracy');
    const resCount300 = body.querySelector('.res-count-300');
    const resCount100 = body.querySelector('.res-count-100');
    const resCount50 = body.querySelector('.res-count-50');
    const resCountMiss = body.querySelector('.res-count-miss');
    const gradeBadge = body.querySelector('.osu-grade-badge');

    // Words array for hit circle centers
    const targetWords = ["SYNC", "FOCUS", "SUBMIT", "OBEY", "SURRENDER", "TRANCE", "MIND", "BEAT", "RHYTHM", "DAYOUTH", "HYPNOSIS"];

    // Game Variables
    let isPlaying = false;
    let animFrameId = null;
    let score = 0;
    let combo = 0;
    let maxCombo = 0;
    let hit300 = 0;
    let hit100 = 0;
    let hit50 = 0;
    let hitMiss = 0;

    let bpm = 90;
    let targetRadius = 85;
    let approachDuration = 1800;
    let hitWindowMiss = 550;

    let activeCircles = [];
    let particles = [];
    let floatingTexts = [];
    let lastMouseX = 0;
    let lastMouseY = 0;

    const comboColors = [
      '#ff5ea8', // Pink
      '#4dd2ff', // Sky Blue
      '#8cff5a', // Green
      '#ffcc38', // Amber
      '#c07bff', // Purple
      '#ff6a5a'  // Coral
    ];
    let colorIndex = 0;

    // Web Audio Synthesizer Engine & Circle Spawners
    let audioCtx = null;
    let beatSchedulerId = null;
    let circleIntervalId = null;
    let nextBeatTime = 0;
    let beatIndex = 0;

    function initAudio() {
      try {
        if (!audioCtx || audioCtx.state === 'closed') {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      } catch (e) {
        console.warn('Web Audio Context error:', e);
      }
    }

    function startBeatLoop() {
      if (circleIntervalId) clearInterval(circleIntervalId);
      if (beatSchedulerId) clearTimeout(beatSchedulerId);

      const msPerBeat = 60000 / bpm;
      spawnCircle();
      circleIntervalId = setInterval(() => {
        if (isPlaying) spawnCircle();
      }, msPerBeat);

      initAudio();
      if (!audioCtx) return;

      nextBeatTime = audioCtx.currentTime + 0.05;
      beatIndex = 0;

      const lookahead = 25.0;
      const scheduleAheadTime = 0.1;

      const scheduleNextBeats = () => {
        if (!isPlaying || !audioCtx) return;
        while (nextBeatTime < audioCtx.currentTime + scheduleAheadTime) {
          scheduleAudioBeat(beatIndex, nextBeatTime);
          const secondsPerBeat = 60.0 / bpm;
          nextBeatTime += secondsPerBeat;
          beatIndex++;
        }
        beatSchedulerId = setTimeout(scheduleNextBeats, lookahead);
      };

      scheduleNextBeats();
    }

    function scheduleAudioBeat(index, time) {
      if (!audioCtx || !musicToggle.checked) return;

      try {
        const kickOsc = audioCtx.createOscillator();
        const kickGain = audioCtx.createGain();
        kickOsc.connect(kickGain);
        kickGain.connect(audioCtx.destination);

        kickOsc.frequency.setValueAtTime(130, time);
        kickOsc.frequency.exponentialRampToValueAtTime(0.01, time + 0.3);

        kickGain.gain.setValueAtTime(0.6, time);
        kickGain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);

        kickOsc.start(time);
        kickOsc.stop(time + 0.3);

        if (index % 2 === 1) {
          const hatSource = audioCtx.createBufferSource();
          const hatGain = audioCtx.createGain();
          const bufferSize = Math.floor(audioCtx.sampleRate * 0.04);
          const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const hatFilter = audioCtx.createBiquadFilter();
          hatFilter.type = 'highpass';
          hatFilter.frequency.setValueAtTime(7000, time);

          hatSource.buffer = buffer;
          hatSource.connect(hatFilter);
          hatFilter.connect(hatGain);
          hatGain.connect(audioCtx.destination);

          hatGain.gain.setValueAtTime(0.1, time);
          hatGain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);

          hatSource.start(time);
          hatSource.stop(time + 0.05);
        }
      } catch (e) {}
    }

    function playHitsound(isPerfect = true) {
      if (!audioCtx || !musicToggle.checked) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = isPerfect ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(isPerfect ? 880 : 440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(isPerfect ? 220 : 110, audioCtx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch (e) {}
    }

    function hexToRgba(hex, alpha) {
      const h = hex.replace('#', '');
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function resizeCanvas() {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || 960;
      canvas.height = canvas.parentElement.clientHeight || 560;
    }
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    function spawnCircle() {
      if (!isPlaying) return;

      const padding = 100;
      const x = padding + Math.random() * Math.max(100, canvas.width - padding * 2);
      const y = padding + Math.random() * Math.max(100, canvas.height - padding * 2);

      const color = comboColors[colorIndex % comboColors.length];
      colorIndex++;
      const word = targetWords[Math.floor(Math.random() * targetWords.length)];
      const now = performance.now();

      activeCircles.push({
        id: Math.random(),
        x,
        y,
        word,
        radius: targetRadius,
        color,
        spawnTime: now,
        targetTime: now + approachDuration,
        hit: false
      });
    }

    function updateHUD() {
      ingameCombo.textContent = `${combo}x`;
      const totalClicks = hit300 + hit100 + hit50 + hitMiss;
      const acc = totalClicks > 0
        ? ((hit300 * 1.0 + hit100 * 0.6 + hit50 * 0.3) / totalClicks) * 100
        : 100;
      if (isPlaying && activeMeta) {
        activeMeta.textContent = `Score: ${score.toLocaleString()} | Acc: ${acc.toFixed(1)}% | Combo: ${combo}x`;
      }
    }

    function handleHit(cx, cy) {
      if (!isPlaying) return;

      const now = performance.now();

      for (let i = activeCircles.length - 1; i >= 0; i--) {
        const c = activeCircles[i];
        if (c.hit) continue;

        const dist = Math.hypot(cx - c.x, cy - c.y);
        if (dist <= c.radius + 45) {
          c.hit = true;
          const dt = Math.abs(now - c.targetTime);

          if (dt <= 250) { // Easy 300 Perfect
            score += 300;
            hit300++;
            combo++;
            playHitsound(true);
            spawnParticles(c.x, c.y, 16, c.color);
            spawnFloatingText(c.x, c.y - 35, '300', '#ffffff', 1.25);
          } else if (dt <= 420) { // Easy 100 Great
            score += 100;
            hit100++;
            combo++;
            playHitsound(false);
            spawnParticles(c.x, c.y, 10, c.color);
            spawnFloatingText(c.x, c.y - 35, '100', '#ffcc38', 1.1);
          } else { // 50 Good
            score += 50;
            hit50++;
            combo++;
            playHitsound(false);
            spawnFloatingText(c.x, c.y - 35, '50', '#8cff5a', 1.0);
          }

          if (combo > maxCombo) maxCombo = combo;
          updateHUD();
          activeCircles.splice(i, 1);
          break;
        }
      }
    }

    function spawnParticles(x, y, count, color) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 3 + 2,
          color,
          alpha: 1.0,
          decay: Math.random() * 0.03 + 0.02
        });
      }
    }

    function spawnFloatingText(x, y, text, color, scale = 1.0) {
      floatingTexts.push({
        x, y, text, color, scale, alpha: 1.0, vy: -1.4
      });
    }

    function render(now) {
      if (!isPlaying) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = activeCircles.length - 1; i >= 0; i--) {
        const c = activeCircles[i];

        if (!c.hit && now > c.targetTime + hitWindowMiss) {
          hitMiss++;
          combo = 0;
          updateHUD();
          spawnFloatingText(c.x, c.y - 35, 'Miss', '#ff4a4a', 1.0);
          activeCircles.splice(i, 1);
          continue;
        }

        const timeLeft = c.targetTime - now;
        const progress = Math.max(0, timeLeft / approachDuration);
        const col = c.color || '#4dd2ff';

        if (progress > 0) {
          const ringRadius = c.radius + (progress * 75);
          ctx.strokeStyle = col;
          ctx.globalAlpha = 0.35 + (1 - progress) * 0.55;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(c.x, c.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }

        ctx.save();
        ctx.shadowColor = col;
        ctx.shadowBlur = 20;
        const grad = ctx.createRadialGradient(
          c.x, c.y, c.radius * 0.15,
          c.x, c.y, c.radius
        );
        grad.addColorStop(0, 'rgba(10, 12, 22, 0.92)');
        grad.addColorStop(0.72, hexToRgba(col, 0.88));
        grad.addColorStop(1, col);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius - 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = "700 13px var(--font-main, sans-serif)";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 4;
        ctx.fillText(c.word, c.x, c.y);
        ctx.shadowBlur = 0;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.022;

        if (ft.alpha <= 0) {
          floatingTexts.splice(i, 1);
          continue;
        }

        ctx.font = `italic 700 ${Math.round(22 * ft.scale)}px var(--font-main, sans-serif)`;
        ctx.textAlign = 'center';
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = ft.alpha;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1.0;
      }

      animFrameId = requestAnimationFrame(render);
    }

    function startPlay() {
      initAudio();
      if (bgVideo) {
        if (bgVideo.src !== location.origin + '/' + currentVideoSrc && !bgVideo.src.endsWith(currentVideoSrc)) {
          bgVideo.src = currentVideoSrc;
        }
        bgVideo.currentTime = 0;
        bgVideo.play().catch(e => console.warn('Video play error:', e));
      }
      score = 0;
      combo = 0;
      maxCombo = 0;
      hit300 = 0;
      hit100 = 0;
      hit50 = 0;
      hitMiss = 0;
      activeCircles = [];
      particles = [];
      floatingTexts = [];
      updateHUD();

      selectView.style.display = 'none';
      resultsOverlay.style.display = 'none';
      resultsOverlay.classList.add('hidden');
      isPlaying = true;

      startBeatLoop();
      cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(render);
    }

    function stopPlay() {
      isPlaying = false;
      if (bgVideo) bgVideo.pause();
      if (circleIntervalId) clearInterval(circleIntervalId);
      if (beatSchedulerId) clearTimeout(beatSchedulerId);
      cancelAnimationFrame(animFrameId);
    }

    function endGame() {
      stopPlay();

      const totalClicks = hit300 + hit100 + hit50 + hitMiss;
      const accVal = totalClicks > 0
        ? ((hit300 * 1.0 + hit100 * 0.6 + hit50 * 0.3) / totalClicks) * 100
        : 100;

      let grade = 'S';
      if (accVal < 70) grade = 'D';
      else if (accVal < 80) grade = 'C';
      else if (accVal < 90) grade = 'B';
      else if (accVal < 95) grade = 'A';

      gradeBadge.textContent = grade;
      resFinalScore.textContent = score.toLocaleString();
      resMaxCombo.textContent = `${maxCombo}x`;
      resAccuracy.textContent = `${accVal.toFixed(2)}%`;
      resCount300.textContent = hit300;
      resCount100.textContent = hit100;
      resCount50.textContent = hit50;
      resCountMiss.textContent = hitMiss;

      resultsOverlay.style.display = 'flex';
      resultsOverlay.classList.remove('hidden');
    }

    const bgImg = body.querySelector('.osu-bg-img');
    let currentVideoSrc = 'resources/Game 1/1784101884338624.webm';

    resultsOverlay.style.display = 'none';

    // Map Card Selection Handler
    mapCards.forEach(card => {
      card.onclick = () => {
        mapCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        bpm = parseInt(card.dataset.bpm, 10) || 130;
        currentVideoSrc = card.dataset.video || 'resources/Game 1/1784101884338624.webm';
        const imgUrl = card.dataset.img || 'resources/bbc/download.png';
        const name = card.dataset.name || 'David Wise - Crescent Island';
        const diff = card.dataset.diff || 'Normal 4.5★';

        activeTitle.textContent = `${name} [${diff}]`;
        activeMeta.textContent = `Length: 03:42 | BPM: ${bpm} | Rating: ⭐⭐⭐⭐⭐⭐⭐⭐ 8.6★`;

        if (bgImg) bgImg.style.backgroundImage = `url("${imgUrl}")`;
        if (bgVideo) {
          bgVideo.src = currentVideoSrc;
          bgVideo.currentTime = 0;
          bgVideo.play().catch(e => console.warn('Video preview error:', e));
        }
      };

      card.ondblclick = () => {
        card.click();
        startPlay();
      };
    });

    const initialActive = body.querySelector('.osu-map-card.active');
    if (initialActive) {
      initialActive.click();
    }

    randomBtn.onclick = () => {
      const idx = Math.floor(Math.random() * mapCards.length);
      mapCards[idx].click();
    };

    cookieBtn.onclick = startPlay;
    backBtn.onclick = () => {
      stopPlay();
      selectView.style.display = 'flex';
      resultsOverlay.style.display = 'none';
      resultsOverlay.classList.add('hidden');
    };

    retryBtn.onclick = startPlay;
    closeBtn.onclick = () => {
      stopPlay();
      selectView.style.display = 'flex';
      resultsOverlay.style.display = 'none';
      resultsOverlay.classList.add('hidden');
    };

    // Canvas Pointer & Mouse Location Tracking
    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      lastMouseX = e.clientX - rect.left;
      lastMouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('pointerdown', (e) => {
      initAudio();
      const rect = canvas.getBoundingClientRect();
      lastMouseX = e.clientX - rect.left;
      lastMouseY = e.clientY - rect.top;
      handleHit(lastMouseX, lastMouseY);
    });

    // Keyboard controls for authentic osu! Z & X play
    const onKey = (e) => {
      if (!isPlaying) return;
      if (['z', 'x', 'Z', 'X', 'k', 'l', 'K', 'L', ' '].includes(e.key)) {
        e.preventDefault();
        initAudio();
        handleHit(lastMouseX, lastMouseY);
      }
    };
    window.addEventListener('keydown', onKey);

    // Cleanup on window destroy
    new MutationObserver((_, obs) => {
      if (body.isConnected) return;
      stopPlay();
      ro.disconnect();
      window.removeEventListener('keydown', onKey);
      obs.disconnect();
    }).observe(document.getElementById('windows'), { childList: true, subtree: true });
  }
};
