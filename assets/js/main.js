function toggleMenu(){const m=document.querySelector('.mobile');const b=document.querySelector('.burger');if(!m||!b)return;const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');}
// === Lightbox for gallery ===
(function(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  const img = lb.querySelector('.lightbox__img');
  const pager = lb.querySelector('.lightbox__pager');
  const closeBtn = lb.querySelector('.lightbox__close');
  function openLightbox(src, alt){
    img.src = src; img.alt = alt || "Imagen ampliada";
    lb.classList.add('open'); document.body.style.overflow='hidden';
  }
  function closeLightbox(){
    lb.classList.remove('open'); document.body.style.overflow='';
    img.removeAttribute('src');
  }
  document.addEventListener('click', (e)=>{
    const t = e.target;
    if(t.matches('.gallery img')){
      openLightbox(t.getAttribute('src'), t.getAttribute('alt'));
    }else if(t === lb || t === closeBtn){
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeLightbox();
  });
})();

// === Lightbox navigation with arrows ===
(function(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  const img = lb.querySelector('.lightbox__img');
  const pager = lb.querySelector('.lightbox__pager');
  const closeBtn = lb.querySelector('.lightbox__close');
  const prevBtn = lb.querySelector('.lightbox__prev');
  const nextBtn = lb.querySelector('.lightbox__next');

  const galleryImgs = Array.from(document.querySelectorAll('.gallery img'));
  let currentIndex = -1;

  function openLightbox(src, alt, index){
    img.src = src; img.alt = alt || "Imagen ampliada";
    lb.classList.add('open'); document.body.style.overflow='hidden';
    currentIndex = index;
  }

  function closeLightbox(){
    lb.classList.remove('open'); document.body.style.overflow='';
    img.removeAttribute('src');
    currentIndex = -1;
  }

  function showIndex(i){
    const el = galleryImgs[i];
    if(el) openLightbox(el.src, el.alt, i);
  }

  function prevImage(){ if(currentIndex > 0) showIndex(currentIndex - 1); }
  function nextImage(){ if(currentIndex < galleryImgs.length - 1) showIndex(currentIndex + 1); }

  document.addEventListener('click', (e)=>{
    const t = e.target;
    if(t.matches('.gallery img')){
      const i = galleryImgs.indexOf(t);
      openLightbox(t.getAttribute('src'), t.getAttribute('alt'), i);
    }else if(t === lb || t === closeBtn){
      closeLightbox();
    }else if(t === prevBtn){ prevImage(); }
    else if(t === nextBtn){ nextImage(); }
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeLightbox();
    else if(e.key === 'ArrowLeft') prevImage();
    else if(e.key === 'ArrowRight') nextImage();
  });
})();


// === Gallery Lightbox with navigation ===
(function(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  const img = lb.querySelector('.lightbox__img');
  const pager = lb.querySelector('.lightbox__pager');
  const closeBtn = lb.querySelector('.lightbox__close');
  const prevBtn = lb.querySelector('.lightbox__prev');
  const nextBtn = lb.querySelector('.lightbox__next');
  const nodes = Array.from(document.querySelectorAll('.gallery img'));
  const sources = nodes.map(n => ({src:n.getAttribute('src'), alt:n.getAttribute('alt')||'Imagen'}));
  let LB_INDEX = -1;

  function showAt(i){
    if(pager) pager.textContent = ((i + sources.length) % sources.length + 1) + '/' + sources.length;
    if(sources.length===0) return;
    LB_INDEX = (i + sources.length) % sources.length;
    img.src = sources[LB_INDEX].src;
    updatePagination();
    img.alt = sources[LB_INDEX].alt;
    lb.classList.add('open'); document.body.style.overflow='hidden';
  }
  function closeLB(){
    lb.classList.remove('open'); document.body.style.overflow='';
    img.removeAttribute('src');
  }
  document.addEventListener('click', (e)=>{
    const t = e.target;
    if(t.matches('.gallery img')){
      const idx = nodes.indexOf(t);
      showAt(idx);
    }else if(t === lb || t === closeBtn){
      closeLB();
    }else if(t === prevBtn){
      showAt(LB_INDEX - 1);
    }else if(t === nextBtn){
      showAt(LB_INDEX + 1);
    }
  });
  document.addEventListener('keydown', (e)=>{
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') closeLB();
    if(e.key === 'ArrowLeft') showAt(LB_INDEX - 1);
    if(e.key === 'ArrowRight') showAt(LB_INDEX + 1);
  });
})();

// === Mobile menu tap active color ===
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenu = document.querySelector('.mobile ul');
  if (!mobileMenu) return;
  mobileMenu.addEventListener('touchstart', function(e) {
    const li = e.target.closest('li');
    if (!li) return;
    // Quitar clase activa de otros li
    mobileMenu.querySelectorAll('li').forEach(el => el.classList.remove('active-tap'));
    // Agregar clase activa al li tocado
    li.classList.add('active-tap');
  });
  // Opcional: quitar color al tocar fuera
  document.body.addEventListener('touchstart', function(e) {
    if (!e.target.closest('.mobile ul')) {
      mobileMenu.querySelectorAll('li').forEach(el => el.classList.remove('active-tap'));
    }
  });

  // === Carrusel Galería ===
  const carouselImgs = [
    'assets/img/DSC9243.webp',
    'assets/img/DSC9248.webp',
    'assets/img/TEF0519.webp',
    'assets/img/TEF0624.webp',
    'assets/img/TEF0680.webp',
    'assets/img/TEF0691.webp',
    'assets/img/TEF0700.webp',
    'assets/img/TEF0717.webp',
    'assets/img/TEF0722.webp',
    'assets/img/TEF0813.webp'
  ];
  const carouselAlts = [
    'Galería DSC9243',
    'Galería DSC9248',
    'Galería TEF0519',
    'Galería TEF0624',
    'Galería TEF0680',
    'Galería TEF0691',
    'Galería TEF0700',
    'Galería TEF0717',
    'Galería TEF0722',
    'Galería TEF0813'
  ];
  let carouselIndex = 0;
  const imgEl = document.querySelector('.carousel__img');
  const prevBtn = document.querySelector('.carousel__prev');
  const nextBtn = document.querySelector('.carousel__next');
  const pagEl = document.querySelector('.carousel__pagination');

  function updateCarousel() {
    if (!imgEl) return;
    imgEl.src = carouselImgs[carouselIndex];
    imgEl.alt = carouselAlts[carouselIndex];
    if (pagEl) pagEl.textContent = (carouselIndex + 1) + ' / ' + carouselImgs.length;
  }
  if (prevBtn) prevBtn.addEventListener('click', function() {
    carouselIndex = (carouselIndex - 1 + carouselImgs.length) % carouselImgs.length;
    updateCarousel();
  });
  if (nextBtn) nextBtn.addEventListener('click', function() {
    carouselIndex = (carouselIndex + 1) % carouselImgs.length;
    updateCarousel();
  });
  updateCarousel();
  // Scroll al top al hacer click en #brand-name
  var brand = document.getElementById('brand-name');
  if (brand) {
    brand.addEventListener('click', function(e) {
      e.preventDefault();
        // Forzar scroll al top absoluto
        if (window.scrollTo) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        } else {
          window.scroll(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
    });
  }
});

  const pag = lb.querySelector('.lightbox__pagination');
  function updatePagination() {
    pag.textContent = (LB_INDEX + 1) + " / " + sources.length;
  }
