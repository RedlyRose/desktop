/* Cloudflare Pages Function — GoonTok shard proxy.
 *
 * Port of `/api/goontok-feed` from the Ultimate Downloader server. The shard host
 * serves no CORS header, so the browser cannot read it directly; this runs on the
 * edge, where same-origin rules do not apply.
 *
 * GET /api/goontok-feed?limit=180&creator=…&tag=…&shard=012
 *   -> [{ url, creator, tags }]
 *
 * Locally (`npx serve .`) this route 404s and js/tiktok.js falls through to a
 * public CORS relay, so the app still works without a backend.
 */

const ORIGIN = 'https://goontok.mochimiatechdom.workers.dev';
const SHARDS = 33;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function onRequestGet({ request }) {
  const params = new URL(request.url).searchParams;

  const asked = parseInt(params.get('shard'), 10);
  const shard = Number.isInteger(asked) && asked >= 0 && asked < SHARDS
    ? asked
    : Math.floor(Math.random() * SHARDS);

  const shardUrl = `${ORIGIN}/data/creator-pack/shard-${String(shard).padStart(3, '0')}.json`;

  try {
    const res = await fetch(shardUrl, {
      headers: { 'User-Agent': UA },
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (!res.ok) throw new Error(`shard ${shard} returned ${res.status}`);

    const rows = await res.json();
    if (!Array.isArray(rows) || !rows.length) throw new Error(`shard ${shard} was empty`);

    const creator = (params.get('creator') || '').toLowerCase();
    const tag = (params.get('tag') || '').toLowerCase();

    let out = rows;
    if (creator) out = out.filter((r) => r.creator?.toLowerCase().includes(creator));
    if (tag) out = out.filter((r) => r.tags?.some((t) => t.toLowerCase().includes(tag)));

    const limit = Math.min(Math.max(parseInt(params.get('limit'), 10) || 30, 1), 500);

    // Fisher-Yates, then take the head — `sort(() => .5 - random())` is biased.
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }

    return Response.json(out.slice(0, limit), {
      headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return Response.json({ error: err.message }, {
      status: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
