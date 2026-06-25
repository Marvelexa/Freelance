import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { featuredProducts, currencySymbol } from '../data';
import LayoutContainer from './LayoutContainer';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

export default function ProductGrid() {
  return (
    <section className="py-32 lg:py-48 bg-white">
      <LayoutContainer>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 lg:mb-24 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl md:text-6xl font-bold font-display mb-4 tracking-tight">Featured Collection</h2>
            <p className="text-brand-gray-dark text-xl md:text-2xl max-w-2xl">Curated modern essentials designed to elevate your everyday experience.</p>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex items-center text-xl text-brand-blue font-bold hover:text-brand-blue-dark transition-colors group"
          >
            Explore the Collection 
            <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
          </motion.button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group cursor-pointer"
            >
              <div className="relative bg-brand-gray-light rounded-3xl aspect-[4/5] mb-6 overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-700">
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full text-brand-black shadow-lg">
                    {product.badge}
                  </span>
                )}
                <motion.img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1]"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <button className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl text-brand-black p-4 rounded-xl font-bold text-base translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1] flex items-center justify-center gap-2 hover:bg-brand-blue hover:text-white group/btn shadow-xl shadow-black/10">
                  <ShoppingBag size={18} className="group-hover/btn:scale-110 transition-transform" />
                  Add — {currencySymbol}{product.price}
                </button>
              </div>
              
              <div className="px-2">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gray-dark mb-2">{product.category}</p>
                <div className="flex justify-between items-start gap-3">
                  <h3 className="text-xl font-bold font-display text-brand-black leading-tight group-hover:text-brand-blue transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-xl font-bold text-brand-black min-w-max">{currencySymbol}{product.price}</span>
                </div>
                <p className="mt-3 text-brand-gray-dark text-sm leading-relaxed line-clamp-2">{product.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <button className="md:hidden w-full mt-12 h-16 rounded-full border-2 border-gray-200 font-bold text-lg text-brand-black hover:bg-gray-50 transition-colors">
          Explore the Collection
        </button>
      </LayoutContainer>
    </section>
  );
}
