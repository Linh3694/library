import { apiService, type StandardApiResponse } from './api';

const BASE = '/api/method/erp.api.erp_sis.library_view';

// Types cho public library
export interface PublicLibraryTitle {
  _id: string;
  libraryId: string;
  libraryCode: string;
  title: string;
  libraryTitle?: string;
  authors: string[];
  category: string;
  coverImage: string;
  documentType: string;
  seriesName: string;
  language: string;
  isNewBook: boolean;
  isFeaturedBook: boolean;
  isAudioBook: boolean;
  description?: {
    content?: string;
    linkEmbed?: string;
  };
  introduction?: {
    content?: string;
    linkEmbed?: string;
  };
  audioBook?: {
    content?: string;
    linkEmbed?: string;
  };
  publishYear?: number;
  borrowCount?: number;
  rating?: number;
  createdAt?: string;
  modifiedAt?: string;
}

export interface PublicLibraryEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  days: Array<{
    id?: string;
    day_number: number;
    date: string;
    title: string;
    description?: string;
    is_published: boolean;
    images: Array<{
      id?: string;
      url: string;
      caption?: string;
      uploaded_at?: string;
    }>;
  }>;
  images: Array<{
    id?: string;
    url: string;
    caption?: string;
    uploaded_at?: string;
  }>;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivitiesApiResponse {
  activities: PublicLibraryEvent[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface PublicBookIntroduction {
  _id: string;
  id: string;
  slug: string;
  title: string;
  description: string;
  content?: string;
  isFeatured: boolean;
  status: string;
  modifiedAt: string;
  createdBy?: string;
  relatedBook?: {
    id: string;
    title: string;
    library_code: string;
    cover_image: string;
    authors: string[];
    category: string;
    documentType?: string;
    seriesName?: string;
    language?: string;
    isNewBook?: boolean;
    isFeaturedBook?: boolean;
    isAudioBook?: boolean;
    description?: {
      content?: string;
      linkEmbed?: string;
    };
    introduction?: {
      content?: string;
      linkEmbed?: string;
    };
  };
}

export interface BookIntroductionsApiResponse {
  introductions: PublicBookIntroduction[];
  totalPages: number;
  currentPage: number;
  total: number;
}

class PublicLibraryService {
  /**
   * Lấy tất cả đầu sách
   */
  async getAllTitles(limit: number = 20, page: number = 1): Promise<StandardApiResponse<PublicLibraryTitle[]>> {
    return apiService.get<PublicLibraryTitle[]>(`${BASE}.list_public_titles`, { limit, page });
  }

  /**
   * Lấy chi tiết sách theo slug
   */
  async getTitleBySlug(slug: string): Promise<StandardApiResponse<PublicLibraryTitle>> {
    return apiService.get<PublicLibraryTitle>(`${BASE}.get_public_title_by_slug`, { slug });
  }

  /**
   * Lấy sách nổi bật
   */
  async getFeaturedTitles(limit: number = 4): Promise<StandardApiResponse<PublicLibraryTitle[]>> {
    return apiService.get<PublicLibraryTitle[]>(`${BASE}.list_featured_titles`, { limit });
  }

  /**
   * Lấy sách mới
   */
  async getNewTitles(limit: number = 4): Promise<StandardApiResponse<PublicLibraryTitle[]>> {
    return apiService.get<PublicLibraryTitle[]>(`${BASE}.list_new_titles`, { limit });
  }

  /**
   * Lấy sách nói
   */
  async getAudioTitles(limit: number = 4): Promise<StandardApiResponse<PublicLibraryTitle[]>> {
    return apiService.get<PublicLibraryTitle[]>(`${BASE}.list_audio_titles`, { limit });
  }

  /**
   * Lấy sách liên quan dựa trên nhiều tiêu chí
   */
  async getRelatedTitles(
    excludeId: string = '',
    category: string = '', 
    seriesName: string = '',
    documentType: string = '',
    authors: string[] = [],
    limit: number = 10
  ): Promise<StandardApiResponse<PublicLibraryTitle[]>> {
    return apiService.get<PublicLibraryTitle[]>(`${BASE}.list_related_titles`, { 
      exclude_id: excludeId,
      category, 
      series_name: seriesName,
      document_type: documentType,
      authors: JSON.stringify(authors),
      limit 
    });
  }

  /**
   * Lấy danh sách hoạt động/sự kiện
   */
  async getEvents(page: number = 1, limit: number = 20): Promise<StandardApiResponse<ActivitiesApiResponse>> {
    return apiService.get<ActivitiesApiResponse>(`${BASE}.list_public_events`, { page, limit });
  }

  /**
   * Lấy danh sách bài giới thiệu sách (chỉ published)
   */
  async getBookIntroductions(page: number = 1, limit: number = 12, featuredOnly: boolean = false): Promise<StandardApiResponse<BookIntroductionsApiResponse>> {
    return apiService.get<BookIntroductionsApiResponse>(`${BASE}.list_public_book_introductions`, { 
      page, 
      limit,
      featured_only: featuredOnly ? 1 : 0
    });
  }

  /**
   * Lấy chi tiết bài giới thiệu sách theo slug
   */
  async getBookIntroductionBySlug(slug: string): Promise<StandardApiResponse<PublicBookIntroduction>> {
    return apiService.get<PublicBookIntroduction>(`${BASE}.get_public_book_introduction_by_slug`, { slug });
  }

  /**
   * Lấy bài giới thiệu nổi bật
   */
  async getFeaturedIntroductions(limit: number = 3): Promise<StandardApiResponse<BookIntroductionsApiResponse>> {
    return this.getBookIntroductions(1, limit, true);
  }
}

export const publicLibraryService = new PublicLibraryService();
export default publicLibraryService;
