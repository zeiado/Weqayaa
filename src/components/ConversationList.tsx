import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

interface ConversationListProps {
  onSelectConversation: (conversationId: number) => void;
  selectedConversationId?: number;
}

export const ConversationList = ({ onSelectConversation, selectedConversationId }: ConversationListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState("");
  const [newConversationType, setNewConversationType] = useState<ChatType>(ChatType.PreventiveConsultation);

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
      setNewConversationTitle("");
      setNewConversationType(ChatType.PreventiveConsultation);
      setIsCreateDialogOpen(false);
      onSelectConversation(newConv.id);
    }
  };

  const handleDeleteConversation = async (conversationId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm("هل أنت متأكد من حذف هذه المحادثة؟")) {
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-right">المحادثات</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-primary">
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
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في المحادثات..."
            className="text-right pr-10"
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
          <div className="p-2 space-y-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedConversationId === conversation.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm truncate text-right">
                        {conversation.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {getChatTypeLabel(conversation.type)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground text-right truncate mb-2">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(conversation.lastMessageTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {conversation.messageCount}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
