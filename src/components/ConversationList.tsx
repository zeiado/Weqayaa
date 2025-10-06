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
  Trash2
} from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ConversationResponse, ChatType } from "@/types/chat";
import { FeedbackManager } from "@/utils/feedbackManager";

interface ConversationListProps {
  onSelectConversation: (conversationId: number) => void;
  selectedConversationId?: number;
}

export const ConversationList = ({ onSelectConversation, selectedConversationId }: ConversationListProps) => {
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
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">المحادثات</h2>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 ml-2" />
                محادثة جديدة
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
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في المحادثات..."
            className="text-right pr-12 py-3 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="m-4" variant="destructive">
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
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="mr-2">جاري التحميل...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? "لا توجد محادثات تطابق البحث" : "لا توجد محادثات بعد"}
            </p>
            {!searchTerm && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="w-4 h-4 ml-2" />
                إنشاء محادثة جديدة
              </Button>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredConversations.map((conversation, index) => (
              <Card
                key={conversation.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden animate-fade-in ${
                  selectedConversationId === conversation.id ? 'ring-2 ring-blue-500 shadow-blue-500/20' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-base truncate text-right text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {conversation.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-700 dark:text-blue-300 border-0">
                          {getChatTypeLabel(conversation.type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-right truncate mb-3 leading-relaxed">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
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
                      className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    >
                      <Trash2 className="w-4 h-4" />
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
