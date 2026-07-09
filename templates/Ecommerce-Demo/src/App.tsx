import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Features from './components/Features';
import Categories from './components/Categories';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [showLoading, setShowLoading] = useState(true);
  const businessName = new URLSearchParams(window.location.search).get('name') || "NEXVORA";

  return (
    <div className="min-h-screen bg-white">
      {showLoading && (
        <LoadingScreen 
          businessName={businessName} 
          onFinished={() => setShowLoading(false)} 
        />
      )}
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Categories />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}

