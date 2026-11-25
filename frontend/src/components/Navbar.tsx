import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/cart-context';
import { useAuth } from '../context/auth-context';

export const Navbar: React.FC = () => {
  const { totalCount, openDrawer } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    if (accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [accountMenuOpen]);

  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = () => {
      setActiveMega(null);
      setMobileMenuOpen(false);
      setSearchOpen(false);
      setAccountMenuOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const closeMega = () => {
    setActiveMega(null);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setAccountMenuOpen(false);
    setIsClosing(true);
    (document.activeElement as HTMLElement)?.blur();
    setTimeout(() => {
      setIsClosing(false);
    }, 250);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections/shop-all-bags?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isBagsActive =
    location.pathname.includes('/bags') ||
    location.pathname === '/collections' ||
    location.pathname === '/collections/';
  const isShoesActive = location.pathname.includes('/shoes');
  const isAccActive = location.pathname.includes('/accessories');

  return (
    <>
      {/* 1. Top Announcement Bar (Real Project: base.html) */}
      {showAnnouncement && (
        <div className="announcement-bar" id="announcementBar">
          <div className="announcement-text">
            Complimentary express shipping worldwide
          </div>
          <button
            className="announcement-close"
            id="closeAnnouncement"
            onClick={() => setShowAnnouncement(false)}
            aria-label="Dismiss Announcement"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Velmora Luxury Header (Exact Match to base.html) */}
      <header className="header-main" id="siteHeader">
        <div className="header-inner">
          {/* LEFT: Brand Logo & Mobile Toggle */}
          <div className="header-left">
            <button
              className="header-mobile-toggle d-lg-none"
              id="mobileMenuToggle"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <span></span>
              <span></span>
            </button>

            <Link to="/" className="header-logo" aria-label="Velmora Home" onClick={closeMega}>
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none" className="logo-mark">
                <path d="M26 24 L50 78 L74 24" stroke="#141414" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40 24 L50 48 L60 24" stroke="#9E7D47" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="logo-text">VELMORA</span>
            </Link>
          </div>

          {/* CENTER: Primary Category Navigation with Mega Menus */}
          <nav className="header-center header-nav d-none d-lg-flex" aria-label="Main Navigation">
            {/* BAGS ITEM & MEGA MENU */}
            <div
              className={`nav-mega-item ${activeMega === 'Bags' && !isClosing ? 'is-open active' : ''}`}
              onMouseEnter={() => { if (!isClosing) setActiveMega('Bags'); }}
              onMouseLeave={() => setActiveMega(null)}
            >
              <Link
                to="/collections/shop-all-bags"
                className={`header-nav-link ${isBagsActive ? 'active' : ''}`}
                onClick={closeMega}
              >
                BAGS
              </Link>
              <div className="mega-menu-panel">
                <div className="mega-menu-inner">
                  <div className="mega-menu-cols">
                    <div className="mega-col">
                      <span className="mega-col-heading">CATEGORY</span>
                      <ul className="mega-link-list">
                        <li><Link to="/collections/shop-all-bags?badge=New" onClick={closeMega}>New Arrivals</Link></li>
                        <li><Link to="/collections/shop-all-bags" onClick={closeMega}>View All</Link></li>
                        <li><Link to="/collections/shop-all-bags?category=tote" onClick={closeMega}>Tote Bags</Link></li>
                        <li><Link to="/collections/shop-all-bags?category=shoulder" onClick={closeMega}>Shoulder Bags</Link></li>
                        <li><Link to="/collections/shop-all-bags?category=crossbody" onClick={closeMega}>Crossbody Bags</Link></li>
                        <li><Link to="/collections/shop-all-bags?category=clutch" onClick={closeMega}>Clutches</Link></li>
                        <li><Link to="/collections/shop-all-bags?category=mini" onClick={closeMega}>Mini Bags</Link></li>
                      </ul>
                    </div>
                    <div className="mega-col">
                      <span className="mega-col-heading">HIGHLIGHTS</span>
                      <ul className="mega-link-list">
                        <li><Link to="/collections/shop-all-bags?badge=Resort" onClick={closeMega}>Resort '26</Link></li>
                        <li><Link to="/collections/shop-all-bags?badge=Spring" onClick={closeMega}>Spring '26</Link></li>
                        <li><Link to="/collections/shop-all-bags?badge=Icon" onClick={closeMega}>Velmora Icons</Link></li>
                        <li><Link to="/collections/shop-all-bags?category=men" onClick={closeMega}>The Men's Edit</Link></li>
                        <li><Link to="/collections/shop-all-bags?material=suede" onClick={closeMega}>Suede Edit</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mega-featured-card">
                    <Link to="/collections/shop-all-bags" className="mega-featured-link" onClick={closeMega}>
                      <div className="mega-featured-img">
                        <img src="/media/editorial/cat_shoulder.jpg" alt="Velmora Bags" loading="lazy" />
                      </div>
                      <span className="mega-featured-title">NEW SEASON HANDBAGS</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* SHOES ITEM & MEGA MENU */}
            <div
              className={`nav-mega-item ${activeMega === 'Shoes' && !isClosing ? 'is-open active' : ''}`}
              onMouseEnter={() => { if (!isClosing) setActiveMega('Shoes'); }}
              onMouseLeave={() => setActiveMega(null)}
            >
              <Link
                to="/collections/shoes"
                className={`header-nav-link ${isShoesActive ? 'active' : ''}`}
                onClick={closeMega}
              >
                SHOES
              </Link>
              <div className="mega-menu-panel">
                <div className="mega-menu-inner">
                  <div className="mega-menu-cols">
                    <div className="mega-col">
                      <span className="mega-col-heading">CATEGORY</span>
                      <ul className="mega-link-list">
                        <li><Link to="/collections/shoes" onClick={closeMega}>View All</Link></li>
                        <li><Link to="/collections/shoes?category=sandals" onClick={closeMega}>Sandals</Link></li>
                        <li><Link to="/collections/shoes?category=flats" onClick={closeMega}>Flats</Link></li>
                        <li><Link to="/collections/shoes?category=sneakers" onClick={closeMega}>Sneakers</Link></li>
                        <li><Link to="/collections/shoes?category=heels" onClick={closeMega}>Heels</Link></li>
                        <li><Link to="/collections/shoes?category=loafers" onClick={closeMega}>Loafers</Link></li>
                        <li><Link to="/collections/shoes?category=boots" onClick={closeMega}>Boots</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mega-featured-card">
                    <Link to="/collections/shoes" className="mega-featured-link" onClick={closeMega}>
                      <div className="mega-featured-img">
                        <img src="/media/editorial/hero_sandals.jpg" alt="Resort Footwear" loading="lazy" />
                      </div>
                      <span className="mega-featured-title">RESORT FOOTWEAR</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ACCESSORIES ITEM & MEGA MENU */}
            <div
              className={`nav-mega-item ${activeMega === 'Accessories' && !isClosing ? 'is-open active' : ''}`}
              onMouseEnter={() => { if (!isClosing) setActiveMega('Accessories'); }}
              onMouseLeave={() => setActiveMega(null)}
            >
              <Link
                to="/collections/accessories"
                className={`header-nav-link ${isAccActive ? 'active' : ''}`}
                onClick={closeMega}
              >
                ACCESSORIES
              </Link>
              <div className="mega-menu-panel">
                <div className="mega-menu-inner">
                  <div className="mega-menu-cols">
                    <div className="mega-col">
                      <span className="mega-col-heading">CATEGORY</span>
                      <ul className="mega-link-list">
                        <li><Link to="/collections/accessories?category=wallets" onClick={closeMega}>View All Wallets</Link></li>
                        <li><Link to="/collections/accessories?category=wallets&size=small" onClick={closeMega}>Small Wallets</Link></li>
                        <li><Link to="/collections/accessories?category=wallets&size=large" onClick={closeMega}>Large Wallets</Link></li>
                        <li><Link to="/collections/accessories?category=cardholders" onClick={closeMega}>Card Holders</Link></li>
                      </ul>
                    </div>
                    <div className="mega-col">
                      <span className="mega-col-heading">SHOP BY</span>
                      <ul className="mega-link-list">
                        <li><Link to="/collections/accessories?category=belts" onClick={closeMega}>Belts</Link></li>
                        <li><Link to="/collections/accessories?category=travel" onClick={closeMega}>Travel</Link></li>
                        <li><Link to="/collections/accessories?category=care" onClick={closeMega}>Leather Care</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mega-featured-card">
                    <Link to="/collections/accessories" className="mega-featured-link" onClick={closeMega}>
                      <div className="mega-featured-img">
                        <img src="/media/editorial/cat_icons.jpg" alt="Velmora Accessories" loading="lazy" />
                      </div>
                      <span className="mega-featured-title">WALLETS & LEATHER GOODS</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* RIGHT: Search, Account & Shopping Bag */}
          <div className="header-right">
            <button
              className="header-action-btn"
              id="searchTrigger"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Catalog"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="action-text d-none d-sm-inline">SEARCH</span>
            </button>

            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                className="header-action-btn"
                aria-label="Account Menu"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    setAccountMenuOpen(!accountMenuOpen);
                  }
                }}
                title={isAuthenticated ? `Signed in as ${user?.email}` : "Sign In / Join Velmora"}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>

              {/* Clean Minimalist Account Dropdown - Click to open, Monochrome luxury typography */}
              {isAuthenticated && accountMenuOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#ECEAE5] shadow-2xl z-50 py-2 animate-in fade-in"
                  style={{ borderRadius: '2px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                >
                  <div className="px-4 py-2 border-b border-[#ECEAE5]">
                    <div style={{ fontSize: '9.5px', color: '#767676', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>
                      {user?.role === 'ADMIN' || user?.is_admin || user?.is_service_provider ? 'STORE ADMINISTRATOR' : 'SIGNED IN'}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#141414', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.email}
                    </div>
                  </div>

                  <div className="py-1">
                    {(user?.role === 'ADMIN' || user?.is_admin || user?.is_service_provider) && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 16px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#141414',
                          textDecoration: 'none',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF9F6')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <span>STORE ADMIN PANEL</span>
                        <span style={{ fontSize: '13px' }}>&rarr;</span>
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setAccountMenuOpen(false)}
                      style={{
                        display: 'block',
                        padding: '10px 16px',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#141414',
                        textDecoration: 'none',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF9F6')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      MY PROFILE &amp; ORDERS
                    </Link>

                    <div style={{ height: '1px', backgroundColor: '#ECEAE5', margin: '4px 0' }} />

                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#141414',
                        background: 'transparent',
                        border: 'none',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF9F6')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span>SIGN OUT</span>
                      <span style={{ fontSize: '13px', color: '#767676' }}>&times;</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="header-action-btn header-bag-btn"
              id="openCartDrawer"
              onClick={openDrawer}
              aria-label="Shopping Bag"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="action-text">(<span id="cartCounter">{totalCount}</span>)</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Search Overlay */}
      {searchOpen && (
        <div className="search-overlay is-active" id="searchOverlay" onClick={() => setSearchOpen(false)}>
          <div className="search-overlay-inner" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearchSubmit} className="search-input-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                id="quickSearchInput"
                placeholder="SEARCH BAGS, SHOES, ACCESSORIES..."
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="search-close-btn"
                id="closeSearch"
                onClick={() => setSearchOpen(false)}
              >
                ✕
              </button>
            </form>
            <div className="search-quick-links">
              <span>Popular:</span>
              <Link to="/collections/shop-all-bags?category=tote" onClick={() => setSearchOpen(false)}>Tote Bags</Link>
              <Link to="/collections/shop-all-bags?category=shoulder" onClick={() => setSearchOpen(false)}>Shoulder Bags</Link>
              <Link to="/collections/shoes?category=sandals" onClick={() => setSearchOpen(false)}>Sandals</Link>
              <Link to="/collections/accessories?category=wallets" onClick={() => setSearchOpen(false)}>Wallets</Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. Mobile Nav Panel (Only mounted when mobileMenuOpen, never leaks onto desktop) */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel is-open d-lg-none" id="mobileNavPanel">
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item py-2">
              <Link to="/collections/shop-all-bags" className="fw-medium text-dark text-decoration-none" onClick={closeMega}>BAGS</Link>
            </li>
            <li className="mobile-nav-item py-2">
              <Link to="/collections/shoes" className="fw-medium text-dark text-decoration-none" onClick={closeMega}>SHOES</Link>
            </li>
            <li className="mobile-nav-item py-2">
              <Link to="/collections/accessories" className="fw-medium text-dark text-decoration-none" onClick={closeMega}>ACCESSORIES</Link>
            </li>
            <li className="py-2"><Link to="/collections/shop-all-bags?badge=New" className="text-dark text-decoration-none" onClick={closeMega}>NEW ARRIVALS</Link></li>
            <li className="py-2"><Link to="/pages/journal" className="text-dark text-decoration-none" onClick={closeMega}>JOURNAL</Link></li>
            <li className="py-2"><Link to="/pages/stores" className="text-dark text-decoration-none" onClick={closeMega}>BOUTIQUES</Link></li>
            <li className="py-2"><Link to="/pages/loyalty" className="text-dark text-decoration-none" onClick={closeMega}>VELMORA CLUB</Link></li>
          </ul>
        </div>
      )}
          {/* Luxury Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)' }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div 
            className="bg-white max-w-sm w-full p-6 shadow-2xl border border-[#ECEAE5] animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: '2px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: '32px', height: '32px', background: '#141414', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', fontFamily: 'serif' }}>
                V
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: '#141414' }}>
                Sign Out
              </h3>
            </div>
            
            <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              Are you sure you want to sign out of Velmora? You are currently logged in as <strong style={{ color: '#141414' }}>{user?.email}</strong>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #D5D2CB',
                  color: '#141414',
                  padding: '9px 18px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                  navigate('/login');
                }}
                style={{
                  background: '#141414',
                  border: '1px solid #141414',
                  color: '#FFFFFF',
                  padding: '9px 18px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                OK / SIGN OUT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
