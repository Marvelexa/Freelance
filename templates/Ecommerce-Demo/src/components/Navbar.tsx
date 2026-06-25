import { motion } from 'motion/react';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import LayoutContainer from './LayoutContainer';

export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 pointer-events-none">
      <LayoutContainer>
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full pointer-events-auto"
        >
          <div className="px-6 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="#" className="font-display font-bold text-2xl tracking-tighter hover:text-brand-blue transition-colors">
              {new URLSearchParams(window.location.search).get('name') || "NEXVORA"}
            </a>
            <nav className="hidden md:flex gap-8">
              {['Shop', 'Categories', 'Journal', 'Support'].map((item) => (
                <motion.a 
                  key={item} 
                  href="#"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-base font-bold text-brand-gray-dark hover:text-brand-blue transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} className="text-brand-black hover:text-brand-blue transition-colors">
              <Search size={22} strokeWidth={2} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} className="text-brand-black hover:text-brand-blue transition-colors">
              <User size={22} strokeWidth={2} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }} className="text-brand-black hover:text-brand-blue transition-colors relative">
              <ShoppingBag size={22} strokeWidth={2} />
              <span className="absolute -top-1.5 -right-1.5 bg-brand-blue text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                2
              </span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="md:hidden text-brand-black hover:text-brand-blue">
              <Menu size={24} strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </motion.header>
      </LayoutContainer>
    </div>
  );
}
