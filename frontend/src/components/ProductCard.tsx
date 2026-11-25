import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '../api/types';
import { useCart } from '../context/cart-context';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Helper to format image URL from Django media server or placeholder
  const getImageUrl = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800';
    if (url.startsWith('http')) return url;
    return `http://127.0.0.1:8000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, 'Standard');
    toast.success(`${product.name} added to your shopping bag.`);
  };

  const priceFormatted = typeof product.price === 'string'
    ? `$${parseFloat(product.price).toFixed(2)}`
    : `$${product.price.toFixed(2)}`;

  return (
    <div className="group relative flex flex-col bg-white border border-[#ECEAE5] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#8C6D37]">
      {/* Image Container with Luxury Aspect Ratio */}
      <Link to={`/products/${product.id}`} className="block relative w-full pt-[125%] overflow-hidden bg-[#FAF9F6]">
        <img
          src={getImageUrl(product.main_image)}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick Add Floating Button on Hover */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 bg-[#141414] text-white p-3 shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#8C6D37]"
          title="Add to Shopping Bag"
        >
          <ShoppingBag size={16} />
        </button>

        {product.stock_quantity <= 3 && product.stock_quantity > 0 && (
          <span className="absolute top-3 left-3 bg-[#8C6D37] text-white text-[9px] uppercase tracking-[0.14em] font-semibold px-2 py-1">
            Limited Edition
          </span>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C827A] font-semibold block mb-1">
            {typeof product.category === 'object' ? product.category.name : (product.category || 'Atelier Piece')}
          </span>
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-serif text-[15px] font-normal tracking-[0.04em] text-[#141414] group-hover:text-[#8C6D37] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-[#F2EFE9] flex items-center justify-between">
          <span className="text-[13px] font-medium tracking-[0.04em] text-[#141414]">
            {priceFormatted}
          </span>
          <span className="text-[10px] tracking-[0.12em] text-[#8C6D37] font-semibold uppercase">
            In Stock
          </span>
        </div>
      </div>
    </div>
  );
};
