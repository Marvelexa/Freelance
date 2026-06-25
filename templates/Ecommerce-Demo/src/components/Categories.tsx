import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import LayoutContainer from './LayoutContainer';

const categories = [
  {
    id: 'c1',
    name: 'Women\'s Collection',
    count: '124 Products',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'c2',
    name: 'Men\'s Outerwear',
    count: '42 Products',
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'c3',
    name: 'Premium Footwear',
    count: '38 Products',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'c4',
    name: 'Bags & Accessories',
    count: '56 Products',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
};

export default function Categories() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <LayoutContainer>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 lg:mb-20 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl md:text-6xl font-bold font-display mb-4 tracking-tight">Shop by Category</h2>
            <p className="text-brand-gray-dark text-xl lg:text-2xl max-w-2xl">
              Explore our meticulously curated collections designed for the modern aesthetic.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {categories.map((category) => (
            <motion.a
              href="#"
              key={category.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-[2rem] bg-brand-gray block aspect-square lg:aspect-[3/4] w-full shadow-sm hover:shadow-2xl transition-shadow duration-700"
            >
              <motion.img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                  <p className="text-white/80 font-bold tracking-widest uppercase text-xs mb-2">
                    {category.count}
                  </p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
                      {category.name}
                    </h3>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500 ease-out border border-white/30">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </LayoutContainer>
    </section>
  );
}
