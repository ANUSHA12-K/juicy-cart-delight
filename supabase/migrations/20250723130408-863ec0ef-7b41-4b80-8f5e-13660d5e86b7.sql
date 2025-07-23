-- Update the Tropical Mango product to Fresh Kiwi with a working image
UPDATE products 
SET 
  name = 'Fresh Kiwi',
  image_url = 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=500&h=500&fit=crop&crop=center',
  description = 'Tangy and nutritious, rich in vitamin C',
  price = 100.00
WHERE id = '80b89405-3a09-4d31-9c13-c79f96e5d768';