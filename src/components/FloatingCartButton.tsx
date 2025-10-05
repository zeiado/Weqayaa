import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, X } from 'lucide-react';
import Cart from './Cart';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  location: string;
}

interface FloatingCartButtonProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="w-14 h-14 rounded-full bg-gradient-primary hover:shadow-lg transition-all duration-300 relative"
          size="lg"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Cart Panel */}
          <div className="w-full max-w-md bg-background border-l shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">سلة التسوق</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-4">
              <Cart
                items={items}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
                onCheckout={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                onClose={() => setIsCartOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cart Summary (when items exist but cart is closed) */}
      {totalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-24 z-40">
          <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
            <div className="text-sm">
              <p className="font-medium">{totalItems} عنصر</p>
              <p className="text-primary font-semibold">
                {totalPrice.toFixed(2)} جنيه
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCartButton;
