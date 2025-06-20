// API Configuration - Sử dụng environment variable hoặc fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Types cho Library data
export interface Library {
  _id: string;
  libraryId: string;
  libraryCode: string;
  libraryTitle?: string;
  bookTitle?: string;
  title: string;
  authors: string[];
  category: string;
  coverImage: string;
  documentType: string;
  seriesName: string;
  isNewBook: boolean;
  isFeaturedBook: boolean;
  isAudioBook: boolean;
  totalBooks: number;
  rating?: number;
  borrowCount: number;
  publishYear?: number;
  generatedCode: string;
  description?: {
    linkEmbed: string;
    content: string;
  };
  introduction?: {
    linkEmbed: string;
    content: string;
  };
  audioBook?: {
    linkEmbed: string;
    content: string;
  };
}

// API functions
export const libraryAPI = {
  // Lấy tất cả sách
  getAllBooks: async (): Promise<Library[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/libraries/books`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all books:', error);
      throw error;
    }
  },

  // Lấy sách nổi bật
  getFeaturedBooks: async (limit: number = 4): Promise<Library[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/libraries/featured-books?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch featured books');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured books:', error);
      throw error;
    }
  },

  // Lấy sách mới
  getNewBooks: async (limit: number = 4): Promise<Library[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/libraries/new-books?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch new books');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching new books:', error);
      throw error;
    }
  },

  // Lấy sách nói
  getAudioBooks: async (limit: number = 4): Promise<Library[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/libraries/audio-books?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch audio books');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching audio books:', error);
      throw error;
    }
  },

  // Lấy chi tiết sách theo slug
  getBookDetailBySlug: async (slug: string): Promise<Library> => {
    try {
      const response = await fetch(`${API_BASE_URL}/libraries/books/detail/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch book detail');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching book detail:', error);
      throw error;
    }
  },

  // Lấy sách liên quan
  getRelatedBooks: async (category: string, limit: number = 10): Promise<Library[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/libraries/books/related?category=${encodeURIComponent(category)}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch related books');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching related books:', error);
      throw error;
    }
  }
}; 