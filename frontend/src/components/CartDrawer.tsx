import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cart-context';
import { useAuth } from '../context/auth-context';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount, isCartDrawerOpen, closeDrawer } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isCartDrawerOpen) return null;

  const threshold = 300;
  const progressPercent = Math.min(100, Math.round((totalAmount / threshold) * 100));
  const diff = threshold - totalAmount;

  return (
    <>
      <div className="cart-backdrop is-open" onClick={closeDrawer} style={{ display: 'block', opacity: 1 }}></div>
      <aside className="cart-drawer-container is-open" id="cartDrawer" style={{ transform: 'translateX(0)' }}>
        <div className="drawer-header">
          <h3 className="drawer-heading">Your Bag</h3>
          <button className="drawer-close-btn" onClick={closeDrawer} aria-label="Close Bag">&#10005;</button>
        </div>

        {/* Free shipping progress meter */}
        <div className="drawer-shipping-threshold">
          <div className="threshold-message" id="shippingNotice">
            {diff <= 0
              ? '✓ You qualify for Complimentary Worldwide Express Shipping'
              : `Add $${diff.toFixed(2)} more for Complimentary Express Shipping`}
          </div>
          <div className="threshold-bar">
            <div className="threshold-fill" id="shippingProgressFill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Items List using exact drawer-cart-card classes from cart.js */}
        <div className="drawer-items-list" id="drawerCartItems">
          {!isAuthenticated ? (
            <div style={{ textAlign: 'center', padding: '56px 24px' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', borderRadius: '50%', backgroundColor: '#FAF9F6', border: '1px solid #ECEAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8C6D37' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#141414', margin: '0 0 8px 0' }}>
                Private Atelier Bag
              </h3>
              <p style={{ fontSize: '12px', color: '#767676', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                Please sign in with your Velmora client account to view, add, and reserve bespoke handcrafted pieces.
              </p>
              <Link
                to="/login"
                onClick={closeDrawer}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '13px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  backgroundColor: '#141414',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  textDecoration: 'none',
                  borderRadius: '2px',
                  boxSizing: 'border-box'
                }}
              >
                Sign In / Join Velmora
              </Link>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-5 text-muted" style={{ fontSize: '13px' }}>
              Your shopping bag is currently empty.
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.color}`} className="drawer-cart-card">
                <img
                  src={item.image}
                  className="drawer-cart-thumb"
                  alt={item.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/media/editorial/cat_shoulder.jpg';
                  }}
                />
                <div className="drawer-cart-info">
                  <div className="drawer-item-title">{item.name}</div>
                  <div className="drawer-item-color">
                    {item.color} {item.size && item.size !== 'One Size' ? `(${item.size})` : ''} &mdash; ${item.price}
                  </div>
                  <div className="drawer-item-controls">
                    <div className="drawer-qty-stepper">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.color)}>&minus;</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.color)}>+</button>
                    </div>
                    <button
                      className="drawer-btn-remove"
                      onClick={() => removeFromCart(item.id, item.color)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {isAuthenticated && cart.length > 0 && (
          <div className="drawer-footer-checkout">
            <div className="drawer-subtotal-row">
              <span>Subtotal</span>
              <span id="drawerSubtotal">${totalAmount.toFixed(2)}</span>
            </div>
            <p className="drawer-shipping-note">Taxes & shipping calculated at checkout.</p>
            <Link
              to="/cart/"
              onClick={closeDrawer}
              className="btn-bag-primary mb-2 text-center d-block text-decoration-none"
            >
              View Bag
            </Link>
            <Link
              to="/checkout/"
              onClick={closeDrawer}
              className="btn-bag-checkout text-center d-block text-decoration-none"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};
