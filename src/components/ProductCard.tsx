import { ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div className="card-fruit group">
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
        <p className="text-muted-foreground text-sm">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">per lb</span>
        </div>
        
        <button
          onClick={() => onAddToCart(product)}
          className="w-full btn-fruit btn-primary flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;