import React from 'react';
import { Link } from 'react-router-dom';

interface MenuDrawerProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`menu-drawer ${isMenuOpen ? 'active' : ''}`}>
      <ul className="menu-nav-links">
        <li>
          <Link to="/" onClick={closeMenu}>Home</Link>
        </li>
        <li>
          <Link to="/services" onClick={closeMenu}>Services</Link>
        </li>
        <li>
          <Link to="/media" onClick={closeMenu}>Media</Link>
        </li>
        <li>
          <Link to="/enquire" onClick={closeMenu}>Enquire</Link>
        </li>
      </ul>
      <div className="menu-drawer-footer">
        <div className="menu-drawer-socials">
          <a href="https://wa.me/919148990266" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="https://www.instagram.com/taaffeiteevents/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.wedmegood.com/profile/Taaffeite-Events-25042588?srsltid=AfmBOop_bgaeRe3LCx6eg9jacDSxhOKk-9glpzOU3wzwjiCIgl-829hI" target="_blank" rel="noopener noreferrer">WedMeGood</a>
        </div>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-charcoal-light)', textTransform: 'uppercase' }}>
          Rare Stories • Rare Celebrations
        </p>
      </div>
    </nav>
  );
};
