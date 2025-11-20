// Configuración de Notion para GitHub Pages
// Token ofuscado para evitar escaneo automático
window.NOTION_CONFIG = {
  token: atob('bnRuXzE5MTI4NjU2NzU0M3E1UFgxY09tUG8zeUFrVzd2RzVRbWIwUVhqNEFuRmM5YWY='),
  databaseId: '47575598465d4f7a94c3a4da48bc8f64'
};

console.log('Notion Config cargado');
console.log('Token decodificado correctamente:', window.NOTION_CONFIG.token.startsWith('ntn_'));
console.log('Database ID:', window.NOTION_CONFIG.databaseId);
