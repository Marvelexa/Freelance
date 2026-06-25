import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MenuSection from './components/Menu';
import Gallery from './components/Gallery';
import EventsAndPrivateDining from './components/Events';
import Reservation from './components/Reservation';
import Reviews from './components/Reviews';
import Footer from './components/Footer';

export default function App() {
  return (
    <main className="bg-black min-h-screen selection:bg-[#C5A059] selection:text-black">
      <Navbar />
      <Hero />
      <MenuSection />
      <Reviews />
      <Gallery />
      <EventsAndPrivateDining />
      <Reservation />
      <Footer />
    </main>
  );
}
