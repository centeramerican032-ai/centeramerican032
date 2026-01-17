// Navigation Toggle for Mobile
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('nav')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// Articles helper: TOC builder, reveal on scroll, read-more toggles, progress bar, modern carousel
// دالة عرض الفيديو
function showVideoModal(src) {
  const modal = document.getElementById('video-modal') || createVideoModal();
  const wrap = modal.querySelector('.video-wrap');
  wrap.innerHTML = `<iframe width="100%" height="506" src="${src}" title="فيديو توضيحي" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  modal.querySelector('.video-close').onclick = () => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  };
}
function createVideoModal() {
  const modal = document.createElement('div');
  modal.id = 'video-modal';
  modal.className = 'video-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <button class="video-close" aria-label="إغلاق">×</button>
    <div class="video-wrap"></div>
  `;
  document.body.appendChild(modal);
  return modal;
}

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== MODERN CAROUSEL / SLIDER =====
  const slides = [
    { 
      title: 'الصراصير', 
      text: 'من أكثر الآفات المنزلية شيوعًا، تتطلب مزيج من الإدارة البيئية والتدابير الفنية المتقدمة.',
      img: 'images/cockroach.svg'
    },
    { 
      title: 'بق الفراش', 
      text: 'حشرات صغيرة تمتص الدم وتختبئ في الفراش، تسبب حكة شديدة وتنتشر بسرعة عبر الأمتعة.',
      img: 'images/bedbug.svg'
    },
    { 
      title: 'القوارض', 
      text: 'فئران وجرذان تسبب أضرار مالية وصحية كبيرة، تتطلب خطة متكاملة للقضاء عليها.',
      img: 'images/rodent.svg'
    },
    { 
      title: 'البعوض', 
      text: 'ناقل الأمراض الخطيرة، تتطلب مكافحة فعالة ومتابعة مستمرة طوال الموسم.',
      img: 'images/mosquito.svg'
    },
    { 
      title: 'النمل الأبيض', 
      text: 'يسبب أضرار هيكلية بنية جسيمة، يحتاج تشخيص دقيق ومعالجة احترافية.',
      img: 'images/termite.svg'
    }
  ];

  let currentSlide = 0;
  const carousel = document.getElementById('articles-carousel');
  
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const dotsContainer = document.getElementById('carousel-dots');
    
    // Build carousel slides
    slides.forEach((slide, idx) => {
      const slideEl = document.createElement('div');
      slideEl.className = 'carousel-slide';
      slideEl.innerHTML = `
        <div class="carousel-content">
          <div class="carousel-img">
            <img src="${slide.img}" alt="${slide.title}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f0f0f0%22/><text x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 text-anchor=%22middle%22 fill=%22%23999%22 dy=%22.3em%22>صورة</text></svg>'">
          </div>
          <div class="carousel-text">
            <h2>${slide.title}</h2>
            <p>${slide.text}</p>
          </div>
        </div>
      `;
      track.appendChild(slideEl);
      
      // Build dots
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `انتقل إلى الشريحة ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
    
    function updateCarousel() {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      document.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }
    
    function goToSlide(n) {
      currentSlide = (n + slides.length) % slides.length;
      updateCarousel();
    }
    
    function prevSlide() {
      goToSlide(currentSlide - 1);
    }
    
    function nextSlide() {
      goToSlide(currentSlide + 1);
    }
    
    // Navigation buttons
    carousel.querySelector('.carousel-prev').addEventListener('click', prevSlide);
    carousel.querySelector('.carousel-next').addEventListener('click', nextSlide);
    
    // Auto-rotate carousel every 6 seconds
    let autoSlide = setInterval(nextSlide, 6000);
    
    carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carousel.addEventListener('mouseleave', () => {
      autoSlide = setInterval(nextSlide, 6000);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (document.activeElement === carousel || carousel.contains(document.activeElement)) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      }
    });
  }

  // ===== TABLE OF CONTENTS (TOC) BUILDER =====
  const methods = Array.from(document.querySelectorAll('.pest-section'));
  const tocEl = document.createElement('div'); tocEl.className = 'toc';
  const tocTitle = document.createElement('h4'); tocTitle.innerText = 'جدول المحتويات'; tocEl.appendChild(tocTitle);
  methods.forEach(sec => {
    const id = sec.id || sec.dataset.id;
    const title = (sec.querySelector('h3')||{}).innerText || id || 'قسم';
    const a = document.createElement('a'); a.href = `#${id}`; a.innerText = title; 
    a.addEventListener('click', (e)=>{ 
      e.preventDefault(); 
      document.querySelector(`#${id}`).scrollIntoView({behavior:'smooth', block:'start'}); 
      history.replaceState(null,'',`#${id}`); 
    });
    tocEl.appendChild(a);
    // add small toggle button for mobile
    const body = sec.querySelector('.pest-body');
    if(body){
      const btn = document.createElement('button'); btn.className='pest-toggle'; btn.innerText='اقرأ أكثر';
      btn.addEventListener('click', ()=>{ 
        body.classList.toggle('expanded'); 
        btn.innerText = body.classList.contains('expanded') ? 'اقرأ أقل' : 'اقرأ أكثر';
      });
      sec.appendChild(btn);
    }
  });
  // attach TOC if aside exists
  const aside = document.querySelector('.articles-aside');
  if(aside) aside.appendChild(tocEl);

  // ===== INTERSECTION OBSERVER FOR REVEAL-ON-SCROLL =====
  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  const tocLinks = tocEl ? Array.from(tocEl.querySelectorAll('a')) : [];
  if (typeof IntersectionObserver !== 'undefined') {
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          // set active toc
          const id = entry.target.id;
          tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        }
      });
    }, { root:null, threshold: 0.18 });
    revealItems.forEach(i => obs.observe(i));
  }

  // ===== PROGRESS BAR =====
  const prog = document.createElement('div'); prog.id='page-progress'; document.body.appendChild(prog);
  window.addEventListener('scroll', () => {
    const sc = window.scrollY; 
    const h = document.documentElement.scrollHeight - window.innerHeight; 
    const pct = h>0 ? (sc/h)*100 : 0; 
    prog.style.width = pct + '%';
  }, {passive:true});

  // ===== READ-MORE IN-PAGE LOADER =====
  document.addEventListener('click', async (e) => {
    const el = e.target.closest && e.target.closest('.read-more');
    if (!el) return;
    e.preventDefault();
    const src = el.getAttribute('data-src') || el.getAttribute('href');
    if(!src) return window.location.href = el.href;
    const parent = el.closest('.pest-content');
    if(!parent) return;
    const body = parent.querySelector('.pest-body');
    
    // toggle if already loaded
    if(body && body.classList.contains('expanded')){ 
      body.classList.remove('expanded'); 
      body.setAttribute('aria-hidden','true'); 
      el.innerText = 'اقرأ المزيد'; 
      parent.querySelector('.pest-media img') && parent.querySelector('.pest-media img').focus(); 
      return; 
    }
    
    // if content already loaded once, just expand
    if(body && body.dataset.loaded === 'true'){ 
      body.classList.add('expanded'); 
      body.setAttribute('aria-hidden','false'); 
      el.innerText = 'اقرأ أقل'; 
      parent.scrollIntoView({behavior:'smooth', block:'start'}); 
      return; 
    }

    try{
      // fetch the article page and extract article-content
      const res = await fetch(src, {cache:'no-store'});
      if(!res.ok) throw new Error('Fetch failed');
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const art = doc.querySelector('.article-content');
      const content = art ? art.innerHTML : '<p>المقال غير متوفر حالياً.</p>';
      if(!body){
        const wrapper = document.createElement('div'); 
        wrapper.className='pest-body expanded'; 
        wrapper.setAttribute('aria-hidden','false'); 
        wrapper.innerHTML = content; 
        parent.appendChild(wrapper);
      } else {
        body.innerHTML = content; 
        body.dataset.loaded='true'; 
        body.classList.add('expanded'); 
        body.setAttribute('aria-hidden','false');
      }
      el.innerText = 'اقرأ أقل';
      parent.scrollIntoView({behavior:'smooth', block:'start'});
    }catch(err){
      console.warn('Failed to load article fragment', err);
      // fallback: navigate to the page
      window.location.href = src;
    }
  });

  // ===== IMAGE GALLERY =====
  const galleryGrid = document.getElementById('articles-gallery-grid');
  if (galleryGrid) {
    const files = [
      "images/service-spray.svg", "images/service-inspection.svg", "images/service-follow-up.svg",
      "images/cockroach-detail.svg", "images/mosquito-detail.svg", "images/rodent-detail.svg",
      "images/gallery-1.jpg", "images/gallery-2.jpg", "images/gallery-3.png", "images/gallery-4.jpg",
      "images/case-study-1.jpeg", "images/case-study-2.png", "images/case-study-3.webp", "images/case-study-4.png",
      "images/case-study-5.jpg", "images/case-study-6.jpg", "images/case-study-7.jpg", "images/case-study-8.webp",
      "images/testimonial-1.jpeg", "images/testimonial-2.jpg", "images/testimonial-3.png",
      "images/ant.svg", "images/bedbug.svg", "images/cockroach.svg", "images/flea.svg", "images/fly.svg", "images/mosquito.svg", "images/pantry.svg",
      "images/rodent.svg", "images/silverfish.svg", "images/termite.svg", "images/about-team.svg", "images/logo.svg", "images/logo-alt.png", "images/favicon.svg"
    ];

    const captions = [
      'خدمة الرش المتقدمة بدون رائحة',
      'الفحص الدقيق للمباني',
      'المتابعة الدورية المستمرة',
      'مكافحة الصراصير بكفاءة عالية',
      'برنامج مكافحة البعوض الشامل',
      'حلول فعّالة لمكافحة القوارض',
      'من أعمالنا الميدانية',
      'عملية تعقيم احترافية',
      'معرض الخدمات',
      'خدمات متكاملة',
      'حالة دراسية - مشروع سكني',
      'حالة دراسية - مشروع تجاري',
      'حالة دراسية - مستودع',
      'حالة دراسية - مطعم وكافيه',
      'حالة دراسية - مدرسة وروضة',
      'حالة دراسية - منشأة صحية',
      'حالة دراسية - مكتب إداري',
      'حالة دراسية - فندق فاخر',
      'قبل وبعد - تحول المطبخ',
      'قبل وبعد - غرفة النوم',
      'قبل وبعد - المستودع',
      'شهادة عميل - راضي 1',
      'شهادة عميل - راضي 2',
      'شهادة عميل - راضي 3',
      'النمل العام',
      'بق الفراش',
      'الصراصير',
      'البراغيث',
      'الذباب',
      'البعوض',
      'حشرات المخزون',
      'القوارض',
      'الحشرة الفضية',
      'النمل الأبيض',
      'فريق العمل'
    ];

    function openLightbox(src) {
      const lightbox = document.getElementById('lightbox'); 
      const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
      if (lightbox && lightboxImg) { 
        lightboxImg.src = src; 
        lightbox.classList.add('show'); 
        lightbox.setAttribute('aria-hidden', 'false'); 
      }
    }

    files.forEach((f, idx) => {
      const div = document.createElement('div'); 
      div.className = 'gallery-item';
      if (idx % 5 === 0) div.classList.add('size-large');

      const img = document.createElement('img'); 
      img.src = f; 
      img.loading = 'lazy'; 
      img.alt = 'معرض الصور'; 
      img.style.cursor = 'pointer';
      
      // fallback for failed images
      img.onerror = function() { 
        const fallbackSvg = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22><defs><linearGradient id=%22grad%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22><stop offset=%220%25%22 style=%22stop-color:%230d5d0d;stop-opacity:0.1%22 /><stop offset=%22100%25%22 style=%22stop-color:%23ff6b00;stop-opacity:0.1%22 /></linearGradient></defs><rect width=%22100%25%22 height=%22100%25%22 fill=%22url(%23grad)%22/><text x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 text-anchor=%22middle%22 fill=%22%23666%22 dy=%22.3em%22 font-family=%22Cairo,%20sans-serif%22>صورة</text></svg>';
        this.src = fallbackSvg;
      };
      
      img.addEventListener('click', () => openLightbox(f));
      div.appendChild(img);
      
      const cap = document.createElement('p'); 
      cap.className = 'gallery-caption'; 
      cap.innerText = captions[idx % captions.length];
      div.appendChild(cap);
      galleryGrid.appendChild(div);
    });
  }

  // ===== VIDEOS GRID - LOCAL VIDEOS ONLY =====
  const videoGrid = document.getElementById('articles-video-grid');
  if (videoGrid) {
    const vids = [
      { type: 'local', src: 'videos/pest-control-methods.mp4', title: 'عرض توضيحي: طرق المكافحة الحديثة' },
      { type: 'local', src: 'videos/pest-prevention.mp4', title: 'عرض تعريفي: الوقاية من الحشرات' }
    ];

    vids.forEach((v, idx) => {
      const it = document.createElement('div'); 
      it.className = 'video-item'; 
      it.tabIndex = 0; 
      it.dataset.type = v.type; 
      it.dataset.src = v.src;
      
      const thumbWrap = document.createElement('div'); 
      thumbWrap.className = 'thumb';
      
      const timg = document.createElement('img'); 
      timg.src = (idx === 0) ? 'images/case-study-1.jpeg' : 'images/case-study-2.png'; 
      timg.alt = 'صورة مصغرة للفيديو'; 
      timg.loading = 'lazy'; 
      timg.className = 'video-thumb';
      timg.onerror = function() {
        this.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22225%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23eee%22/><text x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 text-anchor=%22middle%22 fill=%22%23999%22 dy=%22.3em%22>فيديو</text></svg>';
      };
      
      thumbWrap.appendChild(timg);
      
      const play = document.createElement('div'); 
      play.className = 'play-overlay'; 
      play.innerText = '▶';
      thumbWrap.appendChild(play);
      
      const label = document.createElement('p'); 
      label.innerText = v.title;
      
      it.appendChild(thumbWrap); 
      it.appendChild(label);

      it.addEventListener('click', () => {
        const videoModal = document.getElementById('video-modal'); 
        const videoWrap = videoModal ? videoModal.querySelector('.video-wrap') : null;
        
        if (videoModal && videoWrap) {
          videoWrap.innerHTML = '';
          fetch(v.src, { method: 'HEAD' }).then(res => {
            if (res.ok) {
              const vv = document.createElement('video'); 
              vv.src = v.src; 
              vv.controls = true; 
              vv.autoplay = true; 
              vv.style.maxWidth = '90vw'; 
              videoWrap.appendChild(vv);
            } else {
              videoWrap.innerHTML = '<p style="padding:30px; text-align:center; color: #d32f2f; font-weight: 600; font-size: 1.1rem;">عذراً - الفيديو المحلي غير متوفر حالياً.</p>';
            }
          }).catch(() => {
            videoWrap.innerHTML = '<p style="padding:30px; text-align:center; color: #d32f2f; font-weight: 600; font-size: 1.1rem;">تعذر تحميل الفيديو - يرجى المحاولة لاحقاً.</p>';
          });
          videoModal.classList.add('show'); 
          videoModal.setAttribute('aria-hidden', 'false');
        }
      });

      if (idx === 0) it.classList.add('centered-video');
      videoGrid.appendChild(it);
    });

    // video modal close handler
    const videoModal = document.getElementById('video-modal'); 
    if (videoModal) {
      const closeBtn = videoModal.querySelector('.video-close'); 
      closeBtn && closeBtn.addEventListener('click', () => { 
        videoModal.classList.remove('show'); 
        videoModal.setAttribute('aria-hidden', 'true'); 
        videoModal.querySelector('.video-wrap').innerHTML = ''; 
      });
      
      videoModal.addEventListener('click', (e) => { 
        if (e.target === videoModal) { 
          videoModal.classList.remove('show'); 
          videoModal.setAttribute('aria-hidden', 'true'); 
          videoModal.querySelector('.video-wrap').innerHTML = ''; 
        } 
      });
      
      document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') { 
          videoModal.classList.remove('show'); 
          videoModal.setAttribute('aria-hidden', 'true'); 
          videoModal.querySelector('.video-wrap').innerHTML = ''; 
        } 
      });
    }
  }

  // ===== ARTICLE PAGE TRANSFORMATION =====
  const articleContent = document.querySelector('.article-content');
  if (articleContent) {
    (function(){
      const originalHTML = articleContent.innerHTML;
      try {
        const fileMap = {
          'الصراصير': '../images/cockroach.svg', 
          'بق الفراش': '../images/bedbug.svg', 
          'القوارض (فئران وجرذان)': '../images/rodent.svg', 
          'النمل': '../images/ant.svg',
          'النمل الأبيض (Termites)': '../images/termite.svg', 
          'البعوض': '../images/mosquito.svg', 
          'الذباب': '../images/fly.svg', 
          'البراغيث': '../images/flea.svg',
          'حشرات المخزون وجوّاف الحبوب (عث المخزن، سوس الطعام)': '../images/pantry.svg', 
          'الحشرة الفضية (Silverfish)': '../images/silverfish.svg'
        };
        const fallback = (f) => '../images/logo.svg';

        // collect H2 sections
        const nodes = Array.from(articleContent.children);
        const grouped = [];
        let current = null;
        nodes.forEach(n => {
          if (n.tagName === 'H2') {
            current = { heading: n, nodes: [] }; 
            grouped.push(current);
          } else if (current) { 
            current.nodes.push(n); 
          }
        });

        if (!grouped.length) return;

        const frag = document.createDocumentFragment();
        grouped.forEach((g, i) => {
          const row = document.createElement('div'); 
          row.className = 'article-row'; 
          if (i % 2) row.classList.add('reverse');
          
          const imgWrap = document.createElement('div'); 
          imgWrap.className = 'article-media';
          
          const img = document.createElement('img');
          const imgSrc = fileMap[g.heading.innerText] || fallback(g.heading.innerText);
          img.src = imgSrc; 
          img.loading = 'lazy'; 
          img.alt = g.heading.innerText;
          
          img.onerror = () => { 
            img.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22200%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f3f3f3%22/><text x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 text-anchor=%22middle%22 fill=%22%23777%22 dy=%22.3em%22>صورة غير متوفرة</text></svg>'; 
          };
          
          imgWrap.appendChild(img);

          const text = document.createElement('div'); 
          text.className = 'article-text';
          text.appendChild(g.heading.cloneNode(true));
          g.nodes.forEach(n => text.appendChild(n.cloneNode(true)));

          row.appendChild(imgWrap); 
          row.appendChild(text);
          frag.appendChild(row);
        });

        articleContent.innerHTML = '';
        articleContent.appendChild(frag);
      } catch (err) {
        console.error('Article transform failed, restoring original content', err);
        articleContent.innerHTML = originalHTML;
      }
    })();
  }

  // ===== ADVANCED INTERACTION EFFECTS =====
  
  // Optimized Parallax Scroll Effect with Throttling
  let lastScrollTime = 0;
  const scrollThrottle = 16; // ~60fps
  
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime < scrollThrottle) return;
    lastScrollTime = now;
    
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach(el => {
      const depth = parseFloat(el.getAttribute('data-parallax')) || 0.5;
      const offset = scrolled * depth;
      el.style.willChange = 'transform';
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });

  // Enhanced Scroll Reveal with Intersection Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        if (entry.target.hasAttribute('data-once')) {
          revealObserver.unobserve(entry.target);
        }
      } else {
        if (!entry.target.hasAttribute('data-once')) {
          entry.target.classList.remove('in-view');
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  });

  // Observe all reveal elements
  document.querySelectorAll('.reveal, [data-animate]').forEach(el => {
    revealObserver.observe(el);
  });

  // Stagger animation for list items
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll(':scope > *');
        items.forEach((item, index) => {
          item.style.setProperty('--stagger-delay', `${index * 0.1}s`);
          item.classList.add('stagger-in');
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-stagger]').forEach(el => {
    staggerObserver.observe(el);
  });

  // Enhanced Mouse Tracking for Cards
  const trackingCards = document.querySelectorAll('[data-tracking]');
  trackingCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      
      card.style.willChange = 'transform';
      card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(0)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  // Enhanced Ripple Effect with Position Tracking
  document.querySelectorAll('button, .btn, [role="button"]').forEach(button => {
    button.addEventListener('click', (e) => {
      if (button.classList.contains('btn-ripple')) return; // Avoid duplicate ripples
      
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        pointer-events: none;
        animation: ripple 0.6s ease-out;
      `;
      
      button.style.position = 'relative';
      button.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Text Shimmer Animation on Interaction
  document.querySelectorAll('[data-shimmer]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.classList.add('shimmer-loading');
    });
    
    el.addEventListener('mouseleave', () => {
      el.classList.remove('shimmer-loading');
    });
  });

  // Keyboard Navigation Enhancement
  document.addEventListener('keydown', (e) => {
    // Tab key: Enhanced focus styles
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // Lazy Load Images with Blur-Up Effect
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
          imageObserver.unobserve(img);
        }
      }
    });
  }, { threshold: 0.01 });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });

  // Performance: Unobserve elements after animation completes
  const cleanupObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && entry.target.classList.contains('in-view')) {
        // Element is no longer in view and has been animated
        // Safe to stop observing for performance
      }
    });
  });

  // Add smooth scroll offset adjustment
  const handleAnchorClick = (e) => {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', handleAnchorClick);
  });

  // Element Fade-In on Scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Mouse Tracking for Cards
  const cards = document.querySelectorAll('[data-tracking]');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      card.style.setProperty('--mouse-x', x);
      card.style.setProperty('--mouse-y', y);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', 0.5);
      card.style.setProperty('--mouse-y', 0.5);
    });
  });

  // Add Ripple Effect to Buttons
  document.querySelectorAll('button, .btn, [role="button"]').forEach(button => {
    button.classList.add('btn-ripple');
    
    button.addEventListener('click', e => {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'ripple 0.6s ease-out';
      
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Text Shimmer Effect on Hover
  document.querySelectorAll('[data-shimmer]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.classList.add('shimmer-loading');
    });
    
    el.addEventListener('mouseleave', () => {
      el.classList.remove('shimmer-loading');
    });
  });

  // Stagger Animation for Lists
  document.querySelectorAll('[data-stagger] > *').forEach((item, index) => {
    item.style.animationDelay = (index * 0.1) + 's';
    item.classList.add('stagger-item', 'slide-in-left');
  });

});

// Image optimization: ensure lazy loading and async decoding for better performance
(function imageOptimization(){
  function optimize() {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
      // ensure images are lazy-loaded unless marked as critical
      if (!img.hasAttribute('loading')) {
        if (img.closest('.article-content') || img.classList.contains('article-img')) {
          img.loading = 'eager';
          img.setAttribute('fetchpriority','high');
        } else {
          img.loading = 'lazy';
          img.setAttribute('fetchpriority','low');
        }
      }
      // decoding async helps render faster
      if (!img.hasAttribute('decoding')) img.decoding = 'async';
      // small accessibility: ensure alt text exists
      if (!img.getAttribute('alt')) img.setAttribute('alt','صورة');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimize);
  } else {
    optimize();
  }
})();

// Insert 2-3 images into each pest section for visual appeal
(function insertSectionImages(){
  const imgs = [
    'images/cockroach.svg','images/bedbug.svg','images/rodent.svg',
    'images/mosquito.svg','images/ant.svg','images/termite.svg',
    'images/flea.svg','images/fly.svg','images/silverfish.svg','images/pantry.svg'
  ];

  function pickImages(n, avoidIndex) {
    const out = [];
    for (let i=0; i<n; i++) {
      const idx = (avoidIndex + i) % imgs.length;
      out.push(imgs[idx]);
    }
    return out;
  }

  function ensureGallery(section, srcs) {
    let wrap = section.querySelector('.pest-gallery');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'pest-gallery';
      wrap.style.display = 'flex';
      wrap.style.gap = '12px';
      wrap.style.marginTop = '12px';
      wrap.style.flexWrap = 'wrap';
      const media = section.querySelector('.pest-media') || section.querySelector('.pest-media-item') || section;
      media.parentNode && media.parentNode.insertBefore(wrap, media.nextSibling);
    }
    // add images
    srcs.forEach(s => {
      const img = document.createElement('img');
      img.src = s;
      img.alt = section.querySelector('h3') ? section.querySelector('h3').innerText + ' صورة' : 'صورة';
      img.loading = 'lazy';
      img.style.width = '120px';
      img.style.height = '96px';
      img.style.objectFit = 'contain';
      img.style.borderRadius = '8px';
      img.style.background = '#fff';
      img.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)';
      wrap.appendChild(img);
    });
  }

  function run() {
    const sections = document.querySelectorAll('.pest-section');
    sections.forEach((sec, i) => {
      // if section already has many images, skip
      const existing = sec.querySelectorAll('.pest-gallery img');
      if (existing && existing.length >= 2) return;
      const picked = pickImages(3, i);
      ensureGallery(sec, picked.slice(0,2)); // add 2 images for compact layout
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();

// Ensure each pest section has 2-3 images for visual consistency
(function seedSectionImages(){
  const imagesPool = [
    'images/service-spray.svg','images/service-inspection.svg','images/service-follow-up.svg',
    'images/cockroach-detail.svg','images/mosquito-detail.svg','images/rodent-detail.svg',
    'images/gallery-1.jpg','images/gallery-2.jpg','images/gallery-3.png',
    'images/case-study-1.jpeg','images/case-study-2.png','images/case-study-3.webp',
    'images/ant.svg','images/bedbug.svg','images/flea.svg','images/fly.svg','images/mosquito.svg','images/rodent.svg'
  ];

  function pickImages(idx, count){
    const out = [];
    for(let i=0;i<count;i++) out.push(imagesPool[(idx + i) % imagesPool.length]);
    return out;
  }

  document.querySelectorAll('.pest-section').forEach((sec, idx) => {
    // count existing imgs inside section
    const existingImgs = sec.querySelectorAll('img');
    if (existingImgs.length >= 2) return; // already ok

    const needed = Math.max(2, Math.min(3, 3 - existingImgs.length));
    const imgs = pickImages(idx, needed);

    const mediaWrap = sec.querySelector('.pest-media') || (() => {
      const d = document.createElement('div'); d.className = 'pest-media'; sec.insertBefore(d, sec.firstChild); return d;
    })();

    imgs.forEach(src => {
      const im = document.createElement('img');
      im.src = src; im.alt = sec.querySelector('h3') ? sec.querySelector('h3').innerText + ' - صورة' : 'صورة';
      im.loading = 'lazy'; im.decoding = 'async'; im.className = 'section-thumb';
      mediaWrap.appendChild(im);
    });
  });
})();

// ===== ADVANCED NAVIGATION EFFECTS =====
// تأثيرات ديناميكية للـ Navigation
document.addEventListener('DOMContentLoaded', () => {
  // Smooth active nav link indicator
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.style.color = 'var(--accent)';
      link.style.background = 'rgba(255, 107, 0, 0.15)';
    }
  });

  // Floating buttons pulse effect
  const floatingBtns = document.querySelectorAll('.floating-btn');
  floatingBtns.forEach((btn, idx) => {
    btn.style.animation = `slideInBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s both`;
  });

  // Page scroll blur effect
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
      nav.style.boxShadow = '0 12px 50px rgba(13, 93, 13, 0.35)';
    } else {
      nav.style.boxShadow = '0 12px 40px rgba(13, 93, 13, 0.25)';
    }
  });

  // Animated counter for stats (if needed)
  const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.innerText = target;
        clearInterval(interval);
      } else {
        element.innerText = Math.floor(current);
      }
    }, 16);
  };

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply observer to elements
  document.querySelectorAll('.article-content, .pest-section, .page-top').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // ===== ADVANCED INTERACTIVE EFFECTS =====
  // 1. Ripple effect on buttons
  document.querySelectorAll('button, a.btn, .location-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      if (this.style.position !== 'relative') {
        this.style.position = 'relative';
      }
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // 2. Enhanced scroll animations for article content
  const articleContent = document.querySelector('.article-content');
  if (articleContent) {
    const contentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'scaleIn 0.8s ease-out forwards';
          entry.target.style.opacity = '1';
        }
      });
    }, { threshold: 0.1 });
    
    contentObserver.observe(articleContent);
  }

  // 3. Text underline animation on hover for links
  document.querySelectorAll('.article-content a').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.backgroundImage = 'linear-gradient(90deg, rgba(255, 107, 0, 0.3) 0%, transparent 100%)';
      this.style.backgroundPosition = '0 100%';
      this.style.backgroundSize = '100% 2px';
      this.style.backgroundRepeat = 'no-repeat';
      this.style.transition = 'all 0.3s ease';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.backgroundImage = 'none';
    });
  });

  // 4. Parallax effect on scroll for headers
  window.addEventListener('scroll', () => {
    const pageTop = document.querySelector('.page-top');
    if (pageTop && window.scrollY < 400) {
      pageTop.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      pageTop.style.opacity = `${Math.max(0, 1 - window.scrollY / 600)}`;
    }
  });

  // 5. Enhanced floating buttons with better animation
  const floatingButtons = document.querySelectorAll('.floating-btn, .location-btn');
  floatingButtons.forEach((btn, index) => {
    btn.style.animation = `slideInBounce 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.12}s both`;
    
    // Add hover glow effect
    btn.addEventListener('mouseenter', function() {
      this.style.filter = 'drop-shadow(0 0 12px rgba(255, 107, 0, 0.6))';
      this.style.transform = 'scale(1.1)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.filter = 'drop-shadow(0 0 0px rgba(255, 107, 0, 0))';
      this.style.transform = 'scale(1)';
    });
  });

  // 6. Progress indicator for article reading
  const existingProgressBar = document.querySelector('.progress-bar');
  if (!existingProgressBar) {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    });
  }

  // 7. Smooth scroll behavior for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 8. Add momentum scrolling smoothness
  let lastScrollTime = 0;
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime > 50) {
      lastScrollTime = now;
      // Update UI elements smoothly during scroll
    }
  }, { passive: true });

  // 9. Auto-hide nav on scroll down, show on scroll up
  let lastScrollTop = 0;
  const navbar = document.querySelector('nav');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (navbar) {
      if (scrollTop > 100) {
        navbar.style.boxShadow = '0 15px 50px rgba(13, 93, 13, 0.35)';
      } else {
        navbar.style.boxShadow = '0 12px 40px rgba(13, 93, 13, 0.25)';
      }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });

  // 10. Add cursor effects on interactive elements
  document.querySelectorAll('a, button, .location-btn, .floating-btn').forEach(el => {
    el.addEventListener('mouseenter', function() {
      document.body.style.cursor = 'pointer';
    });
  });
});


