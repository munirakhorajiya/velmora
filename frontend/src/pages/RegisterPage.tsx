import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { toast } from 'sonner';
import { ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2, X } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isEmailError = errorMessage ? (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('already exists')) : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (password.length < 8) {
      const msg = 'Password must be at least 8 characters long.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = 'Passwords do not match.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    const res = await register({
      email: email.trim().toLowerCase(),
      password,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone_number: phone.trim(),
    });
    setLoading(false);

    if (res.success) {
      toast.success('Your Velmora client account has been created.');
      navigate('/profile');
    } else {
      const err = res.error || 'Failed to create client account.';
      setErrorMessage(err);
      toast.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: '82vh',
        backgroundColor: '#FAF9F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #ECEAE5',
          borderRadius: '3px',
          padding: '40px 42px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#8C6D37',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Velmora Maison
          </span>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '32px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#141414',
              margin: '0 0 10px 0',
              fontWeight: 600,
            }}
          >
            Create Client Account
          </h1>
          <p
            style={{
              fontSize: '12.5px',
              color: '#767676',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            Join the Velmora atelier as a valued private client to commission bespoke pieces, and enjoy complimentary express delivery.
          </p>
        </div>

        {/* Real-time Inline Error Alert */}
        {errorMessage && (
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '2px',
              marginBottom: '22px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 600, color: '#991B1B', lineHeight: '1.5' }}>
                {errorMessage}
              </p>
              {isEmailError && (
                <div style={{ marginTop: '8px' }}>
                  <Link
                    to="/login"
                    style={{
                      fontSize: '11.5px',
                      color: '#991B1B',
                      fontWeight: 700,
                      textDecoration: 'underline',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Sign in to your existing account &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* First Name & Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label
                htmlFor="regFirstName"
                style={{
                  display: 'block',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#333333',
                  marginBottom: '6px',
                }}
              >
                First Name *
              </label>
              <input
                type="text"
                id="regFirstName"
                name="first_name"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '13px',
                  border: '1px solid #D5D2CB',
                  borderRadius: '2px',
                  backgroundColor: '#FCFBF9',
                  color: '#141414',
                  fontFamily: "'Montserrat', sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="regLastName"
                style={{
                  display: 'block',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#333333',
                  marginBottom: '6px',
                }}
              >
                Last Name *
              </label>
              <input
                type="text"
                id="regLastName"
                name="last_name"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '13px',
                  border: '1px solid #D5D2CB',
                  borderRadius: '2px',
                  backgroundColor: '#FCFBF9',
                  color: '#141414',
                  fontFamily: "'Montserrat', sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Address */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label
                htmlFor="regEmail"
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isEmailError ? '#DC2626' : '#333333',
                }}
              >
                Email Address *
              </label>
              <span style={{ fontSize: '10px', color: '#888888', letterSpacing: '0.04em' }}>
                Unique Atelier ID
              </span>
            </div>
            <input
              type="email"
              id="regEmail"
              name="email"
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                fontSize: '13px',
                border: `1px solid ${isEmailError ? '#DC2626' : '#D5D2CB'}`,
                borderRadius: '2px',
                backgroundColor: isEmailError ? '#FFFDFD' : '#FCFBF9',
                color: '#141414',
                fontFamily: "'Montserrat', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
              placeholder="email@address.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
            />
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: '18px' }}>
            <label
              htmlFor="regPhone"
              style={{
                display: 'block',
                fontSize: '10.5px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#333333',
                marginBottom: '6px',
              }}
            >
              Phone Number
            </label>
            <input
              type="text"
              id="regPhone"
              name="phone"
              style={{
                width: '100%',
                padding: '11px 14px',
                fontSize: '13px',
                border: '1px solid #D5D2CB',
                borderRadius: '2px',
                backgroundColor: '#FCFBF9',
                color: '#141414',
                fontFamily: "'Montserrat', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
              }}
              placeholder="+1 555 0192"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Password & Confirm Password */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '8px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  htmlFor="regPassword"
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#333333',
                  }}
                >
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#767676',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="regPassword"
                name="password"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '13px',
                  border: '1px solid #D5D2CB',
                  borderRadius: '2px',
                  backgroundColor: '#FCFBF9',
                  color: '#141414',
                  fontFamily: "'Montserrat', sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="At least 8 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="regConfirmPassword"
                style={{
                  display: 'block',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#333333',
                  marginBottom: '6px',
                }}
              >
                Confirm Password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="regConfirmPassword"
                name="confirm_password"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '13px',
                  border: `1px solid ${confirmPassword.length > 0 ? (passwordsMatch ? '#2E7D32' : '#D32F2F') : '#D5D2CB'}`,
                  borderRadius: '2px',
                  backgroundColor: '#FCFBF9',
                  color: '#141414',
                  fontFamily: "'Montserrat', sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Password Match / Helper */}
          {confirmPassword.length > 0 && (
            <div
              style={{
                marginBottom: '18px',
                fontSize: '11.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: passwordsMatch ? '#2E7D32' : '#D32F2F',
                fontWeight: 500,
              }}
            >
              {passwordsMatch ? (
                <>
                  <CheckCircle2 size={13} color="#2E7D32" />
                  <span>Passwords match</span>
                </>
              ) : (
                <>
                  <X size={13} color="#D32F2F" />
                  <span>Passwords do not match</span>
                </>
              )}
            </div>
          )}
          {confirmPassword.length === 0 && <div style={{ marginBottom: '22px' }} />}

          {/* Privacy & Member note */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#FAF9F6',
              border: '1px solid #ECEAE5',
              borderRadius: '2px',
              marginBottom: '22px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <ShieldCheck size={18} color="#8C6D37" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '11.5px', color: '#555555', lineHeight: '1.5' }}>
              By registering, you become an official <strong>Velmora Club Member</strong> with complimentary concierge support and atelier order archiving.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '11.5px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              backgroundColor: '#141414',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.2s ease',
            }}
          >
            {loading ? 'CREATING CLIENT ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Footer Links */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #ECEAE5',
            textAlign: 'center',
            fontSize: '12px',
            color: '#767676',
          }}
        >
          <span>Already have an account? </span>
          <Link
            to="/login"
            style={{
              color: '#141414',
              fontWeight: 600,
              textDecoration: 'underline',
              marginLeft: '4px',
            }}
          >
            Sign in here
          </Link>
        </div>

        <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '11px', color: '#888888' }}>
          <Link to="/collections" style={{ color: '#555555', textDecoration: 'none' }}>
            Continue as Guest &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
