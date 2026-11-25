import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const LoyaltyPage: React.FC = () => {
  const [activeTier, setActiveTier] = useState<'club' | 'gold' | 'black'>('club');
  const [spendValue, setSpendValue] = useState<number>(1050);
  const [openFaq, setOpenFaq] = useState<number | null>(1);

  const getTierInfo = (spend: number) => {
    if (spend >= 3000) {
      return {
        name: 'VELMORA BLACK',
        note: 'Maximum tier privileges unlocked.',
        fillPercent: 100,
      };
    } else if (spend >= 1500) {
      return {
        name: 'VELMORA GOLD',
        note: `Requires $${3000 - spend} to reach VELMORA BLACK`,
        fillPercent: 50 + ((spend - 1500) / 1500) * 50,
      };
    } else if (spend >= 750) {
      return {
        name: 'VELMORA CLUB',
        note: `Requires $${1500 - spend} to reach VELMORA GOLD`,
        fillPercent: 25 + ((spend - 750) / 750) * 25,
      };
    } else {
      return {
        name: 'GUEST',
        note: `Requires $${750 - spend} to enter VELMORA CLUB`,
        fillPercent: (spend / 750) * 25,
      };
    }
  };

  const currentTier = getTierInfo(spendValue);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="dp-page-container dp-loyalty-page">
      {/* Breadcrumb */}
      <div className="dp-breadcrumbs">
        <Link to="/">Home</Link> <span className="sep">/</span> <span>Velmora Club Loyalty</span>
      </div>

      {/* Hero Header */}
      <section className="dp-editorial-hero text-center">
        <span className="dp-editorial-kicker">MEMBERSHIP PRIVILEGES</span>
        <h1 className="dp-editorial-title">WELCOME TO VELMORA CLUB</h1>
        <div className="dp-editorial-quote-wrap">
          <blockquote className="dp-editorial-quote">
            “Bask in the benefits of our tiered loyalty, designed to elevate your Velmora experience.”
          </blockquote>
          <div className="dp-hero-actions">
            <Link to="/login" className="btn-dp-outline">ACCOUNT LOG IN</Link>
            <a href="#tiers" className="btn-dp-dark">EXPLORE TIERS</a>
          </div>
        </div>
      </section>

      {/* Interactive Membership Tiers Section */}
      <section className="dp-membership-tiers-section" id="tiers">
        <div className="dp-membership-container">
          {/* Left: Tab Controls & Tier Information */}
          <div className="dp-tier-content">
            <h2 className="dp-tier-title">Membership Tiers</h2>

            {/* Tab Navigation Buttons */}
            <div className="dp-tier-tabs" role="tablist">
              <button
                type="button"
                className={`dp-tier-tab ${activeTier === 'club' ? 'is-active' : ''}`}
                onClick={() => setActiveTier('club')}
                role="tab"
                aria-selected={activeTier === 'club'}
              >
                <span>VELMORA CLUB</span>
              </button>
              <button
                type="button"
                className={`dp-tier-tab ${activeTier === 'gold' ? 'is-active' : ''}`}
                onClick={() => setActiveTier('gold')}
                role="tab"
                aria-selected={activeTier === 'gold'}
              >
                <span>VELMORA GOLD</span>
              </button>
              <button
                type="button"
                className={`dp-tier-tab ${activeTier === 'black' ? 'is-active' : ''}`}
                onClick={() => setActiveTier('black')}
                role="tab"
                aria-selected={activeTier === 'black'}
              >
                <span>VELMORA BLACK</span>
              </button>
            </div>

            {/* Tier 1: Velmora Club */}
            {activeTier === 'club' && (
              <div className="dp-tier-panel is-active" id="panel-club" role="tabpanel">
                <div className="dp-tier-spend-badge">LIFETIME SPEND $750+</div>
                <p className="dp-tier-lead">Your welcoming threshold into the Velmora inner circle.</p>
                <ul className="dp-tier-perks">
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>$50 Atelier Credit:</strong> Enjoy $50 off your next order following tier admission.</span>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>Curated Rewards:</strong> Access seasonal gift-with-purchase releases and limited edition capsules.</span>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>Private Save-the-Dates:</strong> Advance alerts for new season arrivals and boutique launches.</span>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>Complimentary Gift Wrapping:</strong> Signature archival debossed packaging on every order.</span>
                  </li>
                </ul>
                <div className="dp-tier-cta">
                  <Link to="/collections/shop-all-bags" className="btn-dp-dark">SHOP TO QUALIFY</Link>
                </div>
              </div>
            )}

            {/* Tier 2: Velmora Gold */}
            {activeTier === 'gold' && (
              <div className="dp-tier-panel is-active" id="panel-gold" role="tabpanel">
                <div className="dp-tier-spend-badge">LIFETIME SPEND $1,500+</div>
                <p className="dp-tier-lead">Expanded bespoke privileges and priority fulfillment.</p>
                <ul className="dp-tier-perks">
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>$75 Atelier Credit:</strong> Enjoy $75 off your next order following tier admission.</span>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>VIP Early Access:</strong> Priority shopping 48 hours ahead of public release dates.</span>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>Birthday Gifting:</strong> An exclusive curated Velmora leather accessory during your birthday month.</span>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>Complimentary Worldwide Shipping:</strong> Free DHL Express priority delivery on all orders.</span>
                  </li>
                </ul>
                <div className="dp-tier-cta">
                  <Link to="/collections/shop-all-bags" className="btn-dp-dark">EXPLORE GOLD COLLECTION</Link>
                </div>
              </div>
            )}

            {/* Tier 3: Velmora Black */}
            {activeTier === 'black' && (
              <div className="dp-tier-panel is-active" id="panel-black" role="tabpanel">
                <div className="dp-tier-spend-badge">LIFETIME SPEND $3,000+</div>
                <p className="dp-tier-lead">Our most prestigious tier with atelier craftsmanship privileges.</p>
                <ul className="dp-tier-perks">
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>Exclusive Tier Gift:</strong> Limited edition handcrafted product created exclusively for Black members.</span>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>First & Guaranteed Access:</strong> Guaranteed allocation for bespoke run collections and runway pieces.</span>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>Complimentary Leather Rejuvenation:</strong> Unlimited lifetime spa, leather nourishment & brass polishing atelier service.</span>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>Private Concierge & Styling:</strong> Dedicated 1-on-1 virtual or in-boutique appointments with our senior stylists.</span>
                  </li>
                  <li>
                    <span className="perk-bullet">✦</span>
                    <span><strong>Complimentary Worldwide Priority Express:</strong> Signed white-glove handover.</span>
                  </li>
                </ul>
                <div className="dp-tier-cta">
                  <Link to="/collections/shop-all-bags" className="btn-dp-dark">EXPERIENCE VELMORA BLACK</Link>
                </div>
              </div>
            )}
          </div>

          {/* Right: Cross-Fading Tier Imagery */}
          <div className="dp-tier-media-wrap">
            {activeTier === 'club' && (
              <div className="dp-tier-img is-active" id="img-club">
                <img src="/media/editorial/loyalty_refer.jpg" alt="Velmora Club Tier" className="img-fluid" />
                <div className="dp-tier-caption">Velmora Club — Curated Gift Rewards & Access</div>
              </div>
            )}
            {activeTier === 'gold' && (
              <div className="dp-tier-img is-active" id="img-gold">
                <img src="/media/editorial/loyalty_black.jpg" alt="Velmora Gold Tier" className="img-fluid" />
                <div className="dp-tier-caption">Velmora Gold — Priority Early Access & Birthday Gifts</div>
              </div>
            )}
            {activeTier === 'black' && (
              <div className="dp-tier-img is-active" id="img-black">
                <img src="/media/editorial/loyalty_header.jpg" alt="Velmora Black Tier" className="img-fluid" />
                <div className="dp-tier-caption">Velmora Black — Atelier Rejuvenation & Limited Editions</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Spend Simulator */}
      <section className="dp-spend-tracker-section">
        <div className="container text-center">
          <h3 className="dp-section-subtitle">YOUR PRIVILEGES JOURNEY</h3>
          <h2 className="dp-section-heading">How Tier Progression Works</h2>
          <p className="dp-tracker-desc">
            Your tier status is determined by your cumulative lifetime purchases across bags, footwear, and leather goods.
            Every $1 spent moves you closer to the next elevated tier of privileges.
          </p>

          <div className="dp-progress-slider-wrap">
            <div className="dp-progress-track">
              <div className="dp-progress-fill" id="spendFill" style={{ width: `${currentTier.fillPercent}%` }}></div>
              <div className="dp-track-marker" style={{ left: '0%' }}><span>$0</span></div>
              <div className="dp-track-marker" style={{ left: '25%' }}><span>Club ($750)</span></div>
              <div className="dp-track-marker" style={{ left: '50%' }}><span>Gold ($1,500)</span></div>
              <div className="dp-track-marker" style={{ left: '100%' }}><span>Black ($3,000)</span></div>
            </div>
            <div className="dp-spend-control">
              <label htmlFor="spendInput">
                Simulate your spend: <strong id="spendValueDisplay">${spendValue.toLocaleString()} USD</strong>
              </label>
              <input
                type="range"
                id="spendInput"
                min="0"
                max="3000"
                step="50"
                value={spendValue}
                onChange={(e) => setSpendValue(Number(e.target.value))}
                className="form-range"
              />
              <div className="dp-current-tier-calc" id="tierResultDisplay">
                Current Tier: <strong>{currentTier.name}</strong> ({currentTier.note})
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="dp-loyalty-faq-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="dp-faq-aside">
                <span className="dp-editorial-kicker">QUESTIONS & ANSWERS</span>
                <h2 className="dp-editorial-title">Frequently Asked Questions</h2>
                <p className="dp-faq-aside-text">
                  Have questions regarding tier admissions, qualifying purchases, or reward redemptions?
                  Our concierge team is available to assist you.
                </p>
                <Link to="/pages/contact" className="btn-dp-outline">CONTACT CONCIERGE</Link>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="accordion dp-accordion" id="loyaltyFaqAccordion">
                {/* FAQ 1 */}
                <div className="accordion-item dp-accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button dp-accordion-btn ${openFaq === 1 ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => toggleFaq(1)}
                    >
                      How does the Velmora Club loyalty programme work?
                    </button>
                  </h2>
                  {openFaq === 1 && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body dp-accordion-body">
                        Your Velmora Club tier is based on your cumulative lifetime spend with Velmora. Customers with a lifetime spend under $750 are esteemed guests preparing for tier admission.<br /><br />
                        Every $1 spent on full-price and seasonal collections, footwear, and accessories counts towards your lifetime tally. As your spend crosses each threshold ($750, $1,500, $3,000), you automatically unlock higher tier privileges.
                      </div>
                    </div>
                  )}
                </div>

                {/* FAQ 2 */}
                <div className="accordion-item dp-accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button dp-accordion-btn ${openFaq === 2 ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => toggleFaq(2)}
                    >
                      How do I advance to the next tier?
                    </button>
                  </h2>
                  {openFaq === 2 && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body dp-accordion-body">
                        Advancement is effortless and automatic. Each qualifying purchase placed online or across our flagship boutiques accumulates on your customer profile. Once your spend qualifies, you receive a celebratory tier welcome notification with your exclusive reward codes.
                      </div>
                    </div>
                  )}
                </div>

                {/* FAQ 3 */}
                <div className="accordion-item dp-accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button dp-accordion-btn ${openFaq === 3 ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => toggleFaq(3)}
                    >
                      When will my tier status be updated?
                    </button>
                  </h2>
                  {openFaq === 3 && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body dp-accordion-body">
                        Your spend balance updates 14 days after each order to allow for our standard return and exchange window. Once this period concludes, qualifying credits and tier elevations are finalized.
                      </div>
                    </div>
                  )}
                </div>

                {/* FAQ 4 */}
                <div className="accordion-item dp-accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button dp-accordion-btn ${openFaq === 4 ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => toggleFaq(4)}
                    >
                      What is the Complimentary Leather Rejuvenation service?
                    </button>
                  </h2>
                  {openFaq === 4 && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body dp-accordion-body">
                        Velmora Black members receive complimentary lifetime access to our specialized Atelier Spa. This includes deep leather hydration, edge burnish touch-ups, stain relief, and solid brass hardware polishing to keep your heirloom pieces flawless forever.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
