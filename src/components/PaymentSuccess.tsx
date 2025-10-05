import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Receipt, 
  Download, 
  Share2, 
  ArrowLeft,
  Star,
  Gift
} from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PaymentSuccessProps {
  onBack: () => void;
  onNewOrder: () => void;
  orderDetails: {
    orderId: string;
    total: number;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    estimatedTime: string;
    location: string;
  };
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ 
  onBack, 
  onNewOrder, 
  orderDetails 
}) => {
  const handleDownloadReceipt = () => {
    // Generate and download receipt
    console.log('Downloading receipt...');
  };

  const handleShareOrder = () => {
    // Share order details
    console.log('Sharing order...');
  };

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <Header 
        onBack={onBack}
        showBackButton={true}
        title="تم الدفع بنجاح"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">تم الدفع بنجاح!</h1>
            <p className="text-muted-foreground">تم تأكيد طلبك وسيتم تحضيره قريباً</p>
          </div>

          {/* Order Summary */}
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                تفاصيل الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">رقم الطلب:</span>
                <Badge variant="outline" className="font-mono">
                  #{orderDetails.orderId}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">الوجبات المطلوبة:</h4>
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-primary">
                      {(item.price * item.quantity).toFixed(2)} جنيه
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-bold">المجموع الكلي:</span>
                <span className="text-2xl font-bold text-primary">
                  {orderDetails.total.toFixed(2)} جنيه
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                حالة الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">تم تأكيد الطلب</p>
                    <p className="text-sm text-muted-foreground">تم استلام طلبك بنجاح</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">جاري التحضير</p>
                    <p className="text-sm text-muted-foreground">وقت التوصيل المتوقع: {orderDetails.estimatedTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold">جاري التوصيل</p>
                    <p className="text-sm text-muted-foreground">سيتم التوصيل إلى: {orderDetails.location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                معلومات التواصل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">رقم الطوارئ</p>
                    <p className="text-sm text-muted-foreground">01234567890</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">موقع الكافتيريا</p>
                    <p className="text-sm text-muted-foreground">مبنى الطلاب - الدور الأرضي</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Points */}
          <Card className="glass-card mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-800 dark:text-yellow-200">
                    لقد حصلت على نقاط مكافآت!
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    +{Math.floor(orderDetails.total * 0.1)} نقطة مكافأة
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={handleDownloadReceipt}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تحميل الإيصال
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleShareOrder}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              مشاركة الطلب
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onNewOrder}
              className="flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              طلب جديد
            </Button>
          </div>

          {/* Rating Prompt */}
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold mb-2">كيف كانت تجربتك؟</h3>
              <p className="text-sm text-muted-foreground mb-4">
                ساعدنا في تحسين الخدمة من خلال تقييم تجربتك
              </p>
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="w-8 h-8 text-yellow-400 hover:text-yellow-500 transition-colors"
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                إرسال التقييم
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
