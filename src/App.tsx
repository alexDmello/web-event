import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { MenuDrawer } from './components/MenuDrawer';
import { Footer } from './components/Footer';

// Lazy load pages for performance optimization (code splitting)
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Services = React.lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const Media = React.lazy(() => import('./pages/Media').then(module => ({ default: module.Media })));
const Enquire = React.lazy(() => import('./pages/Enquire').then(module => ({ default: module.Enquire })));

// Scroll to top component on route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Global scroll reveal observer trigger
const ScrollRevealTrigger: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const setupReveal = () => {
      if (observer) {
        observer.disconnect();
      }

      const revealElements = document.querySelectorAll('.reveal-on-scroll');
      
      if ('IntersectionObserver' in window && revealElements.length > 0) {
        observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              obs.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
          if (!el.classList.contains('active') && observer) {
            observer.observe(el);
          }
        });
      } else if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('active'));
      }
    };

    // Reset reveal elements active class on pathname change to animate them again
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => {
      el.classList.remove('active');
    });

    // Run setup immediately
    setupReveal();

    // Trigger setup on delays to catch lazy loaded content once mounted
    const timer1 = setTimeout(setupReveal, 100);
    const timer2 = setTimeout(setupReveal, 350);
    const timer3 = setTimeout(setupReveal, 800);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  return null;
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock page scrolling when menu drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  return (
    <Router>
      <ScrollToTop />
      <ScrollRevealTrigger />
      <div className="app-container">
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <MenuDrawer isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        <main className="main-content">
          <Suspense fallback={
            <div className="page-loader" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-gold)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontSize: '0.9rem'
            }}>
              Loading...
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/media" element={<Media />} />
              <Route path="/enquire" element={<Enquire />} />
              {/* Fallback redirect */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
