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
