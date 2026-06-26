import React from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from './OptimizedImage';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Brand description */}
        <div className="footer-brand">
          <OptimizedImage
            src="/assets/images/logo.png"
            alt="Taaffeite Events Logo"
            className="footer-logo"
            width={80}
            height={80}
            objectFit="contain"
            containerStyle={{ width: '80px', height: '80px', backgroundColor: 'transparent' }}
          />
          <p className="footer-desc">
            Taaffeite is a high-end luxury events planning agency specializing in elegant, warm, and minimal celebrations. Named after one of the rarest gemstones in the world.
          </p>
        </div>

        {/* Page links */}
        <div className="footer-nav">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/media">Media</Link></li>
            <li><Link to="/enquire">Enquire</Link></li>
          </ul>
        </div>

        {/* Profile Links */}
        <div className="footer-nav">
          <h4>Links</h4>
          <ul className="footer-links">
            <li><a href="https://www.wedmegood.com/profile/Taaffeite-Events-25042588?srsltid=AfmBOop_bgaeRe3LCx6eg9jacDSxhOKk-9glpzOU3wzwjiCIgl-829hI" target="_blank" rel="noopener noreferrer">WedMeGood</a></li>
            <li><a href="https://ar.pinterest.com/thetaaffeiteevents/_created/" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
            <li><a href="https://www.linkedin.com/company/taaffeiteevents/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href="https://www.youtube.com/@Taaffeiteevents" target="_blank" rel="noopener noreferrer">YouTube</a></li>
          </ul>
        </div>

        {/* Contact details */}
        <div className="footer-contact">
          <h4>Connect with Us</h4>
          <ul className="footer-links">
            <li>Email: <a href="mailto:thetaaffeiteevents@gmail.com" style={{ color: 'var(--color-gold-dark)' }}>thetaaffeiteevents@gmail.com</a></li>
            <li>WhatsApp: <a href="https://wa.me/919148990266" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-dark)' }}>+91 91489 90266</a></li>
            <li>Instagram: <a href="https://www.instagram.com/taaffeiteevents/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold-dark)' }}>@taaffeiteevents</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Taaffeite Events. All rights reserved.</p>
      </div>
    </footer>
  );
};
