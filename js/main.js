/* Shell: boot, desktop icons, start menu, taskbar clock, theme, wallpaper. */

const OS = (() => {
  const $ = (sel) => document.querySelector(sel);

  function launch(key) {
    const app = Apps[key];
    if (!app) return;
    WM.open({ ...app, single: true });
    remember(key);
    hideStart();
  }

  /* ----- recents (Recommended section) ----- */
  function remember(key) {
    const recent = [{ key, at: Date.now() }, ...(DB.setting('recent') || []).filter((r) => r.key !== key)];
    DB.setting('recent', recent.slice(0, 6));
  }

  const ago = (ts) => {
    const m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.round(m / 60);
    return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
  };

  /* ----- desktop icons ----- */
  function buildIcons() {
    const icons = $('#icons');
    icons.innerHTML = '';
    for (const [key, app] of Object.entries(Apps)) {
      const icon = document.createElement('button');
      icon.className = 'icon';
      icon.innerHTML = `<span class="glyph">${app.glyph}</span><span class="label"></span>`;
      icon.lastElementChild.textContent = app.title;
      icon.onclick = () => launch(key);   // single click launches; dblclick just refocuses
      icons.appendChild(icon);
    }
  }

  /* ----- start menu ----- */
  function appTile(key, app) {
    const tile = document.createElement('button');
    tile.className = 'sm-app';
    tile.innerHTML = `<span class="glyph">${app.glyph}</span><span></span>`;
    tile.lastElementChild.textContent = app.title;
    tile.onclick = () => launch(key);
    return tile;
  }

  function renderPinned(query = '') {
    const grid = $('#sm-apps');
    const q = query.trim().toLowerCase();
    grid.innerHTML = '';

    const hits = Object.entries(Apps).filter(([, app]) => app.title.toLowerCase().includes(q));
    for (const [key, app] of hits) grid.appendChild(appTile(key, app));
    if (!hits.length) grid.innerHTML = `<p class="sm-empty">No results for “${query}”.</p>`;

    // Searching hides Recommended, same as Windows.
    const searching = q.length > 0;
    $('#sm-rec-head').hidden = searching;
    $('#sm-recent').hidden = searching;
    $('.sm-section span').textContent = searching ? 'Best match' : 'Pinned';
  }

  function renderRecent() {
    const list = $('#sm-recent');
    const recent = (DB.setting('recent') || []).filter((r) => Apps[r.key]);
    list.innerHTML = '';

    if (!recent.length) {
      list.innerHTML = '<p class="sm-empty">Apps you open will show up here.</p>';
      return;
    }

    for (const { key, at } of recent) {
      const app = Apps[key];
      const item = document.createElement('button');
      item.className = 'sm-rec';
      item.innerHTML = `<span class="glyph">${app.glyph}</span><span><b></b><small></small></span>`;
      item.querySelector('b').textContent = app.title;
      item.querySelector('small').textContent = ago(at);
      item.onclick = () => launch(key);
      list.appendChild(item);
    }
  }

  const hideStart = () => {
    $('#startmenu').hidden = true;
    $('#startbtn').classList.remove('on');
  };

  function toggleStart(show) {
    const menu = $('#startmenu');
    const open = show ?? menu.hidden;
    if (!open) return hideStart();

    const query = $('#sm-query');
    query.value = '';
    renderPinned();
    renderRecent();
    menu.hidden = false;
    $('#startbtn').classList.add('on');
    query.focus();
  }

  /* ----- misc shell ----- */
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    DB.setting('theme', next);
  }

  async function applyWallpaper() {
    if (!DB.setting('wallpaper')) return;
    const url = await Blobs.url('wallpaper');
    if (url) $('#desktop').style.backgroundImage = `url(${url})`;
  }

  function tick() {
    const now = new Date();
    $('#clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function boot() {
    document.documentElement.dataset.theme = DB.setting('theme') || 'dark';
    buildIcons();
    applyWallpaper();
    tick();
    setInterval(tick, 10_000);

    $('#startbtn').onclick = (e) => { e.stopPropagation(); toggleStart(); };
    $('#theme-btn').onclick = toggleTheme;
    $('#sm-query').oninput = (e) => renderPinned(e.target.value);
    $('#sm-query').onkeydown = (e) => {
      if (e.key !== 'Enter') return;
      $('#sm-apps .sm-app')?.click();
    };
    $('#sm-all').onclick = () => { $('#sm-query').value = ''; renderPinned(); };
    $('#sm-power').onclick = () => { if (confirm('Restart webOS?')) location.reload(); };

    document.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('#startmenu, #startbtn')) hideStart();
    });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideStart();
      if (e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) { e.preventDefault(); toggleStart(); }
    });

    setTimeout(() => {
      $('#boot').classList.add('done');
      $('#desktop').hidden = false;
      setTimeout(() => $('#boot').remove(), 500);
    }, 900);
  }

  return { boot, launch, toggleTheme, applyWallpaper };
})();

OS.boot();
