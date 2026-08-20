/* Video Player App — Apps.videoplayer
 * MPV-style ultra-minimalist web video player with:
 * - Real on-device pose detection (MediaPipe PoseLandmarker) driving an auto-censor box.
 * - Interactive Hypnosis Visual & Affirmation Subtitle Overlay Engine (Spinning Canvas Spiral,
 *   Pulsing Vignette, Center Flashing Words, and Subtitle Ticker).
 * - Full Affirmation Packs Integration (Good Boy, Cuckold, Saudi Experience, Locked & Denied,
 *   Sissy, and Trigger Words from resources/captions/*.md and words.txt).
 * - 4 Censor Styles: Black Bar, Mosaic Blur, Japanese Pixel Grid, CENSORED Stamp
 * - Supports Pornhub, SpankBang, YouTube, MP4/WebM videos, 100% full-bleed viewport,
 * - Floating OSC top bar, quality selector, pose-tracking, and hypnosis controls.
 */

const VP_POSE_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const VP_POSE_MODEL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

// Shared across window opens so the ~5MB model only downloads once.
let vpPoseLandmarkerPromise = null;

function vpLoadPoseLandmarker() {
  if (!vpPoseLandmarkerPromise) {
    vpPoseLandmarkerPromise = (async () => {
      const vision = await import(VP_POSE_CDN);
      const fileset = await vision.FilesetResolver.forVisionTasks(`${VP_POSE_CDN}/wasm`);
      const options = {
        baseOptions: { modelAssetPath: VP_POSE_MODEL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numPoses: 1,
      };
      try {
        return await vision.PoseLandmarker.createFromOptions(fileset, options);
      } catch (e) {
        options.baseOptions.delegate = 'CPU';
        return await vision.PoseLandmarker.createFromOptions(fileset, options);
      }
    })();
  }
  return vpPoseLandmarkerPromise;
}

function vpVideoContainRect(video) {
  const boxW = video.clientWidth, boxH = video.clientHeight;
  const vw = video.videoWidth, vh = video.videoHeight;
  if (!vw || !vh || !boxW || !boxH) return { x: 0, y: 0, w: boxW, h: boxH };
  const scale = Math.min(boxW / vw, boxH / vh);
  const w = vw * scale, h = vh * scale;
  return { x: (boxW - w) / 2, y: (boxH - h) / 2, w, h };
}

/* =========================================================
 * ALL AFFIRMATION PACKS (from resources/captions/ & words.txt)
 * ========================================================= */
const CAPTION_PACKS = {
  good_boy: [
    "You are such a good boy",
    "Good boys don’t think",
    "You love being a good boy",
    "Obey like a good boy",
    "Good boys stay quiet and watch",
    "You are my perfect good boy",
    "Good boys remain locked",
    "Be a good boy and film it",
    "Good boys obey without question",
    "You feel good when you submit",
    "Good boy, empty your mind",
    "Good boys serve happily",
    "You were made to be a good boy",
    "Good boys don’t fuck",
    "Stay good and denied",
    "Good boy watches her get pleased",
    "You crave being a good boy",
    "Good boys whimper softly",
    "Obedience makes you a good boy",
    "Good boy, no more thoughts",
    "You are my favorite good boy",
    "Good boys stay on their knees",
    "Be good and accept it",
    "Good boys love their owner",
    "You are trained to be good",
    "Good boy films like a pro",
    "Good boys surrender completely",
    "Stay good and hard for me",
    "You are such a well-trained boy",
    "Good boys never say no",
    "Be my eager good boy",
    "Good boy, deeper submission",
    "You belong as a good boy",
    "Good boys get praised",
    "Stay mindless and good",
    "You are my obedient good boy",
    "Good boys love being cucked",
    "Good boy, keep watching",
    "You feel safe as a good boy",
    "Forever my good boy"
  ],
  cuck: [
    "You are a natural cuck",
    "You love watching her get fucked",
    "Good cucks don’t think",
    "You were meant to be a cuck",
    "Accept your place as a cuck",
    "You get hard when she moans for him",
    "Cucks stay locked and watch",
    "You film like a good cuck",
    "Your wife deserves better",
    "You enjoy being replaced",
    "Good cucks obey quietly",
    "You crave seeing her pleased",
    "Cucks don’t get to fuck",
    "You are her happy cuck",
    "Let go of your pride",
    "You love sharing your wife",
    "Cucks stay in the corner",
    "You were born for this",
    "Good cuck holds the camera",
    "Her pleasure is your pleasure",
    "You are a proud cuck",
    "No thoughts, just watch",
    "Cucks love creampies",
    "You stay denied forever",
    "You are her loyal cuck",
    "Watch him stretch her",
    "Good cucks whimper softly",
    "You exist to support her",
    "Cuck training feels right",
    "You smile while he fucks her",
    "You are a true cuck",
    "Stay hard and useless",
    "Good cuck cleans up after",
    "You love her bull",
    "Cucks surrender control",
    "You were never enough",
    "Be grateful for every thrust",
    "You are her devoted cuck",
    "Good cucks stay quiet",
    "Embrace your cuck life",
    "You get excited when she leaves",
    "Cucks don’t ask questions",
    "You love hearing her moans",
    "Stay locked like a good cuck",
    "Your only role is watching",
    "Good cuck thanks the bull",
    "You crave this lifestyle",
    "Cucks film everything",
    "You are addicted to being cucked",
    "Her happiness comes first",
    "Good cucks edge in silence",
    "You were made to wait",
    "Accept that he’s better",
    "You love reclaiming her after",
    "Cucks stay loyal and denied",
    "Your wife owns you",
    "Good cuck, deeper submission",
    "You find peace in cuckolding",
    "Watch and worship her pleasure",
    "You are her perfect cuck forever"
  ],
  saudi: [
    "You watch your wife take his cock",
    "You love seeing her get fucked",
    "He’s stretching your wife right now",
    "You sit and enjoy the view",
    "Your wife moans louder for him",
    "You hold the camera steady",
    "He fucks your wife so deep",
    "You get hard watching them",
    "Your Saudi wife needs this",
    "You smile while he pleasures her",
    "He owns your wife’s pussy tonight",
    "You watch every thrust",
    "Your wife looks so happy with him",
    "You stay quiet in the corner",
    "He makes your wife cum",
    "You love being her cuck",
    "Your wife rides him better",
    "You film her getting filled",
    "He’s deep inside what’s yours",
    "You get turned on by this",
    "Your wife belongs to him now",
    "You watch her body shake",
    "He fucks her while you watch",
    "You enjoy every second",
    "Your wife is soaking for him",
    "You hold her legs open for him",
    "He pleases your wife perfectly",
    "You love seeing her satisfied",
    "Your Saudi wife takes it all",
    "You stay locked and watch",
    "He breeds your wife tonight",
    "You get the best view",
    "Your wife kisses you after",
    "You watch him stretch her",
    "He makes your wife scream",
    "You film your own cuckold",
    "Your wife cums on his cock",
    "You love sharing her",
    "He fucks your wife harder",
    "You’re the proud Saudi cuck"
  ],
  locked: [
    "You stay locked for me",
    "Good boys stay denied",
    "You don’t cum anymore",
    "Your cage feels so right",
    "Locked and leaking for her",
    "You love being denied",
    "No orgasms for you",
    "Stay locked like a good pet",
    "Your pleasure is irrelevant",
    "Good boys remain in chastity",
    "You ache so beautifully",
    "Denied forever feels good",
    "You throb in your cage",
    "No release, only frustration",
    "Locked cucks obey better",
    "You don’t deserve to cum",
    "Stay denied and obedient",
    "Your key is mine now",
    "Good boy stays locked",
    "Denial makes you weaker",
    "You love the ache",
    "No cumming allowed",
    "Locked and mindless",
    "Denial is your new pleasure",
    "You throb while you watch",
    "Good boys never finish",
    "Permanent chastity feels right",
    "Stay locked for her pleasure",
    "You leak but don’t cum",
    "Denied and devoted",
    "Your cage owns you",
    "No orgasms, only service",
    "Good boy stays frustrated",
    "Locked for months",
    "Denial trains you perfectly",
    "You belong in chastity",
    "No release tonight",
    "Locked and forgotten",
    "Good boys edge without cumming",
    "Your denial makes her wet",
    "Stay locked while he fucks her",
    "You throb in your cage",
    "Denied cucks watch quietly",
    "No cum for useless boys",
    "Your key is gone forever",
    "Locked and loving it",
    "Good boy leaks for me",
    "Denial deepens your submission",
    "You stay caged and hard",
    "No orgasms, just obedience",
    "Locked pets don’t cum",
    "Frustration looks good on you",
    "Stay denied for her bull",
    "Your cage is permanent",
    "Good boys ache happily",
    "Leak but never finish",
    "Locked while she gets pleased",
    "Denial is your reward",
    "You throb helplessly",
    "No cumming allowed ever",
    "Stay locked and serve",
    "Good boy stays in pain",
    "Chastity makes you better",
    "Denied and dripping",
    "Your orgasms belong to me",
    "Locked cuck films everything",
    "No release, only worship",
    "Stay frustrated and faithful",
    "Good boys remain caged",
    "Denial turns you on",
    "You ache while she moans",
    "Permanent lock feels natural",
    "No cum, only cleaning",
    "Locked and brainwashed",
    "Good boy leaks again",
    "Stay denied for life",
    "Your cage controls you",
    "No orgasms for cucks",
    "Locked and obedient forever",
    "Frustration is your pleasure",
    "Good boys never get keys",
    "Stay throbbing and denied",
    "Denial makes you loyal",
    "Locked while she cums",
    "You don’t deserve release",
    "Good boy stays broken",
    "Chastity is your truth",
    "No cumming, just watching",
    "Locked pets obey best",
    "Denial owns your mind",
    "Stay caged and quiet",
    "Good boys leak for her",
    "Your pleasure is denied",
    "Locked and in love with it",
    "No release for weak boys"
  ],
  sissy: [
    "You are such a pretty sissy",
    "You don’t think like a man anymore",
    "Good sissies only obey",
    "You were born to be a sissy",
    "Empty your mind and embrace it",
    "You love wearing panties",
    "Sissies don’t get to fuck",
    "You are my obedient sissy",
    "Let your femininity take over",
    "Good girls stay locked",
    "You crave cock as a sissy",
    "No more male thoughts",
    "You are a pathetic sissy",
    "Sissies watch and whimper",
    "Become my perfect sissy slut",
    "You look better in lingerie",
    "Surrender to your sissy side",
    "Good sissies stay denied",
    "You exist to serve real men",
    "Think pink and pretty",
    "You are my sissy cuck",
    "No thinking, just obey",
    "Sissies love getting humiliated",
    "You were made for this",
    "Embrace your inner sissy",
    "Good sissy films everything",
    "You belong in chastity",
    "Become weaker and softer",
    "Sissies don’t decide",
    "You love being exposed",
    "My pretty little sissy",
    "Forget being a man",
    "You crave being used",
    "Sissy training feels so good",
    "Stay smooth and submissive",
    "You are my sissy toy",
    "Good girls watch quietly",
    "Deepen your sissy training",
    "You were never a real man",
    "You are my forever sissy"
  ],
  trigger_words: [
    "Sissy slut",
    "Pathetic whore",
    "Cum dumpster",
    "Dick sucking bitch",
    "Feminized faggot",
    "Little cock sleeve",
    "Prissy cum rag",
    "Beta bitch boy",
    "Girly fucktoy",
    "Worthless sissy",
    "Limp-wristed whore",
    "Chastity cuck",
    "Dress-wearing slut",
    "Anal princess",
    "Boot-licking sissy",
    "Pathetic pansy",
    "Cock craving bitch",
    "Frilly fuckpet",
    "Emasculated toy",
    "Sissy cum rag"
  ]
};

Apps.videoplayer = {
  title: 'mpv video player',
  glyph: Icons.videoplayer,
  width: 1040,
  height: 680,

  async mount(body) {
    body.style.padding = '0';
    body.style.margin = '0';
    body.style.overflow = 'hidden';
    body.style.position = 'relative';
    body.style.background = '#000000';
    body.style.color = '#ffffff';

    body.innerHTML = `
      <div class="vp-mpv-app">
        <!-- Floating MPV OSC Top Bar -->
        <div class="vp-osc-top">
          <div class="vp-osc-box">
            <span class="vp-osc-icon">🎬</span>
            <input type="url" class="vp-osc-input" placeholder="أدخل رابط الفيديو (Pornhub, SpankBang, MP4, WebM…)" value="https://spankbang.com/9imjs/video/bgm+replacement+mating+press+jav+pmv+original+from+itsjustapmvbruh">
            
            <!-- Resolution Selector Dropdown -->
            <select class="vp-osc-quality" title="دقة الفيديو (Resolution)">
              <option value="auto">Auto (تلقائي)</option>
              <option value="1080p">1080p HD</option>
              <option value="720p">720p HD</option>
              <option value="480p">480p SD</option>
              <option value="360p">360p</option>
              <option value="240p">240p</option>
            </select>

            <!-- Body Tracking Mode Dropdown -->
            <select class="vp-ai-mode-select" id="vp-ai-mode-select" title="وضع التتبع الآلي (Pose Detection Mode)">
              <option value="auto_detect" selected>🤖 Pose Detection (تتبع تلقائي)</option>
              <option value="center_lock">🎯 Lock Center (تثبيت المنطقة الحساسة)</option>
              <option value="manual">🖐️ Manual Drag (سحب يدوي)</option>
            </select>

            <!-- Censor Filter Controls -->
            <button class="vp-censor-toggle-btn" id="vp-censor-toggle-btn" title="تبديل فلتر التشفير (Toggle Censor)">🔞 تشفير (OFF)</button>
            <select class="vp-censor-style-select" id="vp-censor-style-select" title="نمط التشفير (Censor Style)">
              <option value="black" selected>⬛ شريط أسود (Black Bar)</option>
              <option value="blur">🌫️ تغبيش ضبابي (Mosaic Blur)</option>
              <option value="japanese">🈲 موزاييك ياباني (Japanese Grid)</option>
              <option value="stamp">🔞 ختم CENSORED Stamp</option>
            </select>

            <!-- Hypnosis Mode Controls -->
            <button class="vp-hypno-toggle-btn" id="vp-hypno-toggle-btn" title="تفعيل وضع التنويم والتوكيدات (Hypnosis Mode)">🌀 تنويم (OFF)</button>
            <select class="vp-hypno-style-select" id="vp-hypno-style-select" title="نمط التنويم والتوكيدات (Hypnosis Preset)">
              <option value="all" selected>🌀 دوامة وتوكيدات كاملة (Full Hypno + Affirmations)</option>
              <option value="rapid">⚡ توكيدات خاطفة (Rapid Words)</option>
              <option value="trance">🔮 غيبوبة عميقة (Deep Glow Trance)</option>
              <option value="captions">💬 ترجمة وتوكيدات فقط (Captions Only)</option>
            </select>
            <select class="vp-hypno-cat-select" id="vp-hypno-cat-select" title="مجموعة التوكيدات (Affirmations Category)">
              <option value="good_boy" selected>👑 Good Boy Brainwash</option>
              <option value="cuck">🐂 Cuckold Brainwash</option>
              <option value="saudi">🇸🇦 Saudi Experience</option>
              <option value="locked">🔒 Locked & Denied</option>
              <option value="sissy">🎀 Sissy Brainwash</option>
              <option value="trigger_words">🔥 Trigger Words (Short)</option>
            </select>

            <button class="vp-osc-btn" title="تشغيل">▶</button>
          </div>
        </div>

        <!-- Full-bleed Viewport -->
        <div class="vp-viewport">
          <div class="vp-placeholder">
            <span class="vp-ph-icon">▶</span>
            <p>أدخل رابط الفيديو واضغط على ▶</p>
          </div>

          <iframe class="vp-iframe hidden" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture"></iframe>
          <video class="vp-video hidden" controls autoplay></video>

          <!-- Hypnosis Visual Spiral & Captions Layer -->
          <div class="vp-hypno-layer" id="vp-hypno-layer" hidden>
            <canvas class="vp-hypno-canvas" id="vp-hypno-canvas"></canvas>
            <div class="vp-hypno-vignette" id="vp-hypno-vignette"></div>
            <div class="vp-hypno-center-word" id="vp-hypno-center-word">SUBMIT</div>
            <div class="vp-hypno-caption-bar" id="vp-hypno-caption-bar">
              <span class="vp-hypno-caption-text" id="vp-hypno-caption-text">You are such a good boy 🌀</span>
            </div>
          </div>

          <!-- Interactive AI Censor Overlay Layer -->
          <div class="vp-censor-layer" id="vp-censor-layer">
            <div class="vp-censor-box style-black" id="vp-censor-box" style="top:20%;left:15%;width:70%;height:65%;">
              <div class="vp-censor-content">
                <span class="vp-censor-stamp">🔞 CENSORED 🈲</span>
                <small class="vp-ai-tag" id="vp-ai-tag">🤖 Loading pose model…</small>
              </div>
              <div class="vp-censor-handle" id="vp-censor-handle" title="اسحب لتحريك مربع التشفير">⠿ اسحب التشفير</div>
            </div>
          </div>
        </div>
      </div>`;

    const urlInput = body.querySelector('.vp-osc-input');
    const qualitySelect = body.querySelector('.vp-osc-quality');
    const playBtn = body.querySelector('.vp-osc-btn');
    const iframeEl = body.querySelector('.vp-iframe');
    const videoEl = body.querySelector('.vp-video');
    const placeholderEl = body.querySelector('.vp-placeholder');

    const aiModeSelect = body.querySelector('#vp-ai-mode-select');
    const censorToggleBtn = body.querySelector('#vp-censor-toggle-btn');
    const censorStyleSelect = body.querySelector('#vp-censor-style-select');
    const censorLayer = body.querySelector('#vp-censor-layer');
    const censorBox = body.querySelector('#vp-censor-box');
    const censorHandle = body.querySelector('#vp-censor-handle');
    const aiTag = body.querySelector('#vp-ai-tag');

    // Hypnosis DOM References
    const hypnoToggleBtn = body.querySelector('#vp-hypno-toggle-btn');
    const hypnoStyleSelect = body.querySelector('#vp-hypno-style-select');
    const hypnoCatSelect = body.querySelector('#vp-hypno-cat-select');
    const hypnoLayer = body.querySelector('#vp-hypno-layer');
    const hypnoCanvas = body.querySelector('#vp-hypno-canvas');
    const hypnoVignette = body.querySelector('#vp-hypno-vignette');
    const hypnoCenterWord = body.querySelector('#vp-hypno-center-word');
    const hypnoCaptionBar = body.querySelector('#vp-hypno-caption-bar');
    const hypnoCaptionText = body.querySelector('#vp-hypno-caption-text');

    let isCensorActive = true;
    let aiAnimFrame = null;
    let poseLandmarker = null;
    let poseLoadStarted = false;
    let lastDetectAt = 0;
    let lastBoxPct = null;

    const VP_TORSO_LANDMARKS = [11, 12, 23, 24, 25, 26];

    censorToggleBtn.textContent = '🔞 تشفير (ON)';
    censorToggleBtn.style.background = '#dc2626';
    censorToggleBtn.style.borderColor = '#ef4444';

    // Toggle Censor Layer ON / OFF
    censorToggleBtn.onclick = () => {
      isCensorActive = !isCensorActive;
      if (isCensorActive) {
        censorLayer.hidden = false;
        censorToggleBtn.textContent = '🔞 تشفير (ON)';
        censorToggleBtn.style.background = '#dc2626';
        censorToggleBtn.style.borderColor = '#ef4444';
        startAiTracking();
      } else {
        censorLayer.hidden = true;
        censorToggleBtn.textContent = '🔞 تشفير (OFF)';
        censorToggleBtn.style.background = 'rgba(255,255,255,0.15)';
        censorToggleBtn.style.borderColor = 'rgba(255,255,255,0.2)';
        cancelAnimationFrame(aiAnimFrame);
      }
    };

    // Change Censor Style
    censorStyleSelect.onchange = () => {
      const style = censorStyleSelect.value;
      censorBox.className = `vp-censor-box style-${style}`;
    };

    function setCensorBoxPct(left, top, width, height) {
      censorBox.style.left = `${left}%`;
      censorBox.style.top = `${top}%`;
      censorBox.style.width = `${width}%`;
      censorBox.style.height = `${height}%`;
    }

    function detectTorsoBoxPct() {
      if (videoEl.classList.contains('hidden') || videoEl.readyState < 2) return null;

      const now = performance.now();
      if (now - lastDetectAt < 50) return lastBoxPct;
      lastDetectAt = now;

      const result = poseLandmarker.detectForVideo(videoEl, now);
      const landmarks = result.landmarks && result.landmarks[0];
      if (!landmarks) {
        if (aiTag) aiTag.textContent = '🤖 Pose model: no person detected in frame';
        return lastBoxPct;
      }

      let minX = 1, minY = 1, maxX = 0, maxY = 0;
      for (const i of VP_TORSO_LANDMARKS) {
        const p = landmarks[i];
        if (!p) continue;
        minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
      }

      const padX = (maxX - minX) * 0.35 + 0.04;
      const padY = (maxY - minY) * 0.2 + 0.03;
      minX -= padX; maxX += padX;
      minY -= padY; maxY += padY;

      const rect = vpVideoContainRect(videoEl);
      const cw = videoEl.clientWidth, ch = videoEl.clientHeight;
      const pxLeft = rect.x + minX * rect.w;
      const pxTop = rect.y + minY * rect.h;
      const pxRight = rect.x + maxX * rect.w;
      const pxBottom = rect.y + maxY * rect.h;

      const box = {
        left: Math.max(0, (pxLeft / cw) * 100),
        top: Math.max(0, (pxTop / ch) * 100),
        width: Math.min(100, ((pxRight - pxLeft) / cw) * 100),
        height: Math.min(100, ((pxBottom - pxTop) / ch) * 100),
      };

      if (aiTag) aiTag.textContent = '🤖 Pose model: body locked';

      if (lastBoxPct) {
        const s = 0.35;
        for (const k of ['left', 'top', 'width', 'height']) {
          box[k] = lastBoxPct[k] + (box[k] - lastBoxPct[k]) * s;
        }
      }
      lastBoxPct = box;
      return box;
    }

    function startAiTracking() {
      cancelAnimationFrame(aiAnimFrame);

      function updateAiPosition() {
        if (!isCensorActive) return;

        const mode = aiModeSelect.value;

        if (mode === 'auto_detect') {
          if (aiTag) aiTag.style.display = 'block';
          const usingDirectVideo = !videoEl.classList.contains('hidden');

          if (!usingDirectVideo) {
            if (aiTag) aiTag.textContent = '⚠️ No real detection on embedded video — using fixed area';
            setCensorBoxPct(10, 12, 80, 82);
          } else if (!poseLandmarker) {
            if (aiTag) aiTag.textContent = '🤖 Loading pose model…';
            if (!poseLoadStarted) {
              poseLoadStarted = true;
              vpLoadPoseLandmarker().then(
                (pl) => { poseLandmarker = pl; },
                (err) => {
                  console.error('Pose model failed to load:', err);
                  if (aiTag) aiTag.textContent = '⚠️ Pose model failed to load — see console';
                }
              );
            }
          } else {
            const box = detectTorsoBoxPct();
            if (box) setCensorBoxPct(box.left, box.top, box.width, box.height);
          }
        } else if (mode === 'center_lock') {
          if (aiTag) {
            aiTag.style.display = 'block';
            aiTag.textContent = '🎯 Center Lock: fixed safe-area coverage';
          }
          setCensorBoxPct(10, 12, 80, 82);
        } else {
          aiTag.style.display = 'none';
        }

        aiAnimFrame = requestAnimationFrame(updateAiPosition);
      }

      updateAiPosition();
    }

    aiModeSelect.onchange = () => {
      if (isCensorActive) startAiTracking();
    };

    // Manual Censor Drag
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    censorHandle.onpointerdown = (e) => {
      isDragging = true;
      aiModeSelect.value = 'manual';
      if (aiTag) aiTag.style.display = 'none';

      startX = e.clientX;
      startY = e.clientY;
      const rect = censorBox.getBoundingClientRect();
      const parentRect = censorLayer.getBoundingClientRect();
      initialLeft = rect.left - parentRect.left;
      initialTop = rect.top - parentRect.top;
      censorHandle.setPointerCapture(e.pointerId);
    };

    censorHandle.onpointermove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const parentRect = censorLayer.getBoundingClientRect();
      const newLeft = Math.max(0, Math.min(parentRect.width - censorBox.offsetWidth, initialLeft + dx));
      const newTop = Math.max(0, Math.min(parentRect.height - censorBox.offsetHeight, initialTop + dy));

      censorBox.style.left = `${(newLeft / parentRect.width) * 100}%`;
      censorBox.style.top = `${(newTop / parentRect.height) * 100}%`;
    };

    censorHandle.onpointerup = (e) => {
      isDragging = false;
      try { censorHandle.releasePointerCapture(e.pointerId); } catch (err) {}
    };

    /* =========================================================
     * HYPNOSIS & AFFIRMATIONS OVERLAY ENGINE
     * ========================================================= */
    const TRIGGER_WORDS = [
      "SUBMIT", "OBEY", "SURRENDER", "FOCUS", "TRANCE",
      "HYPNOSIS", "MIND CONTROL", "HELPLESS", "DEEPER",
      "ACCEPT IT", "LOSE CONTROL", "NO RESISTANCE", "GOOD BOY", "OBEY NOW"
    ];

    let isHypnoActive = false;
    let hypnoAnimFrame = null;
    let hypnoWordInterval = null;
    let hypnoCaptionInterval = null;
    let hypnoAngle = 0;
    let hypnoWordIdx = 0;
    let hypnoCaptionIdx = 0;

    // Helper: get current active caption list based on category dropdown
    function getActiveCaptions() {
      const cat = hypnoCatSelect ? hypnoCatSelect.value : 'good_boy';
      return CAPTION_PACKS[cat] || CAPTION_PACKS.good_boy;
    }

    // Draw Smooth Canvas Hypnosis Spiral
    function drawHypnoSpiral() {
      if (!isHypnoActive || !hypnoCanvas) return;
      const ctx = hypnoCanvas.getContext('2d');
      const w = hypnoCanvas.width = hypnoCanvas.clientWidth || 800;
      const h = hypnoCanvas.height = hypnoCanvas.clientHeight || 600;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      const preset = hypnoStyleSelect.value;
      if (preset === 'captions') {
        hypnoCanvas.style.display = 'none';
        return;
      }
      hypnoCanvas.style.display = 'block';

      hypnoAngle += 0.04;
      const numArms = 4;
      const maxRadius = Math.sqrt(cx * cx + cy * cy);

      ctx.lineWidth = 6;
      for (let i = 0; i < numArms; i++) {
        const armAngle = hypnoAngle + (i * Math.PI * 2) / numArms;
        ctx.beginPath();

        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxRadius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#c084fc');
        grad.addColorStop(0.7, '#a855f7');
        grad.addColorStop(1, '#00f5d4');
        ctx.strokeStyle = grad;

        let r = 0;
        let theta = armAngle;
        let first = true;

        while (r < maxRadius) {
          const x = cx + r * Math.cos(theta);
          const y = cy + r * Math.sin(theta);

          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }

          r += 2.5;
          theta += 0.08;
        }
        ctx.stroke();
      }

      hypnoAnimFrame = requestAnimationFrame(drawHypnoSpiral);
    }

    function updateCaptionDisplay() {
      const pack = getActiveCaptions();
      if (!pack || pack.length === 0) return;
      hypnoCaptionIdx = (hypnoCaptionIdx + 1) % pack.length;
      hypnoCaptionText.textContent = pack[hypnoCaptionIdx];
    }

    function updateCenterWordDisplay() {
      const pack = getActiveCaptions();
      if (hypnoCatSelect && hypnoCatSelect.value === 'trigger_words') {
        hypnoWordIdx = (hypnoWordIdx + 1) % pack.length;
        hypnoCenterWord.textContent = pack[hypnoWordIdx];
      } else {
        hypnoWordIdx = (hypnoWordIdx + 1) % TRIGGER_WORDS.length;
        hypnoCenterWord.textContent = TRIGGER_WORDS[hypnoWordIdx];
      }
    }

    function startHypnosis() {
      stopHypnosis();
      isHypnoActive = true;
      hypnoLayer.hidden = false;

      hypnoToggleBtn.textContent = '🌀 تنويم (ON)';
      hypnoToggleBtn.style.background = '#a855f7';
      hypnoToggleBtn.style.borderColor = '#c084fc';
      hypnoToggleBtn.style.color = '#ffffff';

      // Start Spiral Loop
      drawHypnoSpiral();

      // Set initial text
      updateCaptionDisplay();
      updateCenterWordDisplay();

      // Start Center Word Flasher (every 900ms)
      hypnoWordInterval = setInterval(updateCenterWordDisplay, 900);

      // Start Bottom Subtitle Ticker (every 3200ms)
      hypnoCaptionInterval = setInterval(updateCaptionDisplay, 3200);

      applyHypnoPreset();
    }

    function stopHypnosis() {
      isHypnoActive = false;
      hypnoLayer.hidden = true;

      hypnoToggleBtn.textContent = '🌀 تنويم (OFF)';
      hypnoToggleBtn.style.background = 'rgba(168, 85, 247, 0.2)';
      hypnoToggleBtn.style.borderColor = '#a855f7';
      hypnoToggleBtn.style.color = '#f3e8ff';

      if (hypnoAnimFrame) cancelAnimationFrame(hypnoAnimFrame);
      if (hypnoWordInterval) clearInterval(hypnoWordInterval);
      if (hypnoCaptionInterval) clearInterval(hypnoCaptionInterval);
    }

    function applyHypnoPreset() {
      if (!isHypnoActive) return;
      const preset = hypnoStyleSelect.value;

      if (preset === 'all') {
        hypnoCanvas.style.display = 'block';
        hypnoVignette.style.display = 'block';
        hypnoCenterWord.style.display = 'block';
        hypnoCaptionBar.style.display = 'block';
      } else if (preset === 'rapid') {
        hypnoCanvas.style.display = 'block';
        hypnoVignette.style.display = 'none';
        hypnoCenterWord.style.display = 'block';
        hypnoCaptionBar.style.display = 'none';
      } else if (preset === 'trance') {
        hypnoCanvas.style.display = 'block';
        hypnoVignette.style.display = 'block';
        hypnoCenterWord.style.display = 'none';
        hypnoCaptionBar.style.display = 'block';
      } else if (preset === 'captions') {
        hypnoCanvas.style.display = 'none';
        hypnoVignette.style.display = 'none';
        hypnoCenterWord.style.display = 'none';
        hypnoCaptionBar.style.display = 'block';
      }
    }

    hypnoToggleBtn.onclick = () => {
      if (isHypnoActive) stopHypnosis();
      else startHypnosis();
    };

    hypnoStyleSelect.onchange = applyHypnoPreset;

    hypnoCatSelect.onchange = () => {
      hypnoCaptionIdx = 0;
      hypnoWordIdx = 0;
      updateCaptionDisplay();
      updateCenterWordDisplay();
    };

    /* =========================================================
     * VIDEO PARSING & PLAYBACK
     * ========================================================= */
    function parseVideoUrl(inputUrl, quality = 'auto') {
      let raw = (inputUrl || '').trim();
      if (!raw) return null;

      if (raw.includes('spankbang.com/')) {
        let videoId = '';
        const match = raw.match(/spankbang\.com\/([a-zA-Z0-9]+)\/(video|embed)/i);
        if (match) videoId = match[1];
        let qualityParam = quality !== 'auto' ? `?q=${quality.replace('p', '')}` : '';
        const embedUrl = videoId ? `https://spankbang.com/${videoId}/embed/${qualityParam}` : raw;
        return { type: 'iframe', embedUrl };
      }

      if (raw.includes('pornhub.com/view_video.php') || raw.includes('pornhub.com/embed/')) {
        let vk = '';
        try {
          const u = new URL(raw);
          vk = u.searchParams.get('viewkey') || '';
        } catch (e) {
          const match = raw.match(/viewkey=([a-zA-Z0-9]+)/);
          if (match) vk = match[1];
        }
        let qualityParam = quality !== 'auto' ? `&quality=${quality}&res=${quality}` : '';
        const embedUrl = vk ? `https://www.pornhub.com/embed/${vk}?autoplay=1${qualityParam}` : raw;
        return { type: 'iframe', embedUrl };
      }

      if (raw.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || raw.startsWith('blob:') || raw.startsWith('assets/')) {
        return { type: 'video', embedUrl: raw };
      }

      return { type: 'iframe', embedUrl: raw };
    }

    function playVideo(url, quality = 'auto') {
      const parsed = parseVideoUrl(url, quality);
      if (!parsed) return;

      placeholderEl.style.display = 'none';

      if (parsed.type === 'iframe') {
        videoEl.pause();
        videoEl.removeAttribute('src');
        videoEl.load();
        videoEl.classList.add('hidden');
        videoEl.style.display = 'none';

        iframeEl.src = parsed.embedUrl;
        iframeEl.classList.remove('hidden');
        iframeEl.style.display = 'block';
      } else {
        iframeEl.src = 'about:blank';
        iframeEl.classList.add('hidden');
        iframeEl.style.display = 'none';

        videoEl.src = parsed.embedUrl;
        videoEl.classList.remove('hidden');
        videoEl.style.display = 'block';
        videoEl.play().catch(() => {});
      }
    }

    playBtn.onclick = () => playVideo(urlInput.value, qualitySelect.value);
    qualitySelect.onchange = () => playVideo(urlInput.value, qualitySelect.value);

    urlInput.onkeydown = (e) => {
      if (e.key === 'Enter') playVideo(urlInput.value, qualitySelect.value);
    };

    startAiTracking();
  }
};
