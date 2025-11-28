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
      console.log('Cargando post con ID:', postId);
      const proxyUrl = 'https://corsproxy.io/?';
      
      // 1. Obtener metadata del post
      const pageUrl = `https://api.notion.com/v1/pages/${postId}`;
      console.log('Fetching:', pageUrl);
      
      const pageResponse = await fetch(proxyUrl + encodeURIComponent(pageUrl), {
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
        }
      });

      console.log('Response status:', pageResponse.status);
      if (!pageResponse.ok) {
        const errorText = await pageResponse.text();
        console.error('Error response:', errorText);
        throw new Error('Error al cargar el post');
      }

      const pageData = await pageResponse.json();
      const props = pageData.properties;

      // Extraer datos
      const titulo = props.Título?.title[0]?.plain_text || 'Sin título';
      const categoria = props.Categoría?.select?.name || '';
      const fecha = props.Fecha?.date?.start || '';
      const lectura = props.Lectura?.rich_text[0]?.plain_text || '';
      const excerpt = props.Excerpt?.rich_text[0]?.plain_text || '';
      const contenidoTexto = props.Contenido?.rich_text?.map(t => t.plain_text).join('') || '';
      const imagen = props.Imagen?.files[0]?.file?.url || props.Imagen?.files[0]?.external?.url || '';
      
      console.log('Datos del post:', {
        titulo,
        categoria,
        fecha,
        lectura,
        'tiene excerpt': !!excerpt,
        'largo excerpt': excerpt?.length || 0,
        'tiene contenido': !!contenidoTexto,
        'largo contenido': contenidoTexto?.length || 0,
        'tiene imagen': !!imagen
      });

      // 2. Obtener contenido (bloques)
      let blocks = [];
      try {
        const blocksUrl = `https://api.notion.com/v1/blocks/${postId}/children`;
        const blocksResponse = await fetch(proxyUrl + encodeURIComponent(blocksUrl), {
          headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': '2022-06-28',
          }
        });

        if (blocksResponse.ok) {
          const blocksData = await blocksResponse.json();
          blocks = blocksData.results || [];
        }
      } catch (err) {
        console.log('No se pudo cargar el contenido completo, mostrando excerpt');
      }

      // Renderizar el post
      document.getElementById('pageTitle').textContent = `${titulo} - Redes x Tefi`;
      document.getElementById('pageDescription').content = titulo;
      document.getElementById('postCategory').textContent = categoria;
      document.getElementById('postTitle').textContent = titulo;
      document.getElementById('postDate').textContent = formatDate(fecha);
      document.getElementById('postReading').textContent = lectura;

      // Imagen destacada
      if (imagen) {
        document.getElementById('postImage').innerHTML = `<img src="${imagen}" alt="${titulo}">`;
      }

      // Convertir bloques a HTML
      let html = '';
      
      console.log('Decisión de contenido:', {
        'bloques disponibles': blocks.length,
        'tiene contenidoTexto': !!contenidoTexto,
        'tiene excerpt': !!excerpt
      });
      
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
        
        // Si los bloques no generaron contenido, intentar con la propiedad Contenido
        if (!html.trim() && contenidoTexto) {
          console.log('⚠️ Los bloques estaban vacíos, usando propiedad Contenido');
          blocks = []; // Forzar el siguiente if
        }
      }
      
      if (blocks.length === 0 && contenidoTexto) {
        // Si hay contenido en la propiedad Contenido, convertirlo a HTML
        console.log('✅ Usando contenido de la propiedad Contenido');
        console.log('Contenido completo:', contenidoTexto);
        
        // Procesar línea por línea respetando todos los saltos
        const lineas = contenidoTexto.split('\n');
        console.log('Total de líneas:', lineas.length);
        let htmlTemp = '';
        let enLista = false;
        
        lineas.forEach(linea => {
          linea = linea.trim();
          
          // Línea vacía = cerrar párrafo/lista y saltar
          if (!linea) {
            if (enLista) {
              htmlTemp += '</ul>';
              enLista = false;
            }
            htmlTemp += '<br>';
            return;
          }
          
          // Detectar títulos con números (1. , 2. , etc.)
          if (linea.match(/^\d+\.\s+/)) {
            if (enLista) {
              htmlTemp += '</ul>';
              enLista = false;
            }
            htmlTemp += `<h2>${linea}</h2>`;
            return;
          }
          
          // Detectar items de lista
          if (linea.startsWith('✔') || linea.startsWith('•') || linea.startsWith('❌')) {
            if (!enLista) {
              htmlTemp += '<ul>';
              enLista = true;
            }
            htmlTemp += `<li>${linea}</li>`;
            return;
          }
          
          // Detectar secciones con emoji o símbolos especiales
          if (linea.match(/^📌|^✔|^❌/)) {
            if (enLista) {
              htmlTemp += '</ul>';
              enLista = false;
            }
            htmlTemp += `<p class="highlight"><strong>${linea}</strong></p>`;
            return;
          }
          
          // Párrafo normal
          if (enLista) {
            htmlTemp += '</ul>';
            enLista = false;
          }
          htmlTemp += `<p>${linea}</p>`;
        });
        
        // Cerrar lista si quedó abierta
        if (enLista) {
          htmlTemp += '</ul>';
        }
        
        html = htmlTemp;
      } else if (excerpt) {
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
