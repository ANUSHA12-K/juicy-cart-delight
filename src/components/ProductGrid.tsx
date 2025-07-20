import ProductCard from './ProductCard';

const products = [
  {
    id: 1,
    name: 'Fresh Red Apples',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&h=500&fit=crop&crop=center',
    description: 'Crisp and sweet, perfect for snacking'
  },
  {
    id: 2,
    name: 'Juicy Oranges',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=500&h=500&fit=crop&crop=center',
    description: 'Vitamin C packed citrus goodness'
  },
  {
    id: 3,
    name: 'Ripe Bananas',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=500&h=500&fit=crop&crop=center',
    description: 'Energy-rich potassium source'
  },
  {
    id: 4,
    name: 'Sweet Strawberries',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&h=500&fit=crop&crop=center',
    description: 'Antioxidant-rich berry delight'
  },
  {
    id: 5,
    name: 'Purple Grapes',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&h=500&fit=crop&crop=center',
    description: 'Sweet and juicy cluster'
  },
  {
    id: 6,
    name: 'Tropical Mango',
    price: 2.49,
    image: 'https://images.unsplash.com/photo-1553279013-112d27136a42?w=500&h=500&fit=crop&crop=center',
    description: 'Exotic tropical sweetness'
  }
];

interface ProductGridProps {
  onAddToCart: (product: any) => void;
}

const ProductGrid = ({ onAddToCart }: ProductGridProps) => {
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
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;