/* Window manager: open, focus, drag, resize, minimize, maximize, close. */

const WM = (() => {
  const layer = () => document.getElementById('windows');
  const bar = () => document.getElementById('tasks');
  const wins = new Map();
  let z = 10;
  let seq = 0;

  function open(opts) {
    const { title = 'Window', glyph = '▫', width = 560, height = 380, single = false, mount } = opts;

    if (single) {
      for (const w of wins.values()) {
        if (w.title === title) { focus(w.id); return w; }
      }
    }

    const id = 'w' + (++seq);
    const offset = (wins.size % 8) * 26;
    const el = document.createElement('div');
    el.className = 'win';
    el.dataset.id = id;
    el.style.width = width + 'px';
    el.style.height = height + 'px';
    el.style.left = Math.max(12, (innerWidth - width) / 2 + offset) + 'px';
    el.style.top = Math.max(12, (innerHeight - 48 - height) / 2 + offset) + 'px';
    el.innerHTML = `
      <div class="win-bar">
        <span class="glyph" style="display:inline-flex;align-items:center;">${glyph}</span>
        <span class="title"></span>
        <button class="win-btn" data-do="min" title="Minimize" style="display:inline-flex;align-items:center;justify-content:center"><svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor"><rect width="10" height="2" rx="1"/></svg></button>
        <button class="win-btn" data-do="max" title="Maximize" style="display:inline-flex;align-items:center;justify-content:center"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="8" height="8" rx="1"/></svg></button>
        <button class="win-btn close" data-do="close" title="Close" style="display:inline-flex;align-items:center;justify-content:center"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="1" y1="1" x2="9" y2="9"/><line x1="9" y1="1" x2="1" y2="9"/></svg></button>
      </div>
      <div class="win-body"></div>
      <div class="win-resize"></div>`;
    el.querySelector('.title').textContent = title;

    const body = el.querySelector('.win-body');
    layer().appendChild(el);

    const task = document.createElement('button');
    task.className = 'task';
    task.dataset.id = id;
    task.innerHTML = `<span class="glyph">${glyph}</span><span></span>`;
    task.lastElementChild.textContent = title;
    bar().appendChild(task);

    const win = { id, el, body, task, title };
    wins.set(id, win);

    el.addEventListener('pointerdown', () => focus(id));
    el.querySelector('.win-bar').addEventListener('pointerdown', (e) => {
      if (e.target.closest('.win-btn')) return;
      startDrag(win, e);
    });
    el.querySelector('.win-bar').addEventListener('dblclick', (e) => {
      if (!e.target.closest('.win-btn')) toggleMax(id);
    });
    el.querySelector('.win-resize').addEventListener('pointerdown', (e) => startResize(win, e));
    el.addEventListener('click', (e) => {
      const doo = e.target.closest('[data-do]')?.dataset.do;
      if (doo === 'min') minimize(id);
      if (doo === 'max') toggleMax(id);
      if (doo === 'close') close(id);
    });
    task.addEventListener('click', () => {
      if (el.classList.contains('min') || !el.classList.contains('focused')) restore(id);
      else minimize(id);
    });

    focus(id);
    if (typeof mount === 'function') mount(body, win);
    return win;
  }

  function focus(id) {
    const win = wins.get(id);
    if (!win) return;
    win.el.style.zIndex = ++z;
    for (const w of wins.values()) {
      const on = w.id === id;
      w.el.classList.toggle('focused', on);
      w.task.classList.toggle('active', on);
    }
  }

  function restore(id) {
    const win = wins.get(id);
    if (!win) return;
    win.el.classList.remove('min');
    focus(id);
  }

  function minimize(id) {
    const win = wins.get(id);
    if (!win) return;
    win.el.classList.add('min');
    win.task.classList.remove('active');
  }

  function toggleMax(id) {
    wins.get(id)?.el.classList.toggle('max');
  }

  function close(id) {
    const win = wins.get(id);
    if (!win) return;
    win.el.remove();
    win.task.remove();
    wins.delete(id);
  }

  function startDrag(win, e) {
    if (win.el.classList.contains('max')) return;
    const box = win.el.getBoundingClientRect();
    const dx = e.clientX - box.left;
    const dy = e.clientY - box.top;
    win.el.classList.add('dragging');
    move(e, (ev) => {
      const maxY = innerHeight - 48 - 8;
      win.el.style.left = clamp(ev.clientX - dx, 8 - box.width + 60, innerWidth - 60) + 'px';
      win.el.style.top = clamp(ev.clientY - dy, 0, maxY) + 'px';
    }, () => win.el.classList.remove('dragging'));
  }

  function startResize(win, e) {
    const box = win.el.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    win.el.classList.add('resizing');
    move(e, (ev) => {
      win.el.style.width = Math.max(260, box.width + ev.clientX - x) + 'px';
      win.el.style.height = Math.max(160, box.height + ev.clientY - y) + 'px';
    }, () => win.el.classList.remove('resizing'));
  }

  function move(e, onMove, onEnd) {
    e.preventDefault();
    const target = e.currentTarget;
    target.setPointerCapture?.(e.pointerId);
    const up = () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
      onEnd?.();
    };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  }

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  return { open, close, focus, minimize, restore, toggleMax, wins };
})();
