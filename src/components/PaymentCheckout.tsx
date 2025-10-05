import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  ArrowLeft, 
  Check, 
  Lock, 
  Shield, 
  Clock,
  MapPin,
  Calendar,
  Receipt,
  Star,
  AlertCircle
} from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PaymentCheckoutProps {
  onBack: () => void;
  onPaymentSuccess: () => void;
  cartItems: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    location: string;
  }>;
}

type PaymentMethod = 'instapay' | 'vodafone' | 'visa';

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ 
  onBack, 
  onPaymentSuccess, 
  cartItems 
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('instapay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.14; // 14% VAT in Egypt
  const total = subtotal + tax;

  const paymentMethods = [
    {
      id: 'instapay' as PaymentMethod,
      name: 'InstaPay',
      description: 'الدفع الفوري المصري',
      icon: <Wallet className="w-6 h-6" />,
      color: 'bg-blue-500',
      popular: true
    },
    {
      id: 'vodafone' as PaymentMethod,
      name: 'Vodafone Cash',
      description: 'محفظة فودافون النقدية',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'bg-red-500',
      popular: true
    },
    {
      id: 'visa' as PaymentMethod,
      name: 'Visa Card',
      description: 'بطاقة فيزا',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'bg-indigo-500',
      popular: false
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-wellness">
      <Header 
        onBack={onBack}
        showBackButton={true}
        title="الدفع الآمن"
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" />
                  ملخص الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.location}</p>
                        <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-primary">
                        {(item.price * item.quantity).toFixed(2)} جنيه
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>المجموع الفرعي:</span>
                    <span>{subtotal.toFixed(2)} جنيه</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>ضريبة القيمة المضافة (14%):</span>
                    <span>{tax.toFixed(2)} جنيه</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي:</span>
                    <span className="text-primary">{total.toFixed(2)} جنيه</span>
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <Calendar className="w-4 h-4" />
                    <span>تاريخ الطلب: {new Date().toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>وقت التوصيل المتوقع: 15-30 دقيقة</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              
              {/* Payment Methods */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    اختر طريقة الدفع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedPaymentMethod === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        {method.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-green-500">
                            <Star className="w-3 h-3 ml-1" />
                            شائع
                          </Badge>
                        )}
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center text-white`}>
                            {method.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{method.name}</p>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                        {selectedPaymentMethod === method.id && (
                          <div className="absolute top-2 left-2">
                            <Check className="w-5 h-5 text-primary" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details Form */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    تفاصيل الدفع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPaymentMethod === 'instapay' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">رقم الهاتف</label>
                        <Input
                          type="tel"
                          placeholder="01xxxxxxxxx"
                          value={paymentDetails.phoneNumber}
                          onChange={(e) => setPaymentDetails({...paymentDetails, phoneNumber: e.target.value})}
                          className="text-right"
                        />
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                          <Shield className="w-4 h-4" />
                          <span>InstaPay آمن ومحمي من قبل البنك المركزي المصري</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'vodafone' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">رقم فودافون كاش</label>
                        <Input
                          type="tel"
                          placeholder="01xxxxxxxxx"
                          value={paymentDetails.phoneNumber}
                          onChange={(e) => setPaymentDetails({...paymentDetails, phoneNumber: e.target.value})}
                          className="text-right"
                        />
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-red-800 dark:text-red-200">
                          <Smartphone className="w-4 h-4" />
                          <span>سيتم إرسال رسالة تأكيد إلى هاتفك</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'visa' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">رقم البطاقة</label>
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                          className="text-right"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">تاريخ الانتهاء</label>
                          <Input
                            type="text"
                            placeholder="MM/YY"
                            value={paymentDetails.expiryDate}
                            onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">CVV</label>
                          <Input
                            type="text"
                            placeholder="123"
                            value={paymentDetails.cvv}
                            onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">اسم حامل البطاقة</label>
                        <Input
                          type="text"
                          placeholder="اسم حامل البطاقة"
                          value={paymentDetails.cardholderName}
                          onChange={(e) => setPaymentDetails({...paymentDetails, cardholderName: e.target.value})}
                          className="text-right"
                        />
                      </div>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                          معلوماتك محمية بأمان
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          نستخدم أحدث تقنيات التشفير لحماية معلوماتك المالية. 
                          لا نخزن بيانات البطاقة على خوادمنا.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Button */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold">المجموع الكلي</p>
                        <p className="text-2xl font-bold text-primary">{total.toFixed(2)} جنيه</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">شامل ضريبة القيمة المضافة</p>
                        <p className="text-sm text-muted-foreground">توصيل مجاني</p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-gradient-primary hover:shadow-lg transition-all duration-300 py-4 text-lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                          جاري المعالجة...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 ml-2" />
                          تأكيد الدفع الآمن
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>محمي بتشفير SSL 256-bit</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentCheckout;
