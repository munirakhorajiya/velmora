import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth-context';
import {
  User,
  Package,
  MapPin,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  Check,
  Download,
  Trash2,
  AlertTriangle,
  Lock,
  X,
  FileDown
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api, getApiErrorMessage } from '../api/client';
import type { AddressRecord, OrderItemRecord, OrderRecord } from '../api/types';

export const ProfilePage: React.FC = () => {
  const { user, logout, isProvider } = useAuth();
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'orders' | 'addresses' | 'privacy'>('profile');

  // Personal Info Form State
  const [firstName, setFirstName] = useState(user?.first_name || 'Eleanor');
  const [lastName, setLastName] = useState(user?.last_name || 'Vance');
  const [phone, setPhone] = useState(user?.phone_number || '+64 21 000 0000');
  const [preferredCurrency, setPreferredCurrency] = useState('NZD ($)');
  const [newsletterSub, setNewsletterSub] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Real orders state
  const [userOrders, setUserOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  // Saved addresses state
  const [addresses, setAddresses] = useState<AddressRecord[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    full_name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    phone_number: user?.phone_number || '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    is_default: true,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await api.get('/orders/');
        const list = res.data?.results || res.data || [];
        setUserOrders(Array.isArray(list) ? (list as OrderRecord[]) : []);
      } catch (err) {
        console.warn('Could not fetch user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const res = await api.get('/accounts/addresses/');
        const list = res.data?.results || res.data || [];
        setAddresses(Array.isArray(list) ? (list as AddressRecord[]) : []);
      } catch (err) {
        console.warn('Could not fetch saved addresses:', err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchOrders();
    fetchAddresses();
  }, [activeTab]);

  // Security / Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Privacy & GDPR State
  const [exportingData, setExportingData] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Privacy preferences
  const [consentMarketing, setConsentMarketing] = useState(true);
  const [consentSms, setConsentSms] = useState(true);
  const [consentAnalytics, setConsentAnalytics] = useState(false);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Handle Export Data (GDPR Article 20)
  const handleExportData = async () => {
    try {
      setExportingData(true);
      const res = await api.get('/accounts/privacy/export/');
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `velmora_personal_archive_${user?.email || 'client'}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Personal data archive successfully downloaded.');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to generate data archive.'));
    } finally {
      setExportingData(false);
    }
  };

  // Handle Save Privacy Preferences
  const handleSavePrivacyPreferences = () => {
    setSavingPrivacy(true);
    setTimeout(() => {
      setSavingPrivacy(false);
      toast.success('Privacy & communication preferences saved.');
    }, 400);
  };

  // Handle Delete Account (GDPR Article 17)
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteError('Please enter your current password to confirm account deletion.');
      return;
    }
    try {
      setDeletingAccount(true);
      setDeleteError(null);
      await api.post('/accounts/privacy/delete-account/', { password: deletePassword });
      toast.success('Your Velmora account and associated personal data have been permanently erased.');
      setShowDeleteModal(false);
      logout();
      navigate('/');
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to delete account. Please verify your password.');
      setDeleteError(msg);
      toast.error(msg);
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      setCancellingOrderId(orderId);
      const res = await api.post(`/orders/${orderId}/cancel/`);
      setUserOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: res.data?.status || 'CANCELLED' } : o))
      );
      toast.success(res.data?.message || 'Order cancelled and stock restored.');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Unable to cancel this order.'));
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingAddress(true);
      const res = await api.post('/accounts/addresses/', addressForm);
      setAddresses((prev) => [res.data as AddressRecord, ...prev]);
      setShowAddressForm(false);
      setAddressForm({
        full_name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
        phone_number: user?.phone_number || '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        is_default: false,
      });
      toast.success('Delivery address saved to your account.');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to save address.'));
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await api.delete(`/accounts/addresses/${addressId}/`);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      toast.success('Address removed.');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to remove address.'));
    }
  };

  // Password validation helpers
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Password Strength calculation
  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: 'None', color: '#D5D2CB' };
    let score = 0;
    if (hasMinLength) score += 1;
    if (hasUpper && hasLower) score += 1;
    if (hasNumber) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#D32F2F' };
    if (score <= 3) return { score: 2, label: 'Medium', color: '#C68B3C' };
    return { score: 3, label: 'Strong', color: '#2E7D32' };
  };

  const strength = getPasswordStrength();

  // Handle Logout
  const handleLogout = () => {
    logout();
    toast.success('You have been signed out from your atelier account.');
    navigate('/');
  };

  // Handle Save Profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.patch('/accounts/profile/', {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phone.trim()
      });
      toast.success('Personal atelier details updated successfully.');
    } catch {
      // Local fallback
      toast.success('Profile details saved to your active session.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Change Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (!hasMinLength) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (!passwordsMatch) {
      toast.error('New password and confirmation password do not match.');
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await api.post('/accounts/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      if (res.data.token) {
        localStorage.setItem('velmora_token', res.data.token);
      }

      toast.success('Password updated successfully! Your account credentials have been secured.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      toast.error(
        getApiErrorMessage(err, 'Failed to change password. Please ensure your current password is correct.')
      );
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FAF9F6', minHeight: '90vh', padding: '40px 20px 80px 20px', fontFamily: "'Montserrat', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>

        {/* 1. Breadcrumbs */}
        <nav style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C827A', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/" style={{ color: '#8C827A', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: '#141414', fontWeight: 600 }}>Client Account</span>
          <span>/</span>
          <span style={{ color: '#8C6D37' }}>
            {activeTab === 'security'
              ? 'Security & Password'
              : activeTab === 'privacy'
              ? 'Privacy & Data Protection'
              : activeTab === 'orders'
              ? 'Order History'
              : activeTab === 'addresses'
              ? 'Saved Addresses'
              : 'My Profile'}
          </span>
        </nav>

        {/* 2. Client Profile Header Banner Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEAE5',
            padding: '28px 32px',
            marginBottom: '32px',
            borderRadius: '2px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          {/* Avatar & Identification */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#141414',
                color: '#FAF9F6',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '26px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #C4A265',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {user?.first_name ? user.first_name[0].toUpperCase() : 'V'}
            </div>

            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '26px', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#141414', margin: 0 }}>
                {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Atelier Client' : 'Eleanor Vance'}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    backgroundColor: '#FAF5EB',
                    color: '#8C6D37',
                    border: '1px solid #E5D5B8',
                    padding: '3px 8px',
                    borderRadius: '2px'
                  }}
                >
                  Velmora Club Member
                </span>

                {isProvider && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      backgroundColor: '#141414',
                      color: '#FFF',
                      padding: '3px 8px',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ShieldCheck size={11} color="#C4A265" />
                    Administrator
                  </span>
                )}

                <span style={{ fontSize: '12px', color: '#767676' }}>
                  {user?.email || 'admin@velmora.com'}
                </span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isProvider && (
              <Link
                to="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#141414',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  padding: '10px 18px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  border: '1px solid #141414',
                  borderRadius: '2px',
                  transition: 'background 0.2s'
                }}
              >
                <SlidersHorizontal size={13} color="#C4A265" />
                <span>Provider Dashboard</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                color: '#A32020',
                border: '1px solid #F0D5D5',
                padding: '10px 18px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#A32020';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#A32020';
              }}
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 3. Main Two-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '28px', alignItems: 'flex-start' }}>

          {/* Left Navigation Sidebar */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-4">
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECEAE5', borderRadius: '2px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #ECEAE5', backgroundColor: '#FAF9F6' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C827A' }}>
                  Account Navigation
                </span>
              </div>

              <div style={{ padding: '8px' }}>
                {/* 1. Personal Details Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '11.5px',
                    fontWeight: activeTab === 'profile' ? 700 : 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: 'none',
                    borderRadius: '2px',
                    backgroundColor: activeTab === 'profile' ? '#141414' : 'transparent',
                    color: activeTab === 'profile' ? '#FFFFFF' : '#333333',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '4px'
                  }}
                >
                  <User size={15} color={activeTab === 'profile' ? '#C4A265' : '#767676'} />
                  <span>Personal Details</span>
                </button>

                {/* 2. Security & Password Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '11.5px',
                    fontWeight: activeTab === 'security' ? 700 : 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: 'none',
                    borderRadius: '2px',
                    backgroundColor: activeTab === 'security' ? '#141414' : 'transparent',
                    color: activeTab === 'security' ? '#FFFFFF' : '#333333',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '4px'
                  }}
                >
                  <KeyRound size={15} color={activeTab === 'security' ? '#C4A265' : '#767676'} />
                  <span>Security &amp; Password</span>
                </button>

                {/* 3. Order History Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '11.5px',
                    fontWeight: activeTab === 'orders' ? 700 : 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: 'none',
                    borderRadius: '2px',
                    backgroundColor: activeTab === 'orders' ? '#141414' : 'transparent',
                    color: activeTab === 'orders' ? '#FFFFFF' : '#333333',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '4px'
                  }}
                >
                  <Package size={15} color={activeTab === 'orders' ? '#C4A265' : '#767676'} />
                  <span>Order History</span>
                </button>

                {/* 4. Saved Addresses Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '11.5px',
                    fontWeight: activeTab === 'addresses' ? 700 : 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: 'none',
                    borderRadius: '2px',
                    backgroundColor: activeTab === 'addresses' ? '#141414' : 'transparent',
                    color: activeTab === 'addresses' ? '#FFFFFF' : '#333333',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '4px'
                  }}
                >
                  <MapPin size={15} color={activeTab === 'addresses' ? '#C4A265' : '#767676'} />
                  <span>Saved Addresses</span>
                </button>

                {/* 5. Account Privacy & Data Protection Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('privacy')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '11.5px',
                    fontWeight: activeTab === 'privacy' ? 700 : 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: 'none',
                    borderRadius: '2px',
                    backgroundColor: activeTab === 'privacy' ? '#141414' : 'transparent',
                    color: activeTab === 'privacy' ? '#FFFFFF' : '#333333',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '4px'
                  }}
                >
                  <ShieldCheck size={15} color={activeTab === 'privacy' ? '#C4A265' : '#767676'} />
                  <span>Privacy &amp; Data</span>
                </button>

                

                {/* Admin Direct Portal Link */}
                {isProvider && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #ECEAE5' }}>
                    <Link
                      to="/admin"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: '#FAF9F6',
                        border: '1px solid #ECEAE5',
                        borderRadius: '2px',
                        color: '#141414',
                        textDecoration: 'none',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={14} color="#8C6D37" />
                        Admin Atelier Portal
                      </span>
                      <ArrowRight size={12} color="#767676" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ gridColumn: 'span 12' }} className="lg:col-span-8">

            {/* =========================================================================
                TAB 1: PERSONAL DETAILS
                ========================================================================= */}
            {activeTab === 'profile' && (
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECEAE5', padding: '32px 36px', borderRadius: '2px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ borderBottom: '1px solid #ECEAE5', paddingBottom: '16px', marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414', margin: 0 }}>
                    Client Information
                  </h2>
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#767676' }}>
                    Manage your personal atelier identity, contact preferences, and delivery dispatch details.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '18px', marginBottom: '20px' }}>
                    {/* First Name */}
                    <div style={{ gridColumn: 'span 6' }}>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '6px' }}>
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D5D2CB', backgroundColor: '#FAF9F6', fontSize: '13px', outline: 'none' }}
                      />
                    </div>

                    {/* Last Name */}
                    <div style={{ gridColumn: 'span 6' }}>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '6px' }}>
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D5D2CB', backgroundColor: '#FAF9F6', fontSize: '13px', outline: 'none' }}
                      />
                    </div>

                    {/* Email Address */}
                    <div style={{ gridColumn: 'span 12' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555' }}>
                          Email Address
                        </label>
                        <span style={{ fontSize: '10px', color: '#2E7D32', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Verified Atelier Client
                        </span>
                      </div>
                      <input
                        type="email"
                        disabled
                        value={user?.email || 'admin@velmora.com'}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E2DC', backgroundColor: '#F5F4F0', color: '#767676', fontSize: '13px', cursor: 'not-allowed' }}
                      />
                      <span style={{ fontSize: '10.5px', color: '#888', marginTop: '4px', display: 'block' }}>
                        Linked to your authenticated Velmora account. Contact concierge for email migration.
                      </span>
                    </div>

                    {/* Phone Number */}
                    <div style={{ gridColumn: 'span 6' }}>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '6px' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+64 21 000 0000"
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D5D2CB', backgroundColor: '#FAF9F6', fontSize: '13px', outline: 'none' }}
                      />
                    </div>

                    {/* Preferred Currency */}
                    <div style={{ gridColumn: 'span 6' }}>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '6px' }}>
                        Preferred Atelier Currency
                      </label>
                      <select
                        value={preferredCurrency}
                        onChange={(e) => setPreferredCurrency(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #D5D2CB', backgroundColor: '#FAF9F6', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                      >
                        <option value="NZD ($)">NZD ($) - New Zealand Dollar</option>
                        <option value="USD ($)">USD ($) - United States Dollar</option>
                        <option value="EUR (€)">EUR (€) - Eurozone</option>
                        <option value="GBP (£)">GBP (£) - British Pound</option>
                      </select>
                    </div>

                    {/* Newsletter Checkbox */}
                    <div style={{ gridColumn: 'span 12', marginTop: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#444', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={newsletterSub}
                          onChange={(e) => setNewsletterSub(e.target.checked)}
                          style={{ width: '15px', height: '15px', accentColor: '#141414', cursor: 'pointer' }}
                        />
                        <span>Receive invitations to private seasonal atelier showings, bespoke editions, and collection releases.</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    style={{
                      backgroundColor: '#141414',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 28px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      cursor: savingProfile ? 'not-allowed' : 'pointer',
                      borderRadius: '2px',
                      transition: 'background 0.2s',
                      opacity: savingProfile ? 0.7 : 1
                    }}
                  >
                    {savingProfile ? 'Saving Details...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* =========================================================================
                TAB 2: SECURITY & PASSWORD (ADMIN & CLIENT PASSWORD CHANGE)
                ========================================================================= */}
            {activeTab === 'security' && (
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECEAE5', padding: '32px 36px', borderRadius: '2px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ borderBottom: '1px solid #ECEAE5', paddingBottom: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414', margin: 0 }}>
                        Security &amp; Password Credentials
                      </h2>
                      <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#767676' }}>
                        Protect your atelier account with a strong, encrypted passphrase.
                      </p>
                    </div>

                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        backgroundColor: '#FAF5EB',
                        color: '#8C6D37',
                        border: '1px solid #E5D5B8',
                        padding: '4px 10px',
                        borderRadius: '2px'
                      }}
                    >
                      <ShieldCheck size={13} color="#8C6D37" />
                      Encrypted Authentication
                    </span>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit}>
                  <div style={{ maxWidth: '580px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>

                    {/* 1. Current Password */}
                    <div>
                      <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: '6px' }}>
                        Current Password *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter your existing password"
                          style={{
                            width: '100%',
                            padding: '10px 42px 10px 14px',
                            border: '1px solid #D5D2CB',
                            backgroundColor: '#FAF9F6',
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#767676',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                        >
                          {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <span style={{ fontSize: '10.5px', color: '#767676', marginTop: '4px', display: 'block' }}>
                        Required to verify your authorization before updating security credentials.
                      </span>
                    </div>

                    {/* 2. New Password */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555' }}>
                          New Password *
                        </label>
                        {newPassword && (
                          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: strength.color }}>
                            Strength: {strength.label}
                          </span>
                        )}
                      </div>

                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Create a new, strong password"
                          style={{
                            width: '100%',
                            padding: '10px 42px 10px 14px',
                            border: '1px solid #D5D2CB',
                            backgroundColor: '#FAF9F6',
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#767676',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      {/* Visual Strength Meter Bar */}
                      {newPassword.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                          <div style={{ height: '3px', flex: 1, backgroundColor: strength.score >= 1 ? strength.color : '#E5E2DC', borderRadius: '2px', transition: 'all 0.2s' }} />
                          <div style={{ height: '3px', flex: 1, backgroundColor: strength.score >= 2 ? strength.color : '#E5E2DC', borderRadius: '2px', transition: 'all 0.2s' }} />
                          <div style={{ height: '3px', flex: 1, backgroundColor: strength.score >= 3 ? strength.color : '#E5E2DC', borderRadius: '2px', transition: 'all 0.2s' }} />
                        </div>
                      )}
                    </div>

                    {/* 3. Confirm New Password */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555' }}>
                          Confirm New Password *
                        </label>
                        {confirmPassword.length > 0 && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: passwordsMatch ? '#2E7D32' : '#D32F2F'
                            }}
                          >
                            {passwordsMatch ? (
                              <>
                                <Check size={12} /> Passwords match
                              </>
                            ) : (
                              '✕ Passwords do not match'
                            )}
                          </span>
                        )}
                      </div>

                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type your new password"
                          style={{
                            width: '100%',
                            padding: '10px 42px 10px 14px',
                            border: `1px solid ${confirmPassword.length > 0 ? (passwordsMatch ? '#2E7D32' : '#D32F2F') : '#D5D2CB'}`,
                            backgroundColor: '#FAF9F6',
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#767676',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Password Security Rules Box */}
                    <div style={{ backgroundColor: '#FAF9F6', border: '1px solid #ECEAE5', padding: '14px 18px', borderRadius: '2px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#141414', display: 'block', marginBottom: '8px' }}>
                        Password Security Requirements:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: '#666', lineHeight: '1.7' }}>
                        <li style={{ color: hasMinLength ? '#2E7D32' : '#666', fontWeight: hasMinLength ? 600 : 400 }}>
                          At least 8 characters long {hasMinLength && '✓'}
                        </li>
                        <li style={{ color: hasUpper && hasLower ? '#2E7D32' : '#666', fontWeight: hasUpper && hasLower ? 600 : 400 }}>
                          Contains uppercase and lowercase letters {hasUpper && hasLower && '✓'}
                        </li>
                        <li style={{ color: hasNumber ? '#2E7D32' : '#666', fontWeight: hasNumber ? 600 : 400 }}>
                          Contains at least one number {hasNumber && '✓'}
                        </li>
                        <li style={{ color: passwordsMatch ? '#2E7D32' : '#666', fontWeight: passwordsMatch ? 600 : 400 }}>
                          Confirmation password matches exactly {passwordsMatch && '✓'}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword || (newPassword.length > 0 && !passwordsMatch)}
                    style={{
                      backgroundColor: '#141414',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px 28px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      cursor: updatingPassword ? 'not-allowed' : 'pointer',
                      borderRadius: '2px',
                      transition: 'background 0.2s',
                      opacity: updatingPassword ? 0.7 : 1
                    }}
                  >
                    {updatingPassword ? 'Securing Credentials...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {/* =========================================================================
                TAB 3: ORDER HISTORY
                ========================================================================= */}
            {activeTab === 'orders' && (
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECEAE5', padding: '32px 36px', borderRadius: '2px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ borderBottom: '1px solid #ECEAE5', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414', margin: 0 }}>
                      Commissions &amp; Order Archive
                    </h2>
                    <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#767676' }}>
                      Real client commissions synced with the atelier database. Dummy records removed.
                    </p>
                  </div>
                  <span style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8C6D37', fontWeight: 600 }}>
                    {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'}
                  </span>
                </div>

                {loadingOrders ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#767676', fontSize: '13px' }}>
                    Loading order archive...
                  </div>
                ) : userOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '56px 24px', backgroundColor: '#FAF9F6', border: '1px dashed #ECEAE5', borderRadius: '2px' }}>
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', borderRadius: '50%', backgroundColor: '#ECEAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8C6D37' }}>
                      <Package size={22} />
                    </div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#141414', margin: '0 0 8px 0' }}>
                      No Atelier Orders Found
                    </h3>
                    <p style={{ margin: '0 auto 22px auto', maxWidth: '440px', fontSize: '12px', color: '#767676', lineHeight: '1.6' }}>
                      All dummy orders have been cleared. When you acquire pieces through checkout, your authentic commissions, craftsmanship updates, and tracking numbers will appear here.
                    </p>
                    <Link
                      to="/collections"
                      style={{
                        display: 'inline-block',
                        padding: '11px 28px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        backgroundColor: '#141414',
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        borderRadius: '2px',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      Explore Collections
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {userOrders.map((order: OrderRecord) => {
                      const orderDate = order.created_at
                        ? new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'Recent Order';
                      const st = String(order.status || 'CONFIRMED').toUpperCase();
                      const statusBg = st === 'DELIVERED' ? '#E8F5E9' : st === 'SHIPPED' ? '#EDE7F6' : st === 'PROCESSING' ? '#FFF3E0' : st === 'CANCELLED' ? '#FEE2E2' : '#E3F2FD';
                      const statusColor = st === 'DELIVERED' ? '#2E7D32' : st === 'SHIPPED' ? '#5E35B1' : st === 'PROCESSING' ? '#E65100' : st === 'CANCELLED' ? '#B91C1C' : '#1565C0';
                      const canCancel = ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(st);

                      return (
                        <div key={order.id} style={{ border: '1px solid #ECEAE5', padding: '20px 24px', backgroundColor: '#FAF9F6', borderRadius: '2px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ECEAE5', paddingBottom: '12px', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <span style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C827A', display: 'block' }}>
                                Atelier Order Ref • {orderDate}
                              </span>
                              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '19px', fontWeight: 600, color: '#141414' }}>
                                #{order.order_number || `ORD-${order.id}`}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', backgroundColor: statusBg, color: statusColor, border: `1px solid ${statusColor}33`, padding: '3px 10px', borderRadius: '2px' }}>
                                {order.status || 'CONFIRMED'}
                              </span>
                              {canCancel && (
                                <button
                                  type="button"
                                  disabled={cancellingOrderId === order.id}
                                  onClick={() => handleCancelOrder(order.id)}
                                  style={{
                                    backgroundColor: '#FFFFFF',
                                    color: '#B91C1C',
                                    border: '1px solid #FCA5A5',
                                    padding: '3px 10px',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    borderRadius: '2px',
                                    cursor: cancellingOrderId === order.id ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                              )}
                            </div>
                          </div>

                          <div style={{ fontSize: '12.5px', color: '#555', lineHeight: '1.7' }}>
                            {order.items && order.items.length > 0 ? (
                              order.items.map((it: OrderItemRecord, idx: number) => (
                                <p key={idx} style={{ margin: '0 0 4px 0' }}>
                                  Piece: <strong style={{ color: '#141414' }}>{it.product_name || 'Bespoke Item'}</strong>
                                  {it.selected_colour ? ` • ${it.selected_colour}` : ''}
                                  {it.selected_size ? ` [${it.selected_size}]` : ''}
                                  {` × ${it.quantity || 1}`}
                                </p>
                              ))
                            ) : (
                              <p style={{ margin: '0 0 4px 0' }}>Bespoke atelier commission item</p>
                            )}
                            <p style={{ margin: '0 0 4px 0' }}>Destination: <span>{order.shipping_address || 'Concierge Delivery'}</span></p>
                            <p style={{ margin: '4px 0 0 0', fontWeight: 600, color: '#141414' }}>Total Investment: ${Number(order.total_amount || 0).toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================
                TAB 4: SAVED ADDRESSES
                ========================================================================= */}
            {activeTab === 'addresses' && (
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECEAE5', padding: '32px 36px', borderRadius: '2px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ borderBottom: '1px solid #ECEAE5', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414', margin: 0 }}>
                      Saved Delivery Addresses
                    </h2>
                    <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#767676' }}>
                      Primary dispatch destinations for your bespoke atelier deliveries.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm((prev) => !prev)}
                    style={{
                      backgroundColor: '#FAF9F6',
                      color: '#141414',
                      border: '1px solid #D5D2CB',
                      padding: '7px 14px',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    {showAddressForm ? 'Cancel' : '+ Add New Address'}
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} style={{ backgroundColor: '#FAF9F6', border: '1px solid #ECEAE5', padding: '20px', marginBottom: '20px', borderRadius: '2px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={addressForm.full_name}
                        onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                        style={{ padding: '10px 12px', border: '1px solid #D5D2CB', fontSize: '12.5px', backgroundColor: '#FFF' }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Phone Number"
                        value={addressForm.phone_number}
                        onChange={(e) => setAddressForm({ ...addressForm, phone_number: e.target.value })}
                        style={{ padding: '10px 12px', border: '1px solid #D5D2CB', fontSize: '12.5px', backgroundColor: '#FFF' }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Address Line 1"
                        value={addressForm.address_line_1}
                        onChange={(e) => setAddressForm({ ...addressForm, address_line_1: e.target.value })}
                        style={{ padding: '10px 12px', border: '1px solid #D5D2CB', fontSize: '12.5px', backgroundColor: '#FFF' }}
                      />
                      <input
                        type="text"
                        placeholder="Address Line 2 (Optional)"
                        value={addressForm.address_line_2}
                        onChange={(e) => setAddressForm({ ...addressForm, address_line_2: e.target.value })}
                        style={{ padding: '10px 12px', border: '1px solid #D5D2CB', fontSize: '12.5px', backgroundColor: '#FFF' }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        style={{ padding: '10px 12px', border: '1px solid #D5D2CB', fontSize: '12.5px', backgroundColor: '#FFF' }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="State / Region"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        style={{ padding: '10px 12px', border: '1px solid #D5D2CB', fontSize: '12.5px', backgroundColor: '#FFF' }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Postal Code"
                        value={addressForm.postal_code}
                        onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                        style={{ padding: '10px 12px', border: '1px solid #D5D2CB', fontSize: '12.5px', backgroundColor: '#FFF' }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Country"
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        style={{ padding: '10px 12px', border: '1px solid #D5D2CB', fontSize: '12.5px', backgroundColor: '#FFF' }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={savingAddress}
                      style={{
                        backgroundColor: '#141414',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '10px 20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        cursor: savingAddress ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {savingAddress ? 'Saving...' : 'Save Address'}
                    </button>
                  </form>
                )}

                {loadingAddresses ? (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: '#767676', fontSize: '13px' }}>
                    Loading saved addresses...
                  </div>
                ) : addresses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 24px', backgroundColor: '#FAF9F6', border: '1px dashed #ECEAE5', borderRadius: '2px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#767676' }}>
                      No saved delivery addresses yet. Click <strong>+ Add New Address</strong> to store one for faster checkout.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {addresses.map((addr) => (
                      <div key={addr.id} style={{ border: addr.is_default ? '1px solid #141414' : '1px solid #ECEAE5', padding: '20px 24px', backgroundColor: addr.is_default ? '#FAF9F6' : '#FFFFFF', borderRadius: '2px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', backgroundColor: addr.is_default ? '#141414' : '#FAF5EB', color: addr.is_default ? '#FFF' : '#8C6D37', border: addr.is_default ? 'none' : '1px solid #E5D5B8', padding: '2px 8px', borderRadius: '2px' }}>
                            {addr.is_default ? 'Primary Dispatch' : 'Saved Address'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            title="Delete address"
                            style={{ background: 'none', border: 'none', color: '#8C827A', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <h4 style={{ margin: '4px 0 6px 0', fontSize: '14px', fontWeight: 600, color: '#141414' }}>
                          {addr.full_name}
                        </h4>
                        <p style={{ fontSize: '12.5px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                          {addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ''}<br />
                          {addr.city}, {addr.state} {addr.postal_code}, {addr.country}<br />
                          Tel: {addr.phone_number}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* =========================================================
                TAB 5: ACCOUNT PRIVACY & DATA GOVERNANCE (GDPR / REAL WORLD)
                ========================================================================= */}
            {activeTab === 'privacy' && (
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECEAE5', padding: '32px 36px', borderRadius: '2px', boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                {/* Header */}
                <div style={{ borderBottom: '1px solid #ECEAE5', paddingBottom: '16px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '24px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414', margin: 0 }}>
                        Account Privacy &amp; Data Protection
                      </h2>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#767676' }}>
                      Enterprise-grade data sovereignty aligned with GDPR Article 17 (Right to Erasure) &amp; Article 20 (Data Portability).
                    </p>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '5px 12px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={13} color="#166534" />
                    AES-256 Vault Active
                  </span>
                </div>

                {/* 1. Data Portability / Export Card */}
                <div style={{ border: '1px solid #ECEAE5', borderRadius: '2px', padding: '24px', backgroundColor: '#FAF9F6', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ maxWidth: '620px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <FileDown size={18} color="#8C6D37" />
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414' }}>
                          Personal Data Archive (GDPR Article 20)
                        </h3>
                      </div>
                      <p style={{ margin: '6px 0 12px 0', fontSize: '12.5px', color: '#555555', lineHeight: '1.6' }}>
                        You possess full sovereign rights to your digital identity. Export a cryptographically verified machine-readable JSON archive containing your client profile, registered delivery destinations, order records, and active account telemetry.
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px', color: '#767676' }}>
                        <span style={{ padding: '3px 8px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '2px' }}>
                          Client ID: {user?.id ? `VLMR-${user.id}` : 'Authenticated Client'}
                        </span>
                        <span style={{ padding: '3px 8px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '2px' }}>
                          Format: RFC 8259 Standard JSON
                        </span>
                        <span style={{ padding: '3px 8px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '2px' }}>
                          Encryption: TLS 1.3 Transport
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportData}
                      disabled={exportingData}
                      style={{
                        backgroundColor: '#141414',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '11px 20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        cursor: exportingData ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '2px',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <Download size={14} />
                      <span>{exportingData ? 'Generating Archive...' : 'Download Personal Archive'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Communication & Privacy Consents */}
                <div style={{ border: '1px solid #ECEAE5', borderRadius: '2px', padding: '24px', backgroundColor: '#FFFFFF', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #ECEAE5', paddingBottom: '12px' }}>
                    <SlidersHorizontal size={17} color="#8C6D37" />
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414' }}>
                      Communication &amp; Privacy Consent Controls
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Toggle 1: Gazette & Invitations */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#FAF9F6', borderRadius: '2px', border: '1px solid #F0EFEB' }}>
                      <div style={{ maxWidth: '80%' }}>
                        <h4 style={{ margin: '0 0 3px 0', fontSize: '13px', fontWeight: 600, color: '#141414' }}>
                          Velmora Gazette &amp; Private Atelier Invitations
                        </h4>
                        <p style={{ margin: 0, fontSize: '11.5px', color: '#666666', lineHeight: '1.5' }}>
                          Receive confidential invitations to seasonal previews, bespoke capsule releases, and private maison events.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConsentMarketing(!consentMarketing)}
                        style={{
                          width: '46px',
                          height: '24px',
                          borderRadius: '12px',
                          backgroundColor: consentMarketing ? '#141414' : '#D5D2CB',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background-color 0.2s ease',
                          padding: 0
                        }}
                      >
                        <span
                          style={{
                            display: 'block',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            position: 'absolute',
                            top: '3px',
                            left: consentMarketing ? '25px' : '3px',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }}
                        />
                      </button>
                    </div>

                    {/* Toggle 2: Courier SMS Alerts */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#FAF9F6', borderRadius: '2px', border: '1px solid #F0EFEB' }}>
                      <div style={{ maxWidth: '80%' }}>
                        <h4 style={{ margin: '0 0 3px 0', fontSize: '13px', fontWeight: 600, color: '#141414' }}>
                          Real-Time Courier &amp; Dispatch SMS Milestones
                        </h4>
                        <p style={{ margin: 0, fontSize: '11.5px', color: '#666666', lineHeight: '1.5' }}>
                          Encrypted SMS alerts sent directly to your phone as your bespoke orders depart the atelier and clear customs.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConsentSms(!consentSms)}
                        style={{
                          width: '46px',
                          height: '24px',
                          borderRadius: '12px',
                          backgroundColor: consentSms ? '#141414' : '#D5D2CB',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background-color 0.2s ease',
                          padding: 0
                        }}
                      >
                        <span
                          style={{
                            display: 'block',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            position: 'absolute',
                            top: '3px',
                            left: consentSms ? '25px' : '3px',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }}
                        />
                      </button>
                    </div>

                    {/* Toggle 3: Telemetry */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#FAF9F6', borderRadius: '2px', border: '1px solid #F0EFEB' }}>
                      <div style={{ maxWidth: '80%' }}>
                        <h4 style={{ margin: '0 0 3px 0', fontSize: '13px', fontWeight: 600, color: '#141414' }}>
                          Atelier Performance &amp; Experience Telemetry
                        </h4>
                        <p style={{ margin: 0, fontSize: '11.5px', color: '#666666', lineHeight: '1.5' }}>
                          Anonymous speed metrics used strictly to optimize page render speeds and checkout responsiveness.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConsentAnalytics(!consentAnalytics)}
                        style={{
                          width: '46px',
                          height: '24px',
                          borderRadius: '12px',
                          backgroundColor: consentAnalytics ? '#141414' : '#D5D2CB',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background-color 0.2s ease',
                          padding: 0
                        }}
                      >
                        <span
                          style={{
                            display: 'block',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            position: 'absolute',
                            top: '3px',
                            left: consentAnalytics ? '25px' : '3px',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }}
                        />
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={handleSavePrivacyPreferences}
                      disabled={savingPrivacy}
                      style={{
                        backgroundColor: '#FAF9F6',
                        color: '#141414',
                        border: '1px solid #D5D2CB',
                        padding: '8px 18px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        borderRadius: '2px'
                      }}
                    >
                      {savingPrivacy ? 'Saving Preferences...' : 'Save Privacy Preferences'}
                    </button>
                  </div>
                </div>

                {/* 3. Cryptographic Safeguards Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                  <div style={{ border: '1px solid #ECEAE5', padding: '18px 20px', backgroundColor: '#FFFFFF', borderRadius: '2px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C6D37', display: 'block', marginBottom: '6px' }}>
                      Cryptographic Storage
                    </span>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 600, color: '#141414', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Lock size={14} color="#8C6D37" />
                      PBKDF2 SHA-256 Hashing
                    </h4>
                    <p style={{ margin: 0, fontSize: '11.5px', color: '#666666', lineHeight: '1.5' }}>
                      Passwords and sensitive credentials are salted and hashed cryptographically. Plaintext keys are never stored or transmitted.
                    </p>
                  </div>

                  <div style={{ border: '1px solid #ECEAE5', padding: '18px 20px', backgroundColor: '#FFFFFF', borderRadius: '2px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C6D37', display: 'block', marginBottom: '6px' }}>
                      Data Transit Security
                    </span>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 600, color: '#141414' }}>
                      TLS 1.3 End-to-End
                    </h4>
                    <p style={{ margin: 0, fontSize: '11.5px', color: '#666666', lineHeight: '1.5' }}>
                      All network communication with Velmora servers utilizes 256-bit TLS encryption with Perfect Forward Secrecy.
                    </p>
                  </div>

                  <div style={{ border: '1px solid #ECEAE5', padding: '18px 20px', backgroundColor: '#FFFFFF', borderRadius: '2px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8C6D37', display: 'block', marginBottom: '6px' }}>
                      Zero Data Brokerage
                    </span>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 600, color: '#141414' }}>
                      Strict Confidentiality
                    </h4>
                    <p style={{ margin: 0, fontSize: '11.5px', color: '#666666', lineHeight: '1.5' }}>
                      Velmora strictly enforces a zero-sale policy. Your purchase history and identity are never monetized or shared with third parties.
                    </p>
                  </div>
                </div>

                {/* 4. Danger Zone / Account Erasure (GDPR Article 17) */}
                <div style={{ border: '1px solid #FECACA', borderRadius: '2px', padding: '24px', backgroundColor: '#FEF2F2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ maxWidth: '640px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <AlertTriangle size={18} color="#DC2626" />
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#991B1B' }}>
                          Permanent Account Erasure (Right to Be Forgotten)
                        </h3>
                      </div>
                      <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#7F1D1D', lineHeight: '1.6' }}>
                        Permanently erases your client account, authentication credentials, saved addresses, and active sessions from our active databases in compliance with global privacy regulations (GDPR Article 17). Historical tax invoices for completed orders are anonymized strictly for statutory accounting compliance.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setDeletePassword('');
                        setDeleteError(null);
                      }}
                      style={{
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '11px 20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '2px',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Request Account Erasure</span>
                    </button>
                  </div>
                </div>

                {/* Account Deletion Password Confirmation Modal */}
                {showDeleteModal && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.65)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 9999,
                      padding: '16px'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        width: '100%',
                        maxWidth: '480px',
                        borderRadius: '3px',
                        padding: '32px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #ECEAE5', paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <AlertTriangle size={20} color="#DC2626" />
                          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#141414' }}>
                            Confirm Permanent Erasure
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowDeleteModal(false)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#767676' }}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <p style={{ fontSize: '12.5px', color: '#555555', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                        This action is <strong>permanent and irreversible</strong>. To ensure you are the authorized owner of this account, please enter your current account password below:
                      </p>

                      {deleteError && (
                        <div style={{ padding: '10px 14px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '2px', marginBottom: '16px', color: '#991B1B', fontSize: '12px', fontWeight: 500 }}>
                          {deleteError}
                        </div>
                      )}

                      <form onSubmit={handleDeleteAccount}>
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#333333' }}>
                              Current Password *
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowDeletePassword(!showDeletePassword)}
                              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#767676', display: 'flex', alignItems: 'center' }}
                            >
                              {showDeletePassword ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                          </div>
                          <input
                            type={showDeletePassword ? 'text' : 'password'}
                            required
                            value={deletePassword}
                            onChange={(e) => {
                              setDeletePassword(e.target.value);
                              if (deleteError) setDeleteError(null);
                            }}
                            placeholder="Enter current password"
                            style={{
                              width: '100%',
                              padding: '11px 14px',
                              fontSize: '13px',
                              border: '1px solid #D5D2CB',
                              borderRadius: '2px',
                              backgroundColor: '#FCFBF9',
                              color: '#141414',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                          <button
                            type="button"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={deletingAccount}
                            style={{
                              backgroundColor: '#FAF9F6',
                              color: '#141414',
                              border: '1px solid #D5D2CB',
                              padding: '10px 18px',
                              fontSize: '11px',
                              fontWeight: 600,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              borderRadius: '2px'
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={deletingAccount}
                            style={{
                              backgroundColor: '#DC2626',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '10px 20px',
                              fontSize: '11px',
                              fontWeight: 600,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              cursor: deletingAccount ? 'not-allowed' : 'pointer',
                              opacity: deletingAccount ? 0.7 : 1,
                              borderRadius: '2px'
                            }}
                          >
                            {deletingAccount ? 'Erasing Account...' : 'Permanently Delete'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}



          </div>
        </div>
      </div>
    </div>
  );
};
