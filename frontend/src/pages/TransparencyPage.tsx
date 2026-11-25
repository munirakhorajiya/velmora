import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface PillarModalData {
  num: string;
  title: string;
  lead: string;
  body: string;
}

export const TransparencyPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<PillarModalData | null>(null);

  const pillarsData: { [key: string]: PillarModalData } = {
    '01': {
      num: 'PILLAR 01',
      title: 'Our Vision for Timeless Luxury',
      lead: 'We reject fast fashion cycles. A Velmora bag is designed to last decades, passing gracefully from owner to heir.',
      body: "Since Velmora's inception, our design philosophy has centered on architectural minimalism and tactile craftsmanship. Rather than seasonal obsolescence, our core silhouettes are maintained as permanent icons with numbered iterations, minimizing sample waste and overproduction.",
    },
    '02': {
      num: 'PILLAR 02',
      title: 'Ethical Hides & Solid Brass Hardware',
      lead: 'Every hide tells a story of ethical stewardship and certified closed-loop water treatment.',
      body: 'We work exclusively with tanneries audited by the international Leather Working Group (LWG) achieving Gold Rating. This ensures 100% traceability, state-of-the-art biological wastewater recycling, and zero toxic effluents. Furthermore, our hardware is forged from solid virgin brass, hand-buffed without petroleum plating.',
    },
    '03': {
      num: 'PILLAR 03',
      title: 'Audited Carbon-Zero Operations',
      lead: 'Measurable reductions across shipping, heating, and atelier energy consumption.',
      body: 'Through our solar-powered craft spaces and 100% carbon-offset global express shipping, Velmora achieves audited net-zero carbon transport for every delivery.',
    },
    '04': {
      num: 'PILLAR 04',
      title: 'Handcrafted In Small Batches',
      lead: 'Precision artisanry over automated industrial lines.',
      body: 'Every single Velmora piece begins with hand-grading of individual leather grain by master clickers. Each panel is skived, bonded with solvent-free natural water-based adhesives, and hand-stitched with bonded nylon thread. The result is structural durability that outlives machine-assembled bags by decades.',
    },
    '05': {
      num: 'PILLAR 05',
      title: 'Community, Mentorship & Fair Living Wages',
      lead: 'Empowering the next generation of leathercraft artisans.',
      body: 'We are committed to fair living wages, comprehensive health coverage, and local vocational apprenticeships for young leatherworkers across all our workshops.',
    },
    '06': {
      num: 'PILLAR 06',
      title: 'Certified B Corporation & Circular Atelier',
      lead: 'Meeting the highest standards of verified social and environmental performance.',
      body: 'Velmora is proud to be a Certified B Corporation. Our Circular Atelier initiative enables customers to return pre-loved Velmora pieces for professional spa restoration, credit exchange, or archival re-homing, keeping leather out of landfills permanently.',
    },
  };

  return (
    <div className="dp-page-container dp-transparency-page">
      {/* Breadcrumbs */}
      <div className="dp-breadcrumbs">
        <Link to="/">Home</Link> <span className="sep">/</span> <span>Transparency</span>
      </div>

      {/* Hero Header */}
      <section className="dp-transparency-hero text-center">
        <span className="dp-editorial-kicker">OUR COMMITMENT</span>
        <h1 className="dp-transparency-title">TRANSPARENCY</h1>
        <p className="dp-transparency-lead">
          Welcome to the world of Velmora. Ours is a timeless craft with time-honoured traditions.<br className="d-none d-md-inline" />
          We make beautiful products, responsibly.
        </p>
      </section>

      {/* Key Metrics Highlight Strip */}
      <section className="dp-impact-metrics-bar">
        <div className="container">
          <div className="row text-center gy-4">
            <div className="col-6 col-md-3">
              <div className="dp-metric-box">
                <span className="dp-metric-num">100%</span>
                <span className="dp-metric-label">LWG Gold-Certified Tanneries</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="dp-metric-box">
                <span className="dp-metric-num">B CORP</span>
                <span className="dp-metric-label">Certified Social & Eco Accountability</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="dp-metric-box">
                <span className="dp-metric-num">100%</span>
                <span className="dp-metric-label">Plastic-Free FSC Packaging</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="dp-metric-box">
                <span className="dp-metric-num">ZERO</span>
                <span className="dp-metric-label">Leather Landfill atelier off-cut initiative</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 6 Pillars Editorial Grid */}
      <section className="dp-transparency-pillars-section">
        <div className="container">
          <div className="dp-pillars-grid">
            {/* Pillar 01: Our Vision */}
            <article className="dp-pillar-card">
              <div className="dp-pillar-header">
                <span className="dp-pillar-num">01</span>
                <h2 className="dp-pillar-heading">Our Vision</h2>
              </div>
              <div className="dp-pillar-image-wrap">
                <img src="/media/editorial/transparency_vision.jpg" alt="Our Vision — Velmora Atelier" className="dp-pillar-img" />
                <div className="dp-pillar-badge">SUSTAINED ELEGANCE</div>
              </div>
              <div className="dp-pillar-body">
                <p className="dp-pillar-desc">
                  Velmora is committed to being transparent, considered, accountable and innovative in every aspect of our business.
                  We believe true luxury is rooted in the longevity of what we make, respecting the hands that craft our designs and the natural resources we draw upon.
                </p>
                <button type="button" className="btn-dp-text" onClick={() => setActiveModal(pillarsData['01'])}>
                  Read Atelier Manifesto →
                </button>
              </div>
            </article>

            {/* Pillar 02: Our Materials */}
            <article className="dp-pillar-card">
              <div className="dp-pillar-header">
                <span className="dp-pillar-num">02</span>
                <h2 className="dp-pillar-heading">Our Materials</h2>
              </div>
              <div className="dp-pillar-image-wrap">
                <img src="/media/editorial/story_transparency.jpg" alt="Our Materials" className="dp-pillar-img" />
                <div className="dp-pillar-badge">LWG GOLD AUDITED</div>
              </div>
              <div className="dp-pillar-body">
                <p className="dp-pillar-desc">
                  Committed to our values, we collaborate with select global suppliers to craft high-quality, sustainably sourced, and ethically produced materials.
                  100% of our hides are by-products of the local food industry, vegetable-tanned with plant tannins and zero harmful chrome.
                </p>
                <button type="button" className="btn-dp-text" onClick={() => setActiveModal(pillarsData['02'])}>
                  Explore Leather Sourcing →
                </button>
              </div>
            </article>

            {/* Pillar 03: Our Impact */}
            <article className="dp-pillar-card">
              <div className="dp-pillar-header">
                <span className="dp-pillar-num">03</span>
                <h2 className="dp-pillar-heading">Our Impact</h2>
              </div>
              <div className="dp-pillar-image-wrap">
                <img src="/media/editorial/loyalty_black.jpg" alt="Our Impact" className="dp-pillar-img" />
                <div className="dp-pillar-badge">CARBON-ZERO TRANSIT</div>
              </div>
              <div className="dp-pillar-body">
                <p className="dp-pillar-desc">
                  Creating a responsible business is an ever-evolving journey, but we are committed to building a better world.
                  From rooftop solar in our workshops to 100% carbon-neutral worldwide shipping offsets, every step is calculated and audited annually.
                </p>
                <button type="button" className="btn-dp-text" onClick={() => setActiveModal(pillarsData['03'])}>
                  View Carbon Metrics →
                </button>
              </div>
            </article>

            {/* Pillar 04: Our Manufacturing */}
            <article className="dp-pillar-card">
              <div className="dp-pillar-header">
                <span className="dp-pillar-num">04</span>
                <h2 className="dp-pillar-heading">Our Manufacturing</h2>
              </div>
              <div className="dp-pillar-image-wrap">
                <img src="/media/editorial/story_local.jpg" alt="Our Manufacturing" className="dp-pillar-img" />
                <div className="dp-pillar-badge">MASTER ARTISANS</div>
              </div>
              <div className="dp-pillar-body">
                <p className="dp-pillar-desc">
                  Crafted to be timeless and cherished, our pieces are artisanally made with minimal environmental impact.
                  Each bag requires upwards of 18 hours of hand-cutting, saddle stitching, and hand-painted edge burnishing by artisans with decades of mastery.
                </p>
                <button type="button" className="btn-dp-text" onClick={() => setActiveModal(pillarsData['04'])}>
                  Atelier Craft Standards →
                </button>
              </div>
            </article>

            {/* Pillar 05: Our Community */}
            <article className="dp-pillar-card">
              <div className="dp-pillar-header">
                <span className="dp-pillar-num">05</span>
                <h2 className="dp-pillar-heading">Our Community</h2>
              </div>
              <div className="dp-pillar-image-wrap">
                <img src="/media/editorial/journal_seala.jpg" alt="Our Community" className="dp-pillar-img" />
                <div className="dp-pillar-badge">LOCAL ART & CULTURE</div>
              </div>
              <div className="dp-pillar-body">
                <p className="dp-pillar-desc">
                  We are dedicated to ethical business practices and enriching our community through local art collaborations, youth design mentorships, and fair-wage living standards across our entire supply chain.
                </p>
                <button type="button" className="btn-dp-text" onClick={() => setActiveModal(pillarsData['05'])}>
                  Community Initiatives →
                </button>
              </div>
            </article>

            {/* Pillar 06: Considered Edit */}
            <article className="dp-pillar-card">
              <div className="dp-pillar-header">
                <span className="dp-pillar-num">06</span>
                <h2 className="dp-pillar-heading">Considered Edit</h2>
              </div>
              <div className="dp-pillar-image-wrap">
                <img src="/media/editorial/bcorp.png" alt="Considered Edit & B-Corp" className="dp-pillar-img dp-pillar-contain" />
                <div className="dp-pillar-badge">B CORP VERIFIED</div>
              </div>
              <div className="dp-pillar-body">
                <p className="dp-pillar-desc">
                  As a Certified B Corporation, Velmora meets the highest verified standards of social and environmental performance.
                  Our Circular Atelier program accepts previously loved Velmora bags for repair, rejuvenation, and responsible archive re-homing.
                </p>
                <button type="button" className="btn-dp-text" onClick={() => setActiveModal(pillarsData['06'])}>
                  Circular Atelier Guide →
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Modal Dialog for Pillar Deep Dive */}
      {activeModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content dp-modal-content">
              <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
                <span className="dp-editorial-kicker">{activeModal.num}</span>
                <button type="button" className="btn-close" onClick={() => setActiveModal(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body pt-2">
                <h2 className="dp-modal-title">{activeModal.title}</h2>
                <p className="dp-modal-lead">{activeModal.lead}</p>
                <hr className="dp-modal-hr" />
                <p>{activeModal.body}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
