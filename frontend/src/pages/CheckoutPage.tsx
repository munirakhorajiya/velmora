import { api, getApiErrorMessage } from '../api/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart-context';
import { useAuth } from '../context/auth-context';
import type { OrderRecord, Product } from '../api/types';
import { toast } from 'sonner';

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export const CheckoutPage: React.FC = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [formData, setFormData] = useState({
    firstName: user?.first_name || 'Eleanor',
    lastName: user?.last_name || 'Vance',
    email: user?.email || 'eleanor.vance@example.com',
    phone: user?.phone_number || '+64 9 216 5427',
    street: '16 Te Ara Tahuhu Walkway, Britomart',
    city: 'Auckland',
    postalCode: '1010',
    country: 'New Zealand',
  });
  const [processing, setProcessing] = useState(false);

  const resolveOrderItems = async () => {
    let dbProducts: Product[] = [];
    const needsLookup = cart.some((item) => !Number.isInteger(Number(item.id)));
    if (needsLookup) {
      const prodRes = await api.get('/products/?page_size=200');
      dbProducts = (prodRes.data?.results || prodRes.data || []) as Product[];
    }

    const resolvedItems = cart.map((item) => {
      const numericId = Number(item.id);
      if (Number.isInteger(numericId) && numericId > 0) {
        return {
          product_id: numericId,
          quantity: item.quantity,
          selected_colour: item.color || '',
          selected_size: item.size || '',
          unit_price: Number(item.price),
        };
      }

      const itemNameLower = item.name.toLowerCase().trim();
      const matched = dbProducts.find(
        (p) => p.name.toLowerCase().trim() === itemNameLower || p.slug.toLowerCase() === String(item.id).toLowerCase()
      );
      if (!matched) {
        throw new Error(`"${item.name}" is not available in the backend catalog yet.`);
      }

      return {
        product_id: matched.id,
        quantity: item.quantity,
        selected_colour: item.color || '',
        selected_size: item.size || '',
        unit_price: Number(item.price),
      };
    });

    return resolvedItems;
  };

  const createRealOrder = async (): Promise<OrderRecord> => {
    const items = await resolveOrderItems();
    const orderPayload = {
      customer_name: `${formData.firstName} ${formData.lastName}`.trim() || user?.email || 'Client',
      phone_number: formData.phone.trim() || '+1 555 000 0000',
      shipping_address: `${formData.street}, ${formData.city}, ${formData.postalCode}, ${formData.country}`.trim(),
      items,
    };
    const res = await api.post('/orders/', orderPayload);
    const createdOrder = (res.data?.order || res.data) as OrderRecord | undefined;
    if (!createdOrder?.id || !createdOrder?.order_number) {
      throw new Error('Unexpected response from order service.');
    }
    return createdOrder;
  };

  const handleAuthorizeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const order = await createRealOrder();

      if (paymentMethod === 'razorpay') {
        if (typeof window.Razorpay === 'undefined') {
          toast.error('Razorpay SDK is loading, please try again in a moment.');
          setProcessing(false);
          return;
        }

        const rzpRes = await api.post('/payments/razorpay/create-order/', { order_id: order.id });
        const rzpData = rzpRes.data as {
          key_id: string;
          razorpay_order_id: string;
          amount: number;
          currency: string;
          customer_name?: string;
          customer_email?: string;
          phone_number?: string;
        };

        const options: RazorpayOptions = {
          key: rzpData.key_id,
          order_id: rzpData.razorpay_order_id,
          amount: rzpData.amount,
          currency: rzpData.currency || 'INR',
          name: 'VELMORA ATELIER',
          description: `Order #${order.order_number}`,
          image: '/static/images/velmora_logo.jpg',
          handler: async (response: RazorpaySuccessResponse) => {
            try {
              await api.post('/payments/razorpay/verify/', {
                order_id: order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              clearCart();
              toast.success('Payment Authorized & Verified', {
                description: `Payment ID: ${response.razorpay_payment_id}`,
              });
              navigate(`/order-confirmation/${order.order_number}/`, {
                state: { order, paymentMethod: 'razorpay' },
              });
            } catch (verifyErr: unknown) {
              toast.error(getApiErrorMessage(verifyErr, 'Payment verification failed. Please contact support.'));
              setProcessing(false);
            }
          },
          prefill: {
            name: rzpData.customer_name || `${formData.firstName} ${formData.lastName}`,
            email: rzpData.customer_email || formData.email,
            contact: rzpData.phone_number || formData.phone,
          },
          theme: {
            color: '#141414',
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
              toast.info('Atelier payment session paused');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        clearCart();
        toast.success('Commission Confirmed (Cash on Delivery)');
        navigate(`/order-confirmation/${order.order_number}/`, {
          state: { order, paymentMethod: 'cod' },
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error && !('isAxiosError' in err)
        ? err.message
        : getApiErrorMessage(err, 'Unable to place order. Please check your items and backend connection.');
      toast.error(msg);
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      <h1 className="checkout-page-title">Secure Checkout</h1>
      <div className="checkout-auth-badge">
        <span>Logged in as <strong>{formData.email}</strong></span>
      </div>

      <div className="checkout-autofill-notice">
        <span>✦ Complimentary express courier &amp; all import taxes covered by Velmora.</span>
      </div>

      <form onSubmit={handleAuthorizeOrder}>
        <div className="row g-5">
          {/* Left Column: Contact, Shipping, Payment */}
          <div className="col-lg-7">
            {/* 1. Contact Information */}
            <div className="mb-5">
              <h2 className="checkout-section-heading">1. Contact Information</h2>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="checkout-input-label">First Name</label>
                  <input
                    type="text"
                    required
                    className="checkout-field"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="checkout-input-label">Last Name</label>
                  <input
                    type="text"
                    required
                    className="checkout-field"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="checkout-input-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="checkout-field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="checkout-input-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="checkout-field"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="mb-5">
              <h2 className="checkout-section-heading">2. Delivery Address</h2>
              <div className="row g-3">
                <div className="col-12">
                  <label className="checkout-input-label">Street Address</label>
                  <input
                    type="text"
                    required
                    className="checkout-field"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="checkout-input-label">City</label>
                  <input
                    type="text"
                    required
                    className="checkout-field"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="checkout-input-label">Postal Code</label>
                  <input
                    type="text"
                    required
                    className="checkout-field"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="checkout-input-label">Country / Region</label>
                  <input
                    type="text"
                    required
                    className="checkout-field"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="mb-5">
              <h2 className="checkout-section-heading">3. Payment Method</h2>

              {/* Razorpay Online Option */}
              <div
                className={`payment-option-card ${paymentMethod === 'razorpay' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('razorpay')}
              >
                <div className="payment-radio-circle">
                  <div className="payment-radio-dot"></div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold text-uppercase" style={{ fontSize: '13px', letterSpacing: '0.06em' }}>
                      Razorpay Online Gateway
                    </span>
                    <span className="payment-method-badge badge-razorpay">Live UPI / Cards</span>
                  </div>
                  <p className="text-muted small mb-2">
                    Instant authorization via UPI (Google Pay, PhonePe, Paytm), Credit &amp; Debit Cards, NetBanking.
                  </p>
                </div>
              </div>

              {/* Cash on Delivery Option */}
              <div
                className={`payment-option-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="payment-radio-circle">
                  <div className="payment-radio-dot"></div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold text-uppercase" style={{ fontSize: '13px', letterSpacing: '0.06em' }}>
                      Cash on Delivery (COD)
                    </span>
                    <span className="payment-method-badge badge-cod">Atelier Pay</span>
                  </div>
                  <p className="text-muted small mb-0">
                    Settle commission fee in cash or terminal handover upon delivery to your address.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="col-lg-5">
            <div className="order-summary-box">
              <h3 className="checkout-section-heading mb-3">Order Summary ({cart.length})</h3>

              <div className="checkout-items-list mb-4">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="checkout-item-card">
                    <div className="d-flex gap-3 align-items-center">
                      <img src={item.image} alt={item.name} className="checkout-item-img" />
                      <div>
                        <div className="checkout-item-title">{item.name}</div>
                        <div className="checkout-item-meta">
                          {item.color} {item.size && item.size !== 'One Size' ? `• Size ${item.size}` : ''} • Qty {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="checkout-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted small">Subtotal</span>
                <span className="fw-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted small">Express Worldwide Courier</span>
                <span className="text-success small fw-medium">Complimentary</span>
              </div>
              <div className="d-flex justify-content-between py-3 fs-5 fw-semibold">
                <span>Total Due</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={processing || cart.length === 0}
                className="btn-confirm-order"
              >
                {processing ? 'Processing Commission...' : paymentMethod === 'razorpay' ? 'Authorize Online Payment' : 'Confirm Cash on Delivery'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
