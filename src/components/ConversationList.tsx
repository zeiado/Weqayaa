import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "next-themes";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  AlertCircle,
  Loader2,
  Trash2,
  ArrowLeft
} from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ConversationResponse, ChatType } from "@/types/chat";
import { FeedbackManager } from "@/utils/feedbackManager";

interface ConversationListProps {
  onBack: () => void;
  onSelectConversation: (conversationId: number) => void;
  selectedConversationId?: number;
}

export const ConversationList = ({ onBack, onSelectConversation, selectedConversationId }: ConversationListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState("");
  const [newConversationType, setNewConversationType] = useState<ChatType>(ChatType.PreventiveConsultation);
  const { theme } = useTheme();

  const {
    conversations,
    loading,
    error,
    loadConversations,
    createConversation,
    deleteConversation,
    clearError
  } = useChat();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateConversation = async () => {
    if (!newConversationTitle.trim()) return;

    const newConv = await createConversation(newConversationTitle, newConversationType);
    if (newConv) {
      FeedbackManager.feedbackSuccess();
      setNewConversationTitle("");
      setNewConversationType(ChatType.PreventiveConsultation);
      setIsCreateDialogOpen(false);
      onSelectConversation(newConv.id);
    }
  };

  const handleDeleteConversation = async (conversationId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm("هل أنت متأكد من حذف هذه المحادثة؟")) {
      FeedbackManager.feedbackError();
      await deleteConversation(conversationId);
    }
  };

  const getChatTypeLabel = (type: ChatType): string => {
    switch (type) {
      case ChatType.PreventiveConsultation:
        return "استشارة وقائية";
      case ChatType.NutritionAdvice:
        return "نصائح غذائية";
      case ChatType.GeneralHealth:
        return "صحة عامة";
      default:
        return "غير محدد";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('ar-SA', { 
        weekday: 'short' 
      });
    } else {
      return date.toLocaleDateString('ar-SA', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-wellness">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">العودة</span>
            </Button>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">المحادثات</h2>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary hover:shadow-lg transition-all duration-300">
                <Plus className="w-4 h-4 ml-2" />
                <span className="hidden sm:inline">محادثة جديدة</span>
                <span className="sm:hidden">جديدة</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-right">إنشاء محادثة جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-right block mb-2">
                    عنوان المحادثة
                  </label>
                  <Input
                    value={newConversationTitle}
                    onChange={(e) => setNewConversationTitle(e.target.value)}
                    placeholder="أدخل عنوان المحادثة..."
                    className="text-right"
                    maxLength={200}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-right block mb-2">
                    نوع المحادثة
                  </label>
                  <Select
                    value={newConversationType.toString()}
                    onValueChange={(value) => setNewConversationType(parseInt(value) as ChatType)}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ChatType.PreventiveConsultation.toString()}>
                        استشارة وقائية
                      </SelectItem>
                      <SelectItem value={ChatType.NutritionAdvice.toString()}>
                        نصائح غذائية
                      </SelectItem>
                      <SelectItem value={ChatType.GeneralHealth.toString()}>
                        صحة عامة
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleCreateConversation}
                    disabled={!newConversationTitle.trim()}
                    className="bg-gradient-primary"
                  >
                    إنشاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في المحادثات..."
            className="text-right pr-10 sm:pr-12 py-2 sm:py-3 bg-background/80 backdrop-blur-sm border-border focus:border-primary focus:ring-primary/20 rounded-xl text-foreground"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="m-3 sm:m-4" variant="destructive">
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

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center p-6 sm:p-8">
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-primary" />
            <span className="mr-2 text-muted-foreground">جاري التحميل...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
            <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mb-3 sm:mb-4" />
            <p className="text-muted-foreground text-sm sm:text-base">
              {searchTerm ? "لا توجد محادثات تطابق البحث" : "لا توجد محادثات بعد"}
            </p>
            {!searchTerm && (
              <Button
                variant="outline"
                className="mt-3 sm:mt-4"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="w-4 h-4 ml-2" />
                إنشاء محادثة جديدة
              </Button>
            )}
          </div>
        ) : (
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            {filteredConversations.map((conversation, index) => (
              <Card
                key={conversation.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.01] bg-background/80 backdrop-blur-sm border border-border shadow-lg overflow-hidden animate-fade-in ${
                  selectedConversationId === conversation.id ? 'ring-2 ring-primary shadow-primary/20' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-sm sm:text-base truncate text-right text-foreground group-hover:text-primary transition-colors duration-300">
                          {conversation.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {getChatTypeLabel(conversation.type)}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground text-right truncate mb-2 sm:mb-3 leading-relaxed">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(conversation.lastMessageTime)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {conversation.messageCount} رسالة
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shrink-0"
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
