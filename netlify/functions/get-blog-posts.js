// Función serverless para obtener posts de Notion
const { Client } = require('@notionhq/client');

exports.handler = async (event, context) => {
  // Configurar headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Manejar preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Inicializar cliente de Notion
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });

    const databaseId = process.env.NOTION_DATABASE_ID;

    // Obtener posts de la base de datos
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Publicado',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Fecha',
          direction: 'descending',
        },
      ],
    });

    // Formatear los resultados
    const posts = response.results.map(page => {
      const properties = page.properties;

      return {
        id: page.id,
        titulo: properties.Título?.title[0]?.plain_text || '',
        slug: properties.Slug?.rich_text[0]?.plain_text || '',
        categoria: properties.Categoría?.select?.name || '',
        fecha: properties.Fecha?.date?.start || '',
        lectura: properties.Lectura?.rich_text[0]?.plain_text || '',
        excerpt: properties.Excerpt?.rich_text[0]?.plain_text || '',
        imagen: properties.Imagen?.files[0]?.file?.url || properties.Imagen?.files[0]?.external?.url || '',
        url: page.url,
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ posts }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error al obtener los posts', details: error.message }),
    };
  }
};
