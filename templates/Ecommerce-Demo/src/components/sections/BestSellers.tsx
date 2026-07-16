"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, PRODUCTS, Product } from "@/store/useStore";
import { FiShoppingCart, FiHeart, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function BestSellers() {
  const { cart, addToCart } = useStore();
  const [currentIndex, setCurrentIndex] = useState(1); // Set second tee as default active
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to 'M' size for quick buy
    addToCart(product, "M");
  };

  const getCardStyle = (index: number) => {
    let diff = index - currentIndex;
    const total = PRODUCTS.length;
    
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const isActive = diff === 0;
    let x = 0;
    let scale = 0.9;
    let opacity = 0.55;
    let zIndex = 10 - Math.abs(diff);
    let rotate = 0;

    if (isActive) {
      x = 0;
      scale = 1.02;
      opacity = 1;
      rotate = 0;
    } else {
      const direction = diff > 0 ? 1 : -1;
      const distance = Math.abs(diff);
      x = direction * (280 + (distance - 1) * 50); // Side spacing
      scale = 0.9 - distance * 0.04;
      opacity = 0.55 / distance;
      rotate = direction * 4; // Lean cards out slightly
    }

    return { x, scale, opacity, zIndex, rotate, isActive };
  };

  return (
    <section 
      id="catalog-grid" 
      className="relative py-28 bg-[#f3f6fa] overflow-hidden border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative">
        
        {/* Section Title */}
        <div className="mb-12 text-center space-y-4 max-w-xl mx-auto">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent-blue font-bold block">
            Exclusive Range
          </span>
          <h2 className="font-serif font-bold text-4xl md:text-5xl uppercase tracking-tighter text-slate-800">
            Trend Showcase.
          </h2>
        </div>

        {/* 3D Stacked Slide Container */}
        <div className="relative w-full h-[540px] flex items-center justify-center overflow-visible py-4">
          
          {/* Main Navigation Arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 md:left-4 z-30 p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:scale-105 active:scale-95 shadow-lg transition-all duration-200 cursor-pointer pointer-events-auto"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-0 md:right-4 z-30 p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:scale-105 active:scale-95 shadow-lg transition-all duration-200 cursor-pointer pointer-events-auto"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>

          {/* Slider Cards Wrap */}
          <div className="relative w-full max-w-[340px] h-[500px] flex items-center justify-center">
            {PRODUCTS.map((prod, index) => {
              const { x, scale, opacity, zIndex, rotate, isActive } = getCardStyle(index);
              const isFav = wishlisted[prod.id];

              return (
                <motion.div
                  key={prod.id}
                  initial={false}
                  animate={{
                    x,
                    scale,
                    opacity,
                    zIndex,
                    rotate,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 20,
                  }}
                  className={`absolute w-full h-full bg-white rounded-3xl overflow-hidden flex flex-col justify-between p-4 shadow-xl select-none transition-all duration-300 ${
                    isActive 
                      ? "border-2 border-accent-blue pointer-events-auto" 
                      : "border border-slate-200/60 pointer-events-none"
                  }`}
                  onClick={() => {
                    if (!isActive) setCurrentIndex(index);
                  }}
                >
                  {/* Card Media Section with light gray backing */}
                  <div className="w-full h-[250px] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center p-4 relative flex-shrink-0">
                    <img 
                      src={prod.image}
                      className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
                      alt={prod.name}
                    />
                  </div>

                  {/* Card Content info */}
                  <div className="flex-1 flex flex-col justify-between pt-4 text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] text-accent-blue font-bold uppercase tracking-wider">
                        {prod.category}
                      </span>
                      <h3 className="text-slate-800 font-extrabold text-sm uppercase tracking-wide line-clamp-1">
                        {prod.name}
                      </h3>
                      <div className="text-lg font-black text-slate-800 pt-1">
                        ₹{prod.price}
                      </div>
                    </div>

                    {/* Divider & Taxes */}
                    <div className="border-t border-slate-200/70 pt-3">
                      <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">
                        Inclusive of all taxes
                      </span>
                    </div>

                    {/* Button Row */}
                    <div className="flex gap-2.5 pt-3">
                      <button
                        onClick={(e) => handleAdd(prod, e)}
                        disabled={!isActive}
                        className="flex-1 bg-accent-blue hover:bg-blue-700 text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/10 active:scale-95 disabled:opacity-50 transition-all duration-200"
                      >
                        <FiShoppingCart className="w-3.5 h-3.5" /> ADD TO CART
                      </button>

                      <button
                        onClick={(e) => toggleWishlist(prod.id, e)}
                        disabled={!isActive}
                        className={`w-11 h-11 border rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-200 ${
                          isFav 
                            ? "bg-red-500/10 border-red-500 text-red-500" 
                            : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <FiHeart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
