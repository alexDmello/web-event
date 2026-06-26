import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../components/OptimizedImage';

// Static Configuration Arrays defined outside component to prevent re-creation on render
const quotes = [
  { text: "Because rare stories deserve rare celebrations.", author: "Brand Essence" },
  { text: "Luxury isn't about doing more. It's about making things feel right.", author: "Our Philosophy" },
  { text: "Honest, beautiful moments shared with the people who matter most.", author: "Our Mission" }
];

const marqueeImages = [
  {
    src: "/assets/05 PHOTOS/Weddings/AKR05567.webp",
    alt: "Floral Mandap styling detail",
    width: 2400,
    height: 3600
  },
  {
    src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02776.webp",
    alt: "Luxury guest welcome hampers",
    width: 2400,
    height: 3600
  },
  {
    src: "/assets/05 PHOTOS/Reception/WEVA1312 2.webp",
    alt: "Luxury reception table setting detail",
    width: 3651,
    height: 5477
  },
  {
    src: "/assets/05 PHOTOS/Weddings/AKR07499.webp",
    alt: "Elegant wedding ceremony mandap",
    width: 2400,
    height: 3600
  },
  {
    src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR02772.webp",
    alt: "Vibrant Haldi celebration setup",
    width: 2400,
    height: 3600
  },
  {
    src: "/assets/05 PHOTOS/Weddings/AKR05590.webp",
    alt: "Elegant wedding floral arch details",
    width: 2400,
    height: 3600
  },
  {
    src: "/assets/05 PHOTOS/Reception/WEVA1313 2.webp",
    alt: "Bespoke dinner banquet design",
    width: 4000,
    height: 2666
  },
  {
    src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03432.webp",
    alt: "Exotic floral canopy styling",
    width: 2400,
    height: 3600
  }
];

const heroImages = [
  { src: "/assets/05 PHOTOS/Proposal/0039.webp", width: 4671, height: 7006 },
  { src: "/assets/05 PHOTOS/Haldi-Mehandi/AKR03316.webp", width: 3600, height: 2400 },
  { src: "/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_39266.webp", width: 4608, height: 3072 },
  { src: "/assets/05 PHOTOS/Weddings/AKR07379.webp", width: 3600, height: 2400 }
];

export const Home: React.FC = () => {

  // Hero Quotes Slider State (discrete value - fine as state)
  const [activeQuote, setActiveQuote] = useState(0);

  // Hero slideshow index (discrete, changes every 4s - fine as state)
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  // Refs for direct DOM manipulation — avoids React re-renders on every scroll frame
  const heroSectionRef = useRef<HTMLElement>(null);
  const aboutShowcaseRef = useRef<HTMLDivElement>(null);
  // Refs to the 3 about slide divs for direct class switching
  const aboutSlideRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  // Track last active slide index to avoid redundant DOM updates
  const lastAboutSlideRef = useRef(-1);





  // Quick Enquiry Form States
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryPhoneFocused, setEnquiryPhoneFocused] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const [enquiryData, setEnquiryData] = useState({
    fullName: '',
    email: '',
    phone: '',
    proposedDate: '',
    celebrationType: 'Wedding Planning',
    guestCount: '',
    location: ''
  });
  const [enquiryOtherDetail, setEnquiryOtherDetail] = useState('');

  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const keyMap: Record<string, string> = {
      'quick-name': 'fullName',
      'quick-email': 'email',
      'quick-phone': 'phone',
      'quick-date': 'proposedDate',
      'quick-type': 'celebrationType',
      'quick-guests': 'guestCount',
      'quick-location': 'location'
    };

    const field = keyMap[id];
    if (field) {
      if (field === 'phone') {
        let digits = value.replace(/\D/g, '');
        if (digits.length === 12 && digits.startsWith('91')) {
          digits = digits.slice(2);
        } else if (digits.length === 11 && digits.startsWith('0')) {
          digits = digits.slice(1);
        }
        digits = digits.slice(0, 10);
        setEnquiryData(prev => ({ ...prev, [field]: digits }));
      } else {
        setEnquiryData(prev => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitting(true);
    setEnquiryError(null);

    const { fullName, email, phone, proposedDate, celebrationType, guestCount, location } = enquiryData;
    if (!fullName || !email || !phone || !proposedDate || !celebrationType || !guestCount || !location) {
      setEnquiryError('Please fill in all required fields.');
      setEnquirySubmitting(false);
      return;
    }

    if (celebrationType === 'Other' && !enquiryOtherDetail.trim()) {
      setEnquiryError('Please specify your celebration type.');
      setEnquirySubmitting(false);
      return;
    }

    if (phone.length !== 10) {
      setEnquiryError('Please enter a valid 10-digit phone number.');
      setEnquirySubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/enquire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          email,
          phone: `+91 ${phone}`,
          proposedDate,
          celebrationType: celebrationType === 'Other' ? `Other: ${enquiryOtherDetail}` : celebrationType,
          guestCount: Number(guestCount),
          location
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }

      setEnquirySubmitted(true);
    } catch (err: any) {
      console.error('Error submitting enquiry form:', err);
      setEnquiryError(err.message || 'Failed to submit form. Please check your connection and try again.');
    } finally {
      setEnquirySubmitting(false);
    }
  };



  const sectionOffsetsRef = useRef<number[]>([]);
  const currentSectionIndex = useRef(0);

  // High-performance smooth scroll snapper — zero layout reflows during scroll
  useEffect(() => {
    let isAnimating = false;

    const recalculateOffsets = () => {
      const selectors = [
        '.hero-wrapper',
        '.why-taaffeite-section',
        '#about-showcase', // Slide 1
        '#about-showcase', // Slide 2
        '#about-showcase', // Slide 3
        '.glimpse-section',
        '.cta-section',
        '.quick-enquiry-section',
        'footer'
      ];
      
      const offsets: number[] = [];
      const windowHeight = window.innerHeight;
      
      selectors.forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (!el) {
          offsets.push(0);
          return;
        }
        // getBoundingClientRect().top + scrollY gives absolute document top position
        const top = el.getBoundingClientRect().top + window.scrollY;
        
        if (sel === '#about-showcase') {
          if (i === 2) offsets.push(Math.round(top));
          if (i === 3) offsets.push(Math.round(top + windowHeight));
          if (i === 4) offsets.push(Math.round(top + 2 * windowHeight));
        } else if (sel === 'footer') {
          offsets.push(Math.round(document.documentElement.scrollHeight - windowHeight));
        } else {
          offsets.push(Math.round(top));
        }
      });
      sectionOffsetsRef.current = offsets;
    };

    const smoothScrollTo = (targetY: number, duration = 1400) => {
      isAnimating = true;
      const startY = window.scrollY;
      const change = targetY - startY;
      let startTime: number | null = null;
      
      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Premium ultra-smooth easeInOutCubic curve
        const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        const easeValue = easeInOutCubic(progress);
        
        window.scrollTo(0, startY + change * easeValue);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animate);
        } else {
          window.scrollTo(0, targetY);
          setTimeout(() => {
            isAnimating = false;
          }, 350); // cooldown for trackpad scroll momentum tails
        }
      };
      
      requestAnimationFrame(animate);
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 992) return;
      
      // Stop browser default jumpy scroll
      e.preventDefault();
      if (isAnimating) return;
      if (Math.abs(e.deltaY) < 12) return; // filter out accidental touch-tap triggers

      const direction = e.deltaY > 0 ? 1 : -1;
      const maxIndex = sectionOffsetsRef.current.length - 1;
      const nextIndex = Math.min(maxIndex, Math.max(0, currentSectionIndex.current + direction));
      
      if (nextIndex !== currentSectionIndex.current) {
        currentSectionIndex.current = nextIndex;
        smoothScrollTo(sectionOffsetsRef.current[nextIndex], 1400);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth < 992) return;
      if (isAnimating) return;
      
      let direction = 0;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        direction = 1;
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        direction = -1;
      }
      
      if (direction !== 0) {
        e.preventDefault();
        const maxIndex = sectionOffsetsRef.current.length - 1;
        const nextIndex = Math.min(maxIndex, Math.max(0, currentSectionIndex.current + direction));
        if (nextIndex !== currentSectionIndex.current) {
          currentSectionIndex.current = nextIndex;
          smoothScrollTo(sectionOffsetsRef.current[nextIndex], 1400);
        }
      }
    };

    const handleScrollSync = () => {
      if (window.innerWidth < 992 || isAnimating) return;
      
      const currentScrollY = window.scrollY;
      let closestIndex = 0;
      let minDiff = Infinity;
      const offsets = sectionOffsetsRef.current;
      
      for (let i = 0; i < offsets.length; i++) {
        const diff = Math.abs(currentScrollY - offsets[i]);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      }
      currentSectionIndex.current = closestIndex;
    };

    // Calculate initial positions once mounted and on resize
    recalculateOffsets();
    window.addEventListener('resize', recalculateOffsets);
    
    // Add scroll snapping listeners (using passive: false to allow e.preventDefault() on scroll animation trigger)
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollSync, { passive: true });

    return () => {
      window.removeEventListener('resize', recalculateOffsets);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollSync);
    };
  }, []);

  // Hero Section Symmetrical Shrink — direct DOM update, ZERO React re-renders
  useEffect(() => {
    const handleHeroScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      if (heroSectionRef.current) {
        heroSectionRef.current.style.transform = `scale(${1 - progress * 0.18})`;
        heroSectionRef.current.style.borderRadius = `${progress * 40}px`;
      }
    };
    window.addEventListener('scroll', handleHeroScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleHeroScroll);
  }, []);

  // Quotes Carousel Interval (4 seconds)
  useEffect(() => {
    const interval = setInterval(() => setActiveQuote(prev => (prev + 1) % quotes.length), 4000);
    return () => clearInterval(interval);
  }, []);

  // Interval for Hero Background Slideshow (4 seconds)
  useEffect(() => {
    const interval = setInterval(() => setHeroImageIndex(prev => (prev + 1) % heroImages.length), 4000);
    return () => clearInterval(interval);
  }, []);

  // About Showcase Scroll Link — direct DOM class switching, ZERO React re-renders
  const updateAboutSlides = useCallback((activeIndex: number) => {
    if (lastAboutSlideRef.current === activeIndex) return; // skip if unchanged
    lastAboutSlideRef.current = activeIndex;
    aboutSlideRefs.current.forEach((el, i) => {
      if (!el) return;
      const cls = activeIndex === i ? 'active' : activeIndex > i ? 'past' : 'future';
      el.className = `about-showcase-slide ${cls}`;
    });
  }, []);

  useEffect(() => {
    const handleAboutScroll = () => {
      if (window.innerWidth < 992) {
        // On mobile: all slides visible — ensure active class on all
        aboutSlideRefs.current.forEach(el => {
          if (el) el.className = 'about-showcase-slide active';
        });
        return;
      }
      if (!aboutShowcaseRef.current) return;
      const rect = aboutShowcaseRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      const progress = Math.max(0, Math.min(-rect.top / totalScrollable, 1));
      updateAboutSlides(Math.min(2, Math.max(0, Math.round(progress * 2))));
    };
    window.addEventListener('scroll', handleAboutScroll, { passive: true });
    window.addEventListener('resize', handleAboutScroll);
    handleAboutScroll();
    return () => {
      window.removeEventListener('scroll', handleAboutScroll);
      window.removeEventListener('resize', handleAboutScroll);
    };
  }, [updateAboutSlides]);

  return (
    <div className="home-page-container">


      {/* 1. HERO SECTION WRAPPER WITH SHRINK ANIMATION */}
      <div className="hero-wrapper">
        <section className="hero-section" ref={heroSectionRef}>
          <div className="hero-slideshow-container">
            {heroImages.map((img, idx) => (
              <OptimizedImage
                key={idx}
                src={img.src}
                width={img.width}
                height={img.height}
                alt={`Luxury Celebration ${idx + 1}`}
                className={`hero-slide-img ${idx === heroImageIndex ? 'active' : ''}`}
                eager={true}
                sizes="100vw"
                containerStyle={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                aspectRatio="unset"
              />
            ))}
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <OptimizedImage
              src="/assets/images/logo.webp"
              alt="Taaffeite Events"
              className="hero-brand-logo"
              width={180}
              height={180}
              eager={true}
              objectFit="contain"
              sizes="180px"
              containerStyle={{ width: '180px', height: '180px', marginTop: '-180px', marginBottom: '20px', backgroundColor: 'transparent' }}
            />
            <div className="hero-quotes-container">
              {quotes.map((quote, idx) => (
                <div
                  key={idx}
                  className={`hero-quote-slide ${idx === activeQuote ? 'active' : ''}`}
                >
                  "{quote.text}"
                  <span className="hero-quote-author">{quote.author}</span>
                </div>
              ))}
            </div>
            <Link to="/enquire" className="hero-enquire-btn">Enquire With Us</Link>
          </div>
        </section>
      </div>

      {/* 1.5. WHY TAAFFEITE SECTION */}
      <section className="why-taaffeite-section reveal-on-scroll">
        <div className="why-taaffeite-container">
          <div className="why-taaffeite-header">
            <span className="why-taaffeite-sub-label">A Statement of Distinction</span>
            <h2 className="why-taaffeite-title">Why Taaffeite?</h2>
            <div className="why-taaffeite-divider"></div>
          </div>
          <div className="why-taaffeite-content-grid">
            <div className="why-taaffeite-video-wrapper">
              <video
                src="/assets/WhyTaffeite2.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="why-taaffeite-video"
              />
            </div>
            <div className="why-taaffeite-text-wrapper">
              <div className="why-taaffeite-point">
                <span className="why-taaffeite-point-num">01</span>
                <div className="why-taaffeite-point-content">
                  <h3>Uncompromising Rarity</h3>
                  <p>Named after one of the world's most exclusive gemstones, we believe your celebration should be equally unique. We reject predictability to design one-of-a-kind experiences.</p>
                </div>
              </div>
              <div className="why-taaffeite-point">
                <span className="why-taaffeite-point-num">02</span>
                <div className="why-taaffeite-point-content">
                  <h3>Artistry in Every Detail</h3>
                  <p>From atmospheric lighting to bespoke floral curation, our team handles every detail with painterly precision, creating spaces that feel alive and breath-taking.</p>
                </div>
              </div>
              <div className="why-taaffeite-point">
                <span className="why-taaffeite-point-num">03</span>
                <div className="why-taaffeite-point-content">
                  <h3>The Luxury of Presence</h3>
                  <p>We handle the complex planning and execution behind the scenes, giving you the ultimate luxury: the peace of mind to be completely present with the people who matter most.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SCROLL-LINKED ABOUT SECTION (3 PARTS) */}
      <div className="about-showcase-container" id="about-showcase" ref={aboutShowcaseRef}>
        {/* Invisible anchors to trigger native CSS scroll snapping for the sticky slides */}
        <div className="about-snap-trigger" style={{ position: 'absolute', top: 0, height: '100vh', width: '1px', pointerEvents: 'none' }} />
        <div className="about-snap-trigger" style={{ position: 'absolute', top: '100vh', height: '100vh', width: '1px', pointerEvents: 'none' }} />
        <div className="about-snap-trigger" style={{ position: 'absolute', top: '200vh', height: '100vh', width: '1px', pointerEvents: 'none' }} />
        
        <div className="about-showcase-sticky">

          {/* Slide 1 — initial: active (visible on load) */}
          <div
            ref={el => { aboutSlideRefs.current[0] = el; }}
            className="about-showcase-slide active"
            id="about-slide-0"
          >
            <div className="about-showcase-grid">
              <div className="about-showcase-info">
                <h3 className="about-showcase-title">It Starts With Your Story</h3>
                <div className="about-slide-gold-line"></div>
                <p className="about-showcase-desc">
                  Every celebration begins with people, not plans.Before we think about colours, venues, or timelines, we take time to understand who you are, what matters to your family, and the moments you want to remember years from now. Every decision we make grows from your story, your traditions, and your vision, creating a celebration that feels deeply personal from beginning to end.
                </p>
              </div>
              <div className="about-showcase-image-wrapper">
                <OptimizedImage
                  src="/assets/05 PHOTOS/Weddings/AKR05567.webp"
                  alt="Taaffeite Beliefs & Proposal Setup"
                  className="about-showcase-image"
                  width={2400}
                  height={3600}
                  eager={true}
                  sizes="(max-width: 992px) 100vw, 50vw"
                  aspectRatio="unset"
                />
              </div>
            </div>
          </div>

          {/* Slide 2 — initial: future (below, awaiting scroll) */}
          <div
            ref={el => { aboutSlideRefs.current[1] = el; }}
            className="about-showcase-slide future"
            id="about-slide-1"
          >
            <div className="about-showcase-grid">
              <div className="about-showcase-info">
                <h3 className="about-showcase-title">Inspired by Rarity</h3>
                <div className="about-slide-gold-line"></div>
                <p className="about-showcase-desc">
                  Taaffeite is one of the rarest gemstones in the world, and that belief shapes everything we create. We have never believed in celebrations that look copied or predictable. Every couple, every family, and every story deserves something uniquely their own. That is why we approach every event with fresh ideas, thoughtful design, and an unwavering attention to detail, creating experiences that feel timeless rather than trendy.
                </p>
              </div>
              <div className="about-showcase-image-wrapper">
                <OptimizedImage
                  src="/assets/05 PHOTOS/Weddings/Sanhita & Benny-317 2.webp"
                  alt="Taaffeite Luxury Wedding Ceremony Setup"
                  className="about-showcase-image"
                  width={4631}
                  height={6946}
                  eager={true}
                  sizes="(max-width: 992px) 100vw, 50vw"
                  aspectRatio="unset"
                />
              </div>
            </div>
          </div>

          {/* Slide 3 — initial: future (below, awaiting scroll) */}
          <div
            ref={el => { aboutSlideRefs.current[2] = el; }}
            className="about-showcase-slide future"
            id="about-slide-2"
          >
            <div className="about-showcase-grid">
              <div className="about-showcase-info">
                <h3 className="about-showcase-title">Designed So You Can Be Present</h3>
                <div className="about-slide-gold-line"></div>
                <p className="about-showcase-desc">
                  The most memorable celebrations are the ones where you never have to think about what comes next. While you enjoy every conversation, embrace every loved one, and live every moment, we quietly manage everything behind the scenes. From planning and coordination to the smallest finishing touches, every detail is carefully orchestrated so your celebration unfolds effortlessly, exactly as it should.
                </p>
              </div>
              <div className="about-showcase-image-wrapper">
                <OptimizedImage
                  src="/assets/05 PHOTOS/Reception/Weva1701.webp"
                  alt="Taaffeite Luxury Reception Design"
                  className="about-showcase-image"
                  width={3645}
                  height={5467}
                  eager={true}
                  sizes="(max-width: 992px) 100vw, 50vw"
                  aspectRatio="unset"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. A GLIMPSE INTO THE WORLD WE CREATE */}
      <section className="glimpse-section reveal-on-scroll">
        <div className="glimpse-container">
          <div className="glimpse-text-wrapper">
            <span className="glimpse-sub-label">A Glimpse Into</span>
            <h2 className="glimpse-title">The World We Create</h2>
            <div className="glimpse-divider"></div>
            <p className="glimpse-desc">
              From intimate gatherings shared among close family and friends to grand, multi-day celebrations filled with unforgettable moments, every event we create is thoughtfully designed to reflect the people at the heart of it. We believe that no two stories are ever the same, which is why every celebration we plan is approached with care, creativity, and a deep understanding of what matters most to our clients.
            </p>
          </div>

          {/* Curated infinite marquee image slider */}
          <div className="glimpse-marquee-container">
            <div className="glimpse-marquee-track">
              {/* First Set */}
              {marqueeImages.map((img, idx) => (
                <div key={`set1-${idx}`} className="glimpse-marquee-card">
                  <OptimizedImage
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    eager={true}
                    sizes="(max-width: 768px) 85vw, 300px"
                    aspectRatio="unset"
                    containerStyle={{ width: '100%', height: '100%' }}
                  />
                </div>
              ))}
              {/* Duplicate Set for infinite looping */}
              {marqueeImages.map((img, idx) => (
                <div key={`set2-${idx}`} className="glimpse-marquee-card" aria-hidden="true">
                  <OptimizedImage
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    eager={true}
                    sizes="(max-width: 768px) 85vw, 300px"
                    aspectRatio="unset"
                    containerStyle={{ width: '100%', height: '100%' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glimpse-action">
            <Link to="/media" className="btn-editorial">View Full Media Gallery</Link>
          </div>
        </div>
      </section>




      {/* 8. CALL TO ACTION */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">"Because rare stories deserve rare celebrations."</h2>
        </div>
      </section>

      {/* 7.5. QUICK ENQUIRY SECTION */}
      <section className="quick-enquiry-section reveal-on-scroll">
        <div className="quick-enquiry-container">
          <div className="quick-enquiry-header">
            <span className="intro-title">Quick Enquiry</span>
            <h2>Tell Us About Your Celebration</h2>
            <p>Share the initial details of your vision, and we will get back to you within 24 hours.</p>
          </div>

          {!enquirySubmitted ? (
            <form className="quick-enquiry-form" onSubmit={handleEnquirySubmit}>
              {enquiryError && (
                <div className="quick-enquiry-error">
                  <span>⚠️</span> {enquiryError}
                </div>
              )}

              {/* Row 1: Name and Email */}
              <div className="form-row two-cols">
                <div className="form-group">
                  <label htmlFor="quick-name">Your Full Name *</label>
                  <input
                    type="text"
                    id="quick-name"
                    required
                    disabled={enquirySubmitting}
                    placeholder="e.g. Eleanor Vance"
                    value={enquiryData.fullName}
                    onChange={handleEnquiryChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quick-email">Email Address *</label>
                  <input
                    type="email"
                    id="quick-email"
                    required
                    disabled={enquirySubmitting}
                    placeholder="e.g. eleanor@example.com"
                    value={enquiryData.email}
                    onChange={handleEnquiryChange}
                  />
                </div>
              </div>

              {/* Row 2: Phone and Proposed Date */}
              <div className="form-row two-cols">
                <div className="form-group">
                  <label htmlFor="quick-phone">Phone / WhatsApp Number *</label>
                  <div className={`phone-input-wrapper ${enquiryPhoneFocused ? 'focused' : ''}`}>
                    <span className="phone-prefix">+91</span>
                    <input
                      type="tel"
                      id="quick-phone"
                      required
                      disabled={enquirySubmitting}
                      placeholder="98765 43210"
                      value={enquiryData.phone}
                      onChange={handleEnquiryChange}
                      onFocus={() => setEnquiryPhoneFocused(true)}
                      onBlur={() => setEnquiryPhoneFocused(false)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="quick-date">Proposed Date *</label>
                  <input
                    type="date"
                    id="quick-date"
                    required
                    disabled={enquirySubmitting}
                    value={enquiryData.proposedDate}
                    onChange={handleEnquiryChange}
                  />
                </div>
              </div>

              {/* Row 3: Celebration Type and Guest Count */}
              <div className="form-row two-cols">
                <div className="form-group">
                  <label htmlFor="quick-type">Celebration Type *</label>
                  <select
                    id="quick-type"
                    required
                    disabled={enquirySubmitting}
                    value={enquiryData.celebrationType}
                    onChange={handleEnquiryChange}
                  >
                    <option value="Wedding Planning">Wedding Celebration</option>
                    <option value="Pre-Wedding Celebration">Pre-Wedding (Sangeet, Haldi, Mehendi)</option>
                    <option value="Milestone Birthday">Milestone Birthday / Party</option>
                    <option value="Bespoke Private Event">Bespoke Private Event</option>
                    <option value="Destination Celebration">Destination Wedding / Celebration</option>
                    <option value="Other">Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="quick-guests">Estimated Guest Count *</label>
                  <input
                    type="number"
                    id="quick-guests"
                    required
                    disabled={enquirySubmitting}
                    min="1"
                    placeholder="e.g. 150"
                    value={enquiryData.guestCount}
                    onChange={handleEnquiryChange}
                  />
                </div>
              </div>

              {/* Row 4: Specify Celebration Type (Conditional) */}
              <div className={`conditional-form-row ${enquiryData.celebrationType === 'Other' ? 'show' : ''}`}>
                <div className="form-group">
                  <label htmlFor="quick-other-detail">Specify Celebration Type *</label>
                  <input
                    type="text"
                    id="quick-other-detail"
                    required={enquiryData.celebrationType === 'Other'}
                    disabled={enquirySubmitting}
                    placeholder="e.g. Corporate Anniversary Gala, Proposal, Baby Shower"
                    value={enquiryOtherDetail}
                    onChange={(e) => setEnquiryOtherDetail(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 5: Proposed Location */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quick-location">Proposed Location / City *</label>
                  <input
                    type="text"
                    id="quick-location"
                    required
                    disabled={enquirySubmitting}
                    placeholder="e.g. Bangalore, India"
                    value={enquiryData.location}
                    onChange={handleEnquiryChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn-form-submit" disabled={enquirySubmitting}>
                {enquirySubmitting ? 'Sending Request...' : 'Send Inquiry'}
              </button>
            </form>
          ) : (
            <div className="quick-enquiry-success">
              <h3>Thank You, {enquiryData.fullName}</h3>
              <p>
                Your inquiry for the <strong>{enquiryData.celebrationType === 'Other' ? enquiryOtherDetail : enquiryData.celebrationType}</strong> on <strong>{enquiryData.proposedDate}</strong> has been received successfully.
                Our luxury planning directors will connect with you via email or WhatsApp within 24 hours.
              </p>
            </div>
          )}
        </div>
      </section>


    </div>
  );
};
