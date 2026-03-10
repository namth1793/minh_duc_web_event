import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useAdmin } from '../../../context/AdminContext';

function StatCard({ label, value, color, icon }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: 6,
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 11, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
          {label}
        </p>
        <p style={{ fontSize: 28, fontWeight: 700, color: '#111', margin: 0, lineHeight: 1 }}>
          {value === null ? '—' : value}
        </p>
      </div>
    </div>
  );
}

export default function Overview() {
  const { authHeader } = useAdmin();
  const [stats, setStats] = useState({
    blog: null, careers: null, contacts: null, inquiries: null, applications: null
  });
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
          blog: blog.data.length,
          careers: careers.data.length,
          contacts: contacts.data.length,
          inquiries: inquiries.data.length,
          applications: applications.data.length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authHeader]);

  const cards = [
    { label: 'Tổng bài viết', value: stats.blog, color: '#C9A96E', icon: '✍' },
    { label: 'Tổng tin tuyển dụng', value: stats.careers, color: '#6366f1', icon: '💼' },
    { label: 'Tổng liên hệ', value: stats.contacts, color: '#10b981', icon: '✉' },
    { label: 'Tổng yêu cầu sự kiện', value: stats.inquiries, color: '#f59e0b', icon: '📋' },
    { label: 'Tổng đơn ứng tuyển', value: stats.applications, color: '#ef4444', icon: '📄' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 6px' }}>
          Chào mừng trở lại
        </h3>
        <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
          Tổng quan nội dung website của bạn.
        </p>
      </div>

      {loading ? (
        <div style={{ color: '#888', fontSize: 14 }}>Đang tải thống kê...</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {cards.map(card => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* Quick info */}
      <div
        style={{
          marginTop: 32,
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: 6,
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: '0 0 12px' }}>
          Thông tin đăng nhập (mặc định)
        </h4>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>Tên đăng nhập</span>
            <code style={{ fontSize: 13, background: '#f5f5f5', padding: '2px 8px', borderRadius: 3 }}>admin</code>
          </div>
          <div>
            <span style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>Mật khẩu</span>
            <code style={{ fontSize: 13, background: '#f5f5f5', padding: '2px 8px', borderRadius: 3 }}>admin123</code>
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#f59e0b', margin: '12px 0 0' }}>
          ⚠ Hãy đổi mật khẩu mặc định trước khi triển khai lên môi trường thực tế.
        </p>
      </div>
    </div>
  );
}
