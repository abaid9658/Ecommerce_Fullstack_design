import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import './AuthPages.css';

const RegisterPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, error: authError, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!form.firstName || !form.email || !form.password) {
      setValidationError('Please fill in all required fields');
      return;
    }
    if (form.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirm) {
      setValidationError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      await register(fullName, form.email, form.password);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch {
      // authError displayed below
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][strength];

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-brand-icon">🛒</span>
          <span className="auth-brand-name">Brand</span>
        </div>
        <div className="auth-left-content">
          <h2>Join millions of shoppers!</h2>
          <p>Create your free account and unlock exclusive deals, fast checkout, and personalized shopping.</p>
          <div className="auth-features">
            {['Free account forever', 'Exclusive member deals', 'One-click checkout', 'Order tracking & history'].map((f, i) => (
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
            <h1>{t('auth.signUp') || 'Create Account'}</h1>
            <p>Fill in the details below to get started</p>
          </div>

          {success && (
            <div className="auth-success">
              <FiCheckCircle /> Account created! Redirecting...
            </div>
          )}

          {(validationError || authError) && (
            <div className="auth-error">
              <span>⚠</span> {validationError || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-name-grid">
              <div className="auth-field">
                <label>First Name *</label>
                <div className="auth-input-wrap">
                  <FiUser className="auth-input-icon" />
                  <input type="text" placeholder="John" value={form.firstName} onChange={handleChange('firstName')} required />
                </div>
              </div>
              <div className="auth-field">
                <label>Last Name</label>
                <div className="auth-input-wrap">
                  <FiUser className="auth-input-icon" />
                  <input type="text" placeholder="Doe" value={form.lastName} onChange={handleChange('lastName')} />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label>{t('auth.email') || 'Email Address'} *</label>
              <div className="auth-input-wrap">
                <FiMail className="auth-input-icon" />
                <input type="email" placeholder="name@example.com" value={form.email} onChange={handleChange('email')} required />
              </div>
            </div>

            <div className="auth-field">
              <label>{t('auth.password') || 'Password'} *</label>
              <div className="auth-input-wrap">
                <FiLock className="auth-input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleChange('password')}
                  required
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPass(v => !v)}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: '0.3rem' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '0.2rem' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: '3px', borderRadius: '999px', background: i <= strength ? strengthColor : '#334155', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label>Confirm Password *</label>
              <div className="auth-input-wrap">
                <FiLock className="auth-input-icon" />
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={handleChange('confirm')}
                  required
                  style={{ borderColor: form.confirm && form.confirm !== form.password ? '#ef4444' : '' }}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isSubmitting || success}>
              {isSubmitting ? <span className="auth-spinner" /> : <>{t('auth.createAccount') || 'Create Account'} <FiArrowRight /></>}
            </button>
          </form>

          <p className="auth-terms">
            By creating an account, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>

          <div className="auth-footer-text" style={{ marginTop: '1rem' }}>
            {t('auth.haveAccount') || 'Already have an account?'}{' '}
            <Link to="/login" className="auth-link">{t('auth.signIn') || 'Sign in'}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
