import { useState, useEffect, useCallback } from 'react';
import { chatApi } from '@/services/chatApi';
import { 
  ConversationResponse, 
  ConversationDetailResponse, 
  ChatResponse, 
  ChatType, 
  Message,
  MessageRole,
  ChatState 
} from '@/types/chat';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    currentConversation: null,
    loading: false,
    error: null,
    sendingMessage: false
  });

  // Load user conversations
  const loadConversations = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const conversations = await chatApi.getConversations();
      setState(prev => ({ ...prev, conversations, loading: false }));
    } catch (error) {
      const errorMessage = chatApi.handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  // Load specific conversation
  const loadConversation = useCallback(async (conversationId: number) => {
    console.log('useChat: Loading conversation', conversationId);
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const conversation = await chatApi.getConversation(conversationId);
      console.log('useChat: Conversation loaded', conversation);
      setState(prev => ({ ...prev, currentConversation: conversation, loading: false }));
    } catch (error) {
      console.error('useChat: Error loading conversation', error);
      const errorMessage = chatApi.handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (
    message: string, 
    conversationId?: number, 
    chatType: ChatType = ChatType.PreventiveConsultation
  ): Promise<ChatResponse | null> => {
    setState(prev => ({ ...prev, sendingMessage: true, error: null }));
    
    try {
      const response = await chatApi.sendMessage({
        message,
        conversationId,
        chatType
      });

      // If it's a new conversation, refresh the conversations list
      if (response.isNewConversation) {
        await loadConversations();
      }

      // Load the updated conversation
      await loadConversation(response.conversationId);

      setState(prev => ({ ...prev, sendingMessage: false }));
      return response;
    } catch (error) {
      const errorMessage = chatApi.handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage, sendingMessage: false }));
      return null;
    }
  }, [loadConversations, loadConversation]);

  // Create new conversation
  const createConversation = useCallback(async (title: string, type: ChatType) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const newConversation = await chatApi.createConversation({ title, type });
      await loadConversations();
      setState(prev => ({ ...prev, loading: false }));
      return newConversation;
    } catch (error) {
      const errorMessage = chatApi.handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return null;
    }
  }, [loadConversations]);

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await chatApi.deleteConversation(conversationId);
      await loadConversations();
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      const errorMessage = chatApi.handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, [loadConversations]);

  // Mark message as read
  const markMessageAsRead = useCallback(async (messageId: number) => {
    try {
      await chatApi.markMessageAsRead(messageId);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  }, []);

  // Get suggested questions
  const getSuggestedQuestions = useCallback(async (conversationId: number): Promise<string[]> => {
    try {
      return await chatApi.getSuggestedQuestions(conversationId);
    } catch (error) {
      console.error('Failed to get suggested questions:', error);
      return [];
    }
  }, []);

  // Convert API messages to UI messages
  const convertToUIMessages = useCallback((messages: any[]): Message[] => {
    return messages.map(msg => ({
      id: msg.id.toString(),
      text: msg.content,
      isUser: msg.role === MessageRole.User,
      timestamp: new Date(msg.timestamp),
      isRead: msg.isRead,
      role: msg.role
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Set current conversation
  const setCurrentConversation = useCallback((conversation: ConversationDetailResponse | null) => {
    setState(prev => ({ ...prev, currentConversation: conversation }));
  }, []);

  return {
    ...state,
    loadConversations,
    loadConversation,
    sendMessage,
    createConversation,
    deleteConversation,
    markMessageAsRead,
    getSuggestedQuestions,
    convertToUIMessages,
    clearError,
    setCurrentConversation
  };
};
