// Menu API Service
import { MenuResponse, MenuItem, MenuLocation } from "@/types/menu";

const API_BASE_URL = 'https://weqaya-api-v1.runasp.net/api';

class MenuApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Menu API request failed:', error);
      throw error;
    }
  }

  async getMenus(
    date: string,
    options?: { category?: number; available?: number; page?: number; pageSize?: number }
  ): Promise<MenuResponse[]> {
    const formattedDate = new Date(date).toISOString();
    const params = new URLSearchParams({ date: formattedDate });
    if (options?.category != null) params.set('category', String(options.category));
    if (options?.available != null) params.set('available', String(options.available));
    if (options?.page != null) params.set('page', String(options.page));
    if (options?.pageSize != null) params.set('pageSize', String(options.pageSize));
    return this.makeRequest<MenuResponse[]>(`/Nutrition/menus?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getMenuItem(menuId: number): Promise<MenuResponse> {
    return this.makeRequest<MenuResponse>(`/Nutrition/menus/${menuId}`, {
      method: 'GET',
    });
  }
}

export const menuApi = new MenuApiService();
