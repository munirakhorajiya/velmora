import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface JournalArticle {
  id: number;
  category: 'lookbook' | 'conversation' | 'atelier';
  categoryLabel: string;
  badge: string;
  title: string;
  snippet: string;
  image: string;
  fullLead: string;
  fullBody: string;
  quote?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const JournalPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeModal, setActiveModal] = useState<JournalArticle | null>(null);

  const articles: JournalArticle[] = [
    {
      id: 1,
      category: 'lookbook',
      categoryLabel: "RESORT '26",
      badge: 'LOOKBOOK',
      title: "First Look: Resort '26",
      snippet: "Resort ‘26 arrives 20 October. An architectural study in understated luxury, featuring sculpted curves, hand-pleated leather, and sun-warmed sand palettes.",
      image: '/media/editorial/journal_resort.jpg',
      fullLead: "Captured along the rugged coastal cliffs, Resort '26 marries organic lines with crisp, modernist silhouettes.",
      fullBody: "The collection introduces sculptural new tote shapes alongside delicate mini shoulder bags, each rendered in hand-milled French calfskin and Italian pebble leather. Warm desert tones — Sandstone, Ochre, and Noir — anchor the capsule, complemented by brushed gold hardware custom-cast in our bespoke molds.",
      ctaText: 'SHOP RESORT BAGS',
      ctaLink: '/collections/shop-all-bags?category=Bags',
    },
    {
      id: 2,
      category: 'conversation',
      categoryLabel: 'INTERVIEWS',
      badge: 'IN CONVERSATION',
      title: 'Spring Styled by Seala Lokollo',
      snippet: 'Join us in conversation with creative stylist Seala Lokollo as she shares her approach to tactile layering, oversized totes, and transitional styling.',
      image: '/media/editorial/journal_seala.jpg',
      fullLead: '“When accessories possess genuine architectural integrity, effortless styling naturally follows.”',
      fullBody: 'We spent an afternoon with renowned stylist Seala Lokollo in her sunlit studio. Exploring the new Spring palette, Seala discusses the philosophy of investing in fewer, heirloom-grade leather silhouettes that transcend seasonal trends.',
      quote: "“A bag shouldn't overpower; it should harmonize with your gait and posture. Velmora's balance of weight and strap drape achieves exactly that.”",
    },
    {
      id: 3,
      category: 'lookbook',
      categoryLabel: 'NEW SEASON',
      badge: 'LOOKBOOK',
      title: 'Spring 26 Lookbook',
      snippet: "An exploration of texture and rich earthen tones marking the arrival of Spring '26. Crafted from supple full-grain bullhide and brass fittings.",
      image: '/media/editorial/journal_spring.jpg',
      fullLead: 'Spring 26: Form & Fluidity. A visual exploration of light, shadow, and architectural leathercraft.',
      fullBody: "Shot entirely on 35mm film, the Spring '26 campaign celebrates the tactile beauty of raw materials. Notice the subtle grain patterns unique to every hide, framed by clean lines and precision stitch counts.",
      ctaText: 'EXPLORE SPRING ARRIVALS',
      ctaLink: '/collections/shop-all-bags?badge=New',
    },
    {
      id: 4,
      category: 'atelier',
      categoryLabel: 'SUSTAINABILITY',
      badge: 'ATELIER NOTES',
      title: 'The Art of Vegetable Tanning',
      snippet: 'Deep dive into our plant-derived chestnut and mimosa tanning liquor process, producing rich patinas that grow more beautiful every year.',
      image: '/media/editorial/cat_shoulder.jpg',
      fullLead: 'Preserving centuries-old natural methods with plant tannins.',
      fullBody: 'Vegetable tanning requires up to 60 days of patient soaking in oak, chestnut, and mimosa bark infusions. Unlike synthetic chrome chemicals, this organic process yields leathers that breathe, develop rich golden patinas, and maintain unmatched structural integrity over decades of wear.',
    },
    {
      id: 5,
      category: 'conversation',
      categoryLabel: 'CRAFTSMANSHIP',
      badge: 'IN CONVERSATION',
      title: 'Master Leather Artisans',
      snippet: 'Meet our senior artisans whose decades of hand-cutting, saddle-stitching, and edge-glazing give Velmora bags their hallmark structural poise.',
      image: '/media/editorial/story_journal.jpg',
      fullLead: 'The hands behind the seams. Generational mastery in small-batch leathercraft.',
      fullBody: 'In our Britomart atelier, every pattern maker and master clicker brings over twenty years of tactile knowledge. From selecting the density of the grain to applying seven coats of micro-edge burnishing lacquer by hand, precision is our standard.',
    },
    {
      id: 6,
      category: 'atelier',
      categoryLabel: 'ATELIER ARCHIVES',
      badge: 'CARE GUIDE',
      title: 'Archival Care & Nourishment',
      snippet: 'Essential techniques for conditioning, protecting, and storing luxury leather goods to preserve supple hand-feel for a lifetime.',
      image: '/media/editorial/cat_tote.jpg',
      fullLead: 'Nurturing full-grain leather for decades of daily companionship.',
      fullBody: 'Leather is an organic material that absorbs moisture and responds to temperature. Regular treatment with organic beeswax balm and breathable cotton dust bag storage ensures your bag ages with distinction.',
    },
  ];

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <div className="dp-page-container dp-journal-page">
      {/* Breadcrumbs */}
      <div className="dp-breadcrumbs">
        <Link to="/">Home</Link> <span className="sep">/</span> <span>Journal</span>
      </div>

      {/* Hero Header */}
      <section className="dp-editorial-hero text-center">
        <span className="dp-editorial-kicker">ATELIER ARCHIVES</span>
        <h1 className="dp-editorial-title">JOURNAL</h1>
        <div className="dp-editorial-quote-wrap">
          <p className="dp-editorial-lead">
            Essays on craft, artistic conversations, seasonal lookbooks, and notes from behind our atelier doors.
          </p>
        </div>
      </section>

      {/* Filter Navigation Tabs */}
      <section className="dp-journal-filter-section">
        <div className="container text-center">
          <div className="dp-journal-nav-tabs">
            <button
              type="button"
              className={`dp-journal-filter-tab ${activeCategory === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              ALL ARTICLES
            </button>
            <button
              type="button"
              className={`dp-journal-filter-tab ${activeCategory === 'lookbook' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('lookbook')}
            >
              LOOKBOOKS
            </button>
            <button
              type="button"
              className={`dp-journal-filter-tab ${activeCategory === 'conversation' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('conversation')}
            >
              IN CONVERSATION
            </button>
            <button
              type="button"
              className={`dp-journal-filter-tab ${activeCategory === 'atelier' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('atelier')}
            >
              ATELIER NOTES
            </button>
          </div>
        </div>
      </section>

      {/* 3-Column Articles Grid */}
      <section className="dp-journal-grid-section">
        <div className="container">
          <div className="row g-5" id="journalCardsRow">
            {filtered.map((art) => (
              <div key={art.id} className="col-md-6 col-lg-4 journal-item-col" data-cat={art.category}>
                <article className="dp-journal-card">
                  <div
                    className="dp-journal-media"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActiveModal(art)}
                  >
                    <img src={art.image} alt={art.title} className="dp-journal-img" />
                    <span className="dp-journal-badge">{art.badge}</span>
                  </div>
                  <div className="dp-journal-body">
                    <span className="dp-journal-cat">{art.categoryLabel}</span>
                    <h2 className="dp-journal-heading">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveModal(art);
                        }}
                      >
                        {art.title}
                      </a>
                    </h2>
                    <p className="dp-journal-snippet">{art.snippet}</p>
                    <button
                      type="button"
                      className="btn-dp-text"
                      onClick={() => setActiveModal(art)}
                    >
                      Read more →
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reading Modal */}
      {activeModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content dp-modal-content">
              <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
                <span className="dp-editorial-kicker">{activeModal.badge} &bull; {activeModal.categoryLabel}</span>
                <button type="button" className="btn-close" onClick={() => setActiveModal(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body pt-2">
                <h2 className="dp-modal-title">{activeModal.title}</h2>
                <p className="dp-modal-lead">{activeModal.fullLead}</p>
                <img src={activeModal.image} alt={activeModal.title} className="img-fluid mb-4" />
                <p>{activeModal.fullBody}</p>
                {activeModal.quote && (
                  <blockquote className="dp-editorial-quote my-3">
                    {activeModal.quote}
                  </blockquote>
                )}
                {activeModal.ctaText && activeModal.ctaLink && (
                  <div className="mt-4">
                    <Link to={activeModal.ctaLink} className="btn-dp-dark" onClick={() => setActiveModal(null)}>
                      {activeModal.ctaText}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
