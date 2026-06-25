import { motion } from 'motion/react';
import { Truck, ShieldCheck, HeadphonesIcon, RotateCcw } from 'lucide-react';
import LayoutContainer from './LayoutContainer';
import { currencySymbol, isSareeOrEthnic } from '../data';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: 'Free Express Delivery',
      description: `Complimentary shipping on all orders over ${currencySymbol}${currencySymbol === '₹' ? '5,000' : '150'}.`,
    },
    {
      icon: ShieldCheck,
      title: 'Quality Guarantee',
      description: 'Premium craftsmanship on all our garments.',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Expert Support',
      description: 'Round-the-clock assistance from our dedicated team.',
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Not quite perfect? Return it within 30 days hassle-free.',
    },
  ];
  return (
    <section className="py-24 lg:py-32 bg-brand-black text-white relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/4 w-1/2 h-full bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
      
      <LayoutContainer className="relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="flex flex-col items-center text-center sm:items-start sm:text-left group"
              >
                <div className="h-16 w-16 lg:h-20 lg:w-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-brand-gray-light lg:bg-white/10 group-hover:scale-110 group-hover:bg-brand-blue group-hover:border-brand-blue transition-all duration-500 ease-out">
                   <Icon size={32} strokeWidth={1.5} className="group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-gray-400 text-lg max-w-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </LayoutContainer>
    </section>
  );
}
