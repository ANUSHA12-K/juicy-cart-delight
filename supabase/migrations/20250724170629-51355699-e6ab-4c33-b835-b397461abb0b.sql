-- Add estimated delivery time and tracking to orders table
ALTER TABLE public.orders 
ADD COLUMN estimated_delivery_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN delivery_address TEXT,
ADD COLUMN tracking_notes TEXT;

-- Update existing orders with estimated delivery time (3-5 days from order date)
UPDATE public.orders 
SET estimated_delivery_time = created_at + INTERVAL '4 days'
WHERE estimated_delivery_time IS NULL;

-- Add RLS policy for users to view their order history
CREATE POLICY "Users can view their order history" ON public.orders
FOR SELECT USING (auth.uid() = user_id);