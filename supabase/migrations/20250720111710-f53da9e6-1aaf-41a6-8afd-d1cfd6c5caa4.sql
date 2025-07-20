-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_options JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_unit JSONB NOT NULL,
  final_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read access)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create policies for cart_items (session-based access)
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample fruit products
INSERT INTO public.products (name, price, image_url, description, unit, unit_options) VALUES
(
  'Fresh Red Apples',
  80,
  'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&h=500&fit=crop&crop=center',
  'Crisp and sweet, perfect for snacking',
  'kg',
  '[{"label": "1 kg", "multiplier": 1, "unit": "kg"}, {"label": "500 g", "multiplier": 0.5, "unit": "g"}]'
),
(
  'Juicy Oranges',
  60,
  'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=500&h=500&fit=crop&crop=center',
  'Vitamin C packed citrus goodness',
  'kg',
  '[{"label": "1 kg", "multiplier": 1, "unit": "kg"}, {"label": "500 g", "multiplier": 0.5, "unit": "g"}]'
),
(
  'Ripe Bananas',
  40,
  'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=500&h=500&fit=crop&crop=center',
  'Energy-rich potassium source',
  'dozen',
  '[{"label": "1 dozen", "multiplier": 1, "unit": "dozen"}, {"label": "6 pieces", "multiplier": 0.5, "unit": "pieces"}]'
),
(
  'Sweet Strawberries',
  150,
  'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop&crop=center',
  'Antioxidant-rich berry delight',
  'kg',
  '[{"label": "1 kg", "multiplier": 1, "unit": "kg"}, {"label": "250 g", "multiplier": 0.25, "unit": "g"}]'
),
(
  'Purple Grapes',
  120,
  'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&h=500&fit=crop&crop=center',
  'Sweet and juicy cluster',
  'kg',
  '[{"label": "1 kg", "multiplier": 1, "unit": "kg"}, {"label": "500 g", "multiplier": 0.5, "unit": "g"}]'
),
(
  'Tropical Mango',
  90,
  'https://images.unsplash.com/photo-1553279013-112d27136a42?w=500&h=500&fit=crop&crop=center',
  'Exotic tropical sweetness',
  'kg',
  '[{"label": "1 kg", "multiplier": 1, "unit": "kg"}, {"label": "500 g", "multiplier": 0.5, "unit": "g"}]'
);