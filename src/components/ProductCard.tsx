import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface UnitOption {
  label: string;
  multiplier: number;
  unit: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  unit: string;
  unitOptions: UnitOption[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product & { selectedUnit: UnitOption; finalPrice: number }) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [selectedUnit, setSelectedUnit] = useState(product.unitOptions[0]);
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
        
        {/* Unit Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Select Unit:</label>
          <select
            value={selectedUnit.label}
            onChange={(e) => {
              const unit = product.unitOptions.find(u => u.label === e.target.value);
              if (unit) setSelectedUnit(unit);
            }}
            className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {product.unitOptions.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ₹{(product.price * selectedUnit.multiplier).toFixed(0)}
          </span>
          <span className="text-sm text-muted-foreground">per {selectedUnit.unit}</span>
        </div>
        
        <button
          onClick={() => onAddToCart({
            ...product,
            selectedUnit,
            finalPrice: product.price * selectedUnit.multiplier
          })}
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