import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CartSidebar from '@/components/CartSidebar';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

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
  created_at?: string;
  updated_at?: string;
}

interface SupabaseCartItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  selected_unit: any; // JSON field
  final_price: number;
  created_at: string;
  updated_at: string;
}

const Index = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [user]);

  // Load cart items from Supabase on page load
  const loadCartItems = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Transform the data to match our interface
      const transformedItems = (data || []).map((item: SupabaseCartItem) => ({
        ...item,
        selected_unit: typeof item.selected_unit === 'string' 
          ? JSON.parse(item.selected_unit) 
          : item.selected_unit
      }));
      setCartItems(transformedItems);
    } catch (err) {
      console.error('Error loading cart items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart and save to Supabase
  const handleAddToCart = async (product: any) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(item => 
        item.product_id === product.id && 
        JSON.stringify(item.selected_unit) === JSON.stringify(product.selectedUnit)
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItem = {
          ...cartItems[existingItemIndex],
          quantity: cartItems[existingItemIndex].quantity + 1
        };
        
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: updatedItem.quantity })
          .eq('id', updatedItem.id)
          .eq('user_id', user.id);

        if (error) throw error;

        setCartItems(prevItems =>
          prevItems.map((item, index) =>
            index === existingItemIndex ? updatedItem : item
          )
        );
      } else {
        // Insert new item
        const newItem = {
          user_id: user.id,
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          quantity: 1,
          selected_unit: product.selectedUnit,
          final_price: product.finalPrice
        };

        const { data, error } = await supabase
          .from('cart_items')
          .insert([newItem])
          .select()
          .single();

        if (error) throw error;

        // Transform the returned data
        const transformedItem = {
          ...data,
          selected_unit: typeof data.selected_unit === 'string' 
            ? JSON.parse(data.selected_unit) 
            : data.selected_unit
        };
        setCartItems(prevItems => [...prevItems, transformedItem]);
        
        toast({
          title: "✅ Added to cart!",
          description: `${product.name} has been added to your cart.`,
        });
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update item quantity in cart and Supabase
  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (!user) return;
    
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error('Error updating cart item:', err);
    }
  };

  // Remove item from cart and Supabase
  const handleRemoveItem = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } catch (err) {
      console.error('Error removing cart item:', err);
    }
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={totalCartItems} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      <main className="pt-16">
        <Hero />
        <ProductGrid onAddToCart={handleAddToCart} />
        <AboutSection />
        <ContactSection />
      </main>
      
      <Footer />
      
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Index;