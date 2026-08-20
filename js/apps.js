/* App registry. Add an entry here and it shows up on the desktop + start menu. */

const Apps = {
  /*
  notepad: {
    title: 'Notepad',
    glyph: Icons.notepad,
    width: 520,
    height: 400,
    mount(body) {
      body.style.display = 'flex';
      body.style.flexDirection = 'column';
      body.style.gap = '8px';
      body.innerHTML = `
        <div class="row">
          <input class="btn" style="flex:1" placeholder="note title">
          <button class="btn" data-do="save">Save</button>
        </div>
        <textarea class="pad" placeholder="type…"></textarea>
        <div class="muted" style="font-size:12px"></div>`;

      const [name, save] = [body.querySelector('input'), body.querySelector('[data-do=save]')];
      const text = body.querySelector('textarea');
      const status = body.querySelector('.muted');
      let id = null;

      save.onclick = async () => {
        const row = await DB.put('notes', { id, name: name.value || 'untitled', body: text.value });
        id = row.id;
        status.textContent = `saved ${new Date(row.updated_at).toLocaleTimeString()}`;
      };
    },
  },

  files: {
    title: 'Files',
    glyph: Icons.folder,
    width: 560,
    height: 400,
    async mount(body) {
      const render = async () => {
        const [notes, media] = [await DB.list('notes'), await DB.list('media')];
        body.innerHTML = '';
        const rows = [...notes.map((n) => [Icons.notepad, n.name, 'notes', n.id]), ...media.map((m) => [Icons.gallery, m.name, 'media', m.id])];

        if (!rows.length) {
          body.innerHTML = '<p class="muted">Nothing stored yet. Save a note or upload media.</p>';
          return;
        }

        for (const [glyph, label, table, id] of rows) {
          const row = document.createElement('div');
          row.className = 'row';
          row.style.cssText = 'padding:6px;border-bottom:1px solid var(--line)';
          row.innerHTML = `<span style="display:inline-flex">${glyph}</span><span style="flex:1"></span><button class="btn" style="padding:3px 8px">✕</button>`;
          row.children[1].textContent = label;
          row.lastElementChild.onclick = async () => {
            await DB.del(table, id);
            if (table === 'media') await Blobs.del(id);
            render();
          };
          body.appendChild(row);
        }
      };
      render();
    },
  },

  media: {
    title: 'Media',
    glyph: Icons.gallery,
    width: 620,
    height: 440,
    mount(body) {
      body.innerHTML = `
        <div class="row" style="margin-bottom:10px">
          <input type="file" accept="image/*,video/*,audio/*" multiple hidden>
          <button class="btn" data-do="pick">Upload</button>
          <span class="muted">stored locally (IndexedDB) — swap for R2 later</span>
        </div>
        <div class="grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px"></div>`;

      const picker = body.querySelector('input');
      const grid = body.querySelector('.grid');
      body.querySelector('[data-do=pick]').onclick = () => picker.click();

      picker.onchange = async () => {
        for (const file of picker.files) {
          const row = await DB.put('media', { name: file.name, type: file.type, size: file.size });
          await Blobs.put(row.id, file);
        }
        picker.value = '';
        render();
      };

      async function render() {
        grid.innerHTML = '';
        for (const item of await DB.list('media')) {
          const url = await Blobs.url(item.id);
          const cell = document.createElement('div');
          cell.style.cssText = 'border:1px solid var(--line);border-radius:8px;overflow:hidden;background:rgba(0,0,0,.2)';
          cell.innerHTML = item.type.startsWith('image/')
            ? `<img src="${url}" style="width:100%;height:90px;object-fit:cover;display:block">`
            : `<div style="height:90px;display:grid;place-content:center;">${Icons.videoplayer}</div>`;
          const cap = document.createElement('div');
          cap.style.cssText = 'padding:4px 6px;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
          cap.textContent = item.name;
          cell.appendChild(cap);
          grid.appendChild(cell);
        }
        if (!grid.children.length) grid.innerHTML = '<p class="muted">No media yet.</p>';
      }

      render();
    },
  },

  settings: {
    title: 'Settings',
    glyph: Icons.settings,
    width: 420,
    height: 300,
    mount(body) {
      body.innerHTML = `
        <div class="row" style="margin-bottom:10px">
          <span style="flex:1">Theme</span>
          <button class="btn" data-do="theme">Toggle</button>
        </div>
        <div class="row" style="margin-bottom:10px">
          <span style="flex:1">Wallpaper</span>
          <input type="file" accept="image/*" hidden>
          <button class="btn" data-do="wall">Choose</button>
        </div>
        <div class="row">
          <span style="flex:1">Wipe local data</span>
          <button class="btn" data-do="wipe">Reset</button>
        </div>`;

      const picker = body.querySelector('input');
      body.querySelector('[data-do=theme]').onclick = () => OS.toggleTheme();
      body.querySelector('[data-do=wall]').onclick = () => picker.click();

      picker.onchange = async () => {
        const file = picker.files[0];
        if (!file) return;
        await Blobs.put('wallpaper', file);
        DB.setting('wallpaper', true);
        OS.applyWallpaper();
      };

      body.querySelector('[data-do=wipe]').onclick = () => {
        if (!confirm('Erase all local notes, media and settings?')) return;
        localStorage.clear();
        indexedDB.deleteDatabase('webos.blobs');
        location.reload();
      };
    },
  },
  */
};
