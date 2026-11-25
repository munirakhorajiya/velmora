import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="dp-homepage">
      {/* 1. Top Lookbook Hero: 2-Column Split */}
      <section className="dp-hero-split">
        {/* Left Column: Resort '26 Collection */}
        <div className="dp-hero-col">
          <Link to="/collections/shop-all-bags?category=Bags" className="dp-hero-tile">
            <div className="dp-hero-media">
              <img src="/media/editorial/hero_resort.jpg" alt="Resort '26 Collection" className="dp-hero-img" />
            </div>
            <div className="dp-hero-overlay">
              <span className="dp-overlay-link">RESORT '26 COLLECTION</span>
            </div>
          </Link>
        </div>

        {/* Right Column: New Arrivals */}
        <div className="dp-hero-col">
          <Link to="/collections/shop-all-bags?badge=New" className="dp-hero-tile">
            <div className="dp-hero-media">
              <img src="/media/editorial/hero_new_arrivals.jpg" alt="New Arrivals" className="dp-hero-img" />
            </div>
            <div className="dp-hero-overlay">
              <span className="dp-overlay-link">NEW ARRIVALS</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 2. Middle Hero: Full-Width Summer Sandals Banner */}
      <section className="dp-hero-full">
        <Link to="/collections/shoes" className="dp-hero-tile">
          <div className="dp-hero-media">
            <img src="/media/editorial/hero_sandals.jpg" alt="Shop Summer Sandals" className="dp-hero-img" />
          </div>
          <div className="dp-hero-overlay">
            <span className="dp-overlay-link">SHOP SUMMER SANDALS</span>
          </div>
        </Link>
      </section>

      {/* 3. Four-Column Product Category Strip */}
      <section className="dp-category-strip">
        <div className="dp-cat-grid">
          {/* Col 1: Tote Bags */}
          <div className="dp-cat-item">
            <Link to="/collections/shop-all-bags?category=tote" className="dp-cat-link">
              <div className="dp-cat-header">
                <span className="dp-cat-title">TOTE BAGS</span>
              </div>
              <div className="dp-cat-image-wrap">
                <img src="/media/editorial/cat_tote.jpg" alt="Tote Bags" className="dp-cat-img" />
              </div>
            </Link>
          </div>

          {/* Col 2: Shoulder Bags */}
          <div className="dp-cat-item">
            <Link to="/collections/shop-all-bags?category=shoulder" className="dp-cat-link">
              <div className="dp-cat-header">
                <span className="dp-cat-title">SHOULDER BAGS</span>
              </div>
              <div className="dp-cat-image-wrap">
                <img src="/media/editorial/cat_shoulder.jpg" alt="Shoulder Bags" className="dp-cat-img" />
              </div>
            </Link>
          </div>

          {/* Col 3: Icons */}
          <div className="dp-cat-item">
            <Link to="/collections/shop-all-bags?badge=Icon" className="dp-cat-link">
              <div className="dp-cat-header">
                <span className="dp-cat-title">ICONS</span>
              </div>
              <div className="dp-cat-image-wrap">
                <img src="/media/editorial/cat_icons.jpg" alt="Icons" className="dp-cat-img" />
              </div>
            </Link>
          </div>

          {/* Col 4: Footwear */}
          <div className="dp-cat-item">
            <Link to="/collections/shoes" className="dp-cat-link">
              <div className="dp-cat-header">
                <span className="dp-cat-title">FOOTWEAR</span>
              </div>
              <div className="dp-cat-image-wrap">
                <img src="/media/editorial/cat_footwear.jpg" alt="Footwear" className="dp-cat-img" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Five-Column Brand Commitments & Editorial Grid */}
      <section className="dp-stories-section">
        <div className="dp-stories-grid">
          {/* Card 1: Loyalty */}
          <div className="dp-story-item">
            <Link to="/pages/loyalty" className="dp-story-link">
              <div className="dp-story-image-wrap">
                <img src="/media/editorial/story_loyalty.jpg" alt="Loyalty" className="dp-story-img" />
              </div>
              <div className="dp-story-details">
                <h3 className="dp-story-title">LOYALTY</h3>
                <p className="dp-story-desc">Velmora's tiered loyalty programme with bespoke gifting and early access.</p>
              </div>
            </Link>
          </div>

          {/* Card 2: Transparency */}
          <div className="dp-story-item">
            <Link to="/pages/transparency" className="dp-story-link">
              <div className="dp-story-image-wrap">
                <img src="/media/editorial/story_transparency.jpg" alt="Transparency" className="dp-story-img" />
              </div>
              <div className="dp-story-details">
                <h3 className="dp-story-title">TRANSPARENCY</h3>
                <p className="dp-story-desc">A commitment to responsible materials, thoughtful craft, and pieces made to endure.</p>
              </div>
            </Link>
          </div>

          {/* Card 3: Find Your Local */}
          <div className="dp-story-item">
            <Link to="/pages/stores" className="dp-story-link">
              <div className="dp-story-image-wrap">
                <img src="/media/editorial/story_local.jpg" alt="Find Your Local" className="dp-story-img" />
              </div>
              <div className="dp-story-details">
                <h3 className="dp-story-title">FIND YOUR LOCAL</h3>
                <p className="dp-story-desc">Our stores provide a serene space to live and breathe the magic that is Velmora.</p>
              </div>
            </Link>
          </div>

          {/* Card 4: Journal */}
          <div className="dp-story-item">
            <Link to="/pages/journal" className="dp-story-link">
              <div className="dp-story-image-wrap">
                <img src="/media/editorial/story_journal.jpg" alt="Journal" className="dp-story-img" />
              </div>
              <div className="dp-story-details">
                <h3 className="dp-story-title">JOURNAL</h3>
                <p className="dp-story-desc">Discover our Journal - a space for collections, creativity, and inspiration.</p>
              </div>
            </Link>
          </div>

          {/* Card 5: Express Shipping */}
          <div className="dp-story-item">
            <Link to="/pages/shipping" className="dp-story-link">
              <div className="dp-story-image-wrap">
                <img src="/media/editorial/story_shipping.jpg" alt="Express Shipping" className="dp-story-img" />
              </div>
              <div className="dp-story-details">
                <h3 className="dp-story-title">EXPRESS SHIPPING</h3>
                <p className="dp-story-desc">Enjoy complimentary express shipping on all orders, with 14-day exchanges and returns.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
