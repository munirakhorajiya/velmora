import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const Footer: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to Velmora.');
      setFirstName('');
      setLastName('');
      setEmail('');
    }
  };

  return (
    <footer className="footer-velmora-light" id="siteFooter">
      <div className="footer-inner-wrap">
        {/* Top Row: Newsletter (Left) & 4 Link Columns + B-Corp (Right) */}
        <div className="footer-top-row">
          {/* Left: Newsletter with 3 Underline Inputs */}
          <div className="footer-newsletter-col">
            <h4 className="footer-newsletter-heading">Sign up for 10% off your first order</h4>
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <div className="footer-input-field">
                <input
                  type="text"
                  placeholder="First name"
                  required
                  className="footer-line-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="footer-input-field">
                <input
                  type="text"
                  placeholder="Last name"
                  required
                  className="footer-line-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="footer-input-field">
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  className="footer-line-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="footer-subscribe-btn">
                SUBSCRIBE
              </button>
            </form>
          </div>

          {/* Right: 4 Nav Columns & Certified B-Corp Badge */}
          <div className="footer-nav-columns">
            {/* Column 1: Customer Care */}
            <div className="footer-nav-col">
              <h5 className="footer-col-header">CUSTOMER CARE</h5>
              <ul className="footer-col-list">
                <li><Link to="/pages/contact">Contact</Link></li>
                <li><Link to="/pages/faqs">FAQs</Link></li>
                <li><Link to="/pages/shipping">Shipping</Link></li>
                <li><Link to="/pages/returns">Returns</Link></li>
                <li><Link to="/pages/product-care">Product Care</Link></li>
                <li><Link to="/pages/loyalty">Loyalty</Link></li>
                <li><Link to="/login">Customer Sign In</Link></li>
                <li><Link to="/provider/dashboard">Atelier Provider Portal</Link></li>
                <li><a href="#book-virtual-styling" onClick={(e) => { e.preventDefault(); toast.info('Virtual styling bookings open shortly.'); }}>Book Virtual Styling</a></li>
              </ul>
            </div>

            {/* Column 2: About */}
            <div className="footer-nav-col">
              <h5 className="footer-col-header">ABOUT</h5>
              <ul className="footer-col-list">
                <li><Link to="/pages/stores">Store Locator</Link></li>
                <li><Link to="/pages/story">Our Story</Link></li>
                <li><Link to="/pages/journal">Journal</Link></li>
                <li><Link to="/pages/transparency">Transparency</Link></li>
                <li><Link to="/pages/stockists">Stockists</Link></li>
                <li><Link to="/pages/careers">Careers</Link></li>
                <li><Link to="/pages/sitemap">Sitemap</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="footer-nav-col">
              <h5 className="footer-col-header">LEGAL</h5>
              <ul className="footer-col-list">
                <li><Link to="/pages/terms">Terms of Service</Link></li>
                <li><Link to="/pages/loyalty-terms">Loyalty Terms</Link></li>
                <li><Link to="/pages/privacy">Privacy Policy</Link></li>
                <li><Link to="/pages/legal-notice">Legal Notice</Link></li>
                <li><Link to="/pages/accessibility">Accessibility</Link></li>
              </ul>
            </div>

            {/* Column 4: Follow */}
            <div className="footer-nav-col">
              <h5 className="footer-col-header">FOLLOW</h5>
              <ul className="footer-col-list">
                <li><a href="https://www.instagram.com/velmora/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://www.tiktok.com/@velmora" target="_blank" rel="noopener noreferrer">TikTok</a></li>
                <li><a href="https://www.facebook.com/velmora/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                <li><a href="https://nz.pinterest.com/velmora/" target="_blank" rel="noopener noreferrer">Pinterest</a></li>
              </ul>
            </div>

            {/* B-Corp Badge */}
            <div className="footer-bcorp-col">
              <img
                src="/media/editorial/bcorp.png"
                alt="Certified B Corporation"
                className="footer-bcorp-badge"
                width="55"
                height="85"
              />
            </div>
          </div>
        </div>

        {/* Bottom Giant Brand Wordmark & Copyright */}
        <div className="footer-bottom-brand-row">
          <div className="footer-giant-logo-wrap">
            <span className="footer-giant-wordmark">VELMORA</span>
          </div>
          <div className="footer-copyright-wrap">
            <span>&copy; {new Date().getFullYear()} VELMORA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
