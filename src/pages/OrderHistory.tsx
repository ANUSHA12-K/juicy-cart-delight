import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, CheckCircle, Truck } from 'lucide-react';
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
  estimated_delivery_time: string | null;
  upi_id: string;
  delivery_address: string | null;
  tracking_notes: string | null;
}

const OrderHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedOrders = (data || []).map((order: any) => ({
        ...order,
        order_items: typeof order.order_items === 'string' 
          ? JSON.parse(order.order_items) 
          : order.order_items
      }));
      
      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDeliveryTime = (deliveryTime: string | null) => {
    if (!deliveryTime) return 'Not specified';
    
    const date = new Date(deliveryTime);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Overdue';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `In ${diffDays} days`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItems={0} onCartClick={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading order history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={0} onCartClick={() => {}} />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-green-800">Order History</h1>
            <Button onClick={() => navigate('/')} variant="outline">
              Continue Shopping
            </Button>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <Button onClick={() => navigate('/')} className="bg-green-600 hover:bg-green-700">
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-green-800 text-lg">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </Badge>
                        <span className="text-lg font-bold text-green-800">
                          ₹{order.total_price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Items Ordered</h4>
                        <div className="space-y-3">
                          {order.order_items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                              <div>
                                <h5 className="font-medium">{item.product_name}</h5>
                                <p className="text-sm text-gray-600">
                                  {item.quantity} × {item.unit.label} @ ₹{item.price}
                                </p>
                              </div>
                              <p className="font-semibold">₹{(item.final_price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Information */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">Delivery Information</h4>
                        <div className="space-y-3">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-green-800">Estimated Delivery</p>
                            <p className="text-green-700">
                              {order.estimated_delivery_time 
                                ? new Date(order.estimated_delivery_time).toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'Not specified'
                              }
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                              {formatDeliveryTime(order.estimated_delivery_time)}
                            </p>
                          </div>
                          
                          {order.tracking_notes && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-blue-800">Tracking Notes</p>
                              <p className="text-blue-700 text-sm">{order.tracking_notes}</p>
                            </div>
                          )}
                          
                          <div className="text-sm text-gray-600">
                            <p><span className="font-medium">Payment Method:</span> UPI ({order.upi_id})</p>
                            {order.delivery_address && (
                              <p><span className="font-medium">Delivery Address:</span> {order.delivery_address}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;