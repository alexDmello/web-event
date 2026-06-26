import React, { useState, useEffect } from 'react';
import { OptimizedImage } from '../components/OptimizedImage';

interface MediaPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const Media: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [fadeActive, setFadeActive] = useState(true);

  const photos: MediaPhoto[] = [
    { src: '/assets/05 PHOTOS/Weddings/Sanhita & Benny-13.webp', alt: 'Luxury Wedding Altar Styling', width: 8640, height: 5760 },
    { src: '/assets/05 PHOTOS/Haldi-Mehandi/AKR02741.webp', alt: 'Vibrant Marigold Haldi Bathing Ritual', width: 2400, height: 3600 },
    { src: '/assets/05 PHOTOS/Proposal/0001.webp', alt: 'Elegant Seaside Canopy Proposal Design', width: 4660, height: 6990 },
    { src: '/assets/05 PHOTOS/Reception/Weva1701.webp', alt: 'Sleek Modern Dinner Banquet setup', width: 3645, height: 5467 },
    { src: '/assets/05 PHOTOS/Weddings/AKR05567.webp', alt: 'Richly Decorated Ivory Pillars Mandap', width: 2400, height: 3600 },
    { src: '/assets/05 PHOTOS/Haldi-Mehandi/AKR02762.webp', alt: 'Bright Festive Floral Swing Setup', width: 3600, height: 2400 },
    { src: '/assets/05 PHOTOS/Proposal/0008.webp', alt: 'White Rose Entry Arch Columns', width: 4534, height: 6801 },
    { src: '/assets/05 PHOTOS/Reception/SBJR_Ritvika_26Kaushal_Story377_20copy.webp', alt: 'Reflective Mirrored Cake Pavilion', width: 5600, height: 4200 },
    { src: '/assets/05 PHOTOS/Weddings/Sanhita & Benny-27.webp', alt: 'Bride and Groom Grand Entrance Sparklers', width: 8640, height: 5760 },
    { src: '/assets/05 PHOTOS/Haldi-Mehandi/AKR02772.webp', alt: 'Warm Yellow Draped Seating Area', width: 2400, height: 3600 },
    { src: '/assets/05 PHOTOS/Proposal/0012.JPG', alt: 'Romantic Beachfront Proposal Dinner Table', width: 4644, height: 6966 },
    { src: '/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_39266.webp', alt: 'Suspended Wisteria Floral Installations', width: 4608, height: 3072 },
    { src: '/assets/05 PHOTOS/Weddings/AKR07379.webp', alt: 'Classic White and Hydrangea Altar', width: 3600, height: 2400 },
    { src: '/assets/05 PHOTOS/Haldi-Mehandi/AKR02776.webp', alt: 'Hand-painted Pot arrangements and seating', width: 2400, height: 3600 },
    { src: '/assets/05 PHOTOS/Proposal/0039.webp', alt: 'Exquisite Candlelit Coastline Backdrop', width: 4671, height: 7006 },
    { src: '/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_39412.webp', alt: 'Banquet Table Linens and Crystal details', width: 3651, height: 5111 },
    { src: '/assets/05 PHOTOS/Weddings/AKR07499.webp', alt: 'Traditional Red Rose Canopy Details', width: 2400, height: 3600 },
    { src: '/assets/05 PHOTOS/Haldi-Mehandi/AKR02778.webp', alt: 'Festive Bohemian Lounge Styling', width: 2400, height: 3600 },
    { src: '/assets/05 PHOTOS/Proposal/0041.webp', alt: 'Delicate Fairy Lights Tunnel Setup', width: 4579, height: 6844 },
    { src: '/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_44222.webp', alt: 'Glow Signage and Neon Tunnel Archway', width: 3651, height: 4564 },
    { src: '/assets/05 PHOTOS/Weddings/IMG_7087.webp', alt: 'Arching Pastel Pink Blossoms Setup', width: 4752, height: 3168 },
    { src: '/assets/05 PHOTOS/Haldi-Mehandi/AKR03301.webp', alt: 'Vibrant Yellow Backdrop and Drapes', width: 2400, height: 3600 },
    { src: '/assets/05 PHOTOS/Proposal/0044.webp', alt: 'Heart-shaped Warm Light Installations', width: 6315, height: 4210 },
    { src: '/assets/05 PHOTOS/Reception/WEVA1312 2.webp', alt: 'Gilded Tableware and Olive Table Runners', width: 3651, height: 5477 },
    { src: '/assets/05 PHOTOS/Weddings/IMG_7093.webp', alt: 'Lakeside Clear Glass Mandap Altar', width: 4149, height: 6224 },
    { src: '/assets/05 PHOTOS/Haldi-Mehandi/AKR03316.webp', alt: 'Festive Swing Decor with Yellow Rose Garlands', width: 3600, height: 2400 },
    { src: '/assets/05 PHOTOS/Proposal/ANS01113.webp', alt: 'Bespoke Floral Wall Proposal Panel', width: 4591, height: 6886 },
    { src: '/assets/05 PHOTOS/Reception/WEVA1313 2.webp', alt: 'Handcrafted Calligraphy Placecards and Menu Cards', width: 4000, height: 2666 },
    { src: '/assets/05 PHOTOS/Weddings/IMG_7094.webp', alt: 'Pastel Florals Courtyard Stage', width: 4752, height: 3168 },
    { src: '/assets/05 PHOTOS/Haldi-Mehandi/AKR03432.webp', alt: 'Sun-drenched Courtyard Swing and marigold chains', width: 2400, height: 3600 },
    { src: '/assets/05 PHOTOS/Proposal/ANS01928.webp', alt: 'Lush Rose Archway Entryway', width: 4561, height: 6842 },
    { src: '/assets/05 PHOTOS/Reception/SBJR_Ritvika_26Kaushal_Story349.webp', alt: 'Mirror Walkway and Uplighting setups', width: 3651, height: 4564 },
    { src: '/assets/05 PHOTOS/Weddings/IMG_7095.webp', alt: 'Clear Glass Lakeside Altar Details', width: 4024, height: 6036 },
    { src: '/assets/05 PHOTOS/Haldi-Mehandi/AKR03875.webp', alt: 'Festive Yellow Stage with Bright Hangings', width: 2674, height: 3600 },
    { src: '/assets/05 PHOTOS/Weddings/PRJ07750.webp', alt: 'Groom and Bride Grand Exit Mandap', width: 4752, height: 3168 },
    { src: '/assets/05 PHOTOS/Weddings/Sanhita & Benny-19 2.webp', alt: 'Red Rose Mandap Canopy Columns', width: 5760, height: 8640 },
    { src: '/assets/05 PHOTOS/Weddings/Sanhita & Benny-21.webp', alt: 'Warm candle lit temple mandap ceremony', width: 5760, height: 8640 },
    { src: '/assets/05 PHOTOS/Weddings/Sanhita & Benny-24.webp', alt: 'Ornate Silk Drapes and Gold pillars details', width: 5760, height: 8640 },
    { src: '/assets/05 PHOTOS/Weddings/Sanhita & Benny-317 2.webp', alt: 'Pastel Hydrangea Dome Mandap Altar', width: 4631, height: 6946 },
    { src: '/assets/05 PHOTOS/Weddings/AKR05590.webp', alt: 'Courtyard Floral Stage Setup details', width: 2400, height: 3600 }
  ];

  // Note: automatic eager preloading of all 40 high-res gallery images has been removed to reduce thread blocking and network saturation.

  // Lock scrolling when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  // Handle Keyboard Navigation inside the Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setFadeActive(true);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = () => {
    setFadeActive(false);
    setTimeout(() => {
      setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
      setFadeActive(true);
    }, 200);
  };

  const showPrev = () => {
    setFadeActive(false);
    setTimeout(() => {
      setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
      setFadeActive(true);
    }, 200);
  };

  return (
    <div className="media-page-container">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <h1>Media & Impressions</h1>
        <div className="page-banner-diamond"></div>
        <p>A visual gallery of our signature celebrations</p>
      </section>

      {/* MEDIA INTRO */}
      <section className="media-intro reveal-on-scroll">
        <p>
          We curate moments that stay in memories forever. In our visual log, we share snippets of floral arrangements, architectural constructs, bespoke dinner styling, and guest hampers. Follow our ongoing journeys live on our social handles.
        </p>
        <div className="intro-divider" style={{ margin: '30px auto 0' }}></div>
      </section>

      {/* MASONRY GALLERY */}
      <section className="gallery-section">
        <div className="media-masonry" id="gallery-grid">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className="media-item reveal-on-scroll" 
              onClick={() => openLightbox(index)}
              style={{ cursor: 'pointer' }}
            >
              <OptimizedImage
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
              />
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div 
          id="gallery-lightbox" 
          className="lightbox-modal active" 
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('lightbox-content')) {
              closeLightbox();
            }
          }}
        >
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">&times;</button>
          <button className="lightbox-prev" onClick={showPrev} aria-label="Previous image">&#10216;</button>
          <div className="lightbox-content">
            <img 
              id="lightbox-img" 
              src={photos[lightboxIndex].src} 
              alt={photos[lightboxIndex].alt} 
              width={photos[lightboxIndex].width}
              height={photos[lightboxIndex].height}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{ 
                opacity: fadeActive ? 1 : 0, 
                transition: 'opacity 0.2s ease' 
              }} 
            />
          </div>
          <button className="lightbox-next" onClick={showNext} aria-label="Next image">&#10217;</button>
        </div>
      )}

      {/* CALL TO ACTION */}
      <section className="cta-section reveal-on-scroll">
        <div className="cta-container">
          <h2 className="cta-title">See more of our daily work on Instagram.</h2>
          <a href="https://www.instagram.com/taaffeiteevents/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" className="btn-luxury">Visit Instagram</a>
        </div>
      </section>
    </div>
  );
};
