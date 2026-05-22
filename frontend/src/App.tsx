import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { Navbar } from './components/ui/Navbar';
import { Hero } from './components/sections/Hero';
import { EncryptionExperience } from './components/sections/EncryptionExperience';
import SecureTransmissionSection from './sections/SecureTransmission';
import { About } from './components/sections/About';
import { Footer } from './components/sections/Footer';

// Styles
import './styles/index.css';

function App() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  const handleExploreClick = () => {
    document.getElementById('encryption')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.div className="app">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <Hero onExploreClick={handleExploreClick} />

          {/* Encryption Experience */}
          <EncryptionExperience />

          {/* Secure Transmission */}
          <SecureTransmissionSection />

          {/* About Section */}
          <About />

          {/* Footer */}
          <Footer />
        </motion.main>
      </AnimatePresence>
    </motion.div>
  );
}

export default App;
