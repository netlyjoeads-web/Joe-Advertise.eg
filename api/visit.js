module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Missing Telegram credentials' });
  }

  const { page = '/', referrer = 'مباشر (Direct)', device = 'غير معروف' } = req.body || {};
  const country = req.headers['x-vercel-ip-country'] || 'غير معروف';
  const rawCity = req.headers['x-vercel-ip-city'];
  const city = rawCity ? decodeURIComponent(rawCity) : 'غير معروفة';

  const text = [
    '🔔 *زائر جديد على موقع Joe Advertise*',
    `🌍 *الموقع:* ${city} (${country})`,
    `📱 *الجهاز:* ${device}`,
    `🔗 *المصدر:* ${referrer}`,
    `📄 *الصفحة:* ${page}`
  ].join('\n');

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown'
      })
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send notification' });
  }
};