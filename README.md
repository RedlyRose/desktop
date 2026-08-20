# webOS

Browser desktop shell. Static, no build step, no dependencies. Deploys to Cloudflare Pages as-is.

## Run locally

```
node dev-server.js
```

Serves the static site *and* proxies `/api/nhentai` (nHentai's API has no
CORS headers, so the reader needs a same-origin relay even locally — see
below). `npx serve .` also works for everything except that one fetch.

## Deploy to Cloudflare Pages

- Dashboard: Workers & Pages → Create → Pages → connect repo.
- Build command: *(empty)*
- Build output directory: `/`

Or CLI: `npx wrangler pages deploy .`

## Layout

```
index.html      shell markup
dev-server.js   local static server + /api/nhentai proxy (no deps)
css/style.css   theme vars + all styling
js/db.js        storage seams: DB (records) + Blobs (media)
js/wm.js        window manager: drag, resize, min/max, taskbar
js/apps.js      app registry — add apps here
js/icons.js     shared SVG icon set + desktop app glyphs
js/roster.js    محارمي — character lineup app
js/salah.js     مواقيت الصلاة — prayer times for عرعر
js/wiki.js      معرفة — Saudi encyclopedia (seed articles + local edits)
js/blog.js      المدونة — blog (hugo-theme-reimu layout, seeds + local posts)
js/nhentai.js   nHentai reader — single/double/scroll/grid modes
js/main.js      boot, icons, start menu, clock, theme
```

## Salah app

Prayer times for **عرعر، السعودية** (30.9753 N, 41.0381 E) from the
[Aladhan](https://aladhan.com/prayer-times-api) API, Umm al-Qura (`method=4`).
One request pulls the whole month and caches it under `salah.<year>-<month>`, so
reopening the window is instant and it keeps working offline until the month
turns. All arithmetic runs in `Asia/Riyadh`, so the countdown is right even if
the machine's clock is set elsewhere.

Pick a background with the **خلفية** button; it is stored in `Blobs` under
`salah-bg`. Backgrounds are **never decoded at full size**:

- animated GIFs are decoded once via `ImageDecoder` (WebCodecs), every frame is
  resampled to `SALAH.bgWidth` (640px) and replayed from a canvas — a 1920px GIF
  goes from ~7 MB per frame to ~0.8 MB, and frames past `SALAH.bgFrames` (150)
  are dropped;
- still images are resampled once to the same cap and the original bitmap is
  released;
- browsers without WebCodecs fall back to a plain `<img>`.

Shrinking the file on disk first helps more than anything the page can do:

```
ffmpeg -i in.gif -vf "fps=15,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" out.gif
```

## nHentai reader

Gallery metadata comes from `https://nhentai.net/api/v2/galleries/{id}` —
the old `/api/gallery/{id}` (v1) endpoint was retired and now 403s. The API
sends no CORS headers, so the browser can't call it directly; both
`dev-server.js` (local) and `functions/api/nhentai.js` (Cloudflare Pages)
proxy the same request server-side under `/api/nhentai?id=`. Page images
and thumbnails come straight from the `path`/`thumbnail` fields the v2 API
already returns — no extension guessing needed.

## Adding an app

```js
Apps.terminal = {
  title: 'Terminal', glyph: '>_', width: 600, height: 360,
  mount(body, win) { body.textContent = 'hello'; },
};
```

Desktop icon and start-menu entry are generated automatically.

## Cloudflare wiring (later)

`DB` and `Blobs` in `js/db.js` are the only places that touch storage, and both are
already async. Swapping backends means replacing those two bodies with `fetch` calls:

| Local now | Cloudflare later |
|---|---|
| `DB.list/get/put/del` (localStorage) | `fetch('/api/<table>')` → Pages Function → **D1** |
| `Blobs.put/get/url/del` (IndexedDB) | `fetch('/api/media/<key>')` → Pages Function → **R2** |

Sketch of the eventual server side:

```
functions/api/[table].js       list/insert rows   -> env.DB (D1)
functions/api/media/[key].js   PUT/GET/DELETE     -> env.MEDIA (R2)
```

Bindings go in `wrangler.toml` (`[[d1_databases]]`, `[[r2_buckets]]`) or the Pages
project settings. Nothing else in the codebase needs to change.
