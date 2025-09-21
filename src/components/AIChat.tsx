import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WeqayaLogo } from "./WeqayaLogo";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Send, Mic, Camera, ArrowLeft } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatProps {
  onBack: () => void;
}

export const AIChat = ({ onBack }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "السلام عليكم! أنا مستشار وقاية الذكي. كيف يمكنني مساعدتك في تحسين نظامك الغذائي اليوم؟",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userInput: string) => {
    const responses = [
      "بناءً على ملفك الشخصي، أنصحك بتناول وجبة غنية بالبروتين مثل الفول المدمس مع الطحينة والسلطة الخضراء.",
      "هذا اختيار رائع! هل تريد مني اقتراح وجبات أخرى من قائمة الكافتيريا؟",
      "دعني أساعدك في حساب احتياجاتك من السعرات الحرارية بناءً على هدفك ونشاطك اليومي.",
      "يمكنك إضافة المزيد من الخضروات الورقية لزيادة الفيتامينات والمعادن في وجباتك.",
      "هل تحتاج مساعدة في تخطيط وجبات الأسبوع القادم؟"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const quickActions = [
    "اقترح لي وجبة صحية",
    "احسب احتياجي من السعرات",
    "ما أفضل وجبة للإفطار؟",
    "نصائح لزيادة الوزن"
  ];

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <Header 
        onBack={onBack}
        showBackButton={true}
        title="مستشار وقاية الذكي"
      />

      <div className="container mx-auto px-6 py-6 h-[calc(100vh-120px)] flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 mb-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-start' : 'justify-end'} mb-4`}
              >
                <div className={`flex items-start gap-3 max-w-[80%] ${message.isUser ? '' : 'flex-row-reverse'}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.isUser ? 'bg-primary text-white' : 'bg-secondary text-white'}>
                      {message.isUser ? 'أ' : 'و'}
                    </AvatarFallback>
                  </Avatar>
                  <Card className={`p-4 ${
                    message.isUser 
                      ? 'bg-primary text-white ml-auto' 
                      : 'glass-card mr-auto'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-3 text-center">أو اختر من الأسئلة الشائعة:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 px-3"
                  onClick={() => setInputText(action)}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="shrink-0">
            <Camera className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Mic className="w-5 h-5" />
          </Button>
          <div className="flex-1 flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              className="text-right"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} className="bg-gradient-primary shrink-0">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};