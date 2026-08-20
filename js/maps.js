/* Saudi BBC Cuckold Lore Map Engine (Apps.maps)
 * Interactive Saudi map with 13 unique first-person BBC cuckold narrator stories & custom review card styles.
 * Waze / Apple Maps clean aesthetic with Leaflet markers & route calculator.
 */

const SAUDI_LANDMARKS = [
  {
    id: 'riyadh',
    name: 'الرياض (Riyadh)',
    enName: 'Riyadh',
    category: 'capital',
    coords: [24.7136, 46.6753],
    thumb: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'The Riyadh Sky-High BBC Penthouse',
    desc: 'I paid $5,000 to book the top suite of Kingdom Tower just to sit silently in the corner velvet armchair while a 9-inch Nigerian BBC bull completely tore my gorgeous wife open right in front of me.',
    highlights: ['Kingdom Tower Penthouse', 'Nigerian BBC Bull', 'Corner Chair Worship', 'Husband Cleaning Duty'],
    themeColor: '#d97706',
    cardBg: '#1e1b18',
    textColor: '#fef3c7',
    badgeText: '💎 VIP PENTHOUSE REVIEW',
    rating: '⭐⭐⭐⭐⭐ 5.0 / 5',
    author: '— Verified Kingdom Tower Cuck'
  },
  {
    id: 'jeddah',
    name: 'جدة (Jeddah)',
    enName: 'Jeddah',
    category: 'coastal',
    coords: [21.5433, 39.1728],
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'Red Sea Moonlight BBC Yacht Party',
    desc: 'I rented a luxury yacht off the Jeddah Corniche and invited two massive Sudanese BBC bulls to take my wife on the open deck under the stars while I served them ice-cold drinks.',
    highlights: ['Corniche Luxury Yacht', 'Sudanese BBC Bulls', 'Open Deck Breeding', 'Cold Drink Serving Boy'],
    themeColor: '#ff2a70',
    cardBg: '#1c0914',
    textColor: '#ffe4e6',
    badgeText: '⚡ HOT BEACH PARTY LOG',
    rating: '🔥 4.9 / 5 (SEASIDE)',
    author: '— Corniche Drink Boy'
  },
  {
    id: 'alula',
    name: 'العلا (AlUla)',
    enName: 'AlUla',
    category: 'heritage',
    coords: [26.6176, 37.9208],
    thumb: 'https://images.unsplash.com/photo-1578898835026-6d9b5e523f2d?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'AlUla Desert Rock BBC Pavilion',
    desc: 'In a secluded luxury desert resort near Elephant Rock, I knelt outside the glass pavilion watching a huge 10-inch BBC bull bend my wife over the king bed until she was screaming for more.',
    highlights: ['Elephant Rock Pavilion', '10-Inch BBC Bull', 'Kneeling Outside Glass', 'Screaming Wife Confessions'],
    themeColor: '#b45309',
    cardBg: '#1c150c',
    textColor: '#fef3c7',
    badgeText: '📜 DESERT STONE SCROLL',
    rating: '🌟 4.95 / 5 (SANCTUARY)',
    author: '— Kneeling Desert Worshipper'
  },
  {
    id: 'abha',
    name: 'أبها / عسير (Abha / Asir)',
    enName: 'Abha / Asir',
    category: 'nature',
    coords: [18.2164, 42.5053],
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'Soudah Mountain Mist BBC Cabin',
    desc: 'High up in the foggy peaks of Soudah, I brought a towering Congolese BBC athlete to our mountain cabin. He stretched my wife out on the rug while I watched from the balcony shivering with arousal.',
    highlights: ['Soudah Mountain Cabin', 'Congolese BBC Athlete', 'Balcony Cuckold View', 'Rug Stretch Session'],
    themeColor: '#059669',
    cardBg: '#061c14',
    textColor: '#d1fae5',
    badgeText: '🌫️ MIST CABIN CONFESSION',
    rating: '🌲 4.88 / 5 (MOUNTAIN)',
    author: '— Balcony Shivering Cuck'
  },
  {
    id: 'khobar',
    name: 'الخبر / الدمام (Al Khobar)',
    enName: 'Al Khobar / Dammam',
    category: 'coastal',
    coords: [26.2172, 50.1971],
    thumb: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'Khobar Sea-View BBC Penthouse Lounge',
    desc: 'At a private beachside penthouse overlooking the Causeway, I introduced my wife to a muscular BBC fitness trainer who pounded her senseless while I recorded every second on 4K video.',
    highlights: ['Causeway View Lounge', 'BBC Fitness Trainer', '4K Video Recording', 'Senseless Pounding Session'],
    themeColor: '#0284c7',
    cardBg: '#081726',
    textColor: '#e0f2fe',
    badgeText: '🌊 CAUSEWAY 4K DIARY',
    rating: '📹 5.0 / 5 (RECORDED)',
    author: '— 4K Cameraman Husband'
  },
  {
    id: 'neom',
    name: 'نيوم / ذا لاين (NEOM)',
    enName: 'NEOM / THE LINE',
    category: 'future',
    coords: [28.0934, 35.2500],
    thumb: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'NEOM Cyberpunk BBC Surveillance Room',
    desc: 'In the futuristic glass walls of THE LINE, I controlled the smart lighting and camera angles while two massive BBC bulls took turns dominating my wife on live multi-angle monitors.',
    highlights: ['THE LINE Glass Suite', 'Multi-Angle 4K Monitors', 'Dual BBC Bull Dominance', 'Smart Light Control'],
    themeColor: '#00f2fe',
    cardBg: '#050f1a',
    textColor: '#cffaff',
    badgeText: '💻 CYBERPUNK STREAM LOG',
    rating: '🚀 5.0 / 5 (FUTURE)',
    author: '— Smart Light Operator'
  },
  {
    id: 'arar',
    name: 'عرعر (Arar)',
    enName: 'Arar',
    category: 'north',
    coords: [30.9753, 41.0381],
    thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'Northern Steppe Night BBC Oasis Camp',
    desc: 'Inside a heated desert tent on a freezing northern night, I sat on the carpet pouring tea for a tall Kenyan BBC bull as he laid my wife down and showed her what a real man feels like.',
    highlights: ['Heated Desert Tent', 'Kenyan BBC Bull', 'Pouring Tea for Bull', 'Real Man Lesson'],
    themeColor: '#ea580c',
    cardBg: '#1c1008',
    textColor: '#ffedd5',
    badgeText: '⛺ NORTHERN TENT TALE',
    rating: '🍵 4.92 / 5 (FREEZING)',
    author: '— Tea Serving Husband'
  },
  {
    id: 'jazan',
    name: 'جازان / فرسان (Jazan)',
    enName: 'Jazan / Farasan',
    category: 'coastal',
    coords: [16.8892, 42.5511],
    thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'Farasan Island Tropical BBC Paradise',
    desc: 'On the white sands of Farasan, I set up a private sunbed for a giant Ghanaian BBC diver to breed my wife until sunset while I applied tanning oil to both of their bodies.',
    highlights: ['Farasan Beach Sunbed', 'Ghanaian BBC Diver', 'Tanning Oil Application', 'Sunset Breeding Session'],
    themeColor: '#10b981',
    cardBg: '#051f18',
    textColor: '#d1fae5',
    badgeText: '🌴 TROPICAL PARADISE REVIEW',
    rating: '🏖️ 4.97 / 5 (SUNSET)',
    author: '— Tanning Oil Boy'
  },
  {
    id: 'hail',
    name: 'حائل (Hail)',
    enName: 'Hail',
    category: 'north',
    coords: [27.5219, 41.6907],
    thumb: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'Nafud Desert BBC Hospitality Camp',
    desc: 'True desert cuckold hospitality: I invited a massive 9.5-inch BBC traveler into our VIP desert tent and personally unzipped his pants so he could satisfy my wife properly for the first time.',
    highlights: ['VIP Desert Tent', 'Unzipping Bull Pants', '9.5-Inch BBC Traveler', 'First Real Satisfaction'],
    themeColor: '#dc2626',
    cardBg: '#1f0909',
    textColor: '#fee2e2',
    badgeText: '🔥 HOSPITALITY CONFESSION',
    rating: '⛺ 4.96 / 5 (NAFUD)',
    author: '— Pants Unzipper Husband'
  },
  {
    id: 'taif',
    name: 'الطائف (Taif)',
    enName: 'Taif',
    category: 'nature',
    coords: [21.2854, 40.4244],
    thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'Al Hada Rose Garden BBC Cottage',
    desc: 'Among the fragrant rose gardens of Al Hada, I fluffed the pillows and prepared hot tea while a muscular BBC bull fucked my wife so hard the rose petals fell from the vase onto the bed.',
    highlights: ['Al Hada Rose Cottage', 'Fluffing Bull Pillows', 'Rose Petal Bed Session', 'Hard Pounding Rhythm'],
    themeColor: '#ec4899',
    cardBg: '#1f0814',
    textColor: '#fce7f3',
    badgeText: '🌹 VELVET ROSE DIARY',
    rating: '🌸 4.91 / 5 (FRAGRANT)',
    author: '— Pillow Fluffing Boy'
  },
  {
    id: 'tabuk',
    name: 'تبوك (Tabuk)',
    enName: 'Tabuk',
    category: 'north',
    coords: [28.3835, 36.5662],
    thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'Jabal Al-Lawz Snow BBC Fireplace Lodge',
    desc: 'With snow falling outside Jabal Al-Lawz, I kept the fireplace roaring while a huge BBC alpha warmed my wife up under heavy fur blankets, leaving me to watch in pure cuckold bliss.',
    highlights: ['Jabal Al-Lawz Snow Lodge', 'Roaring Fireplace Cuck', 'Heavy Fur Blanket Session', 'BBC Alpha Warmth'],
    themeColor: '#38bdf8',
    cardBg: '#091824',
    textColor: '#e0f2fe',
    badgeText: '❄️ SNOW FIREPLACE LOG',
    rating: '🏔️ 4.98 / 5 (FROZEN)',
    author: '— Fireplace Tender Cuck'
  },
  {
    id: 'najran',
    name: 'نجران (Najran)',
    enName: 'Najran',
    category: 'south',
    coords: [17.4924, 44.1277],
    thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'Najran Citadel BBC Dungeon & Bar',
    desc: 'Inside the thick stone walls of an ancient fortress suite, I submitted to a massive BBC bull who wore my wedding ring on his pinky while taking my wife right on the mahogany table.',
    highlights: ['Ancient Stone Fortress', 'Wedding Ring on Bull Pinky', 'Mahogany Table Session', 'Complete Submission'],
    themeColor: '#8b5cf6',
    cardBg: '#130a24',
    textColor: '#ede9fe',
    badgeText: '🏰 CITADEL DUNGEON LOG',
    rating: '👑 4.93 / 5 (SUBORDINATE)',
    author: '— Ring Surrender Husband'
  },
  {
    id: 'qassim',
    name: 'القصيم / بريدة (Qassim)',
    enName: 'Qassim / Buraidah',
    category: 'heritage',
    coords: [26.3260, 43.9750],
    thumb: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80',
    loreTitle: 'Buraidah Palm Farm BBC Secret Hideaway',
    desc: 'Deep inside a private date palm estate, I wore my leather submission collar and held the flashlight while two huge BBC bulls took turns filling my wife up until she could not walk.',
    highlights: ['Private Palm Estate', 'Leather Submission Collar', 'Flashlight Holding Boy', 'Dual BBC Filling'],
    themeColor: '#16a34a',
    cardBg: '#091c0e',
    textColor: '#dcfce7',
    badgeText: '🌴 PALM HIDEAWAY LOG',
    rating: '⛓️ 5.0 / 5 (COLLARED)',
    author: '— Flashlight Holding Boy'
  }
];

Apps.maps = {
  title: 'خرائط المملكة',
  glyph: Icons.maps,
  width: 960,
  height: 640,

  async mount(body) {
    body.style.padding = '0';
    body.style.margin = '0';
    body.style.overflow = 'hidden';

    body.innerHTML = `
      <div class="mp-app mp-white-mode" dir="rtl">
        <!-- Sidebar Controls Panel -->
        <aside class="mp-sidebar">
          <header class="mp-header">
            <div class="mp-logo">
              <span class="mp-emblem">🐂</span>
              <div class="mp-title-wrap">
                <h3>Saudi BBC Cuckold Chronicles</h3>
                <small>13 Custom-Styled First-Person Reviews</small>
              </div>
            </div>
          </header>

          <!-- Category filter pills -->
          <nav class="mp-cats">
            <button class="mp-cat-pill active" data-cat="all">All</button>
            <button class="mp-cat-pill" data-cat="capital">Capital</button>
            <button class="mp-cat-pill" data-cat="coastal">Coastal</button>
            <button class="mp-cat-pill" data-cat="heritage">Heritage</button>
            <button class="mp-cat-pill" data-cat="north">North</button>
            <button class="mp-cat-pill" data-cat="south">South</button>
            <button class="mp-cat-pill" data-cat="future">NEOM</button>
          </nav>

          <!-- Landmarks List -->
          <div class="mp-list"></div>
        </aside>

        <!-- Main Map Viewport -->
        <main class="mp-viewport">
          <!-- Leaflet Container -->
          <div id="saudi-map-container" class="mp-map-container"></div>
        </main>
      </div>`;

    // Ensure Leaflet is loaded
    await loadLeaflet();

    const mapContainer = body.querySelector('#saudi-map-container');
    const catPills = body.querySelectorAll('.mp-cat-pill');
    const landmarksListEl = body.querySelector('.mp-list');

    // CartoDB Positron White Light Tile Layer
    const whiteTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB &copy; OpenStreetMap',
      maxZoom: 18
    });

    // Initialize Map over Saudi Arabia center
    const map = L.map(mapContainer, {
      center: [24.0, 45.0],
      zoom: 6,
      zoomControl: false,
      layers: [whiteTileLayer]
    });

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    let markersMap = new Map();

    // Custom Bull Marker Icon Generator with thematic colors
    function createSaudiIcon(color = '#e11d48') {
      return L.divIcon({
        className: 'mp-custom-marker-wrap',
        html: `
          <div class="mp-marker-pin" style="background:${color};color:#fff;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px ${color}88;">
            <span class="mp-marker-symbol" style="font-size:16px;">🐂</span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30]
      });
    }

    // Render Markers on Map
    SAUDI_LANDMARKS.forEach(l => {
      const marker = L.marker(l.coords, {
        icon: createSaudiIcon(l.themeColor)
      }).addTo(map);

      // Custom styled popup content per location
      const popupContent = `
        <div class="mp-popup-card" dir="ltr" style="font-family:system-ui,sans-serif;background:${l.cardBg};color:${l.textColor};border-radius:14px;overflow:hidden;box-shadow:0 12px 28px rgba(0,0,0,0.5);border:1px solid ${l.themeColor}55;">
          <div class="mp-popup-img" style="background-image: url('${l.thumb}');height:110px;background-size:cover;position:relative;">
            <span class="mp-popup-badge" style="background:${l.themeColor};color:#fff;position:absolute;top:10px;left:10px;padding:3px 10px;border-radius:12px;font-size:0.72rem;font-weight:700;letter-spacing:0.5px;">${l.badgeText}</span>
          </div>
          <div class="mp-popup-body" style="padding:14px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
              <h4 style="margin:0;font-size:1.05rem;color:#ffffff;font-weight:700;">${l.name}</h4>
              <span style="font-size:0.75rem;font-weight:700;color:${l.themeColor};">${l.rating}</span>
            </div>
            <div style="font-size:0.86rem;font-weight:700;color:${l.themeColor};margin-bottom:8px;">🔥 "${l.loreTitle}"</div>
            <p style="font-size:0.82rem;line-height:1.6;color:${l.textColor};margin:0 0 10px;font-style:italic;opacity:0.92;">"${l.desc}"</p>
            <div style="font-size:0.75rem;font-weight:600;color:${l.themeColor};margin-bottom:10px;opacity:0.85;">${l.author}</div>
            <div class="mp-popup-highlights" style="display:flex;flex-wrap:wrap;gap:4px;">
              ${l.highlights.map(h => `<span style="background:${l.themeColor}22;color:${l.themeColor};border:1px solid ${l.themeColor}44;padding:2px 8px;border-radius:12px;font-size:0.72rem;font-weight:600;">✦ ${h}</span>`).join('')}
            </div>
          </div>
        </div>`;

      marker.bindPopup(popupContent, { maxWidth: 330, className: 'mp-popup-wrap' });
      markersMap.set(l.id, { marker, data: l });
    });

    // Render Side List
    function renderList(items) {
      landmarksListEl.innerHTML = '';
      if (!items.length) {
        landmarksListEl.innerHTML = '<p class="mp-empty">No matching regions found.</p>';
        return;
      }

      items.forEach(l => {
        const itemEl = document.createElement('div');
        itemEl.className = 'mp-item-card';
        itemEl.dataset.id = l.id;
        itemEl.innerHTML = `
          <div class="mp-item-thumb" style="background-image:url('${l.thumb}')"></div>
          <div class="mp-item-info" style="text-align:left;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <b>${l.name}</b>
              <small style="color:${l.themeColor};font-weight:700;font-size:0.7rem;">${l.badgeText.split(' ')[0]}</small>
            </div>
            <small style="color:${l.themeColor};font-weight:600;display:block;margin-top:2px;">${l.loreTitle}</small>
          </div>
          <button class="mp-item-go" title="Fly to location">📍</button>`;

        itemEl.onclick = () => focusLandmark(l.id);
        landmarksListEl.appendChild(itemEl);
      });
    }

    // Focus on landmark
    function focusLandmark(id) {
      const entry = markersMap.get(id);
      if (!entry) return;
      map.flyTo(entry.data.coords, 10, { duration: 1.5 });
      setTimeout(() => {
        entry.marker.openPopup();
      }, 1200);

      landmarksListEl.querySelectorAll('.mp-item-card').forEach(el => {
        el.classList.toggle('active', el.dataset.id === id);
      });
    }

    // Category Filter
    catPills.forEach(pill => {
      pill.onclick = () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.dataset.cat;

        const filtered = cat === 'all'
          ? SAUDI_LANDMARKS
          : SAUDI_LANDMARKS.filter(l => l.category === cat);

        renderList(filtered);
      };
    });

    // Initial List Render
    renderList(SAUDI_LANDMARKS);

    // Invalidation fix when container mounts
    setTimeout(() => map.invalidateSize(), 300);
  }
};

// Helper script loader for Leaflet
function loadLeaflet() {
  if (window.L) return Promise.resolve();
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}
