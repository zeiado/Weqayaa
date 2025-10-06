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

interface AIChatProps {
  onBack: () => void;
  conversationId?: number;
}

export const AIChat = ({ onBack, conversationId }: AIChatProps) => {
  const [inputText, setInputText] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>(conversationId);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  
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

  // Load conversation if conversationId is provided
  useEffect(() => {
    if (conversationId && conversationId !== currentConversationId) {
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
        
        // Load the updated conversation to get the assistant's response
        await loadConversation(response.conversationId);
        
        // Clear local messages and use API messages
        setLocalMessages([]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the user message if sending failed
      setLocalMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  const quickActions = [
    "اقترح لي وجبة صحية",
    "احسب احتياجي من السعرات",
    "ما أفضل وجبة للإفطار؟",
    "نصائح لزيادة الوزن"
  ];

  // Show welcome message if no conversation is loaded
  const displayMessages = messages.length === 0 ? [
    {
      id: "welcome",
      text: "السلام عليكم! أنا مستشار وقاية الذكي. كيف يمكنني مساعدتك في تحسين نظامك الغذائي اليوم؟",
      isUser: false,
      timestamp: new Date()
    }
  ] : messages;

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <Header 
        onBack={onBack}
        showBackButton={true}
        title="مستشار وقاية الذكي"
      />

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 h-[calc(100vh-120px)] flex flex-col">
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
          <div className="space-y-3 sm:space-y-4">
            {displayMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-start' : 'justify-end'} mb-3 sm:mb-4`}
              >
                <div className={`flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${message.isUser ? '' : 'flex-row-reverse'}`}>
                  <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                    <AvatarFallback className={`text-xs sm:text-sm ${message.isUser ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                      {message.isUser ? 'أ' : 'و'}
                    </AvatarFallback>
                  </Avatar>
                  <Card className={`p-3 sm:p-4 ${
                    message.isUser 
                      ? 'bg-primary text-white ml-auto' 
                      : 'glass-card mr-auto'
                  }`}>
                    <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {displayMessages.length === 1 && (
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 text-center">أو اختر من الأسئلة الشائعة:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 px-3"
                  onClick={() => handleSuggestedQuestion(action)}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && displayMessages.length > 1 && (
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 text-center">أسئلة مقترحة:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 px-3"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" size="icon" className="shrink-0 w-8 h-8 sm:w-10 sm:h-10">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0 w-8 h-8 sm:w-10 sm:h-10">
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="flex-1 flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              className="text-right text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={sendingMessage}
            />
            <Button 
              onClick={handleSendMessage} 
              className="bg-gradient-primary shrink-0 w-8 h-8 sm:w-10 sm:h-10"
              disabled={sendingMessage || !inputText.trim()}
            >
              {sendingMessage ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};