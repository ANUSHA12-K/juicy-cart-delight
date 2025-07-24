import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

interface UnitOption {
  label: string;
  multiplier: number;
  unit: string;
}

interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  selected_unit: UnitOption;
  final_price: number;
}

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadCartItems();
  }, [user, navigate]);

  const loadCartItems = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const transformedItems = (data || []).map((item: any) => ({
        ...item,
        selected_unit: typeof item.selected_unit === 'string' 
          ? JSON.parse(item.selected_unit) 
          : item.selected_unit
      }));
      
      setCartItems(transformedItems);
    } catch (err) {
      console.error('Error loading cart items:', err);
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.final_price * item.quantity);
    }, 0);
  };

  const validateUpiId = (upi: string) => {
    // Validate UPI ID format to accept all valid UPI providers
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
    return upiRegex.test(upi);
  };

  const handlePayment = async () => {
    if (!upiId.trim()) {
      toast({
        title: "Error",
        description: "Please enter your UPI ID",
        variant: "destructive",
      });
      return;
    }

    if (!validateUpiId(upiId)) {
      toast({
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI ID (e.g., abc@upi, xyz@paytm)",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      // Create order in database
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3); // 3-5 days
      
      const orderData = {
        user_id: user!.id,
        order_items: JSON.stringify(cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit: item.selected_unit,
          price: item.price,
          final_price: item.final_price
        }))),
        total_price: calculateTotal(),
        upi_id: upiId,
        status: 'pending',
        estimated_delivery_time: deliveryDate.toISOString(),
        tracking_notes: 'Order received and being processed'
      };

      const { error: orderError } = await supabase
        .from('orders')
        .insert([orderData]);

      if (orderError) throw orderError;

      // Clear cart after successful order
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user!.id);

      if (clearCartError) throw clearCartError;

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Payment Request Sent!",
        description: "Your payment request has been sent to your UPI app. Please complete the payment to confirm your order.",
        duration: 5000,
      });

      // Redirect to order confirmation page
      setTimeout(() => {
        navigate('/order-confirmation');
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItems={0} onCartClick={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={cartItems.length} onCartClick={() => {}} />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-center text-green-800 mb-8">Checkout</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                ) : (
                  <>
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <h4 className="font-medium">{item.product_name}</h4>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × {item.selected_unit.label} @ ₹{item.price}
                          </p>
                        </div>
                        <p className="font-semibold">₹{(item.final_price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold text-green-800">
                        <span>Total:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-800">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g., yourname@upi, yourphone@paytm"
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    Enter your UPI ID to receive the payment request
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Payment Process:</h4>
                  <ol className="text-sm text-green-700 space-y-1">
                    <li>1. Enter your UPI ID above</li>
                    <li>2. Click "Pay Now" to send payment request</li>
                    <li>3. Complete payment in your UPI app</li>
                    <li>4. Your order will be confirmed</li>
                  </ol>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={processing || cartItems.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay Now ₹${calculateTotal().toFixed(2)}`
                  )}
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Back to Store
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;