// API Configuration - Sử dụng environment variable hoặc fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-dev.wellspring.edu.vn/api';

// Types cho Library response từ backend
interface LibraryResponse {
  _id: string;
  libraryCode: string;
  title: string;
  authors?: string[];
  category?: string;
  coverImage?: string;
  documentType?: string;
  seriesName?: string;
  language?: string;
  isNewBook?: boolean;
  isFeaturedBook?: boolean;
  isAudioBook?: boolean;
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
  borrowCount?: number;
  publishYear?: number;
  createdAt?: string;
  books?: Array<{
    _id?: string;
    generatedCode: string;
    title?: string;
    status: string;
    [key: string]: unknown;
  }>;
}

// Types cho Library data
export interface Library {
  _id: string;
  libraryId?: string;
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
  totalBooks?: number;
  rating?: number;
  borrowCount?: number;
  publishYear?: number;
  generatedCode?: string;
  language?: string;
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
  books?: Array<{
    _id?: string;
    generatedCode: string;
    title?: string;
    status: string;
    [key: string]: unknown;
  }>;
}

// Types cho Activities
export interface ActivityDay {
  _id?: string;
  dayNumber: number;
  date: string;
  title: string;
  description: string;
  images: Array<{
    _id?: string;
    url: string;
    caption?: string;
    uploadedAt?: string;
  }>;
}

export interface LibraryActivity {
  _id: string;
  title: string;
  description?: string;
  date: string;
  days: ActivityDay[];
  images: Array<{
    _id?: string;
    url: string;
    caption?: string;
    uploadedAt?: string;
  }>;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivitiesApiResponse {
  activities: LibraryActivity[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// API functions
export const libraryAPI = {
  // Lấy tất cả libraries
  getAllLibraries: async (): Promise<Library[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/libraries`);
      if (!response.ok) {
        throw new Error('Failed to fetch libraries');
      }
      const data = await response.json();
      
      // Transform data để đảm bảo có các trường cần thiết
      return data.map((library: LibraryResponse) => ({
        _id: library._id,
        libraryId: library._id,
        libraryCode: library.libraryCode,
        title: library.title,
        authors: library.authors || [],
        category: library.category || '',
        coverImage: library.coverImage || '',
        documentType: library.documentType || '',
        seriesName: library.seriesName || '',
        language: library.language || 'Tiếng Việt',
        isNewBook: library.isNewBook || false,
        isFeaturedBook: library.isFeaturedBook || false,
        isAudioBook: library.isAudioBook || false,
        description: library.description || { linkEmbed: '', content: '' },
        introduction: library.introduction || { linkEmbed: '', content: '' },
        audioBook: library.audioBook || { linkEmbed: '', content: '' },
        totalBooks: library.books ? library.books.length : 0,
        borrowCount: library.borrowCount || 0,
        publishYear: library.publishYear || new Date(library.createdAt || Date.now()).getFullYear(),
        rating: Math.floor(Math.random() * 5) + 1, // Random rating tạm thời
        generatedCode: library.libraryCode,
        books: library.books || []
      }));
    } catch (error) {
      console.error('Error fetching all libraries:', error);
      throw error;
    }
  },

  // Lấy tất cả sách (từ tất cả libraries)
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
  },

  // Activities API functions
  getActivities: async (page: number = 1, limit: number = 20): Promise<ActivitiesApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/library-activities?page=${page}&limit=${limit}&sortBy=date`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter activities: only published and with images
      const filteredActivities = data.activities.filter((activity: LibraryActivity) => {
        if (!activity.isPublished) {
          return false;
        }
        
        const hasMainImages = activity.images && activity.images.length > 0;
        const hasValidDays = activity.days && activity.days.some(day => {
          return day.images && day.images.length > 0;
        });
        
        return hasMainImages || hasValidDays;
      });
      
      // Sort activities by date (newest first)
      filteredActivities.sort((a: LibraryActivity, b: LibraryActivity) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      return {
        ...data,
        activities: filteredActivities,
        total: filteredActivities.length
      };
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Không thể kết nối đến server');
    }
  }
}; 