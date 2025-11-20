// Blog dinámico con Notion (sin backend)
(function() {
  const blogGrid = document.querySelector('.blog-posts');
  const featuredPost = document.querySelector('.blog-post--featured');
  
  if (!blogGrid) return;

  // Configuración de Notion - Token desde variable global
  const NOTION_TOKEN = window.NOTION_CONFIG?.token || '';
  const DATABASE_ID = window.NOTION_CONFIG?.databaseId || '';

  // Función para formatear fecha
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  // Función para crear HTML de un post
  function createPostHTML(post, isFeatured = false) {
    if (isFeatured) {
      return `
        <div class="blog-post__image">
          <img src="${post.imagen || 'assets/img/flower-pattern.webp'}" alt="${post.titulo}" />
        </div>
        <div class="blog-post__content">
          <span class="blog-post__category">${post.categoria}</span>
          <h2 class="blog-post__title">${post.titulo}</h2>
          <p class="blog-post__excerpt">${post.excerpt}</p>
          <div class="blog-post__meta">
            <span class="blog-post__date">${formatDate(post.fecha)}</span>
            <span class="blog-post__reading">${post.lectura} de lectura</span>
          </div>
          <a href="${post.url}" class="btn">Leer más</a>
        </div>
      `;
    } else {
      return `
        <article class="blog-post">
          <div class="blog-post__image">
            <img src="${post.imagen || 'assets/img/flower-pattern.webp'}" alt="${post.titulo}" />
          </div>
          <div class="blog-post__content">
            <span class="blog-post__category">${post.categoria}</span>
            <h3 class="blog-post__title">${post.titulo}</h3>
            <p class="blog-post__excerpt">${post.excerpt}</p>
            <div class="blog-post__meta">
              <span class="blog-post__date">${formatDate(post.fecha)}</span>
              <span class="blog-post__reading">${post.lectura}</span>
            </div>
            <a href="${post.url}" class="blog-post__link">Leer más →</a>
          </div>
        </article>
      `;
    }
  }

  // Mostrar loader
  function showLoader() {
    if (featuredPost) {
      featuredPost.innerHTML = '<div class="blog-loader">Cargando posts...</div>';
    }
    blogGrid.innerHTML = '<div class="blog-loader">Cargando posts...</div>';
  }

  // Mostrar error
  function showError(message) {
    const errorHTML = `
      <div class="blog-error">
        <p>⚠️ ${message}</p>
        <p>Mostrando contenido de ejemplo.</p>
      </div>
    `;
    if (featuredPost) {
      featuredPost.style.display = 'none';
    }
    blogGrid.innerHTML = errorHTML;
  }

  // Cargar posts desde Notion usando CORS proxy
  async function loadPosts() {
    showLoader();

    // Verificar configuración
    if (!NOTION_TOKEN || !DATABASE_ID) {
      console.error('Configuración de Notion no encontrada');
      showError('Configuración de Notion no encontrada. Verifica notion-config.js');
      return;
    }

    console.log('Token presente:', !!NOTION_TOKEN);
    console.log('Database ID:', DATABASE_ID);

    try {
      // Usar un proxy CORS para hacer la petición a Notion
      const proxyUrl = 'https://corsproxy.io/?';
      const notionUrl = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;
      
      console.log('Haciendo petición a:', notionUrl);

      const response = await fetch(proxyUrl + encodeURIComponent(notionUrl), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'Publicado',
            checkbox: {
              equals: true
            }
          },
          sorts: [
            {
              property: 'Fecha',
              direction: 'descending'
            }
          ]
        })
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Respuesta de Notion:', data);
      console.log('Cantidad de resultados:', data.results?.length || 0);
      
      const posts = data.results.map(page => {
        const props = page.properties;
        return {
          id: page.id,
          titulo: props.Título?.title[0]?.plain_text || '',
          slug: props.Slug?.rich_text[0]?.plain_text || page.id,
          categoria: props.Categoría?.select?.name || '',
          fecha: props.Fecha?.date?.start || '',
          lectura: props.Lectura?.rich_text[0]?.plain_text || '',
          excerpt: props.Excerpt?.rich_text[0]?.plain_text || '',
          imagen: props.Imagen?.files[0]?.file?.url || props.Imagen?.files[0]?.external?.url || '',
          url: `blog-post.html?id=${page.id}`
        };
      });

      console.log('Posts procesados:', posts);

      if (!posts || posts.length === 0) {
        showError('No hay posts publicados aún');
        return;
      }

      // Mostrar el primer post como destacado
      if (featuredPost && posts[0]) {
        featuredPost.innerHTML = createPostHTML(posts[0], true);
      }

      // Mostrar el resto de posts en el grid
      const remainingPosts = posts.slice(1);
      if (remainingPosts.length > 0) {
        blogGrid.innerHTML = remainingPosts.map(post => createPostHTML(post)).join('');
      } else {
        blogGrid.innerHTML = '';
      }

    } catch (error) {
      console.error('Error completo:', error);
      console.error('Tipo de error:', error.name);
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
      showError(`⚠️ Error: ${error.message}`);
    }
  }

  // Cargar posts al iniciar
  loadPosts();
})();
