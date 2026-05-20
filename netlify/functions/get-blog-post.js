// Función serverless para obtener un post individual de Notion
const { Client } = require('@notionhq/client');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const postId = event.queryStringParameters?.id;
  if (!postId) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Falta el parámetro id' }) };
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    // Obtener metadata del post
    const page = await notion.pages.retrieve({ page_id: postId });
    const props = page.properties;

    // Obtener bloques de contenido
    const blocksResponse = await notion.blocks.children.list({ block_id: postId });
    const blocks = blocksResponse.results || [];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        id: page.id,
        titulo: props.Título?.title[0]?.plain_text || '',
        slug: props.Slug?.rich_text[0]?.plain_text || '',
        categoria: props.Categoría?.select?.name || '',
        fecha: props.Fecha?.date?.start || '',
        lectura: props.Lectura?.rich_text[0]?.plain_text || '',
        excerpt: props.Excerpt?.rich_text[0]?.plain_text || '',
        imagen: props.Imagen?.files[0]?.file?.url || props.Imagen?.files[0]?.external?.url || '',
        blocks,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error al obtener el post', details: error.message }),
    };
  }
};
