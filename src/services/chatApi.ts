// Chat API Service
import { 
  SendMessageRequest, 
  ChatResponse, 
  ConversationResponse, 
  ConversationDetailResponse,
  CreateConversationRequest,
  CreateConversationResponse,
  PaginationParams,
  ApiError,
  ChatType
} from '@/types/chat';

const API_BASE_URL = 'https://weqaya-api-v1.runasp.net/api';

class ChatApiService {
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
      console.error('Chat API request failed:', error);
      throw error;
    }
  }

  /**
   * Send a message to the AI health consultant
   */
  async sendMessage(request: SendMessageRequest): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/chat/send-message', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get user's conversations with pagination
   */
  async getConversations(params: PaginationParams = {}): Promise<ConversationResponse[]> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
    const endpoint = `/chat/conversations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<ConversationResponse[]>(endpoint);
  }

  /**
   * Get a specific conversation with all its messages
   */
  async getConversation(conversationId: number): Promise<ConversationDetailResponse> {
    return this.makeRequest<ConversationDetailResponse>(`/chat/conversations/${conversationId}`);
  }

  /**
   * Create a new conversation
   */
  async createConversation(request: CreateConversationRequest): Promise<CreateConversationResponse> {
    return this.makeRequest<CreateConversationResponse>('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Delete a conversation (soft delete)
   */
  async deleteConversation(conversationId: number): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/chat/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Mark a message as read
   */
  async markMessageAsRead(messageId: number): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/chat/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  /**
   * Get suggested questions for a conversation
   */
  async getSuggestedQuestions(conversationId: number): Promise<string[]> {
    return this.makeRequest<string[]>(`/chat/conversations/${conversationId}/suggested-questions`);
  }

  /**
   * Helper method to handle API errors
   */
  handleApiError(error: any): string {
    if (error.status === 401) {
      // Redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return 'تم انتهاء صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
    } else if (error.status === 404) {
      return 'المحادثة غير موجودة';
    } else if (error.status === 400) {
      return 'بيانات غير صحيحة. يرجى التحقق من المدخلات.';
    } else if (error.status === 500) {
      return 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.';
    } else {
      return error.message || 'حدث خطأ غير متوقع';
    }
  }
}

export const chatApi = new ChatApiService();
