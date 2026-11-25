import React from 'react';
import { Link } from 'react-router-dom';

export interface InfoSection {
  heading: string;
  body: string;
}

export interface InfoPageConfig {
  kicker: string;
  title: string;
  lead: string;
  sections: InfoSection[];
  ctaLabel?: string;
  ctaLink?: string;
}

const INFO_PAGES: Record<string, InfoPageConfig> = {
  faqs: {
    kicker: 'CLIENT CARE',
    title: 'FREQUENTLY ASKED QUESTIONS',
    lead: 'Answers regarding Velmora commissions, leather provenance, delivery timelines, and membership privileges.',
    sections: [
      {
        heading: 'How long does express dispatch take?',
        body: 'In-stock pieces dispatch within 24 business hours via DHL Express or NZ Post with complimentary transit insurance and adult signature on delivery.',
      },
      {
        heading: 'Are duties and import taxes included?',
        body: 'Yes. Velmora covers all international customs duties and taxes across New Zealand, Australia, the US, UK, and Europe.',
      },
      {
        heading: 'How do returns and exchanges work?',
        body: 'Unworn pieces with original tags, protective films, and dust bags may be returned or exchanged within 14 calendar days of delivery.',
      },
    ],
    ctaLabel: 'VIEW SHIPPING & RETURNS',
    ctaLink: '/pages/shipping',
  },
  'product-care': {
    kicker: 'ATELIER CARE',
    title: 'LEATHER & HARDWARE CARE',
    lead: 'Preserve the patina, suppleness, and structural poise of your handcrafted Velmora pieces for decades.',
    sections: [
      {
        heading: 'Nourishing Full-Grain Leather',
        body: 'Apply a thin coat of Velmora beeswax leather balm every 3 to 6 months using a soft lint-free cloth to keep vegetable-tanned hides supple.',
      },
      {
        heading: 'Storage & Moisture Protection',
        body: 'Store inside the provided archival cotton dust bag stuffed lightly with acid-free tissue paper, away from direct sunlight and high humidity.',
      },
      {
        heading: 'Solid Brass Hardware',
        body: 'Wipe solid brass clasps and buckles gently with a dry microfiber cloth. Avoid abrasive metal polishes or alcohol-based cleaners.',
      },
    ],
    ctaLabel: 'EXPLORE TRANSPARENCY',
    ctaLink: '/pages/transparency',
  },
  story: {
    kicker: 'OUR MAISON',
    title: 'THE VELMORA STORY',
    lead: 'Founded in Auckland with a commitment to architectural leathercraft, small-batch ethics, and enduring silhouettes.',
    sections: [
      {
        heading: 'Quiet Luxury Craftsmanship',
        body: 'Every Velmora piece begins with hand-graded hides from LWG Gold-certified tanneries, paired with bespoke solid brass hardware.',
      },
      {
        heading: 'Designed to Outlast Seasons',
        body: 'Rather than chasing disposable trends, our atelier refines permanent archival silhouettes crafted to develop rich character over decades.',
      },
    ],
    ctaLabel: 'EXPLORE COLLECTIONS',
    ctaLink: '/collections/shop-all-bags',
  },
  stockists: {
    kicker: 'GLOBAL PRESENCE',
    title: 'BOUTIQUES & STOCKISTS',
    lead: 'Discover Velmora flagship boutiques across New Zealand and Australia alongside curated international partners.',
    sections: [
      {
        heading: 'Flagship Boutiques',
        body: 'Visit our spaces in Britomart (Auckland), Ponsonby, Wellington, Christchurch, Sydney (The Strand Arcade), and Melbourne (Armadale).',
      },
      {
        heading: 'Private Styling Appointments',
        body: 'Book an in-store or virtual consultation with our senior stylists for bespoke monogramming and material previews.',
      },
    ],
    ctaLabel: 'VIEW STORE LOCATOR',
    ctaLink: '/pages/stores',
  },
  careers: {
    kicker: 'JOIN THE ATELIER',
    title: 'CAREERS AT VELMORA',
    lead: 'We welcome passionate craftspeople, client advisors, and creative minds dedicated to considered luxury.',
    sections: [
      {
        heading: 'Craft, Retail & Digital',
        body: 'Openings span leatherwork apprenticeships, boutique client leadership in Auckland and Sydney, and digital commerce operations.',
      },
      {
        heading: 'How to Apply',
        body: 'Send your portfolio or CV to our concierge team via the Contact page with your preferred discipline and location.',
      },
    ],
    ctaLabel: 'CONTACT ATELIER',
    ctaLink: '/pages/contact',
  },
  sitemap: {
    kicker: 'DIRECTORY',
    title: 'SITE DIRECTORY',
    lead: 'Quick access to every Velmora collection, editorial archive, boutique locator, and client service page.',
    sections: [
      {
        heading: 'Collections',
        body: 'Browse Handbags (/collections/shop-all-bags), Footwear (/collections/shoes), and Accessories (/collections/accessories).',
      },
      {
        heading: 'Client Services & Editorial',
        body: 'Explore Velmora Club Loyalty, Journal, Transparency, Shipping & Returns, Store Locator, and Client Account.',
      },
    ],
    ctaLabel: 'SHOP ALL COLLECTIONS',
    ctaLink: '/collections/shop-all',
  },
  terms: {
    kicker: 'LEGAL',
    title: 'TERMS OF SERVICE',
    lead: 'Terms governing purchases, commissions, pricing, and use of the Velmora online boutique.',
    sections: [
      {
        heading: 'Orders & Availability',
        body: 'All pieces are crafted in limited batches. Order confirmation is subject to stock verification and payment authorization.',
      },
      {
        heading: 'Intellectual Property',
        body: 'All Velmora designs, imagery, editorial copy, and trademarks remain the exclusive property of Velmora Maison.',
      },
    ],
  },
  'loyalty-terms': {
    kicker: 'VELMORA CLUB',
    title: 'LOYALTY PROGRAMME TERMS',
    lead: 'Terms and conditions for Velmora Club, Velmora Gold, and Velmora Black membership tiers.',
    sections: [
      {
        heading: 'Qualifying Spend',
        body: 'Tier eligibility ($750 Club, $1,500 Gold, $3,000 Black) is calculated on cumulative completed purchases net of returns.',
      },
      {
        heading: 'Credits & Benefits',
        body: 'Tier credits update 14 days after delivery and apply toward qualifying future commissions.',
      },
    ],
    ctaLabel: 'VIEW VELMORA CLUB',
    ctaLink: '/pages/loyalty',
  },
  privacy: {
    kicker: 'DATA GOVERNANCE',
    title: 'PRIVACY POLICY',
    lead: 'How Velmora collects, protects, and respects your personal data in alignment with GDPR standards.',
    sections: [
      {
        heading: 'Data Collection & Security',
        body: 'We collect only information necessary to fulfill your commissions, manage saved addresses, and deliver requested concierge updates.',
      },
      {
        heading: 'Export & Erasure Rights',
        body: 'Signed-in clients can export their complete personal data archive or permanently delete their account anytime from Account Privacy.',
      },
    ],
    ctaLabel: 'MANAGE ACCOUNT PRIVACY',
    ctaLink: '/profile',
  },
  'legal-notice': {
    kicker: 'CORPORATE',
    title: 'LEGAL NOTICE',
    lead: 'Corporate registration, contact details, and compliance disclosures for Velmora Maison.',
    sections: [
      {
        heading: 'Atelier Headquarters',
        body: 'Velmora Atelier, 16 Te Ara Tahuhu Walkway, Britomart, Auckland 1010, New Zealand. Concierge email: concierge@velmora.com.',
      },
      {
        heading: 'B Corporation Certification',
        body: 'Velmora is committed to audited social, environmental, and supply-chain transparency across all operations.',
      },
    ],
  },
  accessibility: {
    kicker: 'INCLUSIVITY',
    title: 'ACCESSIBILITY STATEMENT',
    lead: 'Velmora is dedicated to ensuring our digital boutique is accessible and welcoming to all visitors.',
    sections: [
      {
        heading: 'Standards & Support',
        body: 'We continually improve keyboard navigation, color contrast, and screen-reader semantics across all collections and checkout flows.',
      },
      {
        heading: 'Concierge Assistance',
        body: 'If you experience difficulty navigating any part of our storefront, please reach out to our concierge team for immediate assistance.',
      },
    ],
    ctaLabel: 'CONTACT CONCIERGE',
    ctaLink: '/pages/contact',
  },
};

export const InfoPage: React.FC<{ slug: keyof typeof INFO_PAGES }> = ({ slug }) => {
  const page = INFO_PAGES[slug];

  return (
    <div className="dp-page-container">
      <div className="dp-breadcrumbs">
        <Link to="/">Home</Link> <span className="sep">/</span> <span>{page.title}</span>
      </div>

      <section className="dp-editorial-hero text-center">
        <span className="dp-editorial-kicker">{page.kicker}</span>
        <h1 className="dp-editorial-title">{page.title}</h1>
        <div className="dp-editorial-quote-wrap">
          <p className="dp-editorial-lead">{page.lead}</p>
          {page.ctaLabel && page.ctaLink && (
            <div className="dp-hero-actions">
              <Link to={page.ctaLink} className="btn-dp-dark">
                {page.ctaLabel}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="dp-policy-body-section">
        <div className="container dp-policy-content-wrap">
          {page.sections.map((section) => (
            <div key={section.heading} className="dp-policy-article">
              <h2 className="dp-policy-h2">{section.heading}</h2>
              <p className="dp-policy-p">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
