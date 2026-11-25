import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cart-context';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();

  const threshold = 300;
  const progressPercent = Math.min(100, Math.round((totalAmount / threshold) * 100));
  const diff = threshold - totalAmount;

  return (
    <div className="container-fluid px-4 px-md-5 py-5" style={{ maxWidth: '1440px', margin: '0 auto' }}>
      <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, fontWeight: 400 }}>
          Shopping Bag
        </h1>
        <Link to="/collections/" className="text-decoration-none" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--dp-noir)' }}>
          &larr; Continue Shopping
        </Link>
      </div>

      <div className="row g-5">
        {/* Items List Table */}
        <div className="col-12 col-lg-8" id="fullCartItemsContainer">
          {cart.length === 0 ? (
            <div className="text-center py-5 text-muted">
              Your shopping bag is currently empty.<br /><br />
              <Link to="/collections/" className="btn-bag-checkout d-inline-block text-decoration-none px-4 py-2">
                Discover Handbags
              </Link>
            </div>
          ) : (
            <>
              {/* Shipping Progress */}
              <div className="p-3 border bg-light mb-4" style={{ background: '#FAF9F6' }}>
                <span className="small d-block mb-1 text-muted" style={{ fontSize: '12px' }}>
                  {diff <= 0
                    ? '✓ You qualify for Complimentary Worldwide Express Shipping'
                    : `Add $${diff.toFixed(2)} more for Complimentary Express Shipping`}
                </span>
                <div className="progress" style={{ height: '4px' }}>
                  <div
                    className="progress-bar bg-dark"
                    role="progressbar"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {cart.map((item) => (
                <div key={`${item.id}-${item.color}`} className="drawer-cart-card p-3 mb-3 border">
                  <img
                    src={item.image}
                    className="drawer-cart-thumb"
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/media/editorial/cat_shoulder.jpg';
                    }}
                  />
                  <div className="drawer-cart-info">
                    <div className="drawer-item-title h5">{item.name}</div>
                    <div className="drawer-item-color">
                      {item.color} {item.size && item.size !== 'One Size' ? `(${item.size})` : ''} &mdash; ${item.price}
                    </div>
                    <div className="drawer-item-controls mt-2">
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
              ))}
            </>
          )}
        </div>

        {/* Order Summary Card */}
        <div className="col-12 col-lg-4">
          <div className="p-4" style={{ background: 'var(--dp-sand)', border: '1px solid var(--dp-border)' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', fontWeight: 500 }}>
              Order Summary
            </h4>

            <div className="d-flex justify-content-between py-2 border-bottom" style={{ fontSize: '13px' }}>
              <span>Complimentary Express Shipping</span>
              <span style={{ color: 'var(--dp-gold)', fontWeight: 600 }}>FREE</span>
            </div>

            <div className="d-flex justify-content-between py-3 font-weight-bold" style={{ fontSize: '16px' }}>
              <span>Estimated Total</span>
              <span id="fullCartTotal">${totalAmount.toFixed(2)}</span>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--dp-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
              Duties and taxes included where applicable. Complimentary eco-friendly signature gift packaging included with all orders.
            </p>

            <Link to="/checkout/" className="btn-bag-checkout text-center d-block text-decoration-none">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
