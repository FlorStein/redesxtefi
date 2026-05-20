// Cargar contenido individual del post desde Notion
(function() {
  const NOTION_TOKEN = window.NOTION_CONFIG?.token || '';
  
  console.log('Blog Post - Token presente:', !!NOTION_TOKEN);
  
  const loader = document.getElementById('postLoader');
  const content = document.getElementById('postContent');
  const error = document.getElementById('postError');

  // Obtener ID del post de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  console.log('Post ID:', postId);

  if (!postId) {
    console.error('No se encontró ID de post en la URL');
    showError();
    return;
  }

  function showError() {
    if (loader) loader.style.display = 'none';
    if (content) content.style.display = 'none';
    if (error) error.style.display = 'block';
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  // Convertir bloques de Notion a HTML
  function blockToHTML(block) {
    const type = block.type;
    const content = block[type];
    
    console.log('Procesando bloque:', { type, content });

    switch (type) {
      case 'paragraph':
        const pText = content?.rich_text?.map(t => t.plain_text).join('') || '';
        console.log('Párrafo:', pText);
        return pText ? `<p>${pText}</p>` : '';
      
      case 'heading_1':
        const h1Text = content?.rich_text?.map(t => t.plain_text).join('') || '';
        return h1Text ? `<h2>${h1Text}</h2>` : '';
      
      case 'heading_2':
        const h2Text = content?.rich_text?.map(t => t.plain_text).join('') || '';
        return h2Text ? `<h3>${h2Text}</h3>` : '';
      
      case 'heading_3':
        const h3Text = content?.rich_text?.map(t => t.plain_text).join('') || '';
        return h3Text ? `<h4>${h3Text}</h4>` : '';
      
      case 'bulleted_list_item':
        const liText = content?.rich_text?.map(t => t.plain_text).join('') || '';
        return liText ? `<li>${liText}</li>` : '';
      
      case 'numbered_list_item':
        const numText = content?.rich_text?.map(t => t.plain_text).join('') || '';
        return numText ? `<li>${numText}</li>` : '';
      
      case 'quote':
        const quoteText = content.rich_text.map(t => t.plain_text).join('');
        return `<blockquote>${quoteText}</blockquote>`;
      
      case 'code':
        const codeText = content.rich_text.map(t => t.plain_text).join('');
        return `<pre><code>${codeText}</code></pre>`;
      
      case 'image':
        const imageUrl = content.file?.url || content.external?.url;
        const caption = content.caption?.[0]?.plain_text || '';
        return imageUrl ? `<figure><img src="${imageUrl}" alt="${caption}"><figcaption>${caption}</figcaption></figure>` : '';
      
      case 'divider':
        return '<hr>';
      
      default:
        return '';
    }
  }

  async function loadPost() {
    try {
      const response = await fetch(`/.netlify/functions/get-blog-post?id=${postId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Error al cargar el post');
      }

      const data = await response.json();

      const titulo      = data.titulo  || 'Sin título';
      const categoria   = data.categoria || '';
      const fecha       = data.fecha    || '';
      const lectura     = data.lectura  || '';
      const excerpt     = data.excerpt  || '';
      const imagen      = data.imagen   || '';
      let   blocks      = data.blocks   || [];

      // Renderizar el post
      const currentUrl = window.location.href;
      const baseUrl = window.location.origin;

      // Asegurar que la imagen sea una URL absoluta
      let imageUrl = imagen;
      if (!imageUrl) {
        imageUrl = `${baseUrl}/assets/img/logo_rxT.png`;
      } else if (!imageUrl.startsWith('http')) {
        imageUrl = `${baseUrl}/${imageUrl.replace(/^\//, '')}`;
      }

      const description = excerpt || titulo;
      });
      
      document.getElementById('pageTitle').textContent = `${titulo} - Redes x Tefi`;
      document.getElementById('pageDescription').content = description;
      document.getElementById('postCategory').textContent = categoria;
      document.getElementById('postTitle').textContent = titulo;
      document.getElementById('postDate').textContent = formatDate(fecha);
      document.getElementById('postReading').textContent = lectura;
      
      // Meta tags Open Graph (con validación)
      const ogUrl = document.getElementById('ogUrl');
      const ogTitle = document.getElementById('ogTitle');
      const ogDescription = document.getElementById('ogDescription');
      const ogImage = document.getElementById('ogImage');
      
      if (ogUrl) ogUrl.content = currentUrl;
      if (ogTitle) ogTitle.content = titulo;
      if (ogDescription) ogDescription.content = description;
      if (ogImage) ogImage.content = imageUrl;
      
      // Meta tags Twitter (con validación)
      const twitterUrl = document.getElementById('twitterUrl');
      const twitterTitle = document.getElementById('twitterTitle');
      const twitterDescription = document.getElementById('twitterDescription');
      const twitterImage = document.getElementById('twitterImage');
      
      if (twitterUrl) twitterUrl.content = currentUrl;
      if (twitterTitle) twitterTitle.content = titulo;
      if (twitterDescription) twitterDescription.content = description;
      if (twitterImage) twitterImage.content = imageUrl;

      // Imagen destacada
      if (imagen) {
        document.getElementById('postImage').innerHTML = `<img src="${imagen}" alt="${titulo}">`;
      }

      // Convertir bloques a HTML
      let html = '';
      
      if (blocks.length > 0) {
        console.log('✅ Usando bloques de Notion -', blocks.length, 'bloques');
        let inList = false;
        let listType = '';

        blocks.forEach((block, index) => {
          const blockHTML = blockToHTML(block);
          
          // Manejar listas
          if (block.type === 'bulleted_list_item') {
            if (!inList) {
              html += '<ul>';
              inList = true;
              listType = 'ul';
            }
            html += blockHTML;
          } else if (block.type === 'numbered_list_item') {
            if (!inList) {
              html += '<ol>';
              inList = true;
              listType = 'ol';
            }
            html += blockHTML;
          } else {
            if (inList) {
              html += listType === 'ul' ? '</ul>' : '</ol>';
              inList = false;
            }
            html += blockHTML;
          }
        });

        // Cerrar lista si quedó abierta
        if (inList) {
          html += listType === 'ul' ? '</ul>' : '</ol>';
        }
      }
      
      if (blocks.length === 0) {
        // Si no hay bloques ni contenido, mostrar el excerpt
        console.log('⚠️ Solo mostrando excerpt');
        html = `<p>${excerpt}</p><p><em>Contenido completo próximamente...</em></p>`;
      } else {
        console.log('❌ No hay contenido disponible');
        html = `<p><em>Este artículo está en desarrollo. Vuelve pronto para ver el contenido completo.</em></p>`;
      }

      console.log('HTML generado:', html.substring(0, 200) + '...');
      document.getElementById('postBody').innerHTML = html;

      // Mostrar contenido
      console.log('Post cargado exitosamente');
      if (loader) loader.style.display = 'none';
      if (content) content.style.display = 'block';

    } catch (err) {
      console.error('Error completo:', err);
      console.error('Stack:', err.stack);
      showError();
    }
  }

  console.log('Iniciando carga del post...');

  loadPost();
})();

// === FUNCIONES DE COMPARTIR ===

function shareOnWhatsApp() {
  const url = window.location.href;
  const title = document.getElementById('postTitle').textContent;
  const text = `${title} - ${url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function shareOnTwitter() {
  const url = window.location.href;
  const title = document.getElementById('postTitle').textContent;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
}

function shareOnFacebook() {
  const url = window.location.href;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function copyLink() {
  const url = window.location.href;
  const button = event.target.closest('.blog-share__btn--copy');
  const buttonText = button.querySelector('.blog-share__btn-text');
  
  navigator.clipboard.writeText(url).then(() => {
    const originalText = buttonText.textContent;
    buttonText.textContent = '¡Copiado!';
    button.classList.add('copied');
    
    setTimeout(() => {
      buttonText.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('Error al copiar:', err);
    alert('No se pudo copiar el enlace');
  });
}
