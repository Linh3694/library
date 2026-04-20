// Import new service
import {
  publicLibraryService,
  type PublicLibraryTitle,
  type PublicLibraryEvent,
  type PublicLookupItem,
  type ActivitiesApiResponse as ServiceActivitiesApiResponse,
  type BookIntroductionsApiResponse,
  type PublicBookIntroduction,
  type PublicBookCopy
} from '../services/publicLibraryService';

// Re-export types from service
export type Library = PublicLibraryTitle;
export type LibraryActivity = PublicLibraryEvent;
export type LookupItem = PublicLookupItem;
export type ActivitiesApiResponse = ServiceActivitiesApiResponse;
export type BookIntroduction = PublicBookIntroduction;
export type BookCopy = PublicBookCopy;

// API functions - Using new Frappe backend
export const libraryAPI = {
  // Lấy danh mục public (document_type, series)
  getLookups: async (type: string = ""): Promise<LookupItem[]> => {
    try {
      const response = await publicLibraryService.getPublicLookups(type);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch lookups');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching lookups:', error);
      throw error;
    }
  },

  // Lấy tất cả libraries (limit = 0 để lấy toàn bộ)
  getAllLibraries: async (): Promise<Library[]> => {
    try {
      const response = await publicLibraryService.getAllTitles(0, 1);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch libraries');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching all libraries:', error);
      throw error;
    }
  },

  // Lấy tất cả sách (limit = 0 để lấy toàn bộ)
  getAllBooks: async (): Promise<Library[]> => {
    try {
      const response = await publicLibraryService.getAllTitles(0, 1);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch books');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching all books:', error);
      throw error;
    }
  },

  // Lấy sách nổi bật
  getFeaturedBooks: async (limit: number = 4): Promise<Library[]> => {
    try {
      const response = await publicLibraryService.getFeaturedTitles(limit);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch featured books');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching featured books:', error);
      throw error;
    }
  },

  // Lấy sách mới
  getNewBooks: async (limit: number = 4): Promise<Library[]> => {
    try {
      const response = await publicLibraryService.getNewTitles(limit);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch new books');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching new books:', error);
      throw error;
    }
  },

  // Lấy sách nói
  getAudioBooks: async (limit: number = 4): Promise<Library[]> => {
    try {
      const response = await publicLibraryService.getAudioTitles(limit);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch audio books');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching audio books:', error);
      throw error;
    }
  },

  // Lấy chi tiết sách theo slug
  getBookDetailBySlug: async (slug: string): Promise<Library> => {
    try {
      const response = await publicLibraryService.getTitleBySlug(slug);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch book detail');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching book detail:', error);
      throw error;
    }
  },

  // Lấy sách liên quan với nhiều tiêu chí
  getRelatedBooks: async (
    excludeId: string = '',
    category: string = '',
    seriesName: string = '',
    documentType: string = '',
    authors: string[] = [],
    limit: number = 10
  ): Promise<Library[]> => {
    try {
      const response = await publicLibraryService.getRelatedTitles(
        excludeId,
        category,
        seriesName,
        documentType,
        authors,
        limit
      );
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch related books');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching related books:', error);
      throw error;
    }
  },

  // Activities API functions
  getActivities: async (page: number = 1, limit: number = 20): Promise<ActivitiesApiResponse> => {
    try {
      const response = await publicLibraryService.getEvents(page, limit);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch activities');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Không thể kết nối đến server');
    }
  },

  // Lấy danh sách bài giới thiệu sách
  getBookIntroductions: async (page: number = 1, limit: number = 12, featuredOnly: boolean = false): Promise<BookIntroductionsApiResponse> => {
    try {
      const response = await publicLibraryService.getBookIntroductions(page, limit, featuredOnly);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch book introductions');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching book introductions:', error);
      throw error;
    }
  },

  // Lấy danh sách bản sao của sách
  getBookCopies: async (titleId: string): Promise<BookCopy[]> => {
    try {
      const response = await publicLibraryService.getBookCopies(titleId);
      if (!response.success || !response.data) {
        throw new Error('Failed to fetch book copies');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching book copies:', error);
      throw error;
    }
  }
};