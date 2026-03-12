import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import logo from '../../assets/logo.jpg';

export default function AdminLoginPage() {
  const { adminLogin, isAdminLoggedIn } = useAdmin();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in
  if (isAdminLoggedIn) {
    navigate('/admin', { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || 'Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 50%, #111111 100%)' }}
    >
      {/* Subtle gold border card */}
      <div
        className="w-full max-w-sm mx-4"
        style={{
          background: '#1e1e1e',
          border: '1px solid rgba(201,169,110,0.3)',
          borderRadius: '2px',
          padding: '48px 40px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="Minh Đức Events"
            style={{ height: 64, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 16 }}
          />
          <h1
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C9A96E',
              fontWeight: 400,
              margin: 0,
            }}
          >
            Trang Quản Trị
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#888',
                marginBottom: 8,
              }}
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #333',
                borderRadius: 1,
                padding: '10px 14px',
                color: '#fff',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#C9A96E')}
              onBlur={e => (e.target.style.borderColor = '#333')}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label
              style={{
                display: 'block',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#888',
                marginBottom: 8,
              }}
            >
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                background: '#111',
                border: '1px solid #333',
                borderRadius: 1,
                padding: '10px 14px',
                color: '#fff',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#C9A96E')}
              onBlur={e => (e.target.style.borderColor = '#333')}
            />
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(220,38,38,0.1)',
                border: '1px solid rgba(220,38,38,0.3)',
                borderRadius: 1,
                padding: '10px 14px',
                color: '#f87171',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#333' : '#C9A96E',
              color: loading ? '#888' : '#111',
              border: 'none',
              borderRadius: 1,
              padding: '12px',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        {/* Back to home */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#555',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C9A96E')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}
          >
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
