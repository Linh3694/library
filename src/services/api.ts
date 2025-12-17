import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

// Frappe API configuration - Sử dụng environment variable hoặc fallback
const FRAPPE_BASE_URL = import.meta.env.VITE_FRAPPE_URL || 'https://admin.sis.wellspring.edu.vn';

// Standard API response type
export interface StandardApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: FRAPPE_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Parse Frappe API response
  private parseResponse<T>(axiosResponse: AxiosResponse): StandardApiResponse<T> {
    const { data, status } = axiosResponse;

    // Frappe trả về message object
    if (data && typeof data === 'object' && 'message' in data) {
      const messageData = data.message;
      
      // Check if message contains success/data structure
      if (messageData && typeof messageData === 'object') {
        if ('success' in messageData) {
          return {
            success: messageData.success,
            data: messageData.data,
            message: messageData.message,
            errors: messageData.errors,
            code: messageData.code,
          };
        }
        
        // Direct data in message
        return {
          success: status >= 200 && status < 300,
          data: messageData as T,
          message: 'Success',
        };
      }
    }

    // Fallback
    return {
      success: status >= 200 && status < 300,
      data: data as T,
      message: 'Success',
    };
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<StandardApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.get(url, { params });
      return this.parseResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data?: unknown): Promise<StandardApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.client.post(url, data);
      return this.parseResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError<T>(error: unknown): StandardApiResponse<T> {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          data?: {
            success?: boolean;
            message?: string;
            errors?: unknown;
          };
        };
        message?: string;
      };

      const responseData = axiosError.response?.data;
      if (responseData) {
        return {
          success: false,
          message: responseData.message || axiosError.message || 'An error occurred',
          errors: responseData.errors as Record<string, string[]> | undefined,
        };
      }
    }

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'An error occurred',
    };
  }
}

export const apiService = new ApiService();
export default apiService;
