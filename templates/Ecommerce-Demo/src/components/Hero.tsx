import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredProducts, currencySymbol } from '../data';
import LayoutContainer from './LayoutContainer';

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentProduct = featuredProducts[currentIndex];

  return (
    <section className="relative pt-36 pb-20 lg:pt-40 lg:pb-24 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      <LayoutContainer className="relative z-10 w-full">
        {/* Floating Slider Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-brand-gray-light rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 relative shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-gray-100 overflow-hidden group w-full"
        >
          {/* Decorative background blur inside the floating container */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-brand-blue/5 -z-10" />
          
          {/* Navigation Buttons */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-brand-black hover:text-brand-blue"
            >
              <ChevronLeft size={28} />
            </motion.button>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-brand-black hover:text-brand-blue"
            >
              <ChevronRight size={28} />
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentProduct.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center"
            >
              <div className="max-w-2xl">
                {currentProduct.badge && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-bold mb-8 tracking-wide uppercase"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse" />
                    {currentProduct.badge}
                  </motion.div>
                )}
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold leading-[1.05] text-brand-black mb-6 tracking-tight"
                >
                  {currentProduct.name}
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xl md:text-2xl text-brand-gray-dark mb-10 max-w-lg leading-relaxed mix-blend-multiply"
                >
                  {currentProduct.description}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row gap-5 items-center"
                >
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto h-16 px-10 rounded-full bg-brand-black text-white text-lg font-medium flex items-center justify-center gap-3 shadow-2xl shadow-brand-black/20 hover:bg-brand-blue hover:shadow-brand-blue/30 transition-colors group"
                  >
                    Shop Now — {currencySymbol}{currentProduct.price}
                    <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />
                  </motion.button>
                </motion.div>
              </div>

              <div className="relative lg:ml-auto w-full max-w-lg lg:max-w-none mx-auto mt-10 lg:mt-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/30 via-purple-500/20 to-transparent rounded-[3rem] blur-3xl transform -rotate-6 scale-110 -z-10 opacity-70" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <motion.img 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    src={currentProduct.image} 
                    alt={currentProduct.name} 
                    className="w-full rounded-[2.5rem] shadow-2xl object-cover aspect-square lg:aspect-[4/5] object-center bg-white"
                  />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dot Indicators */}
          <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {featuredProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex ? 'bg-brand-blue w-10 h-2.5' : 'bg-gray-300 w-2.5 h-2.5 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </motion.div>
      </LayoutContainer>
    </section>
  );
}
