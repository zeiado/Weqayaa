import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WeqayaLogo } from "./WeqayaLogo";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Send, Mic, Camera, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { Message, ChatType } from "@/types/chat";
import { FeedbackManager } from "@/utils/feedbackManager";
import { useTheme } from "next-themes";

interface AIChatProps {
  onBack: () => void;
  conversationId?: number;
}

export const AIChat = ({ onBack, conversationId }: AIChatProps) => {
  const [inputText, setInputText] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>(conversationId);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const { theme } = useTheme();
  
  const {
    currentConversation,
    loading,
    error,
    sendingMessage,
    sendMessage,
    loadConversation,
    convertToUIMessages,
    getSuggestedQuestions,
    clearError
  } = useChat();

  // Convert API messages to UI messages
  const apiMessages = currentConversation ? convertToUIMessages(currentConversation.messages) : [];
  
  // Use local messages if we have them, otherwise use API messages
  const messages = localMessages.length > 0 ? localMessages : apiMessages;

  // Debug logging
  console.log('AIChat Debug:', {
    conversationId,
    currentConversationId,
    currentConversation,
    apiMessages,
    localMessages,
    messages,
    loading,
    error
  });

  // Load conversation if conversationId is provided
  useEffect(() => {
    if (conversationId && conversationId !== currentConversationId) {
      console.log('Loading conversation:', conversationId);
      setCurrentConversationId(conversationId);
      loadConversation(conversationId);
    }
  }, [conversationId, currentConversationId, loadConversation]);

  // Load suggested questions when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      getSuggestedQuestions(currentConversationId).then(setSuggestedQuestions);
    }
  }, [currentConversationId, getSuggestedQuestions]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || sendingMessage) return;

    // Play feedback for message sent
    FeedbackManager.feedbackMessageSent();

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    // Add user message to UI immediately for better UX
    setLocalMessages(prev => [...prev, userMessage]);
    const messageText = inputText;
    setInputText("");

    try {
      const response = await sendMessage(messageText, currentConversationId, ChatType.PreventiveConsultation);
      
      if (response) {
        setCurrentConversationId(response.conversationId);
        setSuggestedQuestions(response.suggestedQuestions);
        
        // Play feedback for message received
        FeedbackManager.feedbackMessageReceived();
        
        // Load the updated conversation to get the assistant's response
        await loadConversation(response.conversationId);
        
        // Clear local messages and use API messages
        setLocalMessages([]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Play error feedback
      FeedbackManager.feedbackError();
      // Remove the user message if sending failed
      setLocalMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    // Play feedback for button press
    FeedbackManager.vibrateLight();
    setInputText(question);
  };

  const quickActions = [
    "اقترح لي وجبة صحية",
    "احسب احتياجي من السعرات",
    "ما أفضل وجبة للإفطار؟",
    "نصائح لزيادة الوزن"
  ];

  // Show welcome message only if no conversation is loaded and no messages
  const displayMessages = (messages.length === 0 && !currentConversationId) ? [
    {
      id: "welcome",
      text: "السلام عليكم! أنا مستشار وقاية الذكي. كيف يمكنني مساعدتك في تحسين نظامك الغذائي اليوم؟",
      isUser: false,
      timestamp: new Date()
    }
  ] : messages;

  return (
    <div className="min-h-screen bg-gradient-wellness relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-primary-glow/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary-glow/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Header 
        onBack={onBack}
        showBackButton={true}
        title="مستشار وقاية الذكي"
      />

      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-6 h-[calc(100vh-120px)] flex flex-col relative z-10">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-right">
              {error}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                className="mr-2 text-xs"
              >
                إغلاق
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 mb-4 sm:mb-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Loading state for conversation */}
            {loading && currentConversationId && displayMessages.length === 0 && (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-muted-foreground">جاري تحميل المحادثة...</span>
                </div>
              </div>
            )}
            
            {displayMessages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-start' : 'justify-end'} animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${message.isUser ? '' : 'flex-row-reverse'}`}>
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className={`w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-white/20 shadow-lg ${
                      message.isUser ? 'ring-primary/30' : 'ring-secondary/30'
                    }`}>
                      <AvatarFallback className={`text-sm font-bold ${
                        message.isUser 
                          ? 'bg-gradient-primary text-white' 
                          : 'bg-gradient-secondary text-white'
                      }`}>
                        {message.isUser ? 'أ' : 'و'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator for AI */}
                    {!message.isUser && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`relative group ${
                    message.isUser ? 'ml-1' : 'mr-1'
                  }`}>
                    <Card className={`p-3 sm:p-4 shadow-lg border-0 transition-all duration-300 hover:shadow-xl ${
                      message.isUser 
                        ? 'bg-gradient-primary text-white ml-auto' 
                        : 'bg-white dark:bg-gray-800 backdrop-blur-sm text-foreground mr-auto border border-border'
                    }`}>
                      <p className="text-sm sm:text-base leading-relaxed font-medium text-right">{message.text}</p>
                      
                      {/* Message timestamp */}
                      <div className={`text-xs mt-2 opacity-70 ${
                        message.isUser ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </Card>
                    
                    {/* Message tail */}
                    <div className={`absolute top-4 w-0 h-0 ${
                      message.isUser 
                        ? 'right-[-8px] border-l-[8px] border-l-primary border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent'
                        : 'left-[-8px] border-r-[8px] border-r-white/90 dark:border-r-gray-800/90 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {sendingMessage && (
              <div className="flex justify-end animate-fade-in">
                <div className="flex items-start gap-3 max-w-[80%] flex-row-reverse">
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-secondary/30 shadow-lg">
                    <AvatarFallback className="bg-gradient-secondary text-white text-sm font-bold">
                      و
                    </AvatarFallback>
                  </Avatar>
                  <Card className="bg-white dark:bg-gray-800 backdrop-blur-sm p-3 sm:p-4 shadow-lg border border-border">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-sm text-muted-foreground mr-2">يكتب...</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {displayMessages.length === 1 && (
          <div className="mb-4 sm:mb-6 animate-fade-in">
            <div className="text-center mb-3 sm:mb-4">
              <p className="text-sm text-muted-foreground font-medium">أو اختر من الأسئلة الشائعة:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-sm h-auto py-2 sm:py-3 px-3 sm:px-4 bg-background border-border hover:bg-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 group text-right"
                  onClick={() => handleSuggestedQuestion(action)}
                >
                  <span className="group-hover:text-primary transition-colors duration-300">{action}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && displayMessages.length > 1 && (
          <div className="mb-4 sm:mb-6 animate-fade-in">
            <div className="text-center mb-3 sm:mb-4">
              <p className="text-sm text-muted-foreground font-medium">أسئلة مقترحة:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-sm h-auto py-2 sm:py-3 px-3 sm:px-4 bg-background border-border hover:bg-secondary/10 hover:border-secondary/30 hover:shadow-md transition-all duration-300 group text-right"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  <span className="group-hover:text-secondary transition-colors duration-300">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 shadow-lg border border-border">
          <div className="flex gap-2 sm:gap-3 items-end">
            {/* Action Buttons */}
            <div className="flex gap-1 sm:gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
              >
                <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background/50 hover:bg-secondary/10 hover:border-secondary/30 transition-all duration-300"
              >
                <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              </Button>
            </div>
            
            {/* Input Field */}
            <div className="flex-1 relative">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                className="text-right text-sm bg-background/50 border-border focus:border-primary focus:ring-primary/20 rounded-xl pr-10 sm:pr-12 py-2 sm:py-3 text-foreground"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={sendingMessage}
              />
              <Button 
                onClick={handleSendMessage} 
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-gradient-primary hover:shadow-lg shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                disabled={sendingMessage || !inputText.trim()}
              >
                {sendingMessage ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-white" />
                ) : (
                  <Send className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Character count */}
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>متاح 24/7</span>
            <span>{inputText.length}/2000</span>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};