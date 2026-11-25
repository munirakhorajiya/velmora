import React from 'react';
import { Link } from 'react-router-dom';

export const ShippingPage: React.FC = () => {
  return (
    <div className="dp-page-container dp-shipping-page">
      {/* Breadcrumbs */}
      <div className="dp-breadcrumbs">
        <Link to="/">Home</Link> <span className="sep">/</span> <span>Shipping & Returns</span>
      </div>

      {/* Hero Header */}
      <section className="dp-editorial-hero text-center">
        <span className="dp-editorial-kicker">CUSTOMER CARE</span>
        <h1 className="dp-editorial-title">SHIPPING & RETURNS</h1>
        <div className="dp-editorial-quote-wrap">
          <p className="dp-editorial-lead">
            Complimentary express delivery worldwide, transparent tracking, full transit insurance, and effortless 14-day returns.
          </p>
          <div className="dp-hero-actions">
            <a href="#shipping-destinations" className="btn-dp-outline">DELIVERY RATES</a>
            <a href="#returns-policy" className="btn-dp-dark">RETURNS POLICY</a>
          </div>
        </div>
      </section>

      {/* Policy Highlights Grid */}
      <section className="dp-policy-highlights-section">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-md-3">
              <div className="dp-policy-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mb-3">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <h3 className="dp-policy-box-title">Free Worldwide Express</h3>
                <p className="dp-policy-box-desc">Complimentary DHL Express shipping on orders over $300.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="dp-policy-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mb-3">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <h3 className="dp-policy-box-title">Insured Transit</h3>
                <p className="dp-policy-box-desc">100% full value insurance and signed handover on every package.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="dp-policy-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mb-3">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h3 className="dp-policy-box-title">Same Day Courier</h3>
                <p className="dp-policy-box-desc">Metro Auckland & Wellington dispatch before 12pm weekdays.</p>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="dp-policy-box">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="mb-3">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                <h3 className="dp-policy-box-title">14-Day Returns</h3>
                <p className="dp-policy-box-desc">Hassle-free online portal with pre-paid shipping labels.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Policy Content */}
      <section className="dp-policy-body-section" id="shipping-destinations">
        <div className="container dp-policy-content-wrap">
          {/* 1. Delivery Rates & Times Table */}
          <div className="dp-policy-article">
            <h2 className="dp-policy-h2">1. Delivery Rates & Timelines</h2>
            <p className="dp-policy-p">
              All orders are dispatched from our central atelier within 24 hours of confirmation (excluding weekends and public holidays). All international duties and taxes are fully covered by Velmora — there are no surprise fees upon arrival.
            </p>

            <div className="table-responsive my-4">
              <table className="table dp-policy-table">
                <thead>
                  <tr>
                    <th>DESTINATION</th>
                    <th>DELIVERY TIMELINE</th>
                    <th>SHIPPING FEE</th>
                    <th>DUTIES & TAXES</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>New Zealand</strong></td>
                    <td>1–3 Business Days (NZ Post)</td>
                    <td><span className="text-success fw-medium">Complimentary</span></td>
                    <td>Included</td>
                  </tr>
                  <tr>
                    <td><strong>Australia</strong></td>
                    <td>2–3 Business Days (DHL Express)</td>
                    <td><span className="text-success fw-medium">Complimentary</span></td>
                    <td>Covered by Velmora</td>
                  </tr>
                  <tr>
                    <td><strong>United States & Canada</strong></td>
                    <td>3–5 Business Days (DHL Express)</td>
                    <td><span className="text-success fw-medium">Complimentary on orders $300+</span> ($25 under $300)</td>
                    <td>Covered by Velmora</td>
                  </tr>
                  <tr>
                    <td><strong>United Kingdom & Europe</strong></td>
                    <td>3–5 Business Days (DHL Express)</td>
                    <td><span className="text-success fw-medium">Complimentary on orders $300+</span> ($30 under $300)</td>
                    <td>Covered by Velmora</td>
                  </tr>
                  <tr>
                    <td><strong>Rest of World</strong></td>
                    <td>4–7 Business Days (DHL Express)</td>
                    <td><span className="text-success fw-medium">Complimentary on orders $300+</span> ($35 under $300)</td>
                    <td>Covered by Velmora</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Same Day Delivery */}
          <div className="dp-policy-article">
            <h2 className="dp-policy-h2">2. Same Day Delivery</h2>
            <p className="dp-policy-p">
              Same Day courier delivery is available across Auckland and Wellington metropolitan areas for an additional charge of $20. If your postal code qualifies, the option will automatically appear at checkout.<br /><br />
              Orders must be finalized by 12:00pm, Monday through Friday, to guarantee delivery by 5:00pm that evening. Orders placed outside this window will dispatch on the following business day.
            </p>
          </div>

          {/* 3. Click & Collect */}
          <div className="dp-policy-article">
            <h2 className="dp-policy-h2">3. Click & Collect In-Store</h2>
            <p className="dp-policy-p">
              Click & Collect is complimentary across all Velmora boutiques (Britomart, Ponsonby, Wellington, Christchurch, Sydney, Melbourne). Simply select <em>"In-Store Pickup"</em> during checkout.<br /><br />
              You will receive an email notification when your piece is prepared and wrapped for collection, typically within 24 hours. Please bring your order confirmation email and valid photo ID.
            </p>
          </div>

          {/* 4. Transit Insurance & Signature */}
          <div className="dp-policy-article">
            <h2 className="dp-policy-h2">4. Tracking, Signature & Full Transit Insurance</h2>
            <p className="dp-policy-p">
              A dedicated DHL or NZ Post tracking number is dispatched to your email immediately upon carrier collection. All Velmora parcels require an adult signature upon delivery to ensure secure receipt.<br /><br />
              Every shipment is fully insured by Velmora throughout transit until delivered into your hands. In the unlikely event of transit damage or loss, our concierge team will immediately initiate an archival replacement or full refund.
            </p>
          </div>

          {/* 5. 14-Day Returns & Exchanges */}
          <div className="dp-policy-article" id="returns-policy">
            <h2 className="dp-policy-h2">5. Returns & Exchange Policy</h2>
            <p className="dp-policy-p">
              We want you to cherish your Velmora piece. If for any reason your purchase does not exceed expectations, we gladly accept returns or exchanges within <strong>14 calendar days</strong> of parcel delivery.<br /><br />
              <strong>Conditions for Return:</strong>
            </p>
            <ul className="dp-policy-list">
              <li>Items must be unworn, unused, and in their original pristine condition with all protective films intact.</li>
              <li>All original archival packaging, including dust bags, authenticity tags, and embossed boxes must accompany the return.</li>
              <li>Bespoke customized pieces and monogrammed initials are final sale and non-returnable.</li>
              <li>Footwear soles must show zero abrasion; we advise trying shoes on carpeted surfaces only.</li>
            </ul>

            <div className="dp-returns-portal-banner">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div>
                  <h3 className="dp-returns-banner-title">Ready to start a return or exchange?</h3>
                  <p className="dp-returns-banner-desc mb-md-0">Access our self-service returns portal with your order number and email address.</p>
                </div>
                <a href="mailto:returns@velmora.com?subject=Return%20Request" className="btn-dp-dark text-nowrap mt-3 mt-md-0">
                  START RETURN PORTAL
                </a>
              </div>
            </div>
          </div>

          {/* 6. Carbon-Zero Commitment */}
          <div className="dp-policy-article">
            <h2 className="dp-policy-h2">6. Carbon-Zero Certified Shipping</h2>
            <p className="dp-policy-p">
              As part of our Certified B Corporation commitments, Velmora partners with certified carbon-offset projects to neutralize 100% of the greenhouse emissions generated during parcel transit. Your pieces arrive with an audited zero net-carbon footprint.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
