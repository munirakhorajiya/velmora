// Velmora Authentic Shopping Bag & Drawer Logic
let cart = JSON.parse(localStorage.getItem('velmora_cart')) || [];

function saveCart() {
  localStorage.setItem('velmora_cart', JSON.stringify(cart));
  renderCart();
}

function addToCart(id, name, price, color, image) {
  const existing = cart.find(item => item.id === id && item.color === color);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, color, image, quantity: 1 });
  }
  saveCart();
  openDrawer();
}

function updateCartQty(id, color, delta) {
  const item = cart.find(i => i.id === id && i.color === color);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => !(i.id === id && i.color === color));
    }
  }
  saveCart();
}

function renderCart() {
  const counter = document.getElementById('cartCounter');
  const drawerItems = document.getElementById('drawerCartItems');
  const subtotalEl = document.getElementById('drawerSubtotal');
  const fillBar = document.getElementById('shippingProgressFill');
  const noticeEl = document.getElementById('shippingNotice');

  // Full cart page elements
  const fullCartContainer = document.getElementById('fullCartItemsContainer');
  const fullCartTotal = document.getElementById('fullCartTotal');

  const totalCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  if (counter) counter.innerText = totalCount;
  if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
  if (fullCartTotal) fullCartTotal.innerText = `$${subtotal.toFixed(2)}`;

  // Shipping threshold calculation ($300 target)
  if (fillBar) {
    const progress = Math.min(100, (subtotal / 300) * 100);
    fillBar.style.width = `${progress}%`;
  }

  if (noticeEl) {
    if (subtotal >= 300) {
      noticeEl.innerText = '✦ You qualify for Complimentary Worldwide Express Shipping';
    } else {
      const remaining = (300 - subtotal).toFixed(2);
      noticeEl.innerText = `Add $${remaining} more for Complimentary Express Shipping`;
    }
  }

  // Render Drawer Items
  if (drawerItems) {
    if (cart.length === 0) {
      drawerItems.innerHTML = '<div class="text-center py-5 text-muted" style="font-size: 13px;">Your shopping bag is currently empty.</div>';
    } else {
      drawerItems.innerHTML = cart.map(item => `
        <div class="drawer-cart-card">
          <img src="${item.image}" class="drawer-cart-thumb" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80'">
          <div class="drawer-cart-info">
            <div class="drawer-item-title">${item.name}</div>
            <div class="drawer-item-color">${item.color} — $${item.price}</div>
            <div class="drawer-item-controls">
              <div class="drawer-qty-stepper">
                <button onclick="updateCartQty(${item.id}, '${item.color}', -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQty(${item.id}, '${item.color}', 1)">+</button>
              </div>
              <button class="drawer-btn-remove" onclick="updateCartQty(${item.id}, '${item.color}', -${item.quantity})">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Render Full Cart Page Table if on /cart/
  if (fullCartContainer) {
    if (cart.length === 0) {
      fullCartContainer.innerHTML = `
        <div class="text-center py-5 text-muted">
          Your shopping bag is currently empty.<br><br>
          <a href="/collections/" class="btn-bag-checkout d-inline-block text-decoration-none px-4 py-2">Discover Handbags</a>
        </div>
      `;
    } else {
      fullCartContainer.innerHTML = cart.map(item => `
        <div class="drawer-cart-card p-3 mb-3 border">
          <img src="${item.image}" class="drawer-cart-thumb" alt="${item.name}">
          <div class="drawer-cart-info">
            <div class="drawer-item-title h5">${item.name}</div>
            <div class="drawer-item-color">${item.color} — $${item.price}</div>
            <div class="drawer-item-controls mt-2">
              <div class="drawer-qty-stepper">
                <button onclick="updateCartQty(${item.id}, '${item.color}', -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQty(${item.id}, '${item.color}', 1)">+</button>
              </div>
              <button class="drawer-btn-remove" onclick="updateCartQty(${item.id}, '${item.color}', -${item.quantity})">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

// Drawer Open/Close Events
function openDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.add('show');
  if (backdrop) backdrop.classList.add('show');
}

function closeDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.remove('show');
  if (backdrop) backdrop.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  const openBtn = document.getElementById('openCartDrawer');
  const closeBtn = document.getElementById('closeCartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');

  if (openBtn) openBtn.addEventListener('click', (e) => { e.preventDefault(); openDrawer(); });
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
});
