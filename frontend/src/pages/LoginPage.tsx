import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const nextParam = queryParams.get('next');

  // Automatic redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.role === 'ADMIN' || !!user.is_admin || !!user.is_staff || !!user.is_superuser;
      if (isAdmin) {
        navigate(nextParam || '/admin', { replace: true });
      } else {
        navigate(nextParam || '/profile', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, nextParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await login(email.trim().toLowerCase(), password, role);
    setLoading(false);

    if (res.success) {
      toast.success('Welcome back to Velmora.');
      const userRole = res.user?.role || role;
      const isAdmin = userRole === 'ADMIN' || !!res.user?.is_admin || !!res.user?.is_staff || !!res.user?.is_superuser;

      // Role-specific distinct paths
      if (isAdmin) {
        navigate(nextParam || '/admin');
      } else {
        navigate(nextParam || '/profile');
      }
    } else {
      toast.error(res.error || 'Invalid email or password.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
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
            Velmora Atelier
          </span>
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">
            Select your portal type and enter your credentials to access your private account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Account Role: Client Portal vs Store Admin */}
          <div className="auth-form-group">
            <label htmlFor="loginRole" className="auth-label">Portal Access</label>
            <select
              id="loginRole"
              name="role"
              required
              className="auth-select form-select"
              value={role}
              onChange={(e) => setRole(e.target.value as 'CUSTOMER' | 'ADMIN')}
            >
              <option value="CUSTOMER">Client / Customer Portal</option>
              <option value="ADMIN">Store Administrator / Atelier Console</option>
            </select>
          </div>

          <div className="auth-form-group">
            <label htmlFor="loginEmail" className="auth-label">Email Address</label>
            <input
              type="email"
              id="loginEmail"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="loginPassword" className="auth-label">Password</label>
            <input
              type="password"
              id="loginPassword"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>

        <div className="auth-footer-links">
          <span>Don't have an account? </span>
          <Link to="/register">Create client account</Link>
        </div>

        <div className="mt-4 pt-3 border-top text-center" style={{ fontSize: '11px', color: '#767676' }}>
          <Link to="/collections" className="text-dark text-decoration-none">
            Continue as Guest &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
