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
    document.getElementById('operations-center')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          <Hero onExploreClick={handleExploreClick} />

          <motion.section
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.45 }}
          >
            <EncryptionExperience />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.45 }}
          >
            <SecureTransmissionSection />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 0.45 }}
          >
            <About />
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
          >
            <Footer />
          </motion.section>
        </motion.main>
      </AnimatePresence>
    </motion.div>
  );
}

export default App;
