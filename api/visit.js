function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildWhatsAppLink(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('01') && digits.length === 11) {
    return `https://wa.me/2${digits}`;
  }
  return `https://wa.me/${digits}`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Missing Telegram credentials' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const {
    type = 'visit',
    page = '/',
    referrer = 'دخول مباشر (Direct)',
    device = 'غير معروف',
    visitorStatus = 'زائر جديد 🆕',
    phone = '',
    leadSource = '',
    actionLabel = ''
  } = body;

  const country = req.headers['x-vercel-ip-country'] || 'غير معروف';
  const rawCity = req.headers['x-vercel-ip-city'];
  const city = rawCity ? decodeURIComponent(rawCity) : 'غير معروفة';

  let text = '';

  if (type === 'lead') {
    const waLink = buildWhatsAppLink(phone);
    text = [
      '🔥 <b>عميل مهتم ساب رقمه على Joe Advertise!</b>',
      `📞 <b>الرقم:</b> <code>${escapeHtml(phone)}</code>`,
      waLink ? `💬 <b>ابدأ محادثة واتساب فوراً:</b> ${waLink}` : '',
      `📍 <b>المكان بالموقع:</b> ${escapeHtml(leadSource)}`,
      `🔗 <b>مصدر الزيارة:</b> ${escapeHtml(referrer)}`,
      `🌍 <b>الموقع:</b> ${escapeHtml(city)} (${escapeHtml(country)})`,
      `📱 <b>الجهاز:</b> ${escapeHtml(device)}`
    ].filter(Boolean).join('\n');
  } else if (type === 'interest') {
    text = [
      '👀 <b>تفاعل مهم من زائر على الموقع</b>',
      `🎯 <b>الإجراء:</b> ${escapeHtml(actionLabel)}`,
      `👤 <b>الحالة:</b> ${escapeHtml(visitorStatus)}`,
      `🌍 <b>الموقع:</b> ${escapeHtml(city)} (${escapeHtml(country)})`,
      `📱 <b>الجهاز:</b> ${escapeHtml(device)}`
    ].join('\n');
  } else {
    text = [
      '🔔 <b>زائر على موقع Joe Advertise</b>',
      `👤 <b>الحالة:</b> ${escapeHtml(visitorStatus)}`,
      `🌍 <b>الموقع:</b> ${escapeHtml(city)} (${escapeHtml(country)})`,
      `📱 <b>الجهاز:</b> ${escapeHtml(device)}`,
      `🔗 <b>المصدر:</b> ${escapeHtml(referrer)}`,
      `📄 <b>الصفحة:</b> ${escapeHtml(page)}`
    ].join('\n');
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (!tgRes.ok) {
      const errData = await tgRes.text();
      return res.status(502).json({ error: 'Telegram API error', details: errData });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send notification' });
  }
};