import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error: authError, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    if (!email || !password) {
      setValidationError(t('auth.fillAllFields') || 'Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      navigate(loggedInUser.role === 'admin' ? '/admin' : '/');
    } catch {
      // Error displayed from authError
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-brand-icon">🛒</span>
          <span className="auth-brand-name">Brand</span>
        </div>
        <div className="auth-left-content">
          <h2>Welcome back!</h2>
          <p>Sign in to access your orders, wishlist, and personalized recommendations.</p>
          <div className="auth-features">
            {[
              'Track your orders in real-time',
              'Access exclusive deals',
              'Manage your wishlist',
              'Fast & secure checkout',
            ].map((f, i) => (
              <div key={i} className="auth-feature">
                <span className="auth-feature-check">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-left-bg-circle circle1" />
        <div className="auth-left-bg-circle circle2" />
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>{t('auth.signIn') || 'Sign In'}</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          {(validationError || authError) && (
            <div className="auth-error">
              <span>⚠</span> {validationError || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">{t('auth.email') || 'Email Address'}</label>
              <div className="auth-input-wrap">
                <FiMail className="auth-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="login-password">{t('auth.password') || 'Password'}</label>
                <a href="#forgot" className="auth-forgot">
                  {t('auth.forgotPassword') || 'Forgot password?'}
                </a>
              </div>
              <div className="auth-input-wrap">
                <FiLock className="auth-input-icon" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPass(v => !v)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="auth-spinner" />
              ) : (
                <>{t('auth.signIn') || 'Sign In'} <FiArrowRight /></>
              )}
            </button>
          </form>

          <div className="auth-footer-text" style={{ marginTop: '1.5rem' }}>
            {t('auth.noAccount') || "Don't have an account?"}{' '}
            <Link to="/register" className="auth-link">
              {t('auth.signUp') || 'Sign up'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
