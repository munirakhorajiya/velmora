// Velmora Authentic Storefront Controller (Mega Menus, Collections, Image Arrows & Filter Drawer)
document.addEventListener('DOMContentLoaded', () => {
  if (typeof VELMORA_CATALOG === 'undefined') return;

  const grid = document.getElementById('productsGrid');
  const pillsContainer = document.getElementById('categoryPillsContainer');
  const countLabel = document.getElementById('activeFilterBadge');
  const deptTitle = document.getElementById('departmentTitle');
  const deptDesc = document.getElementById('departmentDesc');
  const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
  const filterDrawer = document.getElementById('filterDrawer');
  const filterBackdrop = document.getElementById('filterBackdrop');
  const drawerTrigger = document.getElementById('filterDrawerTrigger');
  const drawerClose = document.getElementById('closeFilterDrawer');
  const drawerApply = document.getElementById('applyFiltersBtn');
  const drawerClear = document.getElementById('clearAllFilters');
  const drawerSort = document.getElementById('drawerSortSelect');

  // Page Context from Django template
  const contextEl = document.getElementById('velmoraPageContext');
  const pageDept = contextEl ? (contextEl.dataset.dept || 'all') : 'all';
  const pageCat = contextEl ? (contextEl.dataset.category || '') : '';
  const pageBadge = contextEl ? (contextEl.dataset.badge || '') : '';
  const pageSlug = contextEl ? (contextEl.dataset.slug || '') : '';

  // URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const paramDept = urlParams.get('department') || '';
  const paramCat = urlParams.get('category') || '';
  const paramBadge = urlParams.get('badge') || '';
  const paramQuery = urlParams.get('q') || '';
  const paramTag = urlParams.get('tag') || '';
  const paramMaterial = urlParams.get('material') || '';

  let currentDept = paramDept || (pageDept !== 'all' ? pageDept : 'all');
  if (currentDept === 'all' && ['bags', 'shoes', 'accessories'].includes(pageSlug.toLowerCase())) {
    currentDept = pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1).toLowerCase();
  }
  if (['all-footwear', 'footwear'].includes(pageSlug.toLowerCase())) {
    currentDept = 'Shoes';
  }

  let currentCategory = paramCat || pageCat || 'all';
  let currentBadge = paramBadge || pageBadge || '';
  let currentColor = 'all';
  let currentTag = paramTag || '';
  let currentMaterial = paramMaterial || '';
  let currentSort = 'featured';

  // Department & Category metadata for editorial header matching Deadly Ponies
  const DEPT_METADATA = {
    all: {
      title: 'COLLECTIONS',
      desc: 'Explore our complete curation of handcrafted leather handbags, artisan footwear, and small goods crafted in limited editions.',
      breadcrumb: 'Shop All'
    },
    Bags: {
      title: 'BAGS',
      desc: 'Every style, in every shade. Browse the complete Velmora collection of handcrafted leather bags - totes, shoulder bags, crossbody styles, and clutches.',
      breadcrumb: 'Bags'
    },
    Shoes: {
      title: 'SHOES',
      desc: 'Every style, every season. Browse the complete Velmora footwear collection - flats, loafers, boots, sneakers, heels, and sandals, all in one place.',
      breadcrumb: 'Shoes'
    },
    'all-footwear': {
      title: 'ALL FOOTWEAR',
      desc: 'Every style, every season. Browse the complete Velmora footwear collection - flats, loafers, boots, sneakers, heels, and sandals, all in one place.',
      breadcrumb: 'All Footwear'
    },
    Accessories: {
      title: 'ACCESSORIES',
      desc: 'Handcrafted small leather goods made to accompany you everywhere. Browse the complete Velmora accessories collection - wallets, belts, scarves, and leather care.',
      breadcrumb: 'Accessories'
    },
    Wallets: {
      title: 'WALLETS',
      desc: 'Every wallet style, in one place. From slim cardholders to full-sized leather wallets, browse the complete Velmora wallet collection and find the one that fits how you carry.',
      breadcrumb: 'Wallets'
    }
  };

  // Sync Editorial Header text with current department/category (Screenshot 1: Monospace Intro & Title)
  function syncEditorialHeader() {
    let meta = DEPT_METADATA[currentDept] || DEPT_METADATA.all;
    if (['all-footwear', 'footwear'].includes(pageSlug.toLowerCase())) {
      meta = DEPT_METADATA['all-footwear'];
    } else if (currentCategory && currentCategory.toLowerCase() === 'wallets') {
      meta = DEPT_METADATA.Wallets;
    }
    if (deptTitle && meta.title) deptTitle.innerText = meta.title;
    if (deptDesc && meta.desc) deptDesc.innerText = meta.desc;
    if (breadcrumbCurrent && meta.breadcrumb) breadcrumbCurrent.innerText = meta.breadcrumb;
  }

  // 2. Filter & Render Product Cards
  function renderProducts() {
    if (!grid) return;

    let items = VELMORA_CATALOG.filter(p => {
      const matchesDept = currentDept === 'all' || p.department.toLowerCase() === currentDept.toLowerCase();
      const matchesCat = currentCategory === 'all' || p.category.toLowerCase().includes(currentCategory.toLowerCase());
      const matchesBadge = !currentBadge || (p.badge && p.badge.toLowerCase().includes(currentBadge.toLowerCase()));
      const matchesColor = currentColor === 'all' || (p.colors && p.colors.some(c => c.name.toLowerCase().includes(currentColor.toLowerCase())));
      const matchesMaterial = !currentMaterial || (
        p.name.toLowerCase().includes(currentMaterial.toLowerCase()) ||
        (p.colors && p.colors.some(c => c.name.toLowerCase().includes(currentMaterial.toLowerCase()) || c.primary.toLowerCase().includes(currentMaterial.toLowerCase())))
      );
      const matchesTag = !currentTag || (
        p.name.toLowerCase().includes(currentTag.toLowerCase()) ||
        p.category.toLowerCase().includes(currentTag.toLowerCase())
      );
      return matchesDept && matchesCat && matchesBadge && matchesColor && matchesMaterial && matchesTag;
    });

    // Sort items
    items.sort((a, b) => {
      if (currentSort === 'price-low') return a.price - b.price;
      if (currentSort === 'price-high') return b.price - a.price;
      if (currentSort === 'newest') return (b.badge === 'New Season' ? 1 : 0) - (a.badge === 'New Season' ? 1 : 0);
      return 0; // featured default
    });

    // Update active filter badge counter
    let activeFilterCount = 0;
    if (currentDept !== 'all') activeFilterCount++;
    if (currentCategory !== 'all') activeFilterCount++;
    if (currentBadge) activeFilterCount++;
    if (currentColor !== 'all') activeFilterCount++;
    if (countLabel) {
      if (activeFilterCount > 0) {
        countLabel.innerText = activeFilterCount;
        countLabel.classList.remove('d-none');
      } else {
        countLabel.classList.add('d-none');
      }
    }

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5">
          <p class="text-muted" style="letter-spacing: 0.1em; font-size: 13px;">No pieces found matching your current selection.</p>
          <button class="btn btn-outline-dark btn-sm mt-3" onclick="resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map(product => {
      const colors = product.colors || [];
      const firstColor = colors.length > 0 ? colors[0] : null;
      const imagesList = (firstColor && firstColor.images && firstColor.images.length > 0)
        ? firstColor.images
        : [firstColor ? firstColor.primary : '/media/editorial/cat_shoulder.jpg', firstColor ? firstColor.alt : ''].filter(Boolean);

      const colorName = firstColor ? firstColor.name : '';
      const hasMultipleColors = colors.length > 1;
      const isShoes = (product.department && product.department.toLowerCase() === 'shoes');

      const swatchesHtml = hasMultipleColors
        ? `
          <div class="card-swatches-row">
            ${colors.map((c, idx) => `
              <button 
                type="button"
                class="swatch-dot ${idx === 0 ? 'active' : ''}" 
                style="background: ${c.code};" 
                title="${c.name}"
                data-name="${c.name}"
                data-index="${idx}"
                onclick="handleSwatchClick(event, this, '${product.id}', ${idx})"
              ></button>
            `).join('')}
          </div>
        `
        : '';

      const arrowsHtml = imagesList.length > 1
        ? `
          <div class="carousel__arrows">
            <button type="button" class="arrow--prev" title="Previous photo" aria-label="Previous photo" onclick="handleCardSlideStep(event, this, -1)">
              <svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20L0.999999 10.5L10 1" stroke="black" stroke-linecap="round"/>
              </svg>
            </button>
            <button type="button" class="arrow--next" title="Next photo" aria-label="Next photo" onclick="handleCardSlideStep(event, this, 1)">
              <svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L10 10.5L1 20" stroke="black" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        `
        : '';

      const progressBarHtml = imagesList.length > 1
        ? `
          <div class="carousel__progress-bar">
            <div class="carousel__progress-fill" style="width: ${(1 / imagesList.length) * 100}%;"></div>
          </div>
        `
        : '';

      // Deadly Ponies QuickBuy overlay on hover (Add to cart for bags/acc, sizes for shoes)
      const quickBuyHtml = isShoes
        ? `
          <div class="card-quickbuy card-quickbuy--shoes">
            <div class="card-shoe-sizes-row">
              <span onclick="handleCardQuickAdd(event, '${product.id}', '36')">36</span>
              <span onclick="handleCardQuickAdd(event, '${product.id}', '37')">37</span>
              <span onclick="handleCardQuickAdd(event, '${product.id}', '38')">38</span>
              <span onclick="handleCardQuickAdd(event, '${product.id}', '39')">39</span>
              <span onclick="handleCardQuickAdd(event, '${product.id}', '40')">40</span>
              <span onclick="handleCardQuickAdd(event, '${product.id}', '41')">41</span>
            </div>
          </div>
        `
        : `
          <div class="card-quickbuy">
            <button type="button" class="card-quick-add-bar" onclick="handleCardQuickAdd(event, '${product.id}')">
              Add to cart
            </button>
          </div>
        `;

      const slidesHtml = imagesList.map((img, i) => `
        <div class="card-carousel-slide ${i === 0 ? 'active' : ''}">
          <a href="/products/${product.id}/" class="card-image-link" tabindex="-1">
            <img src="${img}" alt="${product.name} Angle ${i + 1}" loading="${i < 2 ? 'eager' : 'lazy'}">
          </a>
        </div>
      `).join('');

      return `
        <div class="col-6 col-md-4 col-xl-3 product-card" data-id="${product.id}" data-color-index="0" data-slide-index="0">
          <div class="card-media-box">
            <span class="card-badge-minimal">${(product.badge && product.badge !== 'New Season') ? product.badge : 'NEW'}</span>
            
            <div class="card-carousel-viewport">
              <div class="card-carousel-track">
                ${slidesHtml}
              </div>
            </div>

            ${arrowsHtml}
            ${progressBarHtml}
            ${quickBuyHtml}
          </div>

          <div class="card-info-wrap">
            <div class="card-meta-line">
              <h3 class="card-title-text">
                <a href="/products/${product.id}/">
                  ${product.name.toUpperCase()} <span class="active-color-text">${colorName ? 'in ' + colorName : ''}</span>
                </a>
              </h3>
              <span class="card-price-text">$${product.price}</span>
            </div>

            ${swatchesHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  // 3. Multi-Image Slide Step (Deadly Ponies 1:1 match)
  // Clicking < or > smoothly slides through ALL photos of that item in the active colorway!
  window.handleCardSlideStep = function(event, btn, direction) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const card = btn.closest('.product-card');
    if (!card) return;

    const track = card.querySelector('.card-carousel-track');
    const slides = track ? track.querySelectorAll('.card-carousel-slide') : [];
    if (slides.length <= 1) return;

    let currentIndex = parseInt(card.dataset.slideIndex || '0', 10);
    let newIndex = (currentIndex + direction + slides.length) % slides.length;

    card.dataset.slideIndex = newIndex;

    track.style.transform = `translateX(-${newIndex * 100}%)`;

    const progressFill = card.querySelector('.carousel__progress-fill');
    if (progressFill) {
      progressFill.style.width = `${((newIndex + 1) / slides.length) * 100}%`;
    }
  };

  // Quick Buy Add to Cart Handler
  window.handleCardQuickAdd = function(event, productId, size) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const product = VELMORA_CATALOG.find(p => p.id === productId);
    if (!product) return;

    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    const colorIdx = card ? parseInt(card.dataset.colorIndex || '0', 10) : 0;
    const color = (product.colors && product.colors[colorIdx])
      ? product.colors[colorIdx]
      : ((product.colors && product.colors[0]) || {});

    let colorLabel = color.name || 'Standard';
    if (size) {
      colorLabel += ` (Size ${size})`;
    }

    const image = color.primary || (color.images && color.images[0]) || '/media/editorial/cat_shoulder.jpg';

    if (typeof addToCart === 'function') {
      addToCart(product.id, product.name, product.price, colorLabel, image);
    }
  };

  window.handleCardMouseEnter = function(mediaBox) {
    // Reveal hover elements cleanly without displacing active user slide
  };

  window.handleCardMouseLeave = function(mediaBox) {
    // Retain clean presentation
  };

  // 5. Swatch Click (Switches colorway, loads ALL images of that colorway, resets slide index)
  window.handleSwatchClick = function(event, dot, productId, index) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const card = dot.closest('.product-card');
    if (!card) return;

    const product = VELMORA_CATALOG.find(p => p.id === productId);
    if (!product || !product.colors || !product.colors[index]) return;

    card.dataset.colorIndex = index;
    card.dataset.slideIndex = 0;
    delete card.dataset.userNavigated;

    card.querySelectorAll('.swatch-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');

    const selectedColor = product.colors[index];
    const colorLabel = card.querySelector('.active-color-text');
    if (colorLabel && selectedColor.name) {
      colorLabel.innerText = `in ${selectedColor.name}`;
    }

    // Determine all photos for this new colorway
    let images = (selectedColor.images && selectedColor.images.length > 0)
      ? selectedColor.images
      : [selectedColor.primary, selectedColor.alt].filter(Boolean);

    const track = card.querySelector('.card-carousel-track');
    if (track) {
      track.innerHTML = images.map((img, i) => `
        <div class="card-carousel-slide ${i === 0 ? 'active' : ''}">
          <a href="/products/${product.id}/" class="card-image-link" tabindex="-1">
            <img src="${img}" alt="${product.name} Angle ${i + 1}" loading="${i < 2 ? 'eager' : 'lazy'}">
          </a>
        </div>
      `).join('');
      track.style.transform = 'translateX(0%)';
    }

    const progressFill = card.querySelector('.carousel__progress-fill');
    if (progressFill) {
      progressFill.style.width = `${(1 / images.length) * 100}%`;
    }
  };

  // 5. Quick Add To Bag from Card
  window.handleCardQuickAdd = function(id, name, price, btn) {
    const card = btn.closest('.product-card');
    const activeDot = card ? card.querySelector('.swatch-dot.active') : null;
    const color = activeDot && activeDot.dataset.name ? activeDot.dataset.name : 'Standard';
    const img = activeDot && activeDot.dataset.primary ? activeDot.dataset.primary : '/media/editorial/cat_shoulder.jpg';

    if (typeof addToCart === 'function') {
      addToCart(id, name, price, color, img);
    } else {
      // Visual feedback on button
      btn.innerText = 'ADDED ✓';
      setTimeout(() => { btn.innerText = 'ADD TO CART'; }, 1500);
    }
  };

  // 6. Reset Filters Helper
  window.resetFilters = function() {
    currentCategory = 'all';
    currentColor = 'all';
    currentBadge = '';
    currentMaterial = '';
    currentTag = '';
    syncEditorialHeader();
    renderProducts();
  };

  // 7. Filter Drawer Event Listeners
  if (drawerTrigger && filterDrawer) {
    drawerTrigger.addEventListener('click', () => {
      filterDrawer.classList.add('is-open');
      if (filterBackdrop) filterBackdrop.classList.add('is-open');
    });
  }

  const closeDrawer = () => {
    if (filterDrawer) filterDrawer.classList.remove('is-open');
    if (filterBackdrop) filterBackdrop.classList.remove('is-open');
  };

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (filterBackdrop) filterBackdrop.addEventListener('click', closeDrawer);

  // Department selector inside drawer
  document.querySelectorAll('#drawerDeptOptions .filter-drawer-pill').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#drawerDeptOptions .filter-drawer-pill').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentDept = this.dataset.dept;
      currentCategory = 'all';
      syncEditorialHeader();
      renderProducts();
    });
  });

  // Color options inside drawer
  document.querySelectorAll('#drawerColorOptions .color-filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        currentColor = 'all';
      } else {
        document.querySelectorAll('#drawerColorOptions .color-filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentColor = this.dataset.color;
      }
      renderProducts();
    });
  });

  // Badge options inside drawer
  document.querySelectorAll('#drawerBadgeOptions .filter-drawer-pill').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        currentBadge = '';
      } else {
        document.querySelectorAll('#drawerBadgeOptions .filter-drawer-pill').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentBadge = this.dataset.badge;
      }
      renderProducts();
    });
  });

  // Sort inside drawer
  if (drawerSort) {
    drawerSort.addEventListener('change', function() {
      currentSort = this.value;
      renderProducts();
    });
  }

  if (drawerClear) {
    drawerClear.addEventListener('click', () => {
      document.querySelectorAll('#drawerColorOptions .color-filter-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#drawerBadgeOptions .filter-drawer-pill').forEach(b => b.classList.remove('active'));
      resetFilters();
      closeDrawer();
    });
  }

  if (drawerApply) {
    drawerApply.addEventListener('click', closeDrawer);
  }

  // Mobile submenu accordion toggles
  document.querySelectorAll('.mobile-sub-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const target = document.querySelector(this.dataset.target);
      if (target) {
        target.classList.toggle('d-none');
        this.innerText = target.classList.contains('d-none') ? '＋' : '−';
      }
    });
  });

  // Initial Execution
  syncEditorialHeader();
  renderProducts();
});
