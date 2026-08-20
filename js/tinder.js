/* Swipe — Tinder-Style Profile Swiper Game Engine (Apps.tinder)
 * Features:
 * - Real-time stacked cards (top card + undercard preview)
 * - Explicit Swipe Choices:
 *   - Swipe Right / "Talk Yourself": You try talking to her yourself -> Rejection Outcome
 *   - Swipe Left / "Send to Bull": You send her to your bull -> Bull Match Outcome
 * - Mouse/Touch pointer dragging with smooth rotation & dynamic stamps
 * - Keyboard shortcuts (Left Arrow = Send to Bull, Right Arrow = Talk Yourself, Up Arrow = Next)
 * - Outcome overlay card with Redo / Rewind / Next controls
 * - Image preloading & fallback icons
 */

Apps.tinder = {
  title: 'Swipe',
  glyph: Icons.fire,
  width: 880,
  height: 650,

  async mount(body) {
    body.style.padding = '0';
    body.style.margin = '0';
    body.style.overflow = 'hidden';
    body.style.background = '#090a0f';
    body.style.color = '#ffffff';
    body.style.fontFamily = 'var(--font-main, system-ui, sans-serif)';
    body.style.userSelect = 'none';

    body.innerHTML = `
      <style>
        .tinder-app {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 16px;
          box-sizing: border-box;
          background: radial-gradient(circle at 50% 30%, #1a0b1e, #090a0f 80%);
          position: relative;
        }
        .tinder-header {
          position: absolute;
          top: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 92%;
          max-width: 440px;
          font-size: 0.85rem;
          color: #94a3b8;
          z-index: 10;
        }
        .tinder-card-stack {
          position: relative;
          width: 370px;
          height: 480px;
          margin-top: 20px;
        }
        .tinder-card {
          width: 100%;
          height: 100%;
          background: #151926;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 0; left: 0;
          cursor: grab;
          touch-action: none;
          user-select: none;
          will-change: transform;
        }
        .tinder-card-under {
          transform: scale(0.95) translateY(14px);
          opacity: 0.6;
          pointer-events: none;
          z-index: 1;
        }
        .tinder-card-top {
          z-index: 2;
        }
        .tinder-card-img-wrap {
          height: 68%;
          width: 100%;
          background: #1e2436;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tinder-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .tinder-stamp {
          position: absolute;
          top: 20px;
          font-size: 1.1rem;
          font-weight: 900;
          padding: 6px 14px;
          border-radius: 8px;
          border: 3px solid;
          opacity: 0;
          pointer-events: none;
          z-index: 5;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .tinder-stamp-talk {
          right: 16px;
          color: #ff5ea8;
          border-color: #ff5ea8;
          transform: rotate(12deg);
        }
        .tinder-stamp-bull {
          left: 16px;
          color: #4dd2ff;
          border-color: #4dd2ff;
          transform: rotate(-12deg);
        }
        .tinder-info {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .tinder-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .tinder-bio {
          font-size: 0.84rem;
          color: #cbd5e1;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .tinder-controls {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          z-index: 10;
          width: 370px;
        }
        .tinder-action-choice-btn {
          flex: 1;
          padding: 12px 8px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.06);
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #fff;
        }
        .tinder-action-choice-btn:hover {
          transform: translateY(-2px);
        }
        .tinder-btn-bull {
          border-color: #4dd2ff;
          color: #4dd2ff;
          background: rgba(77, 210, 255, 0.08);
        }
        .tinder-btn-bull:hover { background: rgba(77, 210, 255, 0.22); }
        .tinder-btn-talk {
          border-color: #ff5ea8;
          color: #ff5ea8;
          background: rgba(255, 94, 168, 0.08);
        }
        .tinder-btn-talk:hover { background: rgba(255, 94, 168, 0.22); }
        .tinder-btn-rewind {
          width: 44px;
          flex: 0 0 44px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.06);
          font-size: 1.1rem;
        }

        .tinder-outcome-card {
          width: 370px;
          min-height: 450px;
          background: #151926;
          border: 1px solid rgba(255, 94, 168, 0.35);
          border-radius: 20px;
          padding: 24px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
          z-index: 20;
        }
        .tinder-outcome-badge {
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .tinder-outcome-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .tinder-outcome-text {
          font-size: 0.88rem;
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 24px;
          flex: 1;
        }
        .tinder-action-row {
          display: flex;
          gap: 10px;
          width: 100%;
        }
        .tinder-action-btn {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tinder-action-btn:hover { background: rgba(255, 255, 255, 0.2); }
        .hidden { display: none !important; }
      </style>

      <div class="tinder-app">
        <header class="tinder-header">
          <span style="display:inline-flex;align-items:center;gap:6px">${Icons.fire} Swipe Matcher</span>
          <span class="tinder-progress" id="tinder-progress">Profile 1 / 10</span>
        </header>

        <div class="tinder-card-stack" id="card-stack">
          <!-- Under Card Preview -->
          <div class="tinder-card tinder-card-under" id="card-under">
            <div class="tinder-card-img-wrap" id="under-img-wrap"></div>
            <div class="tinder-info">
              <div class="tinder-name" id="under-name">--</div>
              <div class="tinder-bio" id="under-bio">--</div>
            </div>
          </div>

          <!-- Top Interactive Card -->
          <div class="tinder-card tinder-card-top" id="card-top">
            <div class="tinder-card-img-wrap" id="top-img-wrap">
              <div class="tinder-stamp tinder-stamp-talk" id="stamp-talk">${Icons.chat} TALK YOURSELF</div>
              <div class="tinder-stamp tinder-stamp-bull" id="stamp-bull">${Icons.bull} SEND TO BULL</div>
            </div>
            <div class="tinder-info">
              <div class="tinder-name" id="top-name">--</div>
              <div class="tinder-bio" id="top-bio">--</div>
            </div>
          </div>
        </div>

        <!-- Outcome Overlay -->
        <div class="tinder-outcome-card hidden" id="outcome-card">
          <div class="tinder-outcome-badge" id="outcome-badge">Outcome</div>
          <div class="tinder-outcome-title" id="outcome-title">--</div>
          <div class="tinder-outcome-text" id="outcome-text">--</div>
          <div class="tinder-action-row">
            <button class="tinder-action-btn" id="redo-btn" style="display:inline-flex;align-items:center;justify-content:center;gap:6px">${Icons.refresh} Redo Choice</button>
            <button class="tinder-action-btn" id="next-btn" style="display:inline-flex;align-items:center;justify-content:center;gap:6px">Next Profile ${Icons.play}</button>
          </div>
        </div>

        <div class="tinder-controls" id="controls">
          <button class="tinder-action-choice-btn tinder-btn-bull" id="bull-btn" title="Swipe Left to Send to Bull">${Icons.bull} Send to Bull</button>
          <button class="tinder-action-choice-btn tinder-btn-rewind" id="prev-btn" title="Rewind Previous Profile">${Icons.refresh}</button>
          <button class="tinder-action-choice-btn tinder-btn-talk" id="talk-btn" title="Swipe Right to Talk Yourself">${Icons.chat} Talk Yourself</button>
        </div>
      </div>`;

    // References
    const stack = body.querySelector('#card-stack');
    const cardTop = body.querySelector('#card-top');
    const topImgWrap = body.querySelector('#top-img-wrap');
    const topName = body.querySelector('#top-name');
    const topBio = body.querySelector('#top-bio');

    const cardUnder = body.querySelector('#card-under');
    const underImgWrap = body.querySelector('#under-img-wrap');
    const underName = body.querySelector('#under-name');
    const underBio = body.querySelector('#under-bio');

    const progressEl = body.querySelector('#tinder-progress');

    const outcomeCard = body.querySelector('#outcome-card');
    const outcomeBadge = body.querySelector('#outcome-badge');
    const outcomeTitle = body.querySelector('#outcome-title');
    const outcomeText = body.querySelector('#outcome-text');
    const redoBtn = body.querySelector('#redo-btn');
    const nextBtn = body.querySelector('#next-btn');

    const controls = body.querySelector('#controls');
    const prevBtn = body.querySelector('#prev-btn');
    const bullBtn = body.querySelector('#bull-btn');
    const talkBtn = body.querySelector('#talk-btn');

    // Profiles Dataset
    const profiles = [
      {
        name: 'Lila Voss', age: 24, icon: '💃',
        bio: 'Professional model and tamer. I like men who know their place and bulls who know how to take it.',
        rightLabel: 'Talked Yourself (Rejection)', rightText: 'Lila studies your profile with a soft, condescending laugh: "Oh sweetie... you\'re actually serious? That\'s adorable, but you\'re nowhere near my league. Don\'t take it personally... actually, do."',
        leftLabel: 'Sent to Bull (Match)', leftText: 'Your bull matches with Lila instantly. She texts you updates: "He didn\'t even wait for me to sit down — grabbed me by the throat and pinned me against the wall!"'
      },
      {
        name: 'Sophie Laurent', age: 22, icon: '👱‍♀️',
        bio: 'Sunshine on the outside, absolute menace on the inside. Love the beach and big guys.',
        rightLabel: 'Talked Yourself (Rejection)', rightText: 'Sophie replies: "Aww you\'re so sweet and polite... which is exactly why this won\'t work. Hard pass cutie, unmatched!"',
        leftLabel: 'Sent to Bull (Match)', leftText: 'Sophie meets your bull at the beach: "He fucked me right there in the car with the windows down! He was so deep I lost count."'
      },
      {
        name: 'Yuna Kuro', age: 23, icon: '👩‍🎤',
        bio: 'Elegant on the surface, filthy underneath. Enjoying traditional dates that end with getting railed.',
        rightLabel: 'Talked Yourself (Rejection)', rightText: 'Yuna responds politely: "I crave intensity, roughness, and raw masculinity. You don\'t give off those vibes."',
        leftLabel: 'Sent to Bull (Match)', leftText: 'Yuna goes to a hotel with your bull: "Threw me on the bed and fucked me for hours in every position. I came harder than I have in years!"'
      },
      {
        name: 'Miko "Nyaa" Takahashi', age: 21, icon: '🐱',
        bio: 'Catgirl cosplayer & tease. Meow~',
        rightLabel: 'Talked Yourself (Rejection)', rightText: 'Miko giggles: "Haha you\'re super cute! But you\'re not alpha enough for me. Sorry nyaa~"',
        leftLabel: 'Sent to Bull (Match)', leftText: 'Miko goes wild with your bull: "He grabbed me by the tail plug and fucked me doggy style while I screamed like a good little kitty!"'
      },
      {
        name: 'Vesper Kane', age: 25, icon: '🌹',
        bio: 'Chaos gremlin with a body count higher than my age. I collect broken boys.',
        rightLabel: 'Talked Yourself (Rejection)', rightText: 'Vesper laughs in a voice note: "You don\'t give off any alpha energy. I\'d break you in five minutes. Go find yourself a nice vanilla girl."',
        leftLabel: 'Sent to Bull (Match)', leftText: 'Vesper invites your bull over: "He didn\'t even say hello — grabbed me by the hair and shoved me to my knees!"'
      },
      {
        name: 'Raven Noir', age: 26, icon: '🖤',
        bio: 'Thick, bratty, and merciless. Turning nice guys into cucks.',
        rightLabel: 'Talked Yourself (Rejection)', rightText: 'Raven teasers: "You\'re not the one who gets to enjoy all this ass. I need someone who\'ll smack my ass red. Stay in the loser category!"',
        leftLabel: 'Sent to Bull (Match)', leftText: 'Raven meets your bull: "He ripped my fishnets open and spanked me until my ass was purple while pounding me from behind!"'
      },
      {
        name: 'Kayla Rivera', age: 20, icon: '👙',
        bio: 'Bikini addict and size queen. If you\'re under 8 inches I\'m not interested.',
        rightLabel: 'Talked Yourself (Rejection)', rightText: 'Kayla says: "I\'m a massive size queen. I need something thick and long that actually fills me up. Sorry cutie!"',
        leftLabel: 'Sent to Bull (Match)', leftText: 'Kayla update: "We didn\'t even make it inside — he fucked me against his car first! He\'s stretching me so good!"'
      },
      {
        name: 'Seraphina Voss', age: 24, icon: '⚔️',
        bio: 'Noble by day, complete tease by night. Treated like a princess and used like a slut.',
        rightLabel: 'Talked Yourself (Rejection)', rightText: 'Seraphina replies: "I require much more than manners. I want to be worshipped and then used by someone with real dominance."',
        leftLabel: 'Sent to Bull (Match)', leftText: 'Seraphina story: "He made me beg for his cock like a common slut while reminding me how much better he is than you!"'
      },
      {
        name: 'Captain Ruby Drake', age: 25, icon: '🏴‍☠️',
        bio: 'Sailor mouth, pirate attitude, insatiable hunger for superior dick.',
        rightLabel: 'Talked Yourself (Rejection)', rightText: 'Ruby laughs: "You think you can handle a captain like me? Fuck no. Walk the plank, lad!"',
        leftLabel: 'Sent to Bull (Match)', leftText: 'Ruby update: "He boarded me the second I arrived! Tied me up and destroyed every hole while I screamed like a whore!"'
      },
      {
        name: 'Nyx Shadow', age: 23, icon: '🦇',
        bio: 'Goth succubus who feeds on your humiliation.',
        rightLabel: 'Talked Yourself (Rejection)', rightText: 'Nyx: "You actually thought you had a shot with me? How pathetic. I only let real men touch me. Stay in your lane, loser!"',
        leftLabel: 'Sent to Bull (Match)', leftText: 'Nyx final message: "He completely owned me tonight. Thanks for the superior cock referral, cuck!"'
      }
    ];

    let currentIndex = 0;
    let dragging = false;
    let startX = 0, startY = 0, deltaX = 0, deltaY = 0;

    function renderCardContent(imgWrap, nameEl, bioEl, index) {
      if (index >= profiles.length) return;
      const p = profiles[index];
      nameEl.textContent = `${p.name}, ${p.age}`;
      bioEl.textContent = p.bio;

      const imgPath = `resources/tender/${index + 1}.png`;
      imgWrap.innerHTML = `
        <img src="${imgPath}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
        <div class="tinder-avatar-fallback" style="display:none;height:100%;align-items:center;justify-content:center;color:#4dd2ff;">${Icons.user}</div>
        <div class="tinder-stamp tinder-stamp-talk">${Icons.chat} TALK YOURSELF</div>
        <div class="tinder-stamp tinder-stamp-bull">${Icons.bull} SEND TO BULL</div>
      `;
    }

    function updateCards() {
      outcomeCard.classList.add('hidden');
      stack.classList.remove('hidden');
      controls.classList.remove('hidden');

      if (currentIndex >= profiles.length) {
        showCompletion();
        return;
      }

      progressEl.textContent = `Profile ${currentIndex + 1} / ${profiles.length}`;
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';

      // Render Top Card
      renderCardContent(topImgWrap, topName, topBio, currentIndex);

      // Render Under Card Preview (if exists)
      if (currentIndex + 1 < profiles.length) {
        cardUnder.style.display = 'flex';
        renderCardContent(underImgWrap, underName, underBio, currentIndex + 1);
      } else {
        cardUnder.style.display = 'none';
      }

      resetTopCardPosition();
    }

    function resetTopCardPosition() {
      cardTop.style.transition = 'transform 0.3s ease';
      cardTop.style.transform = 'translate(0px, 0px) rotate(0deg)';
      const sTalk = topImgWrap.querySelector('.tinder-stamp-talk');
      const sBull = topImgWrap.querySelector('.tinder-stamp-bull');
      if (sTalk) sTalk.style.opacity = 0;
      if (sBull) sBull.style.opacity = 0;
    }

    function decide(direction) {
      const flyX = direction === 'right' ? 800 : -800;
      const flyRotate = direction === 'right' ? 25 : -25;

      cardTop.style.transition = 'transform 0.35s ease-out';
      cardTop.style.transform = `translate(${flyX}px, ${deltaY}px) rotate(${flyRotate}deg)`;

      setTimeout(() => showOutcome(direction), 320);
    }

    function showOutcome(direction) {
      stack.classList.add('hidden');
      controls.classList.add('hidden');

      const p = profiles[currentIndex];
      const isRight = direction === 'right'; // Right = Talked Yourself (Rejection), Left = Sent to Bull (Match)
      const text = isRight ? p.rightText : p.leftText;
      const label = isRight ? p.rightLabel : p.leftLabel;

      outcomeBadge.textContent = label;
      outcomeBadge.style.background = isRight ? 'rgba(255, 94, 168, 0.25)' : 'rgba(77, 210, 255, 0.25)';
      outcomeBadge.style.color = isRight ? '#ff5ea8' : '#4dd2ff';
      outcomeTitle.textContent = p.name;
      outcomeText.textContent = text;

      redoBtn.onclick = () => {
        outcomeCard.classList.add('hidden');
        stack.classList.remove('hidden');
        controls.classList.remove('hidden');
        resetTopCardPosition();
      };

      nextBtn.textContent = '➡ Next Profile';
      nextBtn.onclick = () => {
        currentIndex++;
        updateCards();
      };

      outcomeCard.classList.remove('hidden');
    }

    function showCompletion() {
      stack.classList.add('hidden');
      controls.classList.add('hidden');
      outcomeCard.classList.remove('hidden');

      outcomeBadge.textContent = 'Complete';
      outcomeBadge.style.background = 'rgba(77, 210, 255, 0.25)';
      outcomeBadge.style.color = '#4dd2ff';
      outcomeTitle.textContent = '🎉 All Profiles Swiped!';
      outcomeText.textContent = 'You have gone through all 10 profiles in the deck. Click restart to play again.';

      redoBtn.onclick = () => {
        currentIndex = 0;
        updateCards();
      };

      nextBtn.textContent = '🔄 Restart Deck';
      nextBtn.onclick = () => {
        currentIndex = 0;
        updateCards();
      };
    }

    // Pointer Events for Dragging Top Card
    cardTop.addEventListener('pointerdown', (e) => {
      if (outcomeCard.classList.contains('hidden') === false) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      cardTop.style.transition = 'none';
      cardTop.setPointerCapture(e.pointerId);
    });

    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      deltaX = e.clientX - startX;
      deltaY = e.clientY - startY;
      const rotate = deltaX * 0.05;
      cardTop.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotate}deg)`;

      const sTalk = topImgWrap.querySelector('.tinder-stamp-talk');
      const sBull = topImgWrap.querySelector('.tinder-stamp-bull');
      if (sTalk) sTalk.style.opacity = Math.max(0, Math.min(1, deltaX / 90));
      if (sBull) sBull.style.opacity = Math.max(0, Math.min(1, -deltaX / 90));
    });

    window.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;

      if (deltaX > 110) {
        decide('right'); // Talk Yourself
      } else if (deltaX < -110) {
        decide('left'); // Send to Bull
      } else {
        resetTopCardPosition();
      }
      deltaX = 0; deltaY = 0;
    });

    // Control Button Handlers
    talkBtn.onclick = () => decide('right');
    bullBtn.onclick = () => decide('left');
    prevBtn.onclick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCards();
      }
    };

    // Keyboard Shortcuts
    body.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') decide('right');
      else if (e.key === 'ArrowLeft') decide('left');
      else if (e.key === 'ArrowUp' && !outcomeCard.classList.contains('hidden')) {
        nextBtn.click();
      }
    });

    // Initial render
    updateCards();
  }
};
