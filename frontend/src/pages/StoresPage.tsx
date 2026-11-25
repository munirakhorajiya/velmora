import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Boutique {
  id: string;
  name: string;
  city: string;
  region: 'nz' | 'au';
  flag: string;
  image: string;
  address: string;
  tel: string;
  email: string;
  hours: string[];
  services: string[];
  mapLink: string;
}

export const StoresPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'nz' | 'au'>('all');
  const [modalStore, setModalStore] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [apptType, setApptType] = useState('In-Store Styling Consultation');

  const boutiques: Boutique[] = [
    {
      id: 'britomart',
      name: 'BRITOMART',
      city: 'Auckland, NZ',
      region: 'nz',
      flag: 'FLAGSHIP BOUTIQUE',
      image: '/media/editorial/story_local.jpg',
      address: '16 Te Ara Tāhuhu Walkway, Britomart, Auckland 1010',
      tel: '+64 9 216 5427',
      email: 'britomart@velmora.com',
      hours: [
        'Monday – Friday: 10:00am – 5:30pm',
        'Saturday: 10:00am – 5:00pm',
        'Sunday: 10:00am – 4:00pm',
      ],
      services: ['Click & Collect', 'Monogramming', 'Styling Suite'],
      mapLink: 'https://maps.google.com/?q=16+Te+Ara+Tahuhu+Walkway+Auckland',
    },
    {
      id: 'ponsonby',
      name: 'PONSONBY',
      city: 'Auckland, NZ',
      region: 'nz',
      flag: 'LEATHER ATELIER',
      image: '/media/editorial/hero_resort.jpg',
      address: '130 Ponsonby Road, Ponsonby, Auckland 1011',
      tel: '+64 9 376 3490',
      email: 'ponsonby@velmora.com',
      hours: [
        'Monday – Friday: 10:00am – 5:30pm',
        'Saturday: 10:00am – 5:00pm',
        'Sunday: 11:00am – 4:00pm',
      ],
      services: ['Leather Rejuvenation', 'Full Collection', 'Click & Collect'],
      mapLink: 'https://maps.google.com/?q=130+Ponsonby+Road+Auckland',
    },
    {
      id: 'wellington',
      name: 'WELLINGTON',
      city: 'Wellington, NZ',
      region: 'nz',
      flag: 'BOUTIQUE',
      image: '/media/editorial/cat_tote.jpg',
      address: '102 Wakefield Street, Te Aro, Wellington 6011',
      tel: '+64 4 473 1290',
      email: 'wellington@velmora.com',
      hours: [
        'Monday – Friday: 10:00am – 5:30pm',
        'Saturday: 10:00am – 5:00pm',
        'Sunday: 11:00am – 4:00pm',
      ],
      services: ['Click & Collect', 'Footwear Fitting', 'Concierge'],
      mapLink: 'https://maps.google.com/?q=102+Wakefield+Street+Wellington',
    },
    {
      id: 'christchurch',
      name: 'CHRISTCHURCH',
      city: 'Christchurch, NZ',
      region: 'nz',
      flag: 'BOUTIQUE & GALLERY',
      image: '/media/editorial/cat_shoulder.jpg',
      address: '181 High Street, Central City, Christchurch 8011',
      tel: '+64 3 365 4890',
      email: 'christchurch@velmora.com',
      hours: [
        'Monday – Saturday: 10:00am – 5:00pm',
        'Sunday: 11:00am – 4:00pm',
      ],
      services: ['Archive Display', 'Click & Collect', 'Exclusive Releases'],
      mapLink: 'https://maps.google.com/?q=181+High+Street+Christchurch',
    },
    {
      id: 'sydney',
      name: 'THE STRAND ARCADE',
      city: 'Sydney, NSW',
      region: 'au',
      flag: 'AUSTRALIA FLAGSHIP',
      image: '/media/editorial/cat_icons.jpg',
      address: 'Shop 18, Ground Floor, The Strand Arcade, 412–414 George St, Sydney NSW 2000',
      tel: '+61 2 9232 4110',
      email: 'sydney@velmora.com',
      hours: [
        'Monday – Wednesday, Friday: 10:00am – 5:30pm',
        'Thursday: 10:00am – 8:00pm',
        'Saturday: 10:00am – 5:00pm • Sunday: 11:00am – 4:00pm',
      ],
      services: ['VIP Private Suite', 'Atelier Dropoff', 'Same Day Delivery'],
      mapLink: 'https://maps.google.com/?q=The+Strand+Arcade+Sydney',
    },
    {
      id: 'melbourne',
      name: 'ARMADALE',
      city: 'Melbourne, VIC',
      region: 'au',
      flag: 'ARMADALE BOUTIQUE',
      image: '/media/editorial/journal_spring.jpg',
      address: '1042 High Street, Armadale, VIC 3143',
      tel: '+61 3 9509 2311',
      email: 'armadale@velmora.com',
      hours: [
        'Monday – Saturday: 10:00am – 5:00pm',
        'Sunday: 11:00am – 4:00pm',
      ],
      services: ['Private Appointments', 'Atelier Spa', 'Click & Collect'],
      mapLink: 'https://maps.google.com/?q=1042+High+Street+Armadale+VIC',
    },
  ];

  const filtered = selectedRegion === 'all'
    ? boutiques
    : boutiques.filter((b) => b.region === selectedRegion);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Styling appointment requested at ${modalStore || 'Velmora Atelier'}. Our concierge will confirm within 24 hours.`);
    setModalStore(null);
    setClientName('');
    setClientEmail('');
  };

  return (
    <div className="dp-page-container dp-stores-page">
      {/* Breadcrumbs */}
      <div className="dp-breadcrumbs">
        <Link to="/">Home</Link> <span className="sep">/</span> <span>Stores & Ateliers</span>
      </div>

      {/* Hero Header */}
      <section className="dp-editorial-hero text-center">
        <span className="dp-editorial-kicker">FIND YOUR LOCAL</span>
        <h1 className="dp-editorial-title">STORES & ATELIERS</h1>
        <div className="dp-editorial-quote-wrap">
          <p className="dp-editorial-lead">
            Experience Velmora in person. Discover handcrafted leather collections, tactile material archives, and bespoke private styling suites.
          </p>
          <div className="dp-hero-actions">
            <button
              type="button"
              className="btn-dp-dark"
              onClick={() => setModalStore('Flagship Britomart')}
            >
              BOOK VIRTUAL OR IN-STORE STYLING
            </button>
          </div>
        </div>
      </section>

      {/* Region Filters */}
      <section className="dp-store-filter-bar">
        <div className="container text-center">
          <div className="dp-store-tabs">
            <button
              type="button"
              className={`dp-store-tab ${selectedRegion === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelectedRegion('all')}
            >
              ALL LOCATIONS (6)
            </button>
            <button
              type="button"
              className={`dp-store-tab ${selectedRegion === 'nz' ? 'is-active' : ''}`}
              onClick={() => setSelectedRegion('nz')}
            >
              NEW ZEALAND (4)
            </button>
            <button
              type="button"
              className={`dp-store-tab ${selectedRegion === 'au' ? 'is-active' : ''}`}
              onClick={() => setSelectedRegion('au')}
            >
              AUSTRALIA (2)
            </button>
          </div>
        </div>
      </section>

      {/* Boutiques List */}
      <section className="dp-boutiques-list-section">
        <div className="container">
          <div className="row g-5" id="boutiquesGrid">
            {filtered.map((store) => (
              <div key={store.id} className="col-lg-6 store-item-col" data-region={store.region}>
                <div className="dp-boutique-card">
                  <div className="dp-boutique-media">
                    <img src={store.image} alt={store.name} className="dp-boutique-img" />
                    <span className="dp-boutique-flag">{store.flag}</span>
                  </div>
                  <div className="dp-boutique-info">
                    <div className="d-flex justify-content-between align-items-baseline mb-2">
                      <h2 className="dp-boutique-name">{store.name}</h2>
                      <span className="dp-boutique-city">{store.city}</span>
                    </div>
                    <address className="dp-boutique-address">
                      {store.address}<br />
                      Tel: <a href={`tel:${store.tel.replace(/\s/g, '')}`}>{store.tel}</a> &bull; Email: <a href={`mailto:${store.email}`}>{store.email}</a>
                    </address>
                    <div className="dp-boutique-hours">
                      <span className="dp-hours-title">OPENING HOURS</span>
                      <p>
                        {store.hours.map((h, i) => (
                          <React.Fragment key={i}>
                            {h}
                            <br />
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                    <div className="dp-boutique-services">
                      {store.services.map((s, idx) => (
                        <span key={idx} className="dp-service-tag">{s}</span>
                      ))}
                    </div>
                    <div className="dp-boutique-actions">
                      <a href={store.mapLink} target="_blank" rel="noopener noreferrer" className="btn-dp-outline-sm">
                        Get Directions
                      </a>
                      <button
                        type="button"
                        className="btn-dp-dark-sm"
                        onClick={() => setModalStore(store.name)}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Modal */}
      {modalStore && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content dp-modal-content">
              <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
                <span className="dp-editorial-kicker">PRIVATE ATELIER STYLING</span>
                <button type="button" className="btn-close" onClick={() => setModalStore(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body pt-2">
                <h2 className="dp-modal-title">Book an Appointment at {modalStore}</h2>
                <p className="dp-modal-lead">Enjoy 1-on-1 private styling, bespoke monogramming previews, and material discovery.</p>
                <form onSubmit={handleBookingSubmit} className="mt-4">
                  <div className="mb-3">
                    <label className="form-label dp-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control dp-input"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label dp-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control dp-input"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label dp-label">Consultation Type</label>
                    <select
                      className="form-select dp-input"
                      value={apptType}
                      onChange={(e) => setApptType(e.target.value)}
                    >
                      <option>In-Store Styling Consultation</option>
                      <option>Virtual Styling Appointment</option>
                      <option>Bespoke Monogramming Session</option>
                      <option>Atelier Leather Rejuvenation Dropoff</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-dp-dark w-100 mt-2">
                    CONFIRM BOOKING REQUEST
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
