import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { CATEGORIES, MENU_ITEMS } from '../constants';
import * as Icons from 'lucide-react';
import { ShoppingCart, Star, Plus } from 'lucide-react';

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="bg-brand-cream py-32 px-4 md:px-12 overflow-hidden">
      <div className="max-w-[1700px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-brand-red font-black uppercase tracking-[0.4em] text-xs mb-4 block"
            >
              Our Selection
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-black text-brand-brown leading-tight"
            >
              Delicious <br />
              <span className="text-brand-orange italic font-normal">Food Menu</span>
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map((cat) => {
              const Icon = (Icons as any)[cat.icon];
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    isActive 
                      ? 'bg-brand-brown text-white shadow-xl shadow-brand-brown/20' 
                      : 'bg-white text-brand-brown/40 hover:bg-brand-red/10 hover:text-brand-red'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="group relative bg-white rounded-[3rem] p-4 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(45,27,20,0.15)] transition-all duration-500 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden mb-8">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {item.isChefSpecial && (
                      <span className="bg-brand-brown text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md">
                        Chef's Special
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-6 right-6">
                    <span className="bg-brand-cream/90 backdrop-blur-sm text-brand-brown text-lg font-black px-4 py-2 rounded-2xl shadow-xl flex items-center gap-1">
                      {item.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-2xl font-serif font-black text-brand-brown group-hover:text-brand-red transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-1 text-brand-orange mt-1">
                      <Star className="w-3 h-3 fill-brand-orange" />
                      <span className="text-[10px] font-black">4.9</span>
                    </div>
                  </div>
                  
                  <p className="text-brand-brown/50 text-sm font-medium leading-relaxed mb-8 flex-1 italic">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-brand-cream overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-orange flex items-center justify-center text-[8px] font-black text-white">
                        +12
                      </div>
                    </div>

                    <button className="bg-brand-brown text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-brand-red hover:scale-110 active:scale-90 transition-all shadow-lg group">
                      <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {/* Decorative Background Icon */}
                <Icons.Sparkles className="absolute top-1/2 right-4 w-20 h-20 text-brand-brown opacity-[0.02] -z-10 group-hover:opacity-[0.05] transition-opacity" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        <div className="mt-20 flex justify-center">
          <button className="bg-brand-orange text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand-red hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-orange/20 flex items-center gap-4 group">
            Explore Full Menu 
            <ShoppingCart className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute top-40 -left-20 opacity-10 pointer-events-none rotate-12">
        <Icons.Beef className="w-64 h-64 text-brand-brown" />
      </div>
      <div className="absolute bottom-40 -right-20 opacity-10 pointer-events-none -rotate-12">
        <Icons.Utensils className="w-64 h-64 text-brand-brown" />
      </div>
    </section>
  );
}
