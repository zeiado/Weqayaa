import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  Receipt
} from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  location: string;
  image?: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  onClose 
}) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.14; // 14% VAT in Egypt
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">السلة فارغة</h3>
          <p className="text-muted-foreground mb-4">
            أضف بعض الوجبات اللذيذة إلى سلة التسوق
          </p>
          <Button onClick={onClose} variant="outline">
            متابعة التسوق
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            سلة التسوق
          </div>
          <Badge variant="secondary">
            {items.length} عنصر
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Cart Items */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">{item.location}</p>
                <p className="text-sm font-semibold text-primary">
                  {item.price.toFixed(2)} جنيه
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRemoveItem(item.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>المجموع الفرعي:</span>
            <span>{subtotal.toFixed(2)} جنيه</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>ضريبة القيمة المضافة (14%):</span>
            <span>{tax.toFixed(2)} جنيه</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>المجموع الكلي:</span>
            <span className="text-primary">{total.toFixed(2)} جنيه</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button 
          onClick={onCheckout}
          className="w-full bg-gradient-primary hover:shadow-lg transition-all duration-300"
        >
          <Receipt className="w-4 h-4 ml-2" />
          المتابعة للدفع
          <ArrowRight className="w-4 h-4 mr-2" />
        </Button>

        {/* Delivery Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
            🚚 توصيل مجاني للطلبات أكثر من 50 جنيه
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cart;
