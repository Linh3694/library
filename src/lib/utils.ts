import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to create URL slug from book title
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[áàạảãâấầậẩẫăắằặẳẵ]/g, 'a')
    .replace(/[éèẹẻẽêếềệểễ]/g, 'e')
    .replace(/[íìịỉĩ]/g, 'i')
    .replace(/[óòọỏõôốồộổỗơớờợởỡ]/g, 'o')
    .replace(/[úùụủũưứừựửữ]/g, 'u')
    .replace(/[ýỳỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function để xử lý đường dẫn ảnh từ Frappe
export const getImageUrl = (imagePath: string | undefined | null): string | undefined => {
  if (!imagePath || imagePath.trim() === '') {
    return undefined;
  }
  
  const cleanPath = imagePath.trim();
  
  // Nếu đã là URL đầy đủ (bắt đầu với http), trả về as-is
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }
  
  // Nếu bắt đầu với '/', đây có thể là:
  // 1. Static asset từ public folder (local)
  // 2. File path từ Frappe (cần thêm base URL)
  if (cleanPath.startsWith('/')) {
    // Nếu là file từ public folder local (không có /files/)
    if (!cleanPath.startsWith('/files/') && !cleanPath.startsWith('/private/')) {
      return cleanPath;
    }
  }
  
  // Ngược lại, đây là file từ Frappe server, thêm BASE_URL
  const BASE_URL = import.meta.env.VITE_FRAPPE_URL || 'https://admin.sis.wellspring.edu.vn';
  
  // Đảm bảo không có double slash
  const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  const finalUrl = `${BASE_URL}${finalPath}`;
  
  console.log('🖼️ [getImageUrl] Processing:', { imagePath, cleanPath, finalUrl });
  
  return finalUrl;
};
