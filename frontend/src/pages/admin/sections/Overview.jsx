import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useAdmin } from '../../../context/AdminContext';

const GUIDES = [
  {
    icon: '✍', key: 'blog', label: 'Blog', color: '#C9A96E',
    live: true,
    guide: 'Thêm/sửa/xóa bài viết. Thay đổi cập nhật ngay trên trang /blog.',
    steps: ['Nhấn "Blog" ở menu trái', 'Nhấn "+ Thêm Mới" để tạo bài viết', 'Điền tiêu đề, danh mục, ảnh, nội dung', 'Nhấn "Lưu Bài Viết" — website cập nhật ngay'],
  },
  {
    icon: '💼', key: 'careers', label: 'Tuyển Dụng', color: '#6366f1',
    live: true,
    guide: 'Quản lý tin tuyển dụng và xem đơn ứng tuyển. Cập nhật ngay trên trang /careers.',
    steps: ['Nhấn "Tuyển Dụng" ở menu trái', 'Tab "Tin Tuyển Dụng": thêm/sửa/xóa vị trí', 'Tab "Đơn Ứng Tuyển": xem đơn từ ứng viên', 'Nhấn "Lưu" — website cập nhật ngay'],
  },
  {
    icon: '🎯', key: 'services', label: 'Dịch Vụ', color: '#10b981',
    live: true,
    guide: 'Chỉnh nội dung các trang dịch vụ chi tiết (/services/event, /services/booth, ...).',
    steps: ['Nhấn "Dịch Vụ" ở menu trái', 'Chọn dịch vụ cần chỉnh (Event, Booth, Livestream...)', 'Sửa nội dung từng section: hero, description, features', 'Nhấn "Lưu" cho từng section — cập nhật trang dịch vụ'],
  },
  {
    icon: '📬', key: 'contact', label: 'Liên Hệ', color: '#f59e0b',
    live: false,
    guide: 'Xem form liên hệ và yêu cầu sự kiện từ khách hàng gửi qua website.',
    steps: ['Nhấn "Liên Hệ" ở menu trái', 'Tab "Form Liên Hệ": xem tin nhắn từ trang /contact', 'Tab "Yêu Cầu Sự Kiện": xem yêu cầu từ trang /lifestyle-events', 'Dữ liệu chỉ xem, không thể xóa'],
  },
];

function StatCard({ label, value, color, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff', border: '1px solid #e4e4e7', borderRadius: 10,
        padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 10, background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
          {label}
        </p>
        <p style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0, lineHeight: 1 }}>
          {value === null ? '—' : value}
        </p>
      </div>
    </div>
  );
}

function GuideCard({ guide }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: '#fff', border: '1px solid #e4e4e7', borderRadius: 10,
      overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'Montserrat, sans-serif', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 20 }}>{guide.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{guide.label}</span>
            {guide.live && (
              <span style={{
                background: '#dcfce7', color: '#16a34a', fontSize: 10, fontWeight: 600,
                padding: '2px 7px', borderRadius: 20, letterSpacing: '0.05em',
              }}>● LIVE</span>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0' }}>{guide.guide}</p>
        </div>
        <span style={{ fontSize: 12, color: '#9ca3af', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px 52px', borderTop: '1px solid #f3f4f6' }}>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '12px 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Các bước thực hiện:
          </p>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {guide.steps.map((step, i) => (
              <li key={i} style={{ fontSize: 13, color: '#374151', marginBottom: 6, lineHeight: 1.5 }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function Overview() {
  const { authHeader } = useAdmin();
  const [stats, setStats] = useState({ blog: null, careers: null, contacts: null, inquiries: null, applications: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = authHeader();
    Promise.all([
      api.get('/api/admin/blog', { headers }),
      api.get('/api/admin/careers', { headers }),
      api.get('/api/admin/contacts', { headers }),
      api.get('/api/admin/inquiries', { headers }),
      api.get('/api/admin/applications', { headers }),
    ])
      .then(([blog, careers, contacts, inquiries, applications]) => {
        setStats({
          blog: blog.data.length, careers: careers.data.length,
          contacts: contacts.data.length, inquiries: inquiries.data.length,
          applications: applications.data.length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authHeader]);

  return (
    <div>
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
        borderRadius: 12, padding: '28px 32px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      }}>
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>
            Chào mừng trở lại 👋
          </h3>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
            Quản lý toàn bộ nội dung website Elevate Media từ đây.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          style={{
            padding: '10px 20px', background: '#C9A96E', border: 'none', borderRadius: 8,
            color: '#111', fontSize: 13, fontWeight: 600, fontFamily: 'Montserrat, sans-serif',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}
        >
          ↗ Xem Website
        </a>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {loading ? (
          <div style={{ gridColumn: '1/-1', padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>Đang tải thống kê...</div>
        ) : (
          <>
            <StatCard label="Bài Viết" value={stats.blog} color="#C9A96E" icon="✍" />
            <StatCard label="Tin Tuyển Dụng" value={stats.careers} color="#6366f1" icon="💼" />
            <StatCard label="Form Liên Hệ" value={stats.contacts} color="#10b981" icon="✉" />
            <StatCard label="Yêu Cầu Sự Kiện" value={stats.inquiries} color="#f59e0b" icon="📋" />
            <StatCard label="Đơn Ứng Tuyển" value={stats.applications} color="#ef4444" icon="📄" />
          </>
        )}
      </div>

      {/* Guide section */}
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          📖 Hướng Dẫn Sử Dụng
        </h4>
        <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 16px' }}>
          Nhấn vào từng mục để xem hướng dẫn chi tiết. Các mục có badge <strong style={{ color: '#16a34a' }}>LIVE</strong> sẽ cập nhật website ngay sau khi lưu.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {GUIDES.map(g => <GuideCard key={g.key} guide={g} />)}
        </div>
      </div>

      {/* Login info */}
      <div style={{
        background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10,
        padding: '16px 20px', marginTop: 24,
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#92400e', margin: '0 0 8px' }}>⚠ Thông tin đăng nhập mặc định</p>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: 11, color: '#b45309', display: 'block', marginBottom: 2 }}>Tên đăng nhập</span>
            <code style={{ fontSize: 12, background: '#fef3c7', padding: '2px 8px', borderRadius: 4 }}>admin</code>
          </div>
          <div>
            <span style={{ fontSize: 11, color: '#b45309', display: 'block', marginBottom: 2 }}>Mật khẩu</span>
            <code style={{ fontSize: 12, background: '#fef3c7', padding: '2px 8px', borderRadius: 4 }}>admin123</code>
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#b45309', margin: '8px 0 0' }}>Hãy đổi mật khẩu trước khi triển khai thực tế.</p>
      </div>
    </div>
  );
}
