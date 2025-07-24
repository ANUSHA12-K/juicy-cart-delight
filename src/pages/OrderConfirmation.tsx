import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit: {
    label: string;
    multiplier: number;
    unit: string;
  };
  price: number;
  final_price: number;
}

interface Order {
  id: string;
  total_price: number;
  order_items: OrderItem[];
  created_at: string;
  status: string;
}

const OrderConfirmation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchLatestOrder();
  }, [user, navigate]);

  const fetchLatestOrder = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const latestOrder = data[0];
        setOrder({
          ...latestOrder,
          order_items: typeof latestOrder.order_items === 'string' 
            ? JSON.parse(latestOrder.order_items) 
            : latestOrder.order_items
        });
      }
    } catch (err) {
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItems={0} onCartClick={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItems={0} onCartClick={() => {}} />
        <div className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">We couldn't find your order details.</p>
            <Button onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={0} onCartClick={() => {}} />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Thank you! Your order has been submitted.</h1>
            <p className="text-lg text-gray-600">Your order is in process. You'll be notified once it's ready.</p>
          </div>

          {/* Order Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-sm font-normal text-gray-600">
                  Order #{order.id.slice(-8).toUpperCase()}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items */}
              <div className="space-y-4">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-4 last:border-b-0">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.product_name}</h4>
                      <div className="text-sm text-gray-600">
                        <p>Quantity: {item.quantity} × {item.unit.label}</p>
                        <p>Price per {item.unit.unit}: ₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">₹{(item.final_price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold text-green-800">
                  <span>Total Amount:</span>
                  <span>₹{order.total_price.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Info */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Order Information:</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>Order Date: {new Date(order.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  <p>Status: <span className="capitalize font-medium">{order.status}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <Button 
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              View More Fruits
            </Button>
            <div>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;