import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Menu } from "lucide-react";
import { ConversationList } from "./ConversationList";
import { AIChat } from "./AIChat";
import { ChatErrorBoundary } from "./ChatErrorBoundary";

interface ChatInterfaceProps {
  onBack: () => void;
}

export const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>();
  const [showConversationList, setShowConversationList] = useState(false);

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setShowConversationList(false);
  };

  const handleBackToConversations = () => {
    setSelectedConversationId(undefined);
    setShowConversationList(true);
  };

  const handleBackToMain = () => {
    setSelectedConversationId(undefined);
    setShowConversationList(false);
    onBack();
  };

  // If we're showing conversation list
  if (showConversationList) {
    return (
      <ChatErrorBoundary>
        <div className="min-h-screen bg-gradient-wellness">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToMain}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة
              </Button>
              <h1 className="text-xl font-semibold">المحادثات</h1>
            </div>
            
            <Card className="h-[calc(100vh-120px)]">
              <ConversationList
                onSelectConversation={handleSelectConversation}
                selectedConversationId={selectedConversationId}
              />
            </Card>
          </div>
        </div>
      </ChatErrorBoundary>
    );
  }

  // If we have a selected conversation or are starting a new chat, show the chat
  if (selectedConversationId !== undefined) {
    return (
      <ChatErrorBoundary>
        <div className="min-h-screen bg-gradient-wellness">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToConversations}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {selectedConversationId ? "المحادثات" : "العودة"}
              </Button>
              <h1 className="text-xl font-semibold">
                {selectedConversationId ? "المحادثة" : "محادثة جديدة"}
              </h1>
            </div>
            
            <Card className="h-[calc(100vh-120px)]">
              <div className="h-full">
                <AIChat onBack={handleBackToConversations} conversationId={selectedConversationId} />
              </div>
            </Card>
          </div>
        </div>
      </ChatErrorBoundary>
    );
  }

  // Default view - show options
  return (
    <ChatErrorBoundary>
      <div className="min-h-screen bg-gradient-wellness">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToMain}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
            <h1 className="text-xl font-semibold">مستشار وقاية الذكي</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
            {/* Start New Chat */}
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center"
              onClick={() => setSelectedConversationId(undefined)}
            >
              <MessageSquare className="w-16 h-16 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">بدء محادثة جديدة</h2>
              <p className="text-muted-foreground mb-4">
                ابدأ محادثة جديدة مع مستشار وقاية الذكي للحصول على نصائح صحية مخصصة
              </p>
              <Button className="bg-gradient-primary">
                بدء المحادثة
              </Button>
            </Card>

            {/* View Conversations */}
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center"
              onClick={() => setShowConversationList(true)}
            >
              <Menu className="w-16 h-16 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">عرض المحادثات</h2>
              <p className="text-muted-foreground mb-4">
                عرض وإدارة المحادثات السابقة مع المستشار الذكي
              </p>
              <Button variant="outline">
                عرض المحادثات
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </ChatErrorBoundary>
  );
};
