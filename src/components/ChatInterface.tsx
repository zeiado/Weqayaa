import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Menu, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { ConversationList } from "./ConversationList";
import { AIChat } from "./AIChat";
import { ChatErrorBoundary } from "./ChatErrorBoundary";
import { ThemeToggle } from "./ThemeToggle";

interface ChatInterfaceProps {
  onBack: () => void;
}

export const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>();
  const [showConversationList, setShowConversationList] = useState(false);
  const [startNewChat, setStartNewChat] = useState(false);
  const { theme } = useTheme();

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setShowConversationList(false);
  };

  const handleBackToConversations = () => {
    setSelectedConversationId(undefined);
    setShowConversationList(true);
    setStartNewChat(false);
  };

  const handleBackToMain = () => {
    setSelectedConversationId(undefined);
    setShowConversationList(false);
    setStartNewChat(false);
    onBack();
  };

  const handleStartNewConversation = () => {
    setSelectedConversationId(undefined);
    setShowConversationList(false);
    setStartNewChat(true);
  };

  const handleViewConversations = () => {
    setShowConversationList(true);
  };

  // Show conversation list if requested
  if (showConversationList) {
    return (
      <ChatErrorBoundary>
        <ConversationList 
          onBack={handleBackToMain}
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversationId}
        />
      </ChatErrorBoundary>
    );
  }

  // Show chat interface if conversation is selected or starting new chat
  if (selectedConversationId || startNewChat) {
    return (
      <ChatErrorBoundary>
        <AIChat 
          onBack={startNewChat ? handleBackToMain : handleBackToConversations}
          conversationId={selectedConversationId}
        />
      </ChatErrorBoundary>
    );
  }

  // Main landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToMain}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مستشار وقاية الذكي</h1>
          </div>
          <ThemeToggle />
        </div>

        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Start New Conversation Card */}
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">بدء محادثة جديدة</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">ابدأ محادثة جديدة مع المستشار الذكي</p>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                  onClick={handleStartNewConversation}
                >
                  ابدأ الآن
                </Button>
              </div>
            </Card>

            {/* View Conversations Card */}
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Menu className="w-8 h-8 text-green-500 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">عرض المحادثات</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">عرض المحادثات السابقة</p>
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold py-3 rounded-lg transition-colors duration-200"
                  onClick={handleViewConversations}
                >
                  عرض المحادثات
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
