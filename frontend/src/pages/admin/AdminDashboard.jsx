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
  { key: 'overview',  label: 'Tổng Quan',   icon: '▣', desc: 'Thống kê & hướng dẫn' },
  { key: 'blog',      label: 'Blog',         icon: '✍', desc: 'Bài viết & tin tức' },
  { key: 'careers',   label: 'Tuyển Dụng',   icon: '💼', desc: 'Vị trí & đơn ứng tuyển' },
  { key: 'services',  label: 'Dịch Vụ',      icon: '🎯', desc: 'Nội dung trang dịch vụ' },
  { key: 'contact',   label: 'Liên Hệ',      icon: '📬', desc: 'Form & yêu cầu sự kiện' },
];

const s = {
  sidebar: {
    width: 250, minWidth: 250, background: '#111', display: 'flex',
    flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0,
    zIndex: 100, borderRight: '1px solid #222',
  },
  logoArea: {
    padding: '24px 20px 20px', borderBottom: '1px solid #222',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
  },
  badge: {
    fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
    color: '#C9A96E', fontWeight: 600,
  },
  navBtn: (isActive) => ({
    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
    padding: '10px 14px', background: isActive ? 'rgba(201,169,110,0.12)' : 'transparent',
    border: 'none', borderRadius: 6, cursor: 'pointer', textAlign: 'left',
    marginBottom: 2, transition: 'all 0.15s', fontFamily: 'Montserrat, sans-serif',
    borderLeft: isActive ? '3px solid #C9A96E' : '3px solid transparent',
    paddingLeft: isActive ? 11 : 14,
  }),
  navLabel: (isActive) => ({
    fontSize: 13, color: isActive ? '#C9A96E' : '#888',
    fontWeight: isActive ? 600 : 400,
  }),
  navDesc: { fontSize: 10, color: '#555', marginTop: 1 },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
    padding: '9px 14px', background: 'transparent', border: '1px solid #2a2a2a',
    borderRadius: 6, color: '#666', fontSize: 12, fontFamily: 'Montserrat, sans-serif',
    cursor: 'pointer', transition: 'all 0.15s',
  },
};

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
      case 'overview':  return <Overview />;
      case 'services':  return <ServicesManager />;
      case 'blog':      return <BlogManager />;
      case 'careers':   return <CareersManager />;
      case 'contact':   return <ContactManager />;
      default:          return <Overview />;
    }
  }

  const current = NAV_ITEMS.find(i => i.key === active);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Montserrat, sans-serif', background: '#f4f4f5' }}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logoArea}>
          <img src={logo} alt="Logo" style={{ height: 42, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          <span style={s.badge}>Trang Quản Trị</span>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                style={s.navBtn(isActive)}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 15, width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={s.navLabel(isActive)}>{item.label}</div>
                  <div style={s.navDesc}>{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid #222' }}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '8px 14px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)',
              borderRadius: 6, color: '#C9A96E', fontSize: 12, fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer', textDecoration: 'none', marginBottom: 8, boxSizing: 'border-box',
            }}
          >
            <span>↗</span> Xem Website
          </a>
          <button
            onClick={handleLogout}
            style={s.logoutBtn}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666'; }}
          >
            <span>⏻</span> Đăng Xuất
          </button>
          <p style={{ fontSize: 10, color: '#444', textAlign: 'center', margin: '10px 0 0' }}>
            Elevate Media © {new Date().getFullYear()}
          </p>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 250, flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #e4e4e7', padding: '0 32px',
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 18 }}>{current?.icon}</span>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>{current?.label}</h2>
              <p style={{ fontSize: 11, color: '#999', margin: 0 }}>{current?.desc}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#bbb', background: '#f4f4f5', padding: '4px 10px', borderRadius: 20 }}>
              Admin
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '28px 32px' }}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
