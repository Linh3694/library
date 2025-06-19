export const API_URL = 'https://api-dev.wellspring.edu.vn/api';

// URL cho static files và uploads từ server
export const BASE_URL = 'https://api-dev.wellspring.edu.vn';

// URL cho static assets của frontend (nếu cần)
export const ASSETS_URL = '';

// Helper function để xử lý đường dẫn ảnh
export const getImageUrl = (imagePath: string | undefined | null): string | undefined => {
  if (!imagePath) return undefined;
  
  // Nếu đã là URL đầy đủ (bắt đầu với http), trả về as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Nếu bắt đầu với '/', đây là static asset từ public folder
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Ngược lại, đây là file từ server uploads, thêm BASE_URL
  return `${BASE_URL}/${imagePath}`;
}; 