import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface UnitOption {
  label: string;
  multiplier: number;
  unit: string;
}

interface Product {
  id: string; // Change to string for UUID compatibility
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
      <div className="relative overflow-hidden rounded-xl mb-4 shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNTAgMTUwQzMwMC4xIDE1MCAzNDAgMTg5LjkgMzQwIDI0MEMzNDAgMjkwLjEgMzAwLjEgMzMwIDI1MCAzMzBDMTk5LjkgMzMwIDE2MCAyOTAuMSAxNjAgMjQwQzE2MCAxODkuOSAxOTkuOSAxNTAgMjUwIDE1MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMzAiIHk9IjIzMCI+CjxwYXRoIGQ9Ik0zNSAzMkgzMlYzNUgzNVYzMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTIiPgo8cGF0aCBkPSJNNS41IDlMMTAuNSA0TTEwLjUgOU01LjUgNCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+CjwvZz4KPHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTAwIDIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjIwMCIgeT0iMzgwIj4KPHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMTAwIDIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSI1MCIgeT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+Cjwvc3ZnPgo=';
            target.alt = 'Image not available';
          }}
          loading="lazy"
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