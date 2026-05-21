// Cargar contenido individual del post desde JSON estático
(function() {
  const loader  = document.getElementById('postLoader');
  const content = document.getElementById('postContent');
  const error   = document.getElementById('postError');

  const urlParams = new URLSearchParams(window.location.search);
  const postId    = urlParams.get('id');

  if (!postId) { showError(); return; }

  function showError() {
    if (loader)  loader.style.display  = 'none';
    if (content) content.style.display = 'none';
    if (error)   error.style.display   = 'block';
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  async function loadPost() {
    try {
      const res = await fetch('assets/data/posts.json');
      if (!res.ok) throw new Error('No se pudo cargar posts.json');

      const data = await res.json();
      const post = data.posts.find(p => p.id === postId);

      if (!post) { showError(); return; }

      const { titulo, categoria, fecha, lectura, excerpt, imagen, contenido } = post;

      document.getElementById('pageTitle').textContent    = titulo + ' - Redes x Tefi';
      document.getElementById('pageDescription').content  = excerpt || titulo;
      document.getElementById('postCategory').textContent = categoria;
      document.getElementById('postTitle').textContent    = titulo;
      document.getElementById('postDate').textContent     = formatDate(fecha);
      document.getElementById('postReading').textContent  = lectura;

      var currentUrl = window.location.href;
      var baseUrl    = window.location.origin;
      var imageUrl   = imagen || (baseUrl + '/assets/img/logo_rxT.png');

      function setMeta(id, val) { var el = document.getElementById(id); if (el) el.content = val; }
      setMeta('ogUrl',              currentUrl);
      setMeta('ogTitle',            titulo);
      setMeta('ogDescription',      excerpt || titulo);
      setMeta('ogImage',            imageUrl);
      setMeta('twitterUrl',         currentUrl);
      setMeta('twitterTitle',       titulo);
      setMeta('twitterDescription', excerpt || titulo);
      setMeta('twitterImage',       imageUrl);

      var imgWrap = document.getElementById('postImage');
      if (imgWrap && imagen) {
        imgWrap.innerHTML = '<img src="' + imagen + '" alt="' + titulo + '">';
      }

      var body = document.getElementById('postBody');
      if (body) {
        body.innerHTML = contenido || ('<p>' + excerpt + '</p>');
      }

      if (loader)  loader.style.display  = 'none';
      if (content) content.style.display = 'block';

    } catch (err) {
      console.error('Error cargando post:', err);
      showError();
    }
  }

  loadPost();
})();

// === FUNCIONES DE COMPARTIR ===

function shareOnWhatsApp() {
  var url   = window.location.href;
  var title = document.getElementById('postTitle').textContent;
  window.open('https://wa.me/?text=' + encodeURIComponent(title + ' - ' + url), '_blank');
}

function shareOnTwitter() {
  var url   = window.location.href;
  var title = document.getElementById('postTitle').textContent;
  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url), '_blank');
}

function shareOnFacebook() {
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank');
}

function copyLink() {
  var url    = window.location.href;
  var button = event.target.closest('.blog-share__btn--copy');
  var btnTxt = button ? button.querySelector('.blog-share__btn-text') : null;

  navigator.clipboard.writeText(url).then(function() {
    if (btnTxt) {
      var orig = btnTxt.textContent;
      btnTxt.textContent = '¡Copiado!';
      button.classList.add('copied');
      setTimeout(function() { btnTxt.textContent = orig; button.classList.remove('copied'); }, 2000);
    }
  }).catch(function() { alert('No se pudo copiar el enlace'); });
}
