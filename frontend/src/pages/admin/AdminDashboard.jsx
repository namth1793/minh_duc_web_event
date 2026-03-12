import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import logo from '../../assets/logo.jpg';
import Overview from './sections/Overview';
import BlogManager from './sections/BlogManager';
import CareersManager from './sections/CareersManager';
import ServicesManager from './sections/ServicesManager';
import ContactManager from './sections/ContactManager';

const NAV_ITEMS = [
  { key: 'overview', label: 'Tổng Quan', icon: '▣' },
  { key: 'services', label: 'Dịch Vụ', icon: '🎯' },
  { key: 'blog', label: 'Blog', icon: '✍' },
  { key: 'careers', label: 'Tuyển Dụng', icon: '💼' },
  { key: 'contact', label: 'Liên Hệ', icon: '📬' },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const { adminLogout } = useAdmin();
  const navigate = useNavigate();

  function handleLogout() {
    adminLogout();
    navigate('/admin/login', { replace: true });
  }

  function renderSection() {
    switch (active) {
      case 'overview':
        return <Overview />;
      case 'services':
        return <ServicesManager />;
      case 'blog':
        return <BlogManager />;
      case 'careers':
        return <CareersManager />;
      case 'contact':
        return <ContactManager />;
      default:
        return <Overview />;
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Montserrat, sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          minWidth: 240,
          background: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          borderRight: '1px solid #2a2a2a',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            padding: '24px 20px 20px',
            borderBottom: '1px solid #2a2a2a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ height: 44, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
          <span
            style={{
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C9A96E',
              fontWeight: 500,
            }}
          >
            Trang Quản Trị
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  background: isActive ? 'rgba(201,169,110,0.15)' : 'transparent',
                  border: 'none',
                  borderRadius: 4,
                  color: isActive ? '#C9A96E' : '#888',
                  fontSize: 13,
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: isActive ? 500 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: 2,
                  transition: 'all 0.15s',
                  borderLeft: isActive ? '2px solid #C9A96E' : '2px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#ccc';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#888';
                  }
                }}
              >
                <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #2a2a2a' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '10px 14px',
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: 4,
              color: '#666',
              fontSize: 12,
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(220,38,38,0.1)';
              e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)';
              e.currentTarget.style.color = '#f87171';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.color = '#666';
            }}
          >
            <span>⏻</span>
            Đăng Xuất
          </button>
          <p style={{ fontSize: 10, color: '#444', textAlign: 'center', marginTop: 12, margin: '12px 0 0' }}>
            Elevate Media © {new Date().getFullYear()}
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          marginLeft: 240,
          flex: 1,
          background: '#f7f7f7',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: '#fff',
            borderBottom: '1px solid #e5e5e5',
            padding: '0 32px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111', margin: 0 }}>
            {NAV_ITEMS.find(i => i.key === active)?.label || 'Tổng Quan'}
          </h2>
          <span style={{ fontSize: 12, color: '#999' }}>
            Elevate Media Admin
          </span>
        </div>

        {/* Section content */}
        <div style={{ flex: 1, padding: '28px 32px' }}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
