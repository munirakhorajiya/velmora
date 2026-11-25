import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getMergedCatalog, subscribeToCatalogUpdates, syncWithBackendApi } from '../api/catalogSync';
import { useCart } from '../context/cart-context';
import { toast } from 'sonner';

export const CollectionsPage: React.FC = () => {
  const [catalog, setCatalog] = useState(() => getMergedCatalog());

  useEffect(() => {

    // Fetch latest live products from Django database
    syncWithBackendApi().then(() => {
      setCatalog(getMergedCatalog());
    });

    // Listen to real-time modifications and newly added items from dashboard
    const unsub = subscribeToCatalogUpdates(() => {
      setCatalog(getMergedCatalog());
    });
    return () => unsub();
  }, []);
  const { subdept } = useParams<{ subdept?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const { addToCart } = useCart();

  const [cardSlideIndex, setCardSlideIndex] = useState<{ [id: string]: number }>({});
  const [cardColorIndex, setCardColorIndex] = useState<{ [id: string]: number }>({});

  let deptParam = searchParams.get('category') || searchParams.get('dept') || '';
  if (!deptParam && subdept) {
    const s = subdept.toLowerCase();
    if (s === 'bags' || s === 'shop-all-bags') deptParam = 'Bags';
    else if (s === 'shoes' || s === 'all-footwear') deptParam = 'Shoes';
    else if (s === 'accessories' || s === 'wallets') deptParam = 'Accessories';
    else if (s === 'shop-all') deptParam = 'All';
    else deptParam = subdept;
  }
  if (!deptParam) deptParam = 'Bags';

  const badgeParam = searchParams.get('badge') || '';
  const queryParam = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const selectedColor = searchParams.get('color') || '';
  const selectedMeasure = searchParams.get('measure') || '';
  const selectedMaterial = searchParams.get('material') || '';

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return catalog.filter((item) => {
      if (deptParam && deptParam !== 'All' && deptParam !== 'New Arrivals') {
        const itemDept = item.department.toLowerCase();
        const itemCat = item.category.toLowerCase();
        const req = deptParam.toLowerCase();

        if (req === 'bags' || req === 'shop-all-bags') {
          if (itemDept !== 'bags') return false;
        } else if (req === 'shoes') {
          if (itemDept !== 'shoes') return false;
        } else if (req === 'accessories') {
          if (itemDept !== 'accessories') return false;
        } else {
          const matchCat =
            itemCat.includes(req) ||
            req.includes(itemCat) ||
            item.name.toLowerCase().includes(req);
          if (!matchCat) return false;
        }
      }

      if (badgeParam) {
        if (!item.badge || !item.badge.toLowerCase().includes(badgeParam.toLowerCase())) {
          return false;
        }
      }

      if (selectedColor) {
        const hasColor = item.colors.some((c) =>
          c.name.toLowerCase().includes(selectedColor.toLowerCase())
        );
        if (!hasColor) return false;
      }

      if (selectedMaterial) {
        if (
          !item.description.toLowerCase().includes(selectedMaterial.toLowerCase()) &&
          !item.name.toLowerCase().includes(selectedMaterial.toLowerCase())
        ) {
          return false;
        }
      }

      if (selectedMeasure) {
        if (
          !item.dimensions?.toLowerCase().includes(selectedMeasure.toLowerCase()) &&
          !item.description.toLowerCase().includes(selectedMeasure.toLowerCase())
        ) {
          return false;
        }
      }

      if (queryParam) {
        const q = queryParam.toLowerCase();
        const match =
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortParam === 'price-low') return a.price - b.price;
      if (sortParam === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [catalog, deptParam, badgeParam, selectedColor, selectedMeasure, selectedMaterial, queryParam, sortParam]);

  const activeFiltersCount =
    (deptParam !== 'Bags' && deptParam !== 'All' ? 1 : 0) +
    (badgeParam ? 1 : 0) +
    (selectedColor ? 1 : 0) +
    (selectedMeasure ? 1 : 0) +
    (selectedMaterial ? 1 : 0) +
    (sortParam !== 'featured' ? 1 : 0);

  const handleQuickAdd = (product: typeof catalog[0], colorName: string, image: string, size = 'One Size') => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image,
      },
      1,
      colorName,
      size
    );
    toast.success(`${product.name} added to bag`);
  };

  const handleDeptSelect = (d: string) => {
    const next = new URLSearchParams(searchParams);
    if (d === 'All') next.delete('category');
    else next.set('category', d);
    setSearchParams(next);
  };

  const handleSortChange = (sortVal: string) => {
    const next = new URLSearchParams(searchParams);
    if (sortVal === 'featured') next.delete('sort');
    else next.set('sort', sortVal);
    setSearchParams(next);
  };

  const handleColorToggle = (colorName: string) => {
    const next = new URLSearchParams(searchParams);
    if (selectedColor === colorName) next.delete('color');
    else next.set('color', colorName);
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Distinct color list for filters
  const allColors = [
    { name: 'Black', code: '#141414' },
    { name: 'Brown', code: '#56382D' },
    { name: 'Hazel', code: '#8B6544' },
    { name: 'Cognac', code: '#A25934' },
    { name: 'Milk', code: '#F4F2EC' },
    { name: 'Forest', code: '#2D4436' },
    { name: 'Burgundy', code: '#5B2333' },
  ];

  const pageTitle = deptParam && deptParam !== 'All' ? deptParam.toUpperCase() : 'ALL BAGS';

  return (
    <div className="collections-page-wrap">
      <div className="collections-container">
        {/* 1. Breadcrumbs (Exact real project: Home > Shop All > Bags) */}
        <nav className="collections-breadcrumbs-nav" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="crumb-separator">&gt;</span>
          <Link to="/collections/shop-all-bags">Shop All</Link>
          <span className="crumb-separator">&gt;</span>
          <span className="crumb-current">{deptParam || 'Bags'}</span>
        </nav>

        {/* 2. Header Row: Title, Description & Right-Aligned Filter */}
        <div className="collections-editorial-row">
          <div className="collections-editorial-copy">
            <h1 className="collections-heading-text" id="departmentTitle">
              {pageTitle}
            </h1>
            <p className="collections-lead-text" id="departmentDesc">
              Leather handbags from Velmora, crafted in premium leather and made to last. Explore leather bags for women and men in our signature shapes, from totes and shoulder bags to crossbody styles, for every day and every occasion.
            </p>
          </div>

          {/* Right-Aligned Minimal Filter Trigger (Screenshot 1: ⊶ FILTER) */}
          <div className="collections-filter-trigger-wrap">
            <button
              className="btn-velmora-clean-filter"
              id="filterDrawerTrigger"
              onClick={() => setFilterDrawerOpen(true)}
              aria-label="Open Filter"
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.3" className="filter-icon-svg">
                <line x1="1" y1="3" x2="17" y2="3" />
                <circle cx="12" cy="3" r="2.2" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.3" />
                <line x1="1" y1="9" x2="17" y2="9" />
                <circle cx="6" cy="9" r="2.2" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <span className="filter-label-text">FILTER</span>
              {activeFiltersCount > 0 && (
                <span className="filter-count-badge">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* 3. Velmora 4-Column Product Grid */}
        <div className="row g-3 g-md-4" id="productsGrid">
          {filteredProducts.map((product) => {
            const activeColorIdx = cardColorIndex[product.id] || 0;
            const colorObj = product.colors[activeColorIdx] || product.colors[0];

            const imagesList =
              colorObj.images && colorObj.images.length > 0
                ? colorObj.images
                : [colorObj.primary, colorObj.alt].filter(Boolean);

            const currentSlide = cardSlideIndex[product.id] || 0;
            const activeImg = imagesList[currentSlide] || colorObj.primary;

            const isShoes = product.department?.toLowerCase() === 'shoes';

            return (
              <div key={product.id} className="col-6 col-md-4 col-xl-3 product-card" data-id={product.id}>
                {/* Media Container (4:5 Aspect Frame) */}
                <div className="card-media-box">
                  {/* Clean unboxed NEW badge */}
                  <span className="card-badge-minimal">
                    {product.badge && product.badge !== 'New Season' ? product.badge : 'NEW'}
                  </span>

                  {/* Carousel Track */}
                  <div className="card-carousel-viewport">
                    <div className="card-carousel-track">
                      <div className="card-carousel-slide active">
                        <Link to={`/products/${product.id}/`} className="card-image-link">
                          <img
                            src={activeImg}
                            alt={product.name}
                            loading="lazy"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Multi-angle Chevrons */}
                  {imagesList.length > 1 && (
                    <div className="carousel__arrows">
                      <button
                        type="button"
                        className="arrow--prev"
                        title="Previous photo"
                        aria-label="Previous photo"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCardSlideIndex((prev) => ({
                            ...prev,
                            [product.id]: (currentSlide - 1 + imagesList.length) % imagesList.length,
                          }));
                        }}
                      >
                        <svg width="11" height="21" viewBox="0 0 11 21" fill="none">
                          <path d="M10 20L0.999999 10.5L10 1" stroke="black" strokeLinecap="round" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="arrow--next"
                        title="Next photo"
                        aria-label="Next photo"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCardSlideIndex((prev) => ({
                            ...prev,
                            [product.id]: (currentSlide + 1) % imagesList.length,
                          }));
                        }}
                      >
                        <svg width="11" height="21" viewBox="0 0 11 21" fill="none">
                          <path d="M1 1L10 10.5L1 20" stroke="black" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {imagesList.length > 1 && (
                    <div className="carousel__progress-bar">
                      <div
                        className="carousel__progress-fill"
                        style={{ width: `${((currentSlide + 1) / imagesList.length) * 100}%` }}
                      />
                    </div>
                  )}

                  {/* QuickBuy Overlay on Hover */}
                  <div className="card-quickbuy">
                    {isShoes ? (
                      <div className="card-shoe-sizes-row">
                        {['36', '37', '38', '39', '40', '41'].map((sz) => (
                          <span
                            key={sz}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuickAdd(product, colorObj.name, activeImg, sz);
                            }}
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="card-quick-add-bar"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuickAdd(product, colorObj.name, activeImg);
                        }}
                      >
                        Add to cart
                      </button>
                    )}
                  </div>
                </div>

                {/* Info wrap: Title and Price on Single Line */}
                <div className="card-info-wrap">
                  <div className="card-meta-line">
                    <h3 className="card-title-text">
                      <Link to={`/products/${product.id}/`}>
                        {product.name.toUpperCase()}{' '}
                        <span className="active-color-text">
                          {product.variantTitle ? product.variantTitle : (colorObj?.name ? `in ${colorObj.name}` : '')}
                        </span>
                      </Link>
                    </h3>
                    <span className="card-price-text">${product.price}</span>
                  </div>

                  {/* Color Swatches */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="card-swatches-row">
                      {product.colors.map((c, cIdx) => (
                        <button
                          key={c.name}
                          type="button"
                          className={`swatch-dot ${activeColorIdx === cIdx ? 'active' : ''}`}
                          style={{ background: c.code }}
                          title={c.name}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCardColorIndex((prev) => ({ ...prev, [product.id]: cIdx }));
                            setCardSlideIndex((prev) => ({ ...prev, [product.id]: 0 }));
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Slide-Out Filter Drawer (Clean, Modern Quiet Luxury) */}
      {filterDrawerOpen && (
        <>
          <div className="filter-backdrop show" onClick={() => setFilterDrawerOpen(false)} />
          <aside className="filter-drawer-container open" aria-label="Filters Panel">
            <div className="filter-drawer-header">
              <h3 className="filter-drawer-title">Filter & Sort</h3>
              <button
                type="button"
                className="filter-drawer-close"
                onClick={() => setFilterDrawerOpen(false)}
                aria-label="Close Filters"
              >
                ✕
              </button>
            </div>

            <div className="filter-drawer-body">
              {/* Department Selector */}
              <div className="filter-block">
                <span className="filter-block-title">Department</span>
                <div className="filter-option-pills">
                  {['All', 'Bags', 'Shoes', 'Accessories'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`filter-drawer-pill ${(deptParam === d || (d === 'All' && deptParam === 'All')) ? 'active' : ''}`}
                      onClick={() => handleDeptSelect(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Selector */}
              <div className="filter-block">
                <span className="filter-block-title">Sort By</span>
                <select
                  className="form-select filter-sort-select"
                  value={sortParam}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {/* Colors Filter */}
              <div className="filter-block">
                <span className="filter-block-title">Colorways</span>
                <div className="filter-colors-grid">
                  {allColors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      className={`color-filter-btn ${selectedColor === c.name ? 'active' : ''}`}
                      onClick={() => handleColorToggle(c.name)}
                    >
                      <span className="color-circle" style={{ background: c.code }} /> {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="filter-drawer-footer">
                <button
                  type="button"
                  className="btn-filter-clear"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
                <button
                  type="button"
                  className="btn-filter-apply"
                  onClick={() => setFilterDrawerOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Floating Concierge Chat Bubble */}
      <button
        type="button"
        className="dp-floating-chat"
        aria-label="Customer Support Chat"
        onClick={() => toast.info('Velmora Concierge is available. How may we assist you today?')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0-2-.9-2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
        </svg>
      </button>
    </div>
  );
};
