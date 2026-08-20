/* Dayouth Phone / Dialer App — Call Characters
 * Authentic Smartphone UI with Web Audio DTMF & Ringtone Synthesizer Engine.
 */

const PHONE = (() => {
  /* ----- Character Contacts (Hijabi/Covered Gallery Art) ----- */
  const CONTACTS = [
    {
      id: 'mom',
      name: 'أمي',
      role: 'أم المنزل 💖',
      phone: '+966 50 771 9920',
      avatar: 'assets/family/mom.png',
      fallback: 'assets/family/mom.png',
      tone: '#ff6f9c'
    },
    {
      id: 'little-sister',
      name: 'أختي الصغرى',
      role: 'أختي الصغرى 🎀',
      phone: '+966 55 442 1109',
      avatar: 'assets/family/little-sister.png',
      fallback: 'assets/family/little-sister.png',
      tone: '#ff9ec4'
    },
    {
      id: 'big-sister',
      name: 'أختي الكبرى',
      role: 'أختي الكبرى 🎓',
      phone: '+966 54 883 2241',
      avatar: 'assets/family/big-sister.png',
      fallback: 'assets/family/big-sister.png',
      tone: '#6fa8ff'
    },
    {
      id: 'maid',
      name: 'خادمتنا',
      role: 'خادمة المنزل 👗',
      phone: '+966 53 119 4488',
      avatar: 'assets/family/maid.png',
      fallback: 'assets/family/maid.png',
      tone: '#d9c27a'
    },
    {
      id: 'childhood-friend',
      name: 'صديقة طفولتي',
      role: 'صديقة طفولتي 🌸',
      phone: '+966 56 331 6652',
      avatar: 'assets/family/child-friend.png',
      fallback: 'assets/family/child-friend.png',
      tone: '#7ad7c9'
    }
  ];

  /* ----- Web Audio Synthesizer Engine (Ringtone & DTMF) ----- */
  let audioCtx = null;
  let ringtoneInterval = null;
  let ringtoneActive = false;

  function initAudio() {
    try {
      if (!audioCtx || audioCtx.state === 'closed') {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch (e) {
      console.warn('Phone Audio Context error:', e);
    }
  }

  // Plays authentic DTMF Keypad Tones
  function playDTMF(key) {
    initAudio();
    if (!audioCtx) return;

    const dtmfFrequencies = {
      '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
      '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
      '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
      '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
    };

    const freqs = dtmfFrequencies[key] || [700, 1200];
    const now = audioCtx.currentTime;

    try {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.frequency.setValueAtTime(freqs[0], now);
      osc2.frequency.setValueAtTime(freqs[1], now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.15);
      osc2.stop(now + 0.15);
    } catch (e) {}
  }

  // Plays Outgoing Ringtone (440Hz + 480Hz dual tone burst)
  function startRingtone() {
    stopRingtone();
    initAudio();
    ringtoneActive = true;

    function playToneBurst() {
      if (!ringtoneActive || !audioCtx) return;
      try {
        const now = audioCtx.currentTime;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.setValueAtTime(0.15, now + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.0);
        osc2.stop(now + 2.0);
      } catch (e) {}
    }

    playToneBurst();
    ringtoneInterval = setInterval(playToneBurst, 4000);
  }

  function stopRingtone() {
    ringtoneActive = false;
    if (ringtoneInterval) {
      clearInterval(ringtoneInterval);
      ringtoneInterval = null;
    }
  }
  /* ----- Moan Audio Player (Real CC0 Sound Effects) ----- */
  const MOAN_FILES = [
    'assets/audio/moans/woman-sexual-moaning.mp3',
    'assets/audio/moans/a-woman-has-an-orgasm-and-moans-sexually.mp3',
    'assets/audio/moans/female-orgasm.mp3',
    'assets/audio/moans/female-heavy-sighing.mp3',
    'assets/audio/moans/female-heavier-moaning.mp3',
    'assets/audio/moans/mature-woman-moaning-before-cumming.mp3',
    'assets/audio/moans/a-woman-enjoys-sex.mp3',
    'assets/audio/moans/girl-moaning-during-a-simulated-orgasm.mp3',
    'assets/audio/moans/girl-enjoys-cunnilingus.mp3',
    'assets/audio/moans/female-real-orgasm-moans.mp3',
    'assets/audio/moans/female-moaning.mp3',
    'assets/audio/moans/girl-moans.mp3',
    'assets/audio/moans/sexual-moans-of-a-woman.mp3',
    'assets/audio/moans/woman-big-large-and-long-moan.mp3',
    'assets/audio/moans/moaning-woman-while-having-sex.mp3',
    'assets/audio/moans/woman-moaning-and-reaching-an-orgasm.mp3'
  ];

  let moanActive = false;
  let moanTimeout = null;
  let currentMoanAudio = null;
  let lastMoanIndex = -1;

  function pickRandomMoan() {
    // Avoid playing the same clip twice in a row
    let idx;
    do {
      idx = Math.floor(Math.random() * MOAN_FILES.length);
    } while (idx === lastMoanIndex && MOAN_FILES.length > 1);
    lastMoanIndex = idx;
    return MOAN_FILES[idx];
  }

  function playNextMoan(onEnded) {
    if (!moanActive) return;

    const src = pickRandomMoan();
    currentMoanAudio = new Audio(src);
    currentMoanAudio.volume = 0.8;

    currentMoanAudio.onended = () => {
      if (!moanActive) return;
      if (typeof onEnded === 'function') {
        onEnded();
      }
    };

    currentMoanAudio.onerror = () => {
      if (!moanActive) return;
      if (typeof onEnded === 'function') {
        onEnded();
      }
    };

    currentMoanAudio.play().catch(() => {
      if (moanActive && typeof onEnded === 'function') {
        onEnded();
      }
    });
  }

  function startMoans(onEnded) {
    stopMoans();
    moanActive = true;
    playNextMoan(onEnded);
  }

  function stopMoans() {
    moanActive = false;
    if (moanTimeout) {
      clearTimeout(moanTimeout);
      moanTimeout = null;
    }
    if (currentMoanAudio) {
      currentMoanAudio.pause();
      currentMoanAudio.currentTime = 0;
      currentMoanAudio = null;
    }
  }

  /* ----- Call State Management ----- */
  let callConnectTimeout = null;
  let callTimerInterval = null;
  let callSeconds = 0;
  let onCallConnected = null;  // callback set by mount()

  function scheduleCallConnect(statusEl, onEnded) {
    clearCallTimers();
    callSeconds = 0;
    // Ring for 4–6 seconds then "connect"
    const ringDuration = 4000 + Math.random() * 2000;
    callConnectTimeout = setTimeout(() => {
      stopRingtone();
      startMoans(onEnded);
      if (statusEl) statusEl.textContent = '🔴 متصل الآن  00:00';
      // Start call duration timer
      callTimerInterval = setInterval(() => {
        callSeconds++;
        const mm = String(Math.floor(callSeconds / 60)).padStart(2, '0');
        const ss = String(callSeconds % 60).padStart(2, '0');
        if (statusEl) statusEl.textContent = `🔴 متصل الآن  ${mm}:${ss}`;
      }, 1000);
      if (onCallConnected) onCallConnected();
    }, ringDuration);
  }

  function clearCallTimers() {
    if (callConnectTimeout) { clearTimeout(callConnectTimeout); callConnectTimeout = null; }
    if (callTimerInterval) { clearInterval(callTimerInterval); callTimerInterval = null; }
    callSeconds = 0;
  }


  /* ----- Call Logs Storage ----- */
  function getCallLogs() {
    try {
      return JSON.parse(localStorage.getItem('phone_call_logs') || '[]');
    } catch (e) { return []; }
  }

  function saveCallLog(contactName, phoneNum, status = 'جاري الرنين...') {
    const logs = getCallLogs();
    logs.unshift({
      name: contactName,
      number: phoneNum,
      status: status,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem('phone_call_logs', JSON.stringify(logs.slice(0, 30)));
  }

  /* ----- App Mounting Engine ----- */
  function mount(container) {
    container.innerHTML = `
      <div class="ph-app" dir="rtl">
        <!-- Status Bar -->
        <header class="ph-status-bar">
          <span class="ph-time">12:00</span>
          <div class="ph-status-icons">
            <span>5G</span>
            <span>📶</span>
            <span>98% 🔋</span>
          </div>
        </header>

        <!-- Main Body Screens -->
        <div class="ph-body">

          <!-- Contacts Tab -->
          <div class="ph-tab-page ph-page-contacts">
            <div class="ph-search-wrap">
              <input type="text" class="ph-search-input" placeholder="🔍 بحث في جهات الاتصال...">
            </div>
            <div class="ph-section-header">جهات الاتصال</div>
            <div class="ph-contacts-list"></div>
          </div>

          <!-- Keypad Tab -->
          <div class="ph-tab-page ph-page-keypad" hidden>
            <div class="ph-dial-display">
              <div class="ph-dial-number"></div>
              <button type="button" class="ph-backspace-btn" title="مسح">⌫</button>
            </div>
            <div class="ph-keypad-grid">
              <button class="ph-key" data-key="1"><b>1</b><small>&#160;</small></button>
              <button class="ph-key" data-key="2"><b>2</b><small>ABC</small></button>
              <button class="ph-key" data-key="3"><b>3</b><small>DEF</small></button>
              <button class="ph-key" data-key="4"><b>4</b><small>GHI</small></button>
              <button class="ph-key" data-key="5"><b>5</b><small>JKL</small></button>
              <button class="ph-key" data-key="6"><b>6</b><small>MNO</small></button>
              <button class="ph-key" data-key="7"><b>7</b><small>PQRS</small></button>
              <button class="ph-key" data-key="8"><b>8</b><small>TUV</small></button>
              <button class="ph-key" data-key="9"><b>9</b><small>WXYZ</small></button>
              <button class="ph-key" data-key="*"><b>*</b><small>&#160;</small></button>
              <button class="ph-key" data-key="0"><b>0</b><small>+</small></button>
              <button class="ph-key" data-key="#"><b>#</b><small>&#160;</small></button>
            </div>
            <div class="ph-dial-action-wrap">
              <button type="button" class="ph-call-btn-main" title="اتصال">📞</button>
            </div>
          </div>

          <!-- Recents Tab -->
          <div class="ph-tab-page ph-page-recents" hidden>
            <div class="ph-section-header">سجل المكالمات الأخيرة</div>
            <div class="ph-recents-list"></div>
          </div>
        </div>

        <!-- Bottom Navigation Bar -->
        <nav class="ph-nav-bar">
          <button type="button" class="ph-nav-btn active" data-tab="contacts">
            <span class="ph-nav-icon">👥</span>
            <span>جهات الاتصال</span>
          </button>
          <button type="button" class="ph-nav-btn" data-tab="keypad">
            <span class="ph-nav-icon">🔢</span>
            <span>لوحة المفاتيح</span>
          </button>
          <button type="button" class="ph-nav-btn" data-tab="recents">
            <span class="ph-nav-icon">🕒</span>
            <span>السجل</span>
          </button>
        </nav>

        <!-- Active Ringing Call Overlay -->
        <div class="ph-call-overlay" hidden>
          <div class="ph-call-bg"></div>
          <div class="ph-call-content">
            <div class="ph-avatar-pulse-wrap">
              <div class="ph-pulse-ring"></div>
              <div class="ph-pulse-ring delay"></div>
              <img class="ph-call-avatar" alt="Character Avatar" src="assets/family/mom.png">
            </div>
            <h2 class="ph-call-name">أمي</h2>
            <div class="ph-call-role muted">أم المنزل 💖</div>
            <div class="ph-call-number">+966 50 771 9920</div>
            <div class="ph-call-status">جاري الاتصال... 🔔</div>

            <!-- Call Action Controls -->
            <div class="ph-call-controls">
              <button type="button" class="ph-call-ctrl-btn ph-btn-mute" title="كتم الصوت">
                <span>🎤</span>
                <small>كتم</small>
              </button>
              <button type="button" class="ph-call-ctrl-btn ph-btn-speaker" title="مكبر الصوت">
                <span>🔊</span>
                <small>مكبر الصوت</small>
              </button>
              <button type="button" class="ph-call-ctrl-btn ph-btn-end" title="إنهاء المكالمة">
                <span>📞</span>
                <small>إنهاء</small>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    /* ----- DOM References ----- */
    const $ = (sel) => container.querySelector(sel);
    const $$ = (sel) => container.querySelectorAll(sel);

    const searchInput = $('.ph-search-input');
    const contactsList = $('.ph-contacts-list');
    const recentsList = $('.ph-recents-list');
    const dialNumber = $('.ph-dial-number');
    const backspaceBtn = $('.ph-backspace-btn');
    const callBtnMain = $('.ph-call-btn-main');

    const callOverlay = $('.ph-call-overlay');
    const callBg = $('.ph-call-bg');
    const callAvatar = $('.ph-call-avatar');
    const callName = $('.ph-call-name');
    const callRole = $('.ph-call-role');
    const callNumber = $('.ph-call-number');
    const callStatus = $('.ph-call-status');
    const btnEnd = $('.ph-btn-end');

    let currentDialStr = '';

    /* ----- Render Contacts List ----- */
    function renderContacts(filter = '') {
      contactsList.innerHTML = '';
      const q = filter.trim().toLowerCase();

      const filtered = CONTACTS.filter(c => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.phone.includes(q));

      if (filtered.length === 0) {
        contactsList.innerHTML = `<div class="ph-empty-msg">لا توجد جهات اتصال تطابق "${filter}"</div>`;
        return;
      }

      filtered.forEach(c => {
        const card = document.createElement('div');
        card.className = 'ph-contact-card';
        card.style.borderColor = c.tone || 'rgba(255,255,255,0.1)';
        card.innerHTML = `
          <div class="ph-contact-avatar-wrap">
            <img src="${c.avatar}" onerror="this.src='${c.fallback}'" class="ph-contact-img" alt="${c.name}">
          </div>
          <div class="ph-contact-info">
            <div class="ph-contact-name">${c.name}</div>
            <div class="ph-contact-role">${c.role}</div>
            <div class="ph-contact-phone">${c.phone}</div>
          </div>
          <div class="ph-contact-actions">
            <button type="button" class="ph-btn-call" title="اتصال بـ ${c.name}">📞 اتصال</button>
          </div>
        `;

        card.querySelector('.ph-btn-call').onclick = () => initiateCall(c);
        contactsList.appendChild(card);
      });
    }

    /* ----- Render Recents / Call Logs ----- */
    function renderRecents() {
      recentsList.innerHTML = '';
      const logs = getCallLogs();

      if (logs.length === 0) {
        recentsList.innerHTML = '<div class="ph-empty-msg">لا توجد مكالمات صادرة سابقة.</div>';
        return;
      }

      logs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'ph-recent-item';
        item.innerHTML = `
          <div class="ph-recent-icon">📞</div>
          <div class="ph-recent-info">
            <div class="ph-recent-name">${log.name}</div>
            <div class="ph-recent-sub">${log.number} • ${log.status}</div>
          </div>
          <div class="ph-recent-time">${log.time}</div>
        `;
        recentsList.appendChild(item);
      });
    }

    /* ----- Initiate Character Call (Ringing → Connected with moans) ----- */
    function initiateCall(contact) {
      const name = contact.name || 'جهة اتصال مجهولة';
      const role = contact.role || 'جهة اتصال';
      const phone = contact.phone || currentDialStr || '+966 50 000 0000';
      const avatarSrc = contact.avatar || 'assets/family/mom.png';
      const fallbackSrc = contact.fallback || 'assets/family/mom.png';

      callName.textContent = name;
      callRole.textContent = role;
      callNumber.textContent = phone;
      callAvatar.src = avatarSrc;
      callAvatar.onerror = () => { callAvatar.src = fallbackSrc; };
      callBg.style.backgroundImage = `url("${avatarSrc}"), url("${fallbackSrc}")`;
      callStatus.textContent = 'جاري الاتصال... 🔔';

      // Reset pulse animation
      const pulseRings = callOverlay.querySelectorAll('.ph-pulse-ring');
      pulseRings.forEach(r => r.style.borderColor = contact.tone || '#ff6f9c');

      callOverlay.hidden = false;
      startRingtone();
      saveCallLog(name, phone, 'مكالمة صادرة');

      // After ringing, auto-connect, play one moan audio, then close call
      scheduleCallConnect(callStatus, () => endCall());
    }

    function endCall() {
      stopRingtone();
      stopMoans();
      clearCallTimers();
      callStatus.textContent = 'تم إنهاء المكالمة';
      setTimeout(() => {
        callOverlay.hidden = true;
        renderRecents();
      }, 500);
    }

    /* ----- Update Clock ----- */
    function updateClock() {
      const timeEl = $('.ph-time');
      if (timeEl) {
        timeEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    updateClock();
    setInterval(updateClock, 10000);

    /* ----- Event Listeners Wiring ----- */

    // Tab Navigation
    $$('.ph-nav-btn').forEach(btn => {
      btn.onclick = () => {
        $$('.ph-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.dataset.tab;
        $('.ph-page-contacts').hidden = (tab !== 'contacts');
        $('.ph-page-keypad').hidden = (tab !== 'keypad');
        $('.ph-page-recents').hidden = (tab !== 'recents');

        if (tab === 'contacts') renderContacts(searchInput.value);
        if (tab === 'recents') renderRecents();
      };
    });

    // Search input
    searchInput.oninput = (e) => renderContacts(e.target.value);

    // Keypad Buttons
    $$('.ph-key').forEach(keyBtn => {
      keyBtn.onclick = () => {
        const val = keyBtn.dataset.key;
        playDTMF(val);
        currentDialStr += val;
        dialNumber.textContent = currentDialStr;
      };
    });

    backspaceBtn.onclick = () => {
      currentDialStr = currentDialStr.slice(0, -1);
      dialNumber.textContent = currentDialStr;
    };

    // Main Call Button from Keypad
    callBtnMain.onclick = () => {
      if (!currentDialStr) {
        initiateCall(CONTACTS[0]); // Default call Mom if empty
        return;
      }

      // Check if dialed number matches a contact
      const match = CONTACTS.find(c => c.phone.replace(/\s+/g, '') === currentDialStr.replace(/\s+/g, ''));
      if (match) {
        initiateCall(match);
      } else {
        initiateCall({
          name: `رقم: ${currentDialStr}`,
          role: 'مكالمة صادرة',
          phone: currentDialStr,
          avatar: 'assets/family/mom.png',
          fallback: 'assets/family/mom.png'
        });
      }
    };

    // Mute & Speaker Toggle Buttons
    const btnMute = $('.ph-btn-mute');
    const btnSpeaker = $('.ph-btn-speaker');

    btnMute.onclick = () => {
      btnMute.classList.toggle('active');
    };

    btnSpeaker.onclick = () => {
      btnSpeaker.classList.toggle('active');
    };

    // End Call Button
    btnEnd.onclick = endCall;

    // Initial render
    renderContacts();
  }

  return { mount, CONTACTS };
})();

/* ----- Register WebOS Desktop App ----- */
if (typeof Apps !== 'undefined') {
  Apps.phone = {
    title: 'Phone',
    glyph: typeof Icons !== 'undefined' ? (Icons.phone || '📞') : '📞',
    width: 440,
    height: 720,
    mount(body) {
      body.style.padding = '0';
      body.style.background = '#090d16';
      PHONE.mount(body);
    },
  };
}
