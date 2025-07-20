import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  unit: string;
  unit_options: any; // JSON field from Supabase
  created_at?: string;
}

interface TransformedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  unit: string;
  unitOptions: Array<{
    label: string;
    multiplier: number;
    unit: string;
  }>;
}

interface ProductGridProps {
  onAddToCart: (product: any) => void;
}

const ProductGrid = ({ onAddToCart }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      // Transform the data to match our interface
      const transformedProducts = (data || []).map(product => ({
        ...product,
        unit_options: typeof product.unit_options === 'string' 
          ? JSON.parse(product.unit_options) 
          : product.unit_options
      }));
      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="shop" className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Fresh <span className="text-primary">Premium</span> Fruits
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Loading fresh products...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-fruit animate-pulse">
                <div className="bg-muted h-48 rounded-xl mb-4"></div>
                <div className="space-y-3">
                  <div className="bg-muted h-6 rounded w-3/4"></div>
                  <div className="bg-muted h-4 rounded w-full"></div>
                  <div className="bg-muted h-10 rounded"></div>
                  <div className="bg-muted h-12 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="shop" className="section-padding bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Fresh <span className="text-primary">Premium</span> Fruits
            </h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchProducts}
              className="btn-fruit btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="section-padding bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Fresh <span className="text-primary">Premium</span> Fruits
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hand-picked daily from local farms, delivering nutrition and flavor in every bite
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                id: parseInt(product.id), // Convert to number for compatibility
                name: product.name,
                price: product.price,
                image: product.image_url,
                description: product.description,
                unit: product.unit,
                unitOptions: product.unit_options
              } as TransformedProduct} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;