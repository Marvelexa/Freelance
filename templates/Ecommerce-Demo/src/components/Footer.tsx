import { motion } from 'motion/react';
import LayoutContainer from './LayoutContainer';

export default function Footer() {
  return (
    <footer className="bg-brand-gray-light pt-20 pb-10 border-t border-gray-200">
      <LayoutContainer>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <a href="#" className="font-display font-bold text-2xl tracking-tighter mb-4 block text-brand-black">
              {new URLSearchParams(window.location.search).get('name') || "NEXVORA"}
            </a>
            <p className="text-brand-gray-dark text-sm max-w-xs mb-6">
              Thoughtfully designed garments for the modern wardrobe. Elevate your everyday style with our curated collection.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold font-display mb-4 text-brand-black">Shop</h4>
            <ul className="space-y-3 text-sm text-brand-gray-dark">
              <li><a href="#" className="hover:text-brand-blue transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Women's Collection</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Men's Collection</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold font-display mb-4 text-brand-black">Support</h4>
            <ul className="space-y-3 text-sm text-brand-gray-dark">
              <li><a href="#" className="hover:text-brand-blue transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Warranty</a></li>
              <li><a href="#" className="hover:text-brand-blue transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold font-display mb-4 text-brand-black">Stay in the loop</h4>
            <p className="text-brand-gray-dark text-sm mb-4">Subscribe for exclusive offers and product news.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
              />
              <button 
                type="submit" 
                className="bg-brand-orange hover:bg-brand-orange-light text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-gray-dark text-sm">
            © 2026 {new URLSearchParams(window.location.search).get('name') || "Nexvora"}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-brand-gray-dark">
            <a href="#" className="hover:text-brand-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-black transition-colors">Terms of Service</a>
          </div>
        </div>
      </LayoutContainer>
    </footer>
  );
}
