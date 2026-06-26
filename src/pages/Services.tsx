import React from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../components/OptimizedImage';

export const Services: React.FC = () => {
  const serviceCategories = [
    {
      id: 'planning',
      title: 'Wedding Planning & Coordination',
      image: '/assets/05 PHOTOS/Weddings/Sanhita & Benny-317 2.webp',
      items: [
        'End-to-end wedding planning',
        'Wedding day coordination',
        'Timeline & schedule management',
        'Family coordination',
        'Vendor management',
        'Guest flow management'
      ]
    },
    {
      id: 'decor',
      title: 'Décor & Styling',
      image: '/assets/05 PHOTOS/Weddings/AKR05567.webp',
      items: [
        'Wedding décor conceptualization',
        'Stage & mandap styling',
        'Floral coordination',
        'Entrance & venue styling',
        'Lighting & ambience planning',
        'Table setups & styling details'
      ]
    },
    {
      id: 'pre-wedding',
      title: 'Pre-Wedding Celebrations',
      image: '/assets/05 PHOTOS/Haldi-Mehandi/AKR03316.webp',
      items: [
        'Mehendi planning & styling',
        'Haldi setup & coordination',
        'Engagement ceremonies',
        'Sangeet planning',
        'Bridal shower & intimate events'
      ]
    },
    {
      id: 'hospitality',
      title: 'Hospitality & Guest Experience',
      image: '/assets/05 PHOTOS/Haldi-Mehandi/AKR02776.webp',
      items: [
        'Guest management',
        'Welcome experiences',
        'Room hampers & gifting',
        'RSVP coordination',
        'Hospitality desk management',
        'Artist & guest assistance'
      ]
    },
    {
      id: 'production',
      title: 'Entertainment & Production',
      image: '/assets/05 PHOTOS/Reception/SBJR_Ritvika_2BKaushal_44222.webp',
      items: [
        'Artist coordination',
        'Sound & light coordination',
        'DJ & entertainment management',
        'Dance floor & performance setup',
        'Technical production support'
      ]
    },
    {
      id: 'logistics',
      title: 'Logistics & Execution',
      image: '/assets/05 PHOTOS/Reception/SBJR_Ritvika_26Kaushal_Story349.webp',
      items: [
        'Venue layout planning',
        'Seating plans',
        'Entry & movement management',
        'Transportation coordination',
        'On-ground execution team',
        'Vendor supervision'
      ]
    },
    {
      id: 'essentials',
      title: 'Wedding Essentials',
      image: '/assets/05 PHOTOS/Reception/WEVA1313 2.webp',
      items: [
        'Invitations & stationery coordination',
        'Bridal entry concepts',
        'Couple styling coordination',
        'Wedding favors & gifting',
        'Ritual setup coordination'
      ]
    },
    {
      id: 'bespoke',
      title: 'Bespoke Celebrations',
      image: '/assets/05 PHOTOS/Proposal/0039.webp',
      items: [
        'Intimate weddings',
        'Destination weddings',
        'Luxury receptions',
        'Private celebrations',
        'Birthday & milestone events',
        'Custom-designed event experiences'
      ]
    }
  ];

  return (
    <div className="services-page-container">
      {/* PAGE BANNER */}
      <section className="page-banner">
        <h1>Our Services</h1>
        <div className="page-banner-diamond"></div>
        <p>Expertly curated, beautifully executed celebrations</p>
      </section>

      {/* SERVICES CONTENT SECTION */}
      <section className="services-list-section">
        <div className="services-grid-list">
          {serviceCategories.map((category) => (
            <div key={category.id} className="service-card-new reveal-on-scroll" id={category.id}>
              <div className="service-image-container">
                <OptimizedImage
                  src={category.image}
                  alt={category.title}
                  width={800}
                  height={600}
                  className="service-bg-image"
                  containerStyle={{ height: '100%', width: '100%' }}
                  aspectRatio="unset"
                />
                <div className="service-overlay-gradient"></div>
                <div className="service-title-wrapper">
                  <h3>{category.title}</h3>
                  <div className="service-hover-indicator">
                    <span>View Details</span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="service-hover-details">
                <h4>What's Included</h4>
                <ul className="service-items-list-new">
                  {category.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimers / Footnotes */}
        <div className="catering-disclaimer reveal-on-scroll">
          <p>
            <strong>Note on Catering:</strong> Taaffeite currently does not undertake catering services directly, but coordinates seamlessly with premium catering partners chosen by the client to maintain absolute culinary alignment and event flow.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section reveal-on-scroll">
        <div className="cta-container">
          <h2 className="cta-title">Let's craft your milestone event.</h2>
          <Link to="/enquire" className="btn-luxury">Enquire with us</Link>
        </div>
      </section>
    </div>
  );
};
