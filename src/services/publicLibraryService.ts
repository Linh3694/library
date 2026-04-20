import { apiService, type StandardApiResponse } from './api';
import { cache } from '../lib/cache';

const BASE = '/api/method/erp.api.erp_sis.library_view';

// Types cho public library
export interface PublicLibraryTitle {
  _id: string;
  libraryId: string;
  libraryCode: string;
  title: string;
  libraryTitle?: string;
  bookTitle?: string;
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
  totalBooks?: number;
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
  createdBy?: string;
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

export interface PublicLookupItem {
  id: string;
  code: string;
  type: string;
  name: string;
}

export interface PublicBookCopy {
  name: string;
  status: string;
  title_id: string;
  warehouse?: string;
  book_title?: string;
  publish_year?: number;
  series_name?: string;
  storage_location?: string;
}

class PublicLibraryService {
  /**
   * Lấy danh mục public (document_type, series)
   * @param type - "document_type" | "series" | "" (lấy cả 2)
   */
  async getPublicLookups(type: string = ""): Promise<StandardApiResponse<PublicLookupItem[]>> {
    const cacheKey = `library_lookups_${type}`;
    const cachedData = cache.get<PublicLookupItem[]>(cacheKey);

    if (cachedData) {
      return { success: true, data: cachedData };
    }

    const response = await apiService.get<PublicLookupItem[]>(`${BASE}.list_public_lookups`, { type });

    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 3600000); // 1 hour
    }

    return response;
  }

  /**
   * Lấy tất cả đầu sách
   * @param limit - Số lượng sách cần lấy. Nếu limit = 0, sẽ lấy toàn bộ sách
   * @param page - Trang hiện tại (dùng khi có limit)
   */
  async getAllTitles(limit: number = 20, page: number = 1): Promise<StandardApiResponse<PublicLibraryTitle[]>> {
    const cacheKey = `library_all_titles_${limit}_${page}`;
    const cachedData = cache.get<PublicLibraryTitle[]>(cacheKey);

    if (cachedData) {
      return { success: true, data: cachedData };
    }

    const response = await apiService.get<PublicLibraryTitle[]>(`${BASE}.list_public_titles`, { limit, page });

    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 600000); // 10 minutes
    }

    return response;
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
    const cacheKey = `library_featured_${limit}`;
    const cachedData = cache.get<PublicLibraryTitle[]>(cacheKey);

    if (cachedData) {
      return { success: true, data: cachedData };
    }

    const response = await apiService.get<PublicLibraryTitle[]>(`${BASE}.list_featured_titles`, { limit });

    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 300000); // 5 minutes
    }

    return response;
  }

  /**
   * Lấy sách mới
   */
  async getNewTitles(limit: number = 4): Promise<StandardApiResponse<PublicLibraryTitle[]>> {
    const cacheKey = `library_new_${limit}`;
    const cachedData = cache.get<PublicLibraryTitle[]>(cacheKey);

    if (cachedData) {
      return { success: true, data: cachedData };
    }

    const response = await apiService.get<PublicLibraryTitle[]>(`${BASE}.list_new_titles`, { limit });

    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 300000); // 5 minutes
    }

    return response;
  }

  /**
   * Lấy sách nói
   */
  async getAudioTitles(limit: number = 4): Promise<StandardApiResponse<PublicLibraryTitle[]>> {
    const cacheKey = `library_audio_${limit}`;
    const cachedData = cache.get<PublicLibraryTitle[]>(cacheKey);

    if (cachedData) {
      return { success: true, data: cachedData };
    }

    const response = await apiService.get<PublicLibraryTitle[]>(`${BASE}.list_audio_titles`, { limit });

    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 300000); // 5 minutes
    }

    return response;
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
    const cacheKey = `library_events_${page}_${limit}`;
    const cachedData = cache.get<ActivitiesApiResponse>(cacheKey);

    if (cachedData) {
      return { success: true, data: cachedData };
    }

    const response = await apiService.get<ActivitiesApiResponse>(`${BASE}.list_public_events`, { page, limit });

    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 600000); // 10 minutes
    }

    return response;
  }

  /**
   * Lấy danh sách bài giới thiệu sách (chỉ published)
   */
  async getBookIntroductions(page: number = 1, limit: number = 12, featuredOnly: boolean = false): Promise<StandardApiResponse<BookIntroductionsApiResponse>> {
    const cacheKey = `library_introductions_${page}_${limit}_${featuredOnly}`;
    const cachedData = cache.get<BookIntroductionsApiResponse>(cacheKey);

    if (cachedData) {
      return { success: true, data: cachedData };
    }

    const response = await apiService.get<BookIntroductionsApiResponse>(`${BASE}.list_public_book_introductions`, {
      page,
      limit,
      featured_only: featuredOnly ? 1 : 0
    });

    if (response.success && response.data) {
      cache.set(cacheKey, response.data, 600000); // 10 minutes
    }

    return response;
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

  /**
   * Lấy danh sách bản sao của một đầu sách
   */
  async getBookCopies(titleId: string): Promise<StandardApiResponse<PublicBookCopy[]>> {
    return apiService.get<PublicBookCopy[]>('/api/method/frappe.client.get_list', {
      doctype: 'SIS Library Book Copy',
      filters: JSON.stringify({ title_id: titleId }),
      fields: JSON.stringify(['name', 'status', 'warehouse', 'title_id', 'book_title', 'publish_year', 'series_name', 'storage_location'])
    });
  }
}

export const publicLibraryService = new PublicLibraryService();
export default publicLibraryService;
