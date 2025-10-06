// Chat API Types and Interfaces

export enum ChatType {
  PreventiveConsultation = 1,
  NutritionAdvice = 2,
  GeneralHealth = 3
}

export enum MessageRole {
  User = 1,
  Assistant = 2,
  System = 3
}

export interface SendMessageRequest {
  message: string;           // Required, max 2000 characters
  conversationId?: number;   // Optional, for continuing existing conversation
  chatType?: ChatType;       // Optional, defaults to PreventiveConsultation
}

export interface ChatResponse {
  conversationId: number;
  assistantMessage: string;
  timestamp: string;          // ISO 8601 format
  suggestedQuestions: string[];
  isNewConversation: boolean;
}

export interface ConversationResponse {
  id: number;
  title: string;
  type: ChatType;
  createdAt: string;         // ISO 8601 format
  updatedAt: string;         // ISO 8601 format
  isActive: boolean;
  messageCount: number;
  lastMessage: string;
  lastMessageTime: string;   // ISO 8601 format
}

export interface MessageResponse {
  id: number;
  role: MessageRole;         // 1=User, 2=Assistant, 3=System
  content: string;
  timestamp: string;          // ISO 8601 format
  isRead: boolean;
}

export interface ConversationDetailResponse {
  id: number;
  title: string;
  type: ChatType;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  messages: MessageResponse[];
}

export interface CreateConversationRequest {
  title: string;             // Required, max 200 characters
  type: ChatType;            // Required
}

export interface CreateConversationResponse {
  id: number;
  title: string;
  type: ChatType;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  messageCount: number;
  lastMessage: string;
  lastMessageTime: string;
}

export interface ApiError {
  type?: string;
  title?: string;
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;             // Optional, default: 1
  pageSize?: number;         // Optional, default: 10
}

// Frontend-specific types for UI state management
export interface ChatState {
  conversations: ConversationResponse[];
  currentConversation: ConversationDetailResponse | null;
  loading: boolean;
  error: string | null;
  sendingMessage: boolean;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isRead?: boolean;
  role?: MessageRole;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  conversationId: number;
}
