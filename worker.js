// Cloudflare Worker: прокси к DeepSeek. Ключ хранится в секретах, не в браузере.
export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Token',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return new Response('POST only', { status: 405, headers: cors });
    if (req.headers.get('X-Token') !== env.APP_TOKEN) {
      return new Response('Forbidden', { status: 403, headers: cors });
    }
    const r = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + env.DEEPSEEK_KEY,
      },
      body: await req.text(),
    });
    return new Response(r.body, {
      status: r.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  },
};
