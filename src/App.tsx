import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { MenuDrawer } from './components/MenuDrawer';
import { Footer } from './components/Footer';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Lazy load pages for performance optimization (code splitting)
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Services = React.lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const Media = React.lazy(() => import('./pages/Media').then(module => ({ default: module.Media })));
const Enquire = React.lazy(() => import('./pages/Enquire').then(module => ({ default: module.Enquire })));

// Prefetch all route chunks during browser idle time so navigating between
// pages has zero JS-fetch delay (eliminating the primary source of high INP
// on navigation clicks: the 400-800ms chunk download + parse overhead).
const prefetchRoutes = () => {
  const routes = [
    () => import('./pages/Services'),
    () => import('./pages/Media'),
    () => import('./pages/Enquire'),
  ];
  const loadNext = (index: number) => {
    if (index >= routes.length) return;
    routes[index]().finally(() => {
      setTimeout(() => loadNext(index + 1), 200);
    });
  };
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => loadNext(0), { timeout: 3000 });
  } else {
    setTimeout(() => loadNext(0), 2000);
  }
};

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
          threshold: 0.01,
          // Fire as soon as 1% of the element is in view — no delay before panels appear
          rootMargin: '100px 0px 0px 0px'
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
  // Dismiss global loader once React mounts after preloading the LCP hero image
  useEffect(() => {
    // Prefetch all route JS chunks during idle time (eliminates INP on navigation)
    prefetchRoutes();

    // Only wait for the one image that IS the LCP — the first hero slide
    const heroImages = [
      "/assets/images/logo.webp",
      "/assets/05 PHOTOS/Proposal/0039.webp",
    ];

    // 2. Subpage images to prefetch in the background after home is shown
    const subpageImages = [
      '/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_44222.webp',
      '/assets/05 PHOTOS/Reception/SBJR_Ritvika_26Kaushal_Story349.webp',
      '/assets/05 PHOTOS/Weddings/Sanhita & Benny-13.webp',
      '/assets/05 PHOTOS/Haldi-Mehandi/AKR02741.webp',
      '/assets/05 PHOTOS/Proposal/0001.webp',
      '/assets/05 PHOTOS/Weddings/AKR05567.webp',
      '/assets/05 PHOTOS/Haldi-Mehandi/AKR02762.webp',
      '/assets/05 PHOTOS/Proposal/0008.webp',
      '/assets/05 PHOTOS/Reception/SBJR_Ritvika_26Kaushal_Story377_20copy.webp',
      '/assets/05 PHOTOS/Weddings/Sanhita & Benny-27.webp',
      '/assets/05 PHOTOS/Haldi-Mehandi/AKR02772.webp',
      '/assets/05 PHOTOS/Proposal/0012.webp',
      '/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_39412.webp',
      '/assets/05 PHOTOS/Haldi-Mehandi/AKR02776.webp',
      '/assets/05 PHOTOS/Weddings/AKR07499.webp',
      '/assets/05 PHOTOS/Haldi-Mehandi/AKR02778.webp',
      '/assets/05 PHOTOS/Proposal/0041.webp',
      '/assets/05 PHOTOS/Weddings/IMG_7087.webp',
      '/assets/05 PHOTOS/Haldi-Mehandi/AKR03301.webp',
      '/assets/05 PHOTOS/Proposal/0044.webp',
      '/assets/05 PHOTOS/Reception/WEVA1312 2.webp',
      '/assets/05 PHOTOS/Weddings/IMG_7093.webp',
      '/assets/05 PHOTOS/Haldi-Mehandi/AKR03316.webp',
      '/assets/05 PHOTOS/Proposal/ANS01113.webp',
      '/assets/05 PHOTOS/Reception/WEVA1313 2.webp',
      '/assets/05 PHOTOS/Weddings/IMG_7094.webp',
      '/assets/05 PHOTOS/Haldi-Mehandi/AKR03432.webp',
      '/assets/05 PHOTOS/Proposal/ANS01928.webp',
      '/assets/05 PHOTOS/Weddings/IMG_7095.webp',
      '/assets/05 PHOTOS/Haldi-Mehandi/AKR03875.webp',
      '/assets/05 PHOTOS/Weddings/PRJ07750.webp',
      '/assets/05 PHOTOS/Weddings/Sanhita & Benny-19 2.webp',
      '/assets/05 PHOTOS/Weddings/Sanhita & Benny-21.webp',
      '/assets/05 PHOTOS/Weddings/Sanhita & Benny-24.webp',
      '/assets/05 PHOTOS/Weddings/Sanhita & Benny-317 2.webp',
      '/assets/05 PHOTOS/Weddings/AKR05590.webp'
    ];

    let loadedCount = 0;
    const totalToLoad = heroImages.length;
    let minimumDelayPassed = false;
    let heroImagesLoaded = false;

    const tryDismissLoader = () => {
      if (minimumDelayPassed && heroImagesLoaded) {
        if (typeof (window as any).dismissGlobalLoader === 'function') {
          (window as any).dismissGlobalLoader();
        }
        // Start prefetching secondary page images in the background after home is fully revealed
        setTimeout(() => {
          prefetchImages(subpageImages);
        }, 3000);
      }
    };

    // Preload critical hero images
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount >= totalToLoad) {
          heroImagesLoaded = true;
          tryDismissLoader();
        }
      };
    });

    // 800ms minimum: enough for the logo fade-in to complete on fast connections
    const delayTimer = setTimeout(() => {
      minimumDelayPassed = true;
      tryDismissLoader();
    }, 800);

    // Safety fallback (6 seconds max) in case a connection drops/blocks
    const safetyTimer = setTimeout(() => {
      minimumDelayPassed = true;
      heroImagesLoaded = true;
      tryDismissLoader();
    }, 6000);

    // Incremental background prefetching queue
    const prefetchImages = (urls: string[]) => {
      let index = 0;
      const loadNext = () => {
        if (index >= urls.length) return;
        const img = new Image();
        img.src = urls[index];
        index++;
        // Load with a minor delay spacing to keep main thread completely fluid
        setTimeout(loadNext, 100);
      };

      if (typeof (window as any).requestIdleCallback === 'function') {
        (window as any).requestIdleCallback(() => loadNext());
      } else {
        setTimeout(loadNext, 1000);
      }
    };

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(safetyTimer);
    };
  }, []);
  return (
    <Router>
      <ScrollToTop />
      <ScrollRevealTrigger />
      <SpeedInsights />
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
