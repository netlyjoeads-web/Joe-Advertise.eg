/* =========================================================
   1. SPA Page Navigation & Browser History
   ========================================================= */
const pagesMap = {
  main: 'main-site',
  services: 'services-page',
  contact: 'contact-page',
  reviews: 'reviews-page'
};

function closeMobileMenu() {
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) navToggle.checked = false;
}

function navigateTo(pageName, addToHistory = true) {
  const targetPage = pagesMap[pageName] ? pageName : 'main';

  Object.entries(pagesMap).forEach(([key, elementId]) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.classList.toggle('active-page', key === targetPage);
    }
  });

  const currentPage = window.location.hash.replace('#', '') || 'main';
  if (addToHistory && currentPage !== targetPage) {
    const newUrl = targetPage === 'main'
      ? window.location.pathname + window.location.search
      : '#' + targetPage;
    history.pushState({ page: targetPage }, '', newUrl);
  }

  closeMobileMenu();
  window.scrollTo(0, 0);
}

function showMain() { navigateTo('main'); }
function showServices() { navigateTo('services'); }
function showContact() { navigateTo('contact'); }
function showReviews() { navigateTo('reviews'); }

window.addEventListener('popstate', (e) => {
  const hashPage = window.location.hash.replace('#', '');
  const targetPage = (e.state && e.state.page) || hashPage || 'main';
  navigateTo(targetPage, false);
});

(function initRouter() {
  const initialHash = window.location.hash.replace('#', '');
  const initialPage = pagesMap[initialHash] ? initialHash : 'main';
  const initialUrl = initialPage === 'main'
    ? window.location.pathname + window.location.search
    : '#' + initialPage;

  history.replaceState({ page: initialPage }, '', initialUrl);
  if (initialPage !== 'main') {
    navigateTo(initialPage, false);
  }
})();

/* =========================================================
   2. Custom Desktop Cursor
   ========================================================= */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  if (cursor && ring) {
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }
  requestAnimationFrame(animCursor);
}
animCursor();

document.addEventListener('mouseover', e => {
  if (!cursor || !ring) return;
  if (e.target.closest('a, button, .skill-card, .service-card, .contact-pill, .reason-item, .gallery-orbit img')) {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    ring.style.width = '60px'; ring.style.height = '60px';
  } else {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '40px'; ring.style.height = '40px';
  }
});

/* =========================================================
   3. Hero Interactive Robot Canvas
   ========================================================= */
(function() {
  const canvas = document.getElementById('robotCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let mouseX = canvas.width / 2, mouseY = canvas.height / 2;
  let targetHeadX = 0, targetHeadY = 0; let currentHeadX = 0, currentHeadY = 0; let t = 0;

  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left; mouseY = e.clientY - rect.top;
  });

  const PURPLE = '#7c3aed'; const PURPLE_L = '#a855f7'; const NEON = '#d946ef'; const DARK = '#120824';

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); t += 0.03;
    const cx = canvas.width / 2; const cy = canvas.height / 2 + 30; const hover = Math.sin(t) * 12;
    const dx = (mouseX - canvas.width / 2) / canvas.width; const dy = (mouseY - canvas.height / 2) / canvas.height;
    targetHeadX = dx * 35; targetHeadY = dy * 25;
    currentHeadX += (targetHeadX - currentHeadX) * 0.08; currentHeadY += (targetHeadY - currentHeadY) * 0.08;
    const hx = cx + currentHeadX; const hy = cy - 100 + hover + currentHeadY;

    ctx.save(); ctx.translate(cx, cy + hover); ctx.shadowColor = PURPLE; ctx.shadowBlur = 25;
    ctx.beginPath(); ctx.roundRect(-65, -30, 130, 120, 15); ctx.fillStyle = DARK; ctx.fill();
    ctx.strokeStyle = PURPLE; ctx.lineWidth = 3; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.shadowColor = NEON; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(0, 30, 12, 0, Math.PI*2); ctx.fillStyle = NEON; ctx.fill(); ctx.shadowBlur = 0; ctx.restore();

    ctx.save(); ctx.translate(hx, hy);
    const aura = ctx.createRadialGradient(0, 0, 30, 0, 0, 100); aura.addColorStop(0, 'rgba(217,70,239,0.2)'); aura.addColorStop(1, 'rgba(217,70,239,0)');
    ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(0, 0, 100, 0, Math.PI*2); ctx.fill();
    ctx.shadowColor = PURPLE; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(-60, -55, 120, 110, 20); ctx.fillStyle = DARK; ctx.fill(); ctx.strokeStyle = PURPLE_L; ctx.lineWidth = 3; ctx.stroke(); ctx.shadowBlur = 0;

    const ex = (mouseX - canvas.width/2) / canvas.width * 10; const ey = (mouseY - canvas.height/2) / canvas.height * 8;
    for (const eyeX of [-25, 25]) {
      ctx.beginPath(); ctx.roundRect(eyeX - 18, -15, 36, 20, 8); ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fill(); ctx.strokeStyle = PURPLE_L; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.shadowColor = NEON; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(eyeX + ex, ey - 5, 6, 0, Math.PI * 2); ctx.fillStyle = NEON; ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.beginPath(); ctx.moveTo(-25, 30); ctx.quadraticCurveTo(0, 30 + Math.sin(t*2)*5, 25, 30); ctx.strokeStyle = PURPLE_L; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore(); requestAnimationFrame(draw);
  }
  draw();
})();

/* =========================================================
   4. 3D Rotating Gallery Orbit
   ========================================================= */
(function() {
  const orbit = document.querySelector('.gallery-orbit');
  const wrapper = document.querySelector('.gallery-wrapper');
  if (!orbit || !wrapper) return;

  let currentAngle = 0;
  let isDragging = false;
  let startX = 0;
  let prevX = 0;
  const autoRotateSpeed = -0.7; 
  let velocity = autoRotateSpeed; 
  let isHovered = false;

  wrapper.addEventListener('mouseenter', () => { isHovered = true; });
  wrapper.addEventListener('mouseleave', () => { isHovered = false; isDragging = false; });

  function dragStart(e) {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    prevX = startX;
    velocity = 0; 
  }

  function dragMove(e) {
    if (!isDragging) return;
    const x = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const delta = x - prevX;
    velocity = delta * 0.4; 
    prevX = x;
  }

  function dragEnd() { isDragging = false; }

  wrapper.addEventListener('mousedown', dragStart);
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('mouseup', dragEnd);
  wrapper.addEventListener('touchstart', dragStart, {passive: true});
  window.addEventListener('touchmove', dragMove, {passive: true});
  window.addEventListener('touchend', dragEnd);

  function animateCarousel() {
    if (!isDragging) {
      if (!isHovered) {
        velocity += (autoRotateSpeed - velocity) * 0.05; 
      } else {
        velocity += (0 - velocity) * 0.05;
      }
    }
    currentAngle += velocity;
    orbit.style.transform = `rotateY(${currentAngle}deg)`;
    requestAnimationFrame(animateCarousel);
  }
  animateCarousel();
})();

/* =========================================================
   5. Bilingual Switcher (Arabic / English)
   ========================================================= */
let isArabic = false;

function toggleLang() {
  const checkbox = document.getElementById('lang-toggle-checkbox');
  isArabic = checkbox.checked;
  localStorage.setItem('joe_lang', isArabic ? 'ar' : 'en');

  let serviceCards = document.querySelectorAll('.service-card');

  if (isArabic) {
    if (callbackInput) callbackInput.placeholder = 'اكتب رقم الواتساب الخاص بك';
    if (exitInput) exitInput.placeholder = 'اكتب رقم الواتساب الخاص بك';
    const cbBadge = document.getElementById('callbackBadgeText');
    if (cbBadge) cbBadge.textContent = 'نكلمك؟';
    const cbTitle = document.getElementById('callbackCardTitle');
    if (cbTitle) cbTitle.textContent = 'اترك رقم الواتساب الخاص بك';
    const cbSub = document.getElementById('callbackCardSub');
    if (cbSub) cbSub.textContent = 'هنبعتلك تفاصيل الباقات والأسعار على واتساب في دقائق.';
    const cbBtn = document.getElementById('callbackSubmitBtn');
    if (cbBtn) cbBtn.textContent = 'إرسال الرقم';
    const exTag = document.getElementById('exitPopupTag');
    if (exTag) exTag.textContent = 'لحظة واحدة ✦';
    const exTitle = document.getElementById('exitPopupTitle');
    if (exTitle) exTitle.textContent = 'عندك مشروع أو استفسار؟';
    const exDesc = document.getElementById('exitPopupDesc');
    if (exDesc) exDesc.textContent = 'سيب رقم الواتساب بتاعك قبل ما تمشي وهنبعتلك باقات الأسعار ونرد على كل استفساراتك فوراً.';
    const exBtn = document.getElementById('exitSubmitBtn');
    if (exBtn) exBtn.textContent = 'ابعتولي التفاصيل واتساب';
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
   
    const webDevTitle = document.getElementById('web-dev-title');
    if(webDevTitle) webDevTitle.textContent = 'تصميم وتطوير المواقع الإلكترونية';

    const openmartWebTitle = document.getElementById('openmart-web-title');
    if(openmartWebTitle) openmartWebTitle.textContent = 'متجر Openmart الإلكتروني';

    const openmartWebDesc = document.getElementById('openmart-web-desc');
    if(openmartWebDesc) openmartWebDesc.textContent = 'متجر إلكتروني ثنائي اللغة يسهّل تصفح المنتجات وإتمام الطلبات.';

    const partytimeWebTitle = document.getElementById('partytime-web-title');
    if(partytimeWebTitle) partytimeWebTitle.textContent = 'موقع Partytime';

    const partytimeWebDesc = document.getElementById('partytime-web-desc');
    if(partytimeWebDesc) partytimeWebDesc.textContent = 'تجربة موقع عصرية ومتجاوبة لعرض Partytime وخدماتها بطريقة واضحة وجذابة.';
    
    const newWebTitle = document.getElementById('new-web-title');
    if(newWebTitle) newWebTitle.textContent = 'سافور كافيه ومطعم';

    const newWebDesc = document.getElementById('new-web-desc');
    if(newWebDesc) newWebDesc.textContent = 'نظام طلب رقمي مخصص بالكامل مصمم لتسهيل عملية الطلب وتقديم تجربة عميل سلسة.';

    const bannerTitle = document.getElementById('banner-title');
    if (bannerTitle) bannerTitle.textContent = 'تصميم البانرات الإعلانية';

    const webDevLabel = document.getElementById('web-dev-label');
    if(webDevLabel) webDevLabel.textContent = 'معاينة حية لمشروع';

    const uniformTitle = document.getElementById('uniform-title');
    if (uniformTitle) uniformTitle.textContent = 'تصميم الأزياء';

    const webInfoTitle = document.getElementById('web-info-title');
    if(webInfoTitle) webInfoTitle.textContent = 'نموذج تجريبي لموقع إلكتروني ';

    const filterAll = document.querySelector('.filter-btn[data-filter="all"]');
    if (filterAll) filterAll.textContent = 'الكل';
    const filterFood = document.querySelector('.filter-btn[data-filter="food"]');
    if (filterFood) filterFood.textContent = 'مطاعم';
    const filterSnacks = document.querySelector('.filter-btn[data-filter="snacks"]');
    if (filterSnacks) filterSnacks.textContent = 'محمصات';
    const filterMedical = document.querySelector('.filter-btn[data-filter="medical"]');
    if (filterMedical) filterMedical.textContent = 'عيادات طبية';
    const filterCars = document.querySelector('.filter-btn[data-filter="cars"]');
    if (filterCars) filterCars.textContent = 'سيارات';

    const webInfoDesc = document.getElementById('web-info-desc');
    if(webInfoDesc) webInfoDesc.textContent = 'تطوير واجهة مستخدم تفاعلية وجذابة، مصممة بأحدث تقنيات الويب مع تجربة تصفح سلسة وسرعة استجابة عالية على جميع الشاشات والهواتف.';
    
    const webVisitBtn = document.querySelector('#web-visit-btn span');
    if(webVisitBtn) webVisitBtn.textContent = 'تصفح الموقع الحي';

    const navLinks = document.querySelectorAll('.nav-links li a');
    if (navLinks.length >= 5) {
      navLinks[0].textContent = 'الرئيسية';
      navLinks[1].textContent = 'الأعمال';
      navLinks[2].textContent = 'الخدمات';
      navLinks[3].textContent = 'آراء العملاء';
      navLinks[4].textContent = 'تواصل معنا';
    }
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = 'التصميم الجرافيك · منشئ إعلانات AI · تطوير المواقع الإلكترونية';
    const heroDesc = document.querySelector('.hero-desc');
    if (heroDesc) heroDesc.textContent = 'تصميم جرافيك، تطوير المواقع الإلكترونية، وتصميم مشاهد تسويقية باستخدام أحدث تقنيات الذكاء الاصطناعي. نصمم هويات بصرية فاخرة للعلامات التجارية لرقي علامتك التجارية ومنحها حضورًا أكثر تميزًا.';
    const heroBtn = document.querySelector('.hero .btn-primary');
    if (heroBtn) heroBtn.textContent = 'تواصل معنا';

    const skillsLabel = document.querySelector('#skills .section-label');
    if(skillsLabel) {
        skillsLabel.textContent = 'أرقامنا';
        document.querySelector('#skills .section-title').textContent = 'بصمة تصنع الفارق\nحيث تتحول الرؤية إلى نتائج';
        const metricCards = document.querySelectorAll('#skills .skill-card');
        if(metricCards.length >= 3) {
            metricCards[0].querySelector('.skill-desc').textContent = 'عميل وثق بنا';
            metricCards[1].querySelector('.skill-desc').textContent = 'مشروعاً متكاملاً';
            metricCards[2].querySelector('.skill-desc').textContent = 'سنوات خبرة';
        }
    }
    
    const brandingTitle = document.getElementById('branding-title');
    if (brandingTitle) brandingTitle.textContent = 'الهوية البصرية';
    
    const ourWorkLabel = document.querySelector('#our-work .section-label');
    if (ourWorkLabel) ourWorkLabel.textContent = 'أحدث أعمالنا';
    const ourWorkTitle = document.querySelector('#our-work .section-title');
    if (ourWorkTitle) ourWorkTitle.textContent = 'التصميم الجرافيك';
    
    const clientsTitle = document.getElementById('clients-title');
    if(clientsTitle) clientsTitle.textContent = 'شركاء نجاحنا';
    
    const socialMediaTitle = document.getElementById('social-media-title');
    if (socialMediaTitle) socialMediaTitle.textContent = 'تصميمات السوشيال ميديا';

    const servicesTitle = document.getElementById('services-page-title');
    if (servicesTitle) servicesTitle.textContent = 'خـدمـاتـنـا';
    const servicesDesc = document.getElementById('services-page-desc');
    if (servicesDesc) servicesDesc.textContent = 'ما يمكننا تقديمه لتطوير ورقي علامتك التجارية';

    if(serviceCards.length >= 3) {
        serviceCards[0].querySelector('.service-name').textContent = 'تصميم جرافيك';
        serviceCards[1].querySelector('.service-name').textContent = 'تطوير المواقع الإلكترونية';
        serviceCards[2].querySelector('.service-name').textContent = 'اعلان بالذكاء الاصطناعي';
        
        serviceCards[0].querySelector('.service-desc').textContent = 'تصميم محتوى بصري احترافي لمنصات التواصل الاجتماعي، وبناء هويات بصرية مميزة، وشعارات احترافية، وتصاميم عالية التحويل تساعد العلامات التجارية على النمو والتميز في مختلف القطاعات.';
        serviceCards[1].querySelector('.service-desc').textContent = 'تطوير واجهات ويب تفاعلية وإبداعية — مواقع بورتفوليو، صفحات هبوط، وتجارب مستخدم مبهرة بأحدث تقنيات الويب.';
        serviceCards[2].querySelector('.service-desc').textContent = 'إنتاج إعلانات فيديو سينمائية وتعليقات صوتية واقعية بأحدث أدوات الذكاء الاصطناعي لتعزيز حملاتك التسويقية.';
    }

    const contactPageTitle = document.querySelector('#contact-page .contact-header h1');
    if(contactPageTitle) contactPageTitle.textContent = 'تواصل معنا';
    const contactHeaderP = document.querySelector('#contact-page .contact-header p');
    if(contactHeaderP) contactHeaderP.textContent = 'جاهزين لتطوير البراند الخاص بك الآن';
    const contactTitle = document.querySelector('.contact-reasons-title');
    if(contactTitle) contactTitle.textContent = 'لـــيــــه تـتـعــاون مــــعـــــانــــا ؟';

    const reasonCards = document.querySelectorAll('.reason-item');
    if(reasonCards.length >= 3) {
        reasonCards[0].querySelector('h4').textContent = 'شراكة ومرونة تامة — Partnership';
        reasonCards[0].querySelector('p').textContent = 'نحن لا ننفذ التصميم ونختفي. سيكون هناك تواصل دائم ومستمر طوال فترة العمل مع مرونة تامة في التعديلات للوصول إلى النتيجة التي ترضيك 100%، دعمنا مستمر حتى بعد تسليم العمل لضمان استقرار هويتك البصرية.';

        reasonCards[1].querySelector('h4').textContent = 'سرعة وإنجاز — Efficiency';
        reasonCards[1].querySelector('p').textContent = 'نقدر قيمة الوقت في البيزنس. بمجرد اعتماد الأفكار واستلام تفاصيل المشروع، يبدأ التنفيذ فوراً لضمان تسليمك في وقت قياسي دون أي تنازل عن الجودة والاحترافية.';

        reasonCards[2].querySelector('h4').textContent = 'تصاميم تبيع — Direct Response';
        reasonCards[2].querySelector('p').textContent = 'هدفنا ليس مجرد تقديم "تصميم جميل"، بل تصميم يحل مشكلة تسويقية يوصل رسالة يحكي قصة. سنقترح عليك أفكاراً وزوايا باستمرار للعب على سيكيولوجية العميل وتخدم رسالتك لضمان الوصول لأعلى وأفضل نتيجة ممكنة.';
    }

    const backBtns = document.querySelectorAll('.back-btn');
    backBtns.forEach(btn => btn.textContent = '← العودة للرئيسية');

    const reviewsPageTitle = document.getElementById('reviews-page-title');
    if (reviewsPageTitle) reviewsPageTitle.textContent = 'آراء عملاؤنا';
    const clientReviewsTitle = document.getElementById('client-reviews-title');
    if (clientReviewsTitle) clientReviewsTitle.textContent = 'ماذا يقول عملاؤنا';
    const reviewsPageDesc = document.getElementById('reviews-page-desc');
    if (reviewsPageDesc) reviewsPageDesc.textContent = 'ماذا يقول شركاء نـجـاحـنـا عن العمل معنا';
    const reviewFormTitle = document.getElementById('reviewFormTitle');
    if (reviewFormTitle) reviewFormTitle.textContent = 'شاركنا رأيك';
    const reviewNameLabel = document.getElementById('reviewNameLabel');
    if (reviewNameLabel) reviewNameLabel.textContent = 'اسمك';
    const reviewStarsLabel = document.getElementById('reviewStarsLabel');
    if (reviewStarsLabel) reviewStarsLabel.textContent = 'تقييمك';
    const reviewCommentLabel = document.getElementById('reviewCommentLabel');
    if (reviewCommentLabel) reviewCommentLabel.textContent = 'تعليقك';
    const reviewSubmitBtn = document.getElementById('reviewSubmitBtn');
    if (reviewSubmitBtn) reviewSubmitBtn.textContent = 'إرسال الرأي';
    
    const emptyMsg = document.getElementById('reviewsEmptyMsg');
    if (emptyMsg) emptyMsg.textContent = 'لسه مفيش آراء، كن أول من يشارك رأيه';
    const sliderStatus = document.getElementById('reviewsSliderStatus');
    if (sliderStatus) sliderStatus.textContent = 'لسه مفيش آراء معتمدة';

  } else {
    const cbBadgeEn = document.getElementById('callbackBadgeText');
    if (cbBadgeEn) cbBadgeEn.textContent = 'Call me';
    const cbTitleEn = document.getElementById('callbackCardTitle');
    if (cbTitleEn) cbTitleEn.textContent = 'Leave your WhatsApp number';
    const cbSubEn = document.getElementById('callbackCardSub');
    if (cbSubEn) cbSubEn.textContent = 'We’ll reach out with packages & details within minutes.';
    const cbBtnEn = document.getElementById('callbackSubmitBtn');
    if (cbBtnEn) cbBtnEn.textContent = 'Send Number';
    const exTagEn = document.getElementById('exitPopupTag');
    if (exTagEn) exTagEn.textContent = 'WAIT A SECOND ✦';
    const exTitleEn = document.getElementById('exitPopupTitle');
    if (exTitleEn) exTitleEn.textContent = 'Have a project in mind?';
    const exDescEn = document.getElementById('exitPopupDesc');
    if (exDescEn) exDescEn.textContent = 'Leave your WhatsApp number before you go and we’ll send you our packages & portfolio details right away.';
    const exBtnEn = document.getElementById('exitSubmitBtn');
    if (exBtnEn) exBtnEn.textContent = 'Get Details on WhatsApp';
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');

    const openmartWebTitleEn = document.getElementById('openmart-web-title');
    if(openmartWebTitleEn) openmartWebTitleEn.textContent = 'Openmart E-commerce Website';

    const openmartWebDescEn = document.getElementById('openmart-web-desc');
    if(openmartWebDescEn) openmartWebDescEn.textContent = 'A bilingual online store designed to make browsing products and placing orders simple and convenient.';

    const newWebTitleEn = document.getElementById('new-web-title');
    if(newWebTitleEn) newWebTitleEn.textContent = 'Savor Cafe & Restaurant';

    const partytimeWebTitleEn = document.getElementById('partytime-web-title');
    if(partytimeWebTitleEn) partytimeWebTitleEn.textContent = 'Partytime Website';

    const partytimeWebDescEn = document.getElementById('partytime-web-desc');
    if(partytimeWebDescEn) partytimeWebDescEn.textContent = 'A modern, responsive website experience designed to showcase Partytime and make exploring its services simple and engaging.';

    const newWebDescEn = document.getElementById('new-web-desc');
    if(newWebDescEn) newWebDescEn.textContent = 'A fully custom-built digital ordering system designed to streamline the ordering process and deliver a seamless customer experience.';

    const filterAllEn = document.querySelector('.filter-btn[data-filter="all"]');
    if (filterAllEn) filterAllEn.textContent = 'All';
    const filterFoodEn = document.querySelector('.filter-btn[data-filter="food"]');
    if (filterFoodEn) filterFoodEn.textContent = 'Restaurants';
    const filterSnacksEn = document.querySelector('.filter-btn[data-filter="snacks"]');
    if (filterSnacksEn) filterSnacksEn.textContent = 'Roasteries';
    const filterMedicalEn = document.querySelector('.filter-btn[data-filter="medical"]');
    if (filterMedicalEn) filterMedicalEn.textContent = 'Medical Clinics';
    const filterCarsEn = document.querySelector('.filter-btn[data-filter="cars"]');
    if (filterCarsEn) filterCarsEn.textContent = 'Cars';

    const bannerTitleEn = document.getElementById('banner-title');
    if (bannerTitleEn) bannerTitleEn.textContent = 'Banner Design';
    const uniformTitleEn = document.getElementById('uniform-title');
    if (uniformTitleEn) uniformTitleEn.textContent = 'Uniform Design';
    const aiAdsTitleEn = document.getElementById('ai-ads-title');
    if (aiAdsTitleEn) aiAdsTitleEn.textContent = 'AI ADS';

    const webDevTitleEn = document.getElementById('web-dev-title');
    if(webDevTitleEn) webDevTitleEn.textContent = 'Website Design & Development';
    
    const webDevLabelEn = document.getElementById('web-dev-label');
    if(webDevLabelEn) webDevLabelEn.textContent = 'LIVE DEMO PREVIEW';
    
    const webInfoTitleEn = document.getElementById('web-info-title');
    if(webInfoTitleEn) webInfoTitleEn.textContent = 'Interactive Website Preview (Fast Food Restaurant)';
    
    const webInfoDescEn = document.getElementById('web-info-desc');
    if(webInfoDescEn) webInfoDescEn.textContent = 'Developing an engaging and interactive user interface for a fast-food restaurant, built with modern web technologies to ensure seamless navigation and full responsiveness across all devices.';
    
    const webVisitBtnEn = document.querySelector('#web-visit-btn span');
    if(webVisitBtnEn) webVisitBtnEn.textContent = 'Explore Live Demo';

    const navLinks = document.querySelectorAll('.nav-links li a');
    if (navLinks.length >= 5) {
      navLinks[0].textContent = 'Home';
      navLinks[1].textContent = 'Portfolio';
      navLinks[2].textContent = 'Services';
      navLinks[3].textContent = 'Reviews';
      navLinks[4].textContent = 'Contact Us';
    }
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = 'Graphic Design · AI Ads · Web Development';
    const heroDesc = document.querySelector('.hero-desc');
    if (heroDesc) heroDesc.textContent = 'Graphic Design, Web Developer & AI creator. We engineer premium brand identities and cinematic AI commercials that elevate your business.';
    const heroBtn = document.querySelector('.hero .btn-primary');
    if (heroBtn) heroBtn.textContent = 'Contact us';

    const skillsLabelEn = document.querySelector('#skills .section-label');
    if(skillsLabelEn) {
        skillsLabelEn.textContent = 'AGENCY METRICS';
        const skillsTitle = document.querySelector('#skills .section-title');
        if (skillsTitle) skillsTitle.textContent = 'OUR IMPACT';
        const metricCardsEn = document.querySelectorAll('#skills .skill-card');
        if(metricCardsEn.length >= 3) {
            metricCardsEn[0].querySelector('.skill-desc').textContent = 'Businesses Trusted Joe Advertise';
            metricCardsEn[1].querySelector('.skill-desc').textContent = 'Successful Projects';
            metricCardsEn[2].querySelector('.skill-desc').textContent = 'YEARS OF EXPERIENCE';
        }
    }
    
    const brandingTitleEn = document.getElementById('branding-title');
    if (brandingTitleEn) brandingTitleEn.textContent = 'Brand Identity';
    
    const ourWorkLabelEn = document.querySelector('#our-work .section-label');
    if (ourWorkLabelEn) ourWorkLabelEn.textContent = 'IMPRESSIVE DESIGNS';
    const ourWorkTitleEn = document.querySelector('#our-work .section-title');
    if (ourWorkTitleEn) ourWorkTitleEn.textContent = 'Graphic Design';

    const servicesTitleEn = document.getElementById('services-page-title');
    if (servicesTitleEn) servicesTitleEn.textContent = 'SERVICES';
    const servicesDescEn = document.getElementById('services-page-desc');
    if (servicesDescEn) servicesDescEn.textContent = 'What we can do to elevate your brand';
    
    if(serviceCards.length >= 3) {
        serviceCards[0].querySelector('.service-name').textContent = 'GRAPHIC DESIGN';
        serviceCards[1].querySelector('.service-name').textContent = 'WEB DEVELOPMENT';
        serviceCards[2].querySelector('.service-name').textContent = 'AI CREATOR';
        
        serviceCards[0].querySelector('.service-desc').textContent = 'Professional visual content design for social media platforms, including distinctive brand identity development, professional logo design, and high-converting creative assets that help brands grow, stand out, and thrive across diverse industries.';
        serviceCards[1].querySelector('.service-desc').textContent = 'Development of interactive and creative web interfaces — portfolio websites, landing pages, and engaging user experiences powered by the latest web technologies.';
        serviceCards[2].querySelector('.service-desc').textContent = 'Production of cinematic AI commercials and lifelike voiceovers, leveraging state-of-the-art artificial intelligence technologies to maximize engagement and drive marketing success.';
    }

    const contactPageTitleEn = document.querySelector('#contact-page .contact-header h1');
    if(contactPageTitleEn) contactPageTitleEn.textContent = 'GET IN TOUCH';
    const contactHeaderPEn = document.querySelector('#contact-page .contact-header p');
    if(contactHeaderPEn) contactHeaderPEn.textContent = 'Ready to elevate your brand right now';
    const contactTitleEn = document.querySelector('.contact-reasons-title');
    if(contactTitleEn) contactTitleEn.textContent = 'WHY CHOOSE US ?';

    const reasonCardsEn = document.querySelectorAll('.reason-item');
    if(reasonCardsEn.length >= 3) {
        reasonCardsEn[0].querySelector('h4').textContent = 'True Partnership & Flexibility';
        reasonCardsEn[0].querySelector('p').textContent = 'We don\'t just design and disappear. We maintain constant communication with full flexibility in revisions until you are 100% satisfied. Our support continues even after delivery to ensure your brand\'s stability.';

        reasonCardsEn[1].querySelector('h4').textContent = 'Speed & Efficiency';
        reasonCardsEn[1].querySelector('p').textContent = 'We value time in business. Once ideas are approved, execution begins immediately to ensure record-time delivery without compromising on quality or professionalism.';

        reasonCardsEn[2].querySelector('h4').textContent = 'Designs That Sell (Direct Response)';
        reasonCardsEn[2].querySelector('p').textContent = 'Our goal isn\'t just a "beautiful design", but a design that solves a marketing problem and tells a story. We will constantly suggest ideas to leverage customer psychology and achieve the highest possible conversion rates.';
    }

    const backBtnsEn = document.querySelectorAll('.back-btn');
    backBtnsEn.forEach(btn => btn.textContent = '← Back to Home');
    
    const reviewsPageTitleEn = document.getElementById('reviews-page-title');
    if (reviewsPageTitleEn) reviewsPageTitleEn.textContent = 'Client Reviews';
    const clientReviewsTitleEn = document.getElementById('client-reviews-title');
    if (clientReviewsTitleEn) clientReviewsTitleEn.textContent = 'What Our Clients Say';
    const reviewsPageDescEn = document.getElementById('reviews-page-desc');
    if (reviewsPageDescEn) reviewsPageDescEn.textContent = 'What our partners say about our work';
    const reviewFormTitleEn = document.getElementById('reviewFormTitle');
    if (reviewFormTitleEn) reviewFormTitleEn.textContent = 'Share your experience';
    const reviewNameLabelEn = document.getElementById('reviewNameLabel');
    if (reviewNameLabelEn) reviewNameLabelEn.textContent = 'Your name';
    const reviewStarsLabelEn = document.getElementById('reviewStarsLabel');
    if (reviewStarsLabelEn) reviewStarsLabelEn.textContent = 'Your rating';
    const reviewCommentLabelEn = document.getElementById('reviewCommentLabel');
    if (reviewCommentLabelEn) reviewCommentLabelEn.textContent = 'Your comment';
    const reviewSubmitBtnEn = document.getElementById('reviewSubmitBtn');
    if (reviewSubmitBtnEn) reviewSubmitBtnEn.textContent = 'Submit review';

    const socialMediaTitleEn = document.getElementById('social-media-title');
    if (socialMediaTitleEn) socialMediaTitleEn.textContent = 'Social Media Designs';

    const clientsTitleEn = document.getElementById('clients-title');
    if(clientsTitleEn) clientsTitleEn.textContent = 'OUR Clients';
    
    const emptyMsg = document.getElementById('reviewsEmptyMsg');
    if (emptyMsg) emptyMsg.textContent = 'No reviews yet — be the first to share yours';
    const sliderStatus = document.getElementById('reviewsSliderStatus');
    if (sliderStatus) sliderStatus.textContent = 'No approved reviews yet';
  }
}

/* =========================================================
   6. Animated Metrics Counters
   ========================================================= */
const counters = document.querySelectorAll('.counter-num');
let countersStarted = false;

function runCounters() {
  if (countersStarted) return;
  countersStarted = true;
  
  counters.forEach(counter => {
    counter.innerText = '+0'; 
    const target = +counter.getAttribute('data-target');
    const duration = 6000; 
    let startTime = null;

    function updateCount(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const current = Math.floor(percentage * target);
      counter.innerText = '+' + current;
      
      if (percentage < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = '+' + target; 
      }
    }
    requestAnimationFrame(updateCount);
  });
}

function checkCounterVisibility() {
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const sectionPos = skillsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight;
    if (sectionPos < screenPos - 100) {
      runCounters();
    }
  }
}

setTimeout(() => {
  window.addEventListener('scroll', checkCounterVisibility);
  checkCounterVisibility();
}, 2500);

/* =========================================================
   7. Sliders, Lightbox & Portfolio Filters
   ========================================================= */
document.addEventListener("DOMContentLoaded", function() {
  const sliderContainers = document.querySelectorAll('.web-demo-card');

  sliderContainers.forEach(container => {
    const track = container.querySelector('.web-slider-track');
    const btnNext = container.querySelector('.slide-next');
    const btnPrev = container.querySelector('.slide-prev');

    if (track) {
      const images = track.querySelectorAll('img');
      const imageWrapper = container.querySelector('.web-img-wrapper-fix');
      const imgCount = images.length;
      let currentIndex = 0;
      let autoSlideInterval;

      function updateImageWrapperRatio() {
        const image = images[currentIndex];
        if (imageWrapper && image && image.naturalWidth && image.naturalHeight) {
          imageWrapper.style.setProperty('aspect-ratio', `${image.naturalWidth} / ${image.naturalHeight}`, 'important');
        }
      }

      function goToNextSlide() {
        currentIndex = (currentIndex + 1) % imgCount; 
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateImageWrapperRatio();
      }

      function goToPrevSlide() {
        currentIndex = (currentIndex - 1 + imgCount) % imgCount; 
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateImageWrapperRatio();
      }

      images.forEach(image => image.addEventListener('load', updateImageWrapperRatio));
      updateImageWrapperRatio();

      function startAutoSlide() {
        autoSlideInterval = setInterval(goToNextSlide, 4500);
      }

      function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
      }

      if (btnNext && btnPrev) {
        btnNext.addEventListener('click', (e) => {
          e.preventDefault(); 
          goToNextSlide();
          resetAutoSlide(); 
        });

        btnPrev.addEventListener('click', (e) => {
          e.preventDefault();
          goToPrevSlide();
          resetAutoSlide(); 
        });

        [btnNext, btnPrev].forEach(btn => {
          btn.addEventListener('mouseenter', () => {
            btn.style.background = 'var(--neon)';
            btn.style.color = '#fff';
          });
          btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(9,4,18,0.8)';
            btn.style.color = 'var(--neon)';
          });
        });
      }
      startAutoSlide();
    }
  });

  const socialImages = document.querySelectorAll('.social-img');
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
  const imageFadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up-active');
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);
  socialImages.forEach(img => imageFadeObserver.observe(img));

  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox-overlay';
  lightbox.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <img id="lightbox-img" class="lightbox-image" src="" alt="Design Preview">
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.social-img, .brand-img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src; 
      lightbox.classList.add('active');
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
      lightbox.classList.remove('active');
      setTimeout(() => { lightboxImg.src = ''; }, 400); 
    }
  });

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');
      socialImages.forEach(img => {
        if (filterValue === 'all' || img.getAttribute('data-category') === filterValue) {
          img.classList.remove('hide');
        } else {
          img.classList.add('hide');
        }
      });
    });
  });
});

/* =========================================================
   8. Client Reviews (Supabase) & Theme/Lang Persistence
   ========================================================= */
(function() {
  const SUPABASE_URL = "https://wzixccdyvajhyxjwijpa.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_mOJggeRNz_zCfDz65o814A_go2cgnrs";

  if (!window.supabase) return;
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const grid = document.getElementById('reviewsGrid');
  const form = document.getElementById('reviewForm');
  const msg = document.getElementById('reviewMsg');
  const submitBtn = document.getElementById('reviewSubmitBtn');
  const starPicker = document.getElementById('starPicker');
  const sliderTrack = document.getElementById('reviewsSliderTrack');
  const sliderDots = document.getElementById('reviewsSliderDots');
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  
  if (!starPicker || !form) return;

  let currentReview = 0;
  let autoSlideTimer;

  function showReview(index, reviews) {
    if (!sliderTrack || !reviews.length) return;
    currentReview = (index + reviews.length) % reviews.length;
    sliderTrack.style.transform = `translateX(-${currentReview * 100}%)`;
    sliderDots.querySelectorAll('button').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === currentReview));
  }

  function renderReviewSlider(reviews) {
    if (!sliderTrack) return;
    if (!reviews.length) {
      sliderTrack.innerHTML = `<div class="reviews-slider-empty">${isArabic ? 'لسه مفيش آراء معتمدة' : 'No approved reviews yet'}</div>`;
      sliderDots.innerHTML = '';
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }
    sliderTrack.innerHTML = reviews.map(r => `
      <div class="review-card">
        <div class="review-stars">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
        <div class="review-text">${escapeHtml(r.comment)}</div>
        <div class="review-name">${escapeHtml(r.name)}</div>
        <div class="review-date">${timeAgo(r.created_at)}</div>
      </div>
    `).join('');
    sliderDots.innerHTML = reviews.map((_, index) => `<button type="button" class="reviews-slider-dot${index === 0 ? ' active' : ''}" aria-label="Review ${index + 1}"></button>`).join('');
    sliderDots.querySelectorAll('button').forEach((dot, index) => dot.addEventListener('click', () => { showReview(index, reviews); resetAutoSlide(reviews); }));
    currentReview = 0;
    showReview(0, reviews);
    prevBtn.hidden = reviews.length < 2;
    nextBtn.hidden = reviews.length < 2;
  }

  function resetAutoSlide(reviews) {
    clearInterval(autoSlideTimer);
    if (reviews.length > 1) autoSlideTimer = setInterval(() => showReview(currentReview + 1, reviews), 4500);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => { showReview(currentReview - 1, window.clientReviews || []); resetAutoSlide(window.clientReviews || []); });
    nextBtn.addEventListener('click', () => { showReview(currentReview + 1, window.clientReviews || []); resetAutoSlide(window.clientReviews || []); });
  }

  const stars = starPicker.querySelectorAll('span');
  let selectedRating = 5;

  function paintStars(val) {
    stars.forEach(s => s.classList.toggle('active', +s.dataset.val <= val));
  }
  paintStars(selectedRating);
  stars.forEach(s => {
    s.addEventListener('mouseenter', () => paintStars(+s.dataset.val));
    s.addEventListener('mouseleave', () => paintStars(selectedRating));
    s.addEventListener('click', () => { selectedRating = +s.dataset.val; paintStars(selectedRating); });
  });

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return isArabic ? 'الآن' : 'just now';
    if (diff < 3600) return Math.floor(diff/60) + (isArabic ? ' دقيقة' : 'm ago');
    if (diff < 86400) return Math.floor(diff/3600) + (isArabic ? ' ساعة' : 'h ago');
    return Math.floor(diff/86400) + (isArabic ? ' يوم' : 'd ago');
  }

  async function loadReviews() {
    const { data, error } = await sb
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      if (grid) grid.innerHTML = `<div class="reviews-empty">${isArabic ? 'تعذر تحميل الآراء حاليًا' : 'Could not load reviews right now'}</div>`;
      return;
    }
    if (!data || data.length === 0) {
      if (grid) grid.innerHTML = `<div class="reviews-empty" id="reviewsEmptyMsg">${isArabic ? 'لسه مفيش آراء، كن أول من يشارك رأيه' : 'No reviews yet — be the first to share yours'}</div>`;
      renderReviewSlider([]);
      return;
    }
    window.clientReviews = data;
    renderReviewSlider(data);
    resetAutoSlide(data);
    const reviewsMarkup = data.map(r => `
      <div class="review-card">
        <div class="review-stars">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
        <div class="review-text">${escapeHtml(r.comment)}</div>
        <div class="review-name">${escapeHtml(r.name)}</div>
        <div class="review-date">${timeAgo(r.created_at)}</div>
      </div>
    `).join('');
    if (grid) grid.innerHTML = reviewsMarkup;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    if (!name || !comment) return;

    submitBtn.disabled = true;
    msg.textContent = '';
    msg.className = 'review-msg';

    const { error } = await sb.from('reviews').insert({
      name: name,
      comment: comment,
      rating: selectedRating
    });

    submitBtn.disabled = false;

    if (error) {
      msg.textContent = isArabic ? 'حصل خطأ، حاول تاني' : 'Something went wrong, please try again';
      msg.className = 'review-msg error';
      return;
    }

    msg.textContent = isArabic ? 'شكرًا لك! سيتم مراجعة رأيك ونشره قريبًا' : 'Thank you! Your review is pending approval';
    msg.className = 'review-msg success';
    form.reset();
    selectedRating = 5;
    paintStars(5);
    loadReviews();
  });

  loadReviews();
})();

// دالة لتغيير الوضع الليلي / النهاري وحفظه
function toggleTheme() {
  const themeCheckbox = document.getElementById('theme-toggle-checkbox');
  const isLight = themeCheckbox.checked;
  document.body.classList.toggle('light-mode', isLight);
  localStorage.setItem('joe_theme', isLight ? 'light' : 'dark');
}

// استعادة إعدادات اللغة والثيم المحفوظة عند فتح الموقع
(function restorePreferences() {
  const savedTheme = localStorage.getItem('joe_theme');
  const themeCheckbox = document.getElementById('theme-toggle-checkbox');
  if (savedTheme === 'light' && themeCheckbox) {
    themeCheckbox.checked = true;
    document.body.classList.add('light-mode');
  }

  const savedLang = localStorage.getItem('joe_lang');
  const langCheckbox = document.getElementById('lang-toggle-checkbox');
  if (savedLang === 'ar' && langCheckbox) {
    langCheckbox.checked = true;
    toggleLang();
  }
})();
/* =========================================================
   9. Enhanced Visitor Tracking, Lead Capture & Exit Popup
   ========================================================= */
(function initTrackingAndLeads() {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const device = isMobile ? 'موبايل' : 'كمبيوتر';

  function getTrafficSource() {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const rawRef = document.referrer || '';
    const ownHost = window.location.hostname;

    if (utmSource) return utmSource;
    if (params.has('fbclid') || /facebook\.com|fb\.com/i.test(rawRef)) return 'فيسبوك (Facebook)';
    if (/instagram\.com/i.test(rawRef)) return 'إنستجرام (Instagram)';
    if (params.has('gclid') || /google\./i.test(rawRef)) return 'جوجل (Google)';
    if (/tiktok\.com/i.test(rawRef)) return 'تيك توك (TikTok)';
    if (/t\.me|telegram/i.test(rawRef)) return 'تليجرام (Telegram)';
    if (rawRef && !rawRef.includes(ownHost)) return rawRef;
    return 'دخول مباشر (Direct)';
  }

  function getVisitorStatus() {
    let count = parseInt(localStorage.getItem('joe_visit_count') || '0', 10);
    if (!sessionStorage.getItem('joe_visit_counted')) {
      count += 1;
      localStorage.setItem('joe_visit_count', String(count));
      sessionStorage.setItem('joe_visit_counted', '1');
    }
    return count > 1
      ? `🔄 زائر عائد (مهتم - زيارة رقم ${count})`
      : 'زائر جديد 🆕';
  }

  const trafficSource = getTrafficSource();
  const visitorStatus = getVisitorStatus();

  // 1. إشعار دخول الزائر
  if (!navigator.webdriver && !sessionStorage.getItem('joe_visit_notified')) {
    sessionStorage.setItem('joe_visit_notified', '1');
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'visit',
        page: window.location.pathname + window.location.hash,
        referrer: trafficSource,
        device,
        visitorStatus
      }),
      keepalive: true
    }).catch(() => {});
  }

  // 2. تتبع النقرات المهمة (معاينة المشاريع أو أزرار التواصل)
  function notifyInterest(key, actionLabel) {
    if (navigator.webdriver || sessionStorage.getItem('joe_int_' + key)) return;
    sessionStorage.setItem('joe_int_' + key, '1');
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'interest',
        actionLabel,
        visitorStatus,
        device
      }),
      keepalive: true
    }).catch(() => {});
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.includes('partytime-eg.com')) notifyInterest('partytime', 'فتح معاينة موقع Partytime');
    else if (href.includes('openmartegypt.com')) notifyInterest('openmart', 'فتح معاينة متجر Openmart');
    else if (href.includes('savoregy.vercel.app')) notifyInterest('savor', 'فتح معاينة موقع Savor');
    else if (href.includes('fastfoodhtml.vercel.app')) notifyInterest('fastfood', 'فتح معاينة موقع المطعم التجريبي');
    else if (href.includes('wa.me')) notifyInterest('whatsapp', 'ضغط على زرار واتساب');
    else if (href.includes('facebook.com')) notifyInterest('facebook', 'ضغط على صفحة فيسبوك');
  });

function normalizeDigits(val) {
    const arabicNums = '٠١٢٣٤٥٦٧٨٩';
    return String(val || '')
      .replace(/[٠-٩]/g, d => arabicNums.indexOf(d))
      .replace(/\D/g, '');
  }

function validatePhoneNumber(raw) {
    let digits = normalizeDigits(raw);
    const ar = document.documentElement.getAttribute('lang') === 'ar';

    if (digits.startsWith('00')) {
      digits = digits.slice(2);
    }

    // تصحيح تلقائي لو كتب 20010... للرقم المصري
    if (/^2001[0125]\d{8}$/.test(digits)) {
      digits = '2' + digits.slice(2);
    }

    if (!digits) {
      return {
        valid: false,
        msg: ar ? 'من فضلك اكتب رقم الواتساب' : 'Please enter your WhatsApp number'
      };
    }

    // رفض الأرقام الوهمية المكررة أو المتسلسلة
    if (/^(\d)\1+$/.test(digits) || /^(0123456789|1234567890|9876543210)/.test(digits)) {
      return {
        valid: false,
        msg: ar ? 'من فضلك اكتب رقم واتساب صحيح' : 'Please enter a valid WhatsApp number'
      };
    }

    const isEgyptianLocalInvalid = digits.startsWith('01') && !/^01[0125]\d{8}$/.test(digits);
    const isEgyptianIntlInvalid = digits.startsWith('201') && !/^201[0125]\d{8}$/.test(digits);

if (
      digits.length < 8 ||
      digits.length > 15 ||
      isEgyptianLocalInvalid ||
      isEgyptianIntlInvalid
    ) {
      return {
        valid: false,
        msg: ar
          ? 'رقم الواتساب غير مكتمل أو غير صحيح، تأكد من كتابة جميع الأرقام'
          : 'Incomplete or invalid WhatsApp number, please check the digits'
      };
    }

    return { valid: true, digits };
  }

  function attachNumericFilter(inputEl) {
    if (!inputEl) return;
    inputEl.addEventListener('input', () => {
      const cleaned = normalizeDigits(inputEl.value).slice(0, 15);
      if (inputEl.value !== cleaned) inputEl.value = cleaned;
    });
  }

  // عناصر زرار الاتصال السريع فوق الواتساب
  const callbackBtn = document.getElementById('callbackFloatBtn');
  const callbackCard = document.getElementById('callbackCard');
  const callbackClose = document.getElementById('callbackCardClose');
  const callbackForm = document.getElementById('callbackFloatForm');
  const callbackInput = document.getElementById('callbackPhoneInput');
  const callbackError = document.getElementById('callbackError');
  const callbackSuccess = document.getElementById('callbackSuccess');
  const callbackSubmit = document.getElementById('callbackSubmitBtn');

  // عناصر نافذة الخروج (Exit Popup)
  const exitOverlay = document.getElementById('exitPopupOverlay');
  const exitClose = document.getElementById('exitPopupClose');
  const exitForm = document.getElementById('exitPopupForm');
  const exitInput = document.getElementById('exitPhoneInput');
  const exitError = document.getElementById('exitError');
  const exitSuccess = document.getElementById('exitSuccess');
  const exitSubmit = document.getElementById('exitSubmitBtn');

  attachNumericFilter(callbackInput);
  attachNumericFilter(exitInput);

  if (callbackBtn && callbackCard) {
    callbackBtn.addEventListener('click', () => {
      callbackCard.classList.toggle('open');
      if (callbackCard.classList.contains('open') && callbackInput) {
        setTimeout(() => callbackInput.focus(), 150);
      }
    });
  }
  if (callbackClose && callbackCard) {
    callbackClose.addEventListener('click', () => callbackCard.classList.remove('open'));
  }
document.addEventListener('click', (e) => {
    if (
      callbackCard &&
      callbackCard.classList.contains('open') &&
      !callbackCard.contains(e.target) &&
      !(callbackBtn && callbackBtn.contains(e.target))
    ) {
      callbackCard.classList.remove('open');
    }
  });
  async function handleLeadSubmit(e, inputEl, errorEl, successEl, submitBtn, leadSource, onDone) {
    e.preventDefault();
    const ar = document.documentElement.getAttribute('lang') === 'ar';
    errorEl.textContent = '';
    successEl.textContent = '';

    const check = validatePhoneNumber(inputEl.value);
    if (!check.valid) {
      errorEl.textContent = check.msg;
      inputEl.focus();
      return;
    }

    submitBtn.disabled = true;
    try {
      const res = await fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead',
          phone: check.digits,
          leadSource,
          referrer: trafficSource,
          device
        })
      });

      if (!res.ok) throw new Error('Request failed');

      // حفظ إن العميل ساب رقمه لمنع ظهور Exit Popup نهائياً
      localStorage.setItem('joe_lead_submitted', '1');
      if (callbackBtn) {
        callbackBtn.classList.add('submitted');
        setTimeout(() => callbackBtn.classList.remove('submitted'), 30000);
      }

      successEl.textContent = ar
        ? 'تم استلام رقمك بنجاح! هنتواصل معاك واتساب في دقائق ✅'
        : 'Received! We’ll message you on WhatsApp within minutes ✅';
      inputEl.value = '';
      if (onDone) setTimeout(onDone, 1800);
    } catch {
      errorEl.textContent = ar ? 'حصل خطأ في الإرسال، حاول تاني' : 'Could not send right now, please try again';
    } finally {
      submitBtn.disabled = false;
    }
  }

  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      handleLeadSubmit(
        e,
        callbackInput,
        callbackError,
        callbackSuccess,
        callbackSubmit,
        'زر الاتصال السريع (فوق الواتساب)',
        () => callbackCard && callbackCard.classList.remove('open')
      );
    });
  }

  if (exitForm) {
    exitForm.addEventListener('submit', (e) => {
      handleLeadSubmit(
        e,
        exitInput,
        exitError,
        exitSuccess,
        exitSubmit,
        'نافذة الخروج (Exit Popup)',
        () => exitOverlay && exitOverlay.classList.remove('open')
      );
    });
  }

 // منطق إظهار Exit Popup (يظهر عند محاولة الخروج طالما العميل لم يرسل رقمه)
  let exitCooldown = false;

  function triggerExitPopup() {
    if (!exitOverlay) return;
    // الشرط الوحيد للمنع الدائم: إن العميل يكون ساب رقمه فعلاً
    if (localStorage.getItem('joe_lead_submitted') === '1') return;
    // لو النافذة مفتوحة أصلاً أو لسه قافلها من ثواني (منع التكرار المزعج في نفس اللحظة)
    if (exitOverlay.classList.contains('open') || exitCooldown) return;

    if (callbackCard) callbackCard.classList.remove('open');
    exitOverlay.classList.add('open');
    if (exitInput) setTimeout(() => exitInput.focus(), 200);
  }

  function closeExitPopup() {
    if (!exitOverlay) return;
    exitOverlay.classList.remove('open');
    // فترة تهدئة 10 ثواني بعد الضغط على X عشان يقدر يتصفح، ولو حاول يخرج تاني هتظهرله
    exitCooldown = true;
    setTimeout(() => {
      exitCooldown = false;
    }, 10000);
  }

  if (exitClose && exitOverlay) {
    exitClose.addEventListener('click', closeExitPopup);
    exitOverlay.addEventListener('click', (e) => {
      if (e.target === exitOverlay) closeExitPopup();
    });
  }

  const pageLoadTime = Date.now();

  // 1. للكمبيوتر: عند تحريك الماوس لأعلى ناحية الخروج من الصفحة (بعد 3 ثواني من الدخول)
  document.addEventListener('mouseout', (e) => {
    if (Date.now() - pageLoadTime < 3000) return;
    if (!e.relatedTarget && !e.toElement && e.clientY <= 10) {
      triggerExitPopup();
    }
  });

  // 2. للموبايل والكمبيوتر: عند محاولة مغادرة الصفحة أو التبديل لتطبيق/تاب تاني
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && Date.now() - pageLoadTime > 3000) {
      triggerExitPopup();
    }
  });

  // 3. للموبايل: عند الوصول لأعلى الصفحة بعد تصفح حقيقي للأسفل (محاولة السحب للخروج أو تحديث الصفحة)
  let hasScrolledDown = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      hasScrolledDown = true;
    } else if (isMobile && hasScrolledDown && window.scrollY <= 10 && Date.now() - pageLoadTime > 5000) {
      hasScrolledDown = false;
      triggerExitPopup();
    }
  }, { passive: true });
})();
