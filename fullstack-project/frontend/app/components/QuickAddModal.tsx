'use client';

import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useQuickAdd } from '../../context/QuickAddContext';
import { useCart } from '../../context/CartContext';

export default function QuickAddModal() {
  const { isModalOpen, selectedProduct, closeModal } = useQuickAdd();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>('M');

  if (!isModalOpen || !selectedProduct) return null;

  const handleAddToCart = () => {
    // In a real app we'd pass size and quantity to the context.
    // For this flow, we trigger the existing addToCart.
    addToCart(selectedProduct);
    
    // Optional: could add a local toast or just rely on the page's toast 
    // by triggering a custom event or letting the context handle it.
    // For now, just close modal.
    closeModal();
    
    // Since page relies on page-level toast, we might not see a toast unless we trigger it.
    // The requirement is just the visual flow change.
  };

  const sizes = ['S', 'M', 'L', 'XL', '2XL'];
  const colors = selectedProduct.colors && Array.isArray(selectedProduct.colors) && selectedProduct.colors.length > 0
    ? selectedProduct.colors
    : [selectedProduct.image || selectedProduct.img || '/images/trackpants_main.png'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Left: Image */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="bg-gray-50 rounded-lg aspect-[4/5] p-2 flex items-center justify-center">
              <img 
                src={selectedProduct.image || selectedProduct.img} 
                alt={selectedProduct.name} 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-bold text-gray-500 text-xs tracking-wider uppercase mb-1">DOMYOS</h3>
            <h2 className="text-sm font-semibold text-gray-800 leading-snug mb-4">
              {selectedProduct.name}
            </h2>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-semibold text-gray-500">Qty</span>
              <div className="flex items-center border border-gray-300 rounded-full bg-white overflow-hidden h-8 w-24">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 flex justify-center items-center hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-bold w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex-1 flex justify-center items-center hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-sm text-gray-500 font-bold">MRP</span>
              <span className="text-2xl font-black text-gray-900">₹{selectedProduct.price}</span>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-sm text-gray-900 mb-1">Colours</h4>
              <p className="text-xs text-gray-500 mb-3">{colors.length} {colors.length === 1 ? 'Colour' : 'Colours'}</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {colors.map((img, idx) => (
                  <button 
                    key={idx}
                    className={`w-12 h-16 flex-shrink-0 border-2 rounded ${idx === 0 ? 'border-blue-600 p-0.5' : 'border-transparent hover:border-gray-300'} bg-gray-50 transition-all`}
                  >
                    <img src={img} className="w-full h-full object-cover mix-blend-multiply" alt="color variant" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <h4 className="font-bold text-sm text-gray-900">Select Size</h4>
                <button className="text-xs font-bold text-blue-600 hover:underline">View size chart</button>
              </div>
              <div className="flex gap-2">
                {sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 flex-1 border ${selectedSize === size ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700 hover:border-gray-400'} font-semibold text-sm rounded transition-colors`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-[#2B3B95] text-white font-bold rounded-lg shadow hover:bg-blue-900 transition-colors mt-auto tracking-wide"
            >
              Add to cart
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
