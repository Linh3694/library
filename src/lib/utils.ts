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
  const BASE_URL = 'https://api-dev.wellspring.edu.vn';
  return `${BASE_URL}/${imagePath}`;
};
