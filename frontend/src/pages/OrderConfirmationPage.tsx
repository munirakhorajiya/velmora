import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import type { OrderRecord } from '../api/types';

interface ConfirmationLocationState {
  order?: OrderRecord;
  paymentMethod?: 'razorpay' | 'cod';
}

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = (location.state as ConfirmationLocationState | null) || null;
  const [fallbackOrderNum] = useState(() => `VEL-${Math.floor(100000 + Math.random() * 900000)}`);

  const order = state?.order;
  const orderNumber = id || order?.order_number || fallbackOrderNum;
  const formattedDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const paymentStatusLabel =
    order?.status === 'CONFIRMED'
      ? state?.paymentMethod === 'cod'
        ? 'Confirmed (COD)'
        : 'Confirmed'
      : order?.status || 'Confirmed';

  return (
    <div className="order-confirm-container">
      <div className="order-confirm-card">
        <div className="order-confirm-header">
          <span className="order-confirm-badge">Order Confirmed</span>
          <h1 className="order-confirm-title">Thank You For Your Order</h1>
          <p className="order-confirm-subtitle">
            Your piece has entered our workshop schedule. A confirmation email and dispatch tracking details will be sent shortly.
          </p>
        </div>

        <div className="order-meta-box">
          <div>
            <span className="order-meta-label">Order Number</span>
            <span className="order-meta-val">#{orderNumber}</span>
          </div>
          <div>
            <span className="order-meta-label">Date</span>
            <span className="order-meta-val">{formattedDate}</span>
          </div>
          <div>
            <span className="order-meta-label">Shipping Method</span>
            <span className="order-meta-val">Complimentary Express</span>
          </div>
          <div>
            <span className="order-meta-label">Payment Status</span>
            <span className="order-meta-val" style={{ color: '#2E7D32', fontWeight: 600 }}>{paymentStatusLabel}</span>
          </div>
          {order?.total_amount !== undefined && (
            <div>
              <span className="order-meta-label">Total</span>
              <span className="order-meta-val">${Number(order.total_amount).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="order-actions-row">
          <Link to="/collections/" className="btn-order-action btn-order-primary">
            CONTINUE SHOPPING
          </Link>
          <Link to="/profile" className="btn-order-action btn-order-secondary">
            VIEW ORDER HISTORY
          </Link>
        </div>
      </div>
    </div>
  );
};
