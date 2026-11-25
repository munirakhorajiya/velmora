import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { VELMORA_CATALOG, type CatalogProduct, type CatalogColor } from '../api/catalogData';
import { getProductByIdOrSlug, subscribeToCatalogUpdates } from '../api/catalogSync';
import { api } from '../api/client';
import { useCart } from '../context/cart-context';
import { toast } from 'sonner';

const ProductDetailContent: React.FC<{ id?: string }> = ({ id }) => {
  const { addToCart } = useCart();

  // 1. Initial product load from merged catalog (instant, no layout shift)
  const [product, setProduct] = useState<CatalogProduct>(() => getProductByIdOrSlug(id));
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('38');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [accordionState, setAccordionState] = useState<{ [key: string]: boolean }>({
    features: true,
    dimensions: false,
    materials: false,
    care: false,
  });

  // 2. Fetch live updates if id is numeric or if fresh API data exists
  useEffect(() => {
    let active = true;
    const initialName = getProductByIdOrSlug(id).name;

    // If id is numeric or matches a DB product, fetch live API product details
    const fetchApiProduct = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/products/${id}/`);
        if (!active || !res.data) return;
        const apiP = res.data;
        setProduct((prev) => {
          const apiGallery: string[] = apiP.gallery_images || [];
          const existingColors = prev.colors || [];

          const updatedColors = existingColors.map((c, i) => {
            if (i === 0 && (!c.images || c.images.length === 0) && apiGallery.length > 0) {
              return {
                ...c,
                images: apiGallery,
                primary: apiGallery[0] || c.primary
              };
            }
            return c;
          });

          return {
            ...prev,
            name: apiP.name || prev.name,
            price: parseFloat(apiP.current_price || apiP.price) || prev.price,
            description: apiP.description || prev.description,
            materials: apiP.material || prev.materials,
            colors: updatedColors.length > 0 ? updatedColors : prev.colors,
            badge: apiP.is_in_stock ? (prev.badge || 'New') : 'Sold Out'
          };
        });
      } catch {
        // Silently keep catalog product if direct API route doesn't match ID
      }
    };

    void fetchApiProduct();

    // Listen to real-time updates broadcast by dashboard modifications
    const unsubscribe = subscribeToCatalogUpdates((updated) => {
      if (!Array.isArray(updated)) {
        if (
          String(updated.id).toLowerCase() === String(id).toLowerCase() ||
          updated.name.toLowerCase() === initialName.toLowerCase()
        ) {
          setProduct(updated);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [id]);

  const activeColor: CatalogColor =
    product.colors && product.colors[selectedColorIndex]
      ? product.colors[selectedColorIndex]
      : product.colors && product.colors[0]
      ? product.colors[0]
      : {
          name: 'Classic',
          code: '#141414',
          primary: '/media/editorial/cat_shoulder.jpg',
          alt: '/media/editorial/cat_shoulder.jpg',
          images: ['/media/editorial/cat_shoulder.jpg']
        };

  const isShoes = product.department && product.department.toLowerCase() === 'shoes';

  // Toggle accordion sections
  const toggleAccordion = (key: string) => {
    setAccordionState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Add to Bag Handler
  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: activeColor.primary || '/media/editorial/cat_shoulder.jpg',
      },
      1,
      activeColor.name,
      isShoes ? selectedSize : 'One Size'
    );
    toast.success(`${product.name} in ${activeColor.name} added to your bag`);
  };

  // 4 Recommended products for "YOU MAY ALSO LIKE"
  const recommendedProducts = VELMORA_CATALOG.filter((p) => p.id !== product.id).slice(0, 4);

  // Gallery images to display in vertical zero-gap photo stack
  const photoStackImages =
    activeColor.images && activeColor.images.length > 0
      ? activeColor.images
      : activeColor.primary
      ? [activeColor.primary]
      : ['/media/editorial/cat_shoulder.jpg'];

  return (
    <div className="pdp-page-container">
      {/* 1. Minimal Top Breadcrumb */}
      <div className="pdp-top-bar">
        <div className="pdp-breadcrumbs" id="detailBreadcrumbs">
          <Link to="/">Home</Link> <span className="sep">/</span>
          <Link to={`/collections?category=${product.department || 'Bags'}`}>{product.department || 'Bags'}</Link> <span className="sep">/</span>
          <span className="current">{product.name}</span>
        </div>
      </div>

      {/* 2. 2-Column Product Section (Exact Deadly Ponies 50/50 Grid) */}
      <section id="pdp-hero" className="product-section">
        {/* LEFT: Seamless Vertical Photo Stack (Zero Space Between Photos) */}
        <div className="product-section__col--images" id="galleryPhotoStack">
          {photoStackImages.map((imgSrc, idx) => (
            <div key={idx} className="product-section__img-frame">
              <img
                src={imgSrc.startsWith('http') || imgSrc.startsWith('/') ? imgSrc : `/media/${imgSrc}`}
                alt={`${product.name} ${activeColor.name} Angle ${idx + 1}`}
                loading={idx > 1 ? 'lazy' : 'eager'}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = '/media/editorial/cat_shoulder.jpg';
                }}
              />
            </div>
          ))}
        </div>

        {/* RIGHT: Sticky Purchasing Column */}
        <div className="product-section__col--sticky">
          <div className="product-section-block__inner">
            {/* Tag / Badge */}
            <span className="product-section-block__tag" id="productBadgeLabel">
              {product.badge ? product.badge : 'New'}
            </span>

            {/* Heading: Title */}
            <h1 className="product-section-block__heading" id="productMainTitle">
              {product.name}
            </h1>

            {/* Price */}
            <div className="product-section-block__price" id="productPriceText">
              ${Number(product.price).toFixed(2)}
            </div>

            {/* Payments Installment Note with Klarna SVG */}
            <div className="product-section-block__payments" id="installmentNote">
              <span>4 x payments of ${(Number(product.price) / 4).toFixed(2)}</span>
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6329 2.42176L8.8273 0.253611C7.56075 -0.469104 5.97729 0.438365 5.97729 1.89466V2.13919C5.97729 2.27504 6.0482 2.40002 6.1682 2.46523L7.05838 2.97058C7.30384 3.11187 7.60984 2.93255 7.60984 2.64998V2.06855C7.60984 1.78055 7.92075 1.60123 8.1722 1.74251L9.9193 2.74236L11.6609 3.73677C11.9118 3.87805 11.9118 4.24213 11.6609 4.38341L9.9193 5.37782L8.1722 6.37768C7.92075 6.51896 7.60984 6.33961 7.60984 6.05161V5.76361C7.60984 4.30734 6.02639 3.39443 4.75967 4.12258L0.954083 6.29074C-0.318028 7.01887 -0.318028 8.85012 0.954083 9.57825L4.75967 11.7464C6.02639 12.4691 7.60984 11.5616 7.60984 10.1054V9.86085C7.60984 9.72498 7.53893 9.60002 7.41839 9.53478L6.52875 9.02941C6.28275 8.88814 5.97729 9.06749 5.97729 9.35003V9.93149C5.97729 10.2195 5.66584 10.3988 5.41493 10.2575L3.66767 9.25769L1.92598 8.26327C1.67479 8.12194 1.67479 7.7579 1.92598 7.61663L3.66767 6.62221L5.41493 5.62234C5.66584 5.48106 5.97729 5.66041 5.97729 5.94841V6.23641C5.97729 7.69267 7.56075 8.6056 8.8273 7.87741L12.6329 5.70928C13.9049 4.97571 13.9049 3.14991 12.6329 2.42176Z" fill="#141414"/>
              </svg>
            </div>

            {/* Color Swatches Row */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-section-block__header-row--color" id="swatchesContainer">
                <div className="product-swatch__heading">
                  COLOUR: <span id="activeColorName" style={{ fontWeight: 500, textTransform: 'capitalize', color: '#141414' }}>{activeColor.name}</span>
                </div>
                <div className="product-swatch__list" id="swatchesList">
                  {product.colors.map((c, idx) => (
                    <button
                      key={c.name + idx}
                      type="button"
                      className={`product-swatch__option ${selectedColorIndex === idx ? 'active' : ''}`}
                      style={{ background: c.code || '#141414' }}
                      title={`${c.name}`}
                      onClick={() => setSelectedColorIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Footwear Sizes Row (Shown for shoes) */}
            {isShoes && (
              <div className="product-sizes-wrap" id="sizesContainer">
                <div className="product-sizes-header">
                  <span>SIZE: <span id="activeSelectedSize" style={{ fontWeight: 400 }}>{selectedSize}</span></span>
                  <span className="product-size-guide-btn" onClick={() => setSizeGuideOpen(true)}>SIZE GUIDE</span>
                </div>
                <div className="product-sizes-grid" id="sizesList">
                  {['36', '37', '38', '39', '40', '41'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className={`product-size-pill ${selectedSize === sz ? 'active' : ''}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Solid Black ADD TO CART Button */}
            <button
              className="product-section-block__btn"
              id="detailAddCartBtn"
              type="button"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>

            {/* Delivery Perk */}
            <div className="product-delivery-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span><strong>Complimentary express worldwide courier</strong> &amp; 30-day returns.</span>
            </div>

            {/* Accordions: Features, Dimensions, Materials, Care */}
            <div className="accordion" id="detailAccordion">
              {/* Details & Features */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${accordionState.features ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => toggleAccordion('features')}
                  >
                    DETAILS &amp; FEATURES
                  </button>
                </h2>
                {accordionState.features && (
                  <div className="accordion-collapse collapse show">
                    <div className="accordion-body">
                      <p id="productLeadDesc" style={{ marginBottom: '12px', lineHeight: '22px' }}>
                        {product.description}
                      </p>
                      {product.features && product.features.length > 0 && (
                        <ul id="featuresList">
                          {product.features.map((feat, fIdx) => (
                            <li key={fIdx}>{feat}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dimensions */}
              {product.dimensions && (
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${accordionState.dimensions ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => toggleAccordion('dimensions')}
                    >
                      DIMENSIONS &amp; SPECIFICATIONS
                    </button>
                  </h2>
                  {accordionState.dimensions && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body" id="dimensionsContent">
                        {product.dimensions}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Materials */}
              {product.materials && (
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${accordionState.materials ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => toggleAccordion('materials')}
                    >
                      MATERIAL &amp; HARDWARE
                    </button>
                  </h2>
                  {accordionState.materials && (
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body" id="materialsContent">
                        {product.materials}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Care Guide */}
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${accordionState.care ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => toggleAccordion('care')}
                  >
                    PRODUCT CARE &amp; WARRANTY
                  </button>
                </h2>
                {accordionState.care && (
                  <div className="accordion-collapse collapse show">
                    <div className="accordion-body" id="careContent">
                      {product.care ||
                        'Apply Velmora organic leather cream every 3-6 months. Keep away from direct sunlight, extreme humidity, and liquids. Store in provided archival dust bag.'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. You May Also Like Section */}
      <section className="pdp-related-wrap">
        <h2 className="pdp-related-title">YOU MAY ALSO LIKE</h2>
        <div className="row g-3 g-md-4" id="relatedProductsGrid">
          {recommendedProducts.map((rel) => {
            const relColor = rel.colors[0];
            return (
              <div key={rel.id} className="col-6 col-md-3 product-card">
                <div className="card-media-box">
                  <div className="card-carousel-viewport">
                    <Link to={`/products/${rel.id}/`} className="card-image-link">
                      <img src={relColor.primary} alt={rel.name} />
                    </Link>
                  </div>
                </div>
                <div className="card-info-wrap mt-2">
                  <h3 className="card-title-text" style={{ fontSize: '13px' }}>
                    <Link to={`/products/${rel.id}/`} className="text-dark text-decoration-none">
                      {rel.name.toUpperCase()}
                    </Link>
                  </h3>
                  <span className="card-price-text">${rel.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 0, border: '1px solid #E3E1E1' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid #E3E1E1', padding: '20px 24px' }}>
                <h5 className="modal-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Footwear Size Conversion
                </h5>
                <button type="button" className="btn-close" onClick={() => setSizeGuideOpen(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body" style={{ padding: '24px' }}>
                <table className="table table-bordered text-center" style={{ fontSize: '12px', fontFamily: 'var(--font-sans)' }}>
                  <thead style={{ background: '#FAF9F6' }}>
                    <tr>
                      <th>EU</th>
                      <th>US / AU</th>
                      <th>UK</th>
                      <th>FOOT LENGTH (CM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>36</td><td>5.5 - 6</td><td>3.5</td><td>23.0 cm</td></tr>
                    <tr><td>37</td><td>6.5 - 7</td><td>4.5</td><td>23.7 cm</td></tr>
                    <tr><td>38</td><td>7.5 - 8</td><td>5.5</td><td>24.3 cm</td></tr>
                    <tr><td>39</td><td>8.5 - 9</td><td>6.5</td><td>25.0 cm</td></tr>
                    <tr><td>40</td><td>9.5 - 10</td><td>7.5</td><td>25.7 cm</td></tr>
                    <tr><td>41</td><td>10.5 - 11</td><td>8.5</td><td>26.3 cm</td></tr>
                  </tbody>
                </table>
                <p className="text-muted mb-0" style={{ fontSize: '11px' }}>
                  Our footwear fits true to European sizing. For half sizes or wider feet, we recommend sizing up to the nearest whole size.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <ProductDetailContent key={id || 'default'} id={id} />;
};

export default ProductDetailPage;
