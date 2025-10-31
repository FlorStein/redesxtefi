// === PAGE LOADER ===
(function() {
  const loader = document.getElementById('pageLoader');
  const percentElement = document.getElementById('loaderPercent');
  const progressBar = document.getElementById('loaderProgress');
  
  // Validar que existen los elementos
  if (!loader || !percentElement || !progressBar) {
    console.error('Loader elements not found');
    return;
  }
  
  let progress = 0;
  let isPageLoaded = false;
  let counter;
  
  // Función para ocultar el loader
  function hideLoader() {
    clearInterval(counter);
    progress = 100;
    percentElement.textContent = '100';
    progressBar.style.width = '100%';
    
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 300);
  }
  
  // Incremento más lento para duración más larga
  const interval = 80;
  
  // Animar el contador con velocidad variable
  counter = setInterval(() => {
    // Ralentizar el progreso a medida que se acerca al 100%
    let increment;
    if (progress < 40) {
      increment = 1.5;
    } else if (progress < 70) {
      increment = 0.8;
    } else if (progress < 90) {
      increment = 0.4;
    } else if (progress < 95) {
      increment = 0.3;
    } else {
      increment = 0.5; // Continuar progresando
    }
    
    progress += increment;
    
    // Completar cuando la página carga y estamos cerca del final
    if (isPageLoaded && progress >= 90) {
      hideLoader();
      return;
    }
    
    // Forzar completar al llegar a 100
    if (progress >= 100) {
      hideLoader();
      return;
    }
    
    // Actualizar el porcentaje y la barra
    percentElement.textContent = Math.floor(progress);
    progressBar.style.width = progress + '%';
  }, interval);
  
  // Cuando la página termine de cargar
  window.addEventListener('load', () => {
    isPageLoaded = true;
  });
  
  // Timeout de seguridad: forzar completar después de 5 segundos
  setTimeout(() => {
    hideLoader();
  }, 5000);
})();

function toggleMenu(){
  const m=document.querySelector('.mobile');
  const b=document.querySelector('.burger');
  if(!m||!b)return;
  const o=m.classList.toggle('open');
  b.setAttribute('aria-expanded',o?'true':'false');
  // Prevenir scroll del body cuando el menú está abierto
  document.body.style.overflow = o ? 'hidden' : '';
}

// Cerrar menú al hacer clic en un enlace (para navegación suave)
document.addEventListener('DOMContentLoaded', function() {
  const mobileLinks = document.querySelectorAll('.mobile a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Pequeño delay para que la navegación se complete
      setTimeout(() => {
        const m = document.querySelector('.mobile');
        const b = document.querySelector('.burger');
        if(m && m.classList.contains('open')) {
          m.classList.remove('open');
          b.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }, 100);
    });
  });
});
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

  // === Instagram Reel Gallery - Una foto a la vez con zoom ===
  const reel = document.getElementById('instagramReel');
  const reelItems = document.querySelectorAll('.reel-item');
  const reelImages = document.querySelectorAll('.instagram-reel img');
  const indicatorsContainer = document.getElementById('reelIndicators');
  const prevBtn = document.getElementById('reelPrevBtn');
  const nextBtn = document.getElementById('reelNextBtn');
  
  if (reel && reelItems.length > 0 && indicatorsContainer) {
    let currentIndex = 0;
    let lightboxIndex = 0;
    
    // Crear lightbox modal con navegación
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <button class="lightbox-arrow lightbox-arrow--prev" aria-label="Anterior">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div class="lightbox-content">
        <img src="" alt="Imagen ampliada">
        <p class="lightbox-caption"></p>
      </div>
      <button class="lightbox-arrow lightbox-arrow--next" aria-label="Siguiente">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      <div class="lightbox-indicators"></div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrevBtn = lightbox.querySelector('.lightbox-arrow--prev');
    const lightboxNextBtn = lightbox.querySelector('.lightbox-arrow--next');
    const lightboxIndicators = lightbox.querySelector('.lightbox-indicators');
    
    // Crear indicadores del lightbox
    reelItems.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'lightbox-indicator';
      if (index === 0) dot.classList.add('active');
      lightboxIndicators.appendChild(dot);
    });
    
    const lightboxDots = lightbox.querySelectorAll('.lightbox-indicator');
    
    // Función para actualizar la imagen en el lightbox
    const updateLightboxImage = (index) => {
      if (index < 0) index = reelItems.length - 1;
      if (index >= reelItems.length) index = 0;
      
      lightboxIndex = index;
      
      // Obtener la imagen y su caption del mismo reel-item
      const currentItem = reelItems[index];
      const currentImg = currentItem.querySelector('img');
      const currentCaption = currentItem.querySelector('.reel-caption');
      
      if (currentImg) {
        lightboxImg.src = currentImg.src;
        lightboxImg.alt = currentImg.alt;
      }
      
      // Actualizar el texto descriptivo
      if (currentCaption) {
        lightboxCaption.textContent = currentCaption.textContent;
      }
      
      // Actualizar indicadores
      lightboxDots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      // Actualizar visibilidad de flechas
      lightboxPrevBtn.style.opacity = reelItems.length > 1 ? '1' : '0';
      lightboxNextBtn.style.opacity = reelItems.length > 1 ? '1' : '0';
    };
    
    // Crear indicadores
    reelItems.forEach((item, index) => {
      const indicator = document.createElement('div');
      indicator.className = 'reel-indicator';
      if (index === 0) indicator.classList.add('active');
      indicator.dataset.index = index;
      
      // Click en indicador para scroll a imagen
      indicator.addEventListener('click', () => {
        navigateToImage(index);
      });
      
      indicatorsContainer.appendChild(indicator);
    });
    
    // Función para navegar a una imagen específica
    const navigateToImage = (index) => {
      if (index < 0 || index >= reelItems.length) return;
      currentIndex = index;
      const targetItem = reelItems[index];
      targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      updateActiveIndicator();
    };
    
    // Actualizar indicador activo
    const updateActiveIndicator = () => {
      document.querySelectorAll('.reel-indicator').forEach((indicator, index) => {
        if (index === currentIndex) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    };
    
    // Actualizar índice actual durante scroll
    let scrollTimeout;
    reel.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollLeft = reel.scrollLeft;
        const reelWidth = reel.offsetWidth;
        currentIndex = Math.round(scrollLeft / reelWidth);
        updateActiveIndicator();
      }, 100);
    });
    
    // Flechas de navegación (solo desktop)
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        navigateToImage(currentIndex - 1);
      });
      
      nextBtn.addEventListener('click', () => {
        navigateToImage(currentIndex + 1);
      });
    }
    
    // Click en imagen para abrir lightbox (zoom)
    reelImages.forEach((img, index) => {
      img.addEventListener('click', function() {
        lightboxIndex = index;
        updateLightboxImage(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    
    // Navegación en el lightbox
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxImage(lightboxIndex - 1);
    });
    
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxImage(lightboxIndex + 1);
    });
    
    // Cerrar lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowLeft') {
          updateLightboxImage(lightboxIndex - 1);
        } else if (e.key === 'ArrowRight') {
          updateLightboxImage(lightboxIndex + 1);
        }
      }
    });
    
    // Soporte táctil para deslizar en el lightbox
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Deslizar a la izquierda (siguiente)
        updateLightboxImage(lightboxIndex + 1);
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Deslizar a la derecha (anterior)
        updateLightboxImage(lightboxIndex - 1);
      }
    };
    
    // Inicializar indicador activo
    updateActiveIndicator();
  }

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
