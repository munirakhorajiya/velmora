import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactPage } from './pages/ContactPage';
import { ShippingPage } from './pages/ShippingPage';
import { StoresPage } from './pages/StoresPage';
import { TransparencyPage } from './pages/TransparencyPage';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { JournalPage } from './pages/JournalPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProviderDashboardPage } from './pages/ProviderDashboardPage';
import { InfoPage } from './pages/InfoPage';
import { Toaster } from './components/ui/sonner';
import { RequireAuth, RequireAdmin, RequireProvider } from './components/AuthGuard';

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen d-flex flex-column bg-white text-dark">
            <Navbar />
            <CartDrawer />
            <main className="flex-grow-1">
              <Routes>
                {/* Core Public Storefront Routes */}
                <Route path="/" element={<HomePage />} />

                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collections/shop-all-bags" element={<CollectionsPage />} />
                <Route path="/collections/shop-all" element={<CollectionsPage />} />
                <Route path="/collections/:subdept" element={<CollectionsPage />} />

                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Authenticated Client Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <RequireAuth>
                      <CartPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <RequireAuth>
                      <CheckoutPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/order-confirmation/:id"
                  element={
                    <RequireAuth>
                      <OrderConfirmationPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <ProfilePage />
                    </RequireAuth>
                  }
                />

                {/* Administrator Protected Routes (Exclusive to Store Admin) */}
                <Route
                  path="/admin"
                  element={
                    <RequireAdmin>
                      <ProviderDashboardPage />
                    </RequireAdmin>
                  }
                />
                <Route
                  path="/provider/dashboard"
                  element={
                    <RequireProvider>
                      <ProviderDashboardPage />
                    </RequireProvider>
                  }
                />
                <Route
                  path="/provider-dashboard"
                  element={
                    <RequireProvider>
                      <ProviderDashboardPage />
                    </RequireProvider>
                  }
                />

                {/* Editorial & Client Care Pages (Public) */}
                <Route path="/pages/contact" element={<ContactPage />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route path="/pages/shipping" element={<ShippingPage />} />
                <Route path="/pages/returns" element={<ShippingPage />} />
                <Route path="/shipping" element={<ShippingPage />} />

                <Route path="/pages/stores" element={<StoresPage />} />
                <Route path="/stores" element={<StoresPage />} />

                <Route path="/pages/transparency" element={<TransparencyPage />} />
                <Route path="/transparency" element={<TransparencyPage />} />
                <Route path="/atelier" element={<TransparencyPage />} />

                <Route path="/pages/loyalty" element={<LoyaltyPage />} />
                <Route path="/loyalty" element={<LoyaltyPage />} />

                <Route path="/pages/journal" element={<JournalPage />} />
                <Route path="/journal" element={<JournalPage />} />

                <Route path="/pages/faqs" element={<InfoPage slug="faqs" />} />
                <Route path="/pages/product-care" element={<InfoPage slug="product-care" />} />
                <Route path="/pages/story" element={<InfoPage slug="story" />} />
                <Route path="/pages/stockists" element={<InfoPage slug="stockists" />} />
                <Route path="/pages/careers" element={<InfoPage slug="careers" />} />
                <Route path="/pages/sitemap" element={<InfoPage slug="sitemap" />} />
                <Route path="/pages/terms" element={<InfoPage slug="terms" />} />
                <Route path="/pages/loyalty-terms" element={<InfoPage slug="loyalty-terms" />} />
                <Route path="/pages/privacy" element={<InfoPage slug="privacy" />} />
                <Route path="/pages/legal-notice" element={<InfoPage slug="legal-notice" />} />
                <Route path="/pages/accessibility" element={<InfoPage slug="accessibility" />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" richColors />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
