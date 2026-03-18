import { useState } from 'react';
import PageManager from './PageManager';

const SERVICE_TABS = [
  {
    key: 'event',
    label: 'Sự Kiện',
    pageKey: 'service-event',
    contentSections: ['hero', 'description', 'features', 'cta'],
    imageSections: ['hero'],
    title: 'Dịch Vụ: Sự Kiện',
  },
  {
    key: 'booth',
    label: 'Booth & Thi Công',
    pageKey: 'service-booth',
    contentSections: ['hero', 'description', 'features', 'cta'],
    imageSections: ['hero'],
    title: 'Dịch Vụ: Booth & Thi Công',
  },
  {
    key: 'livestream',
    label: 'Livestream',
    pageKey: 'service-livestream',
    contentSections: ['hero', 'description', 'features', 'cta'],
    imageSections: ['hero'],
    title: 'Dịch Vụ: Livestream',
  },
  {
    key: 'creative',
    label: 'Creative & Truyền Thông',
    pageKey: 'service-creative',
    contentSections: ['hero', 'description', 'features', 'cta'],
    imageSections: ['hero'],
    title: 'Dịch Vụ: Creative & Truyền Thông',
  },
  {
    key: 'sports',
    label: 'Sports & Pickleball',
    pageKey: 'service-sports',
    contentSections: ['hero', 'description', 'features', 'cta'],
    imageSections: ['hero'],
    title: 'Dịch Vụ: Sports Events & Pickleball Tournaments',
  },
];

function GuideBox() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, marginBottom: 20 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ background: '#16a34a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>● LIVE</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#15803d' }}>📖 Hướng dẫn — Nội Dung Trang Dịch Vụ</span>
        </div>
        <span style={{ fontSize: 11, color: '#6b7280', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #bbf7d0' }}>
          <p style={{ fontSize: 13, color: '#166534', margin: '12px 0 8px' }}>
            Nội dung chỉnh ở đây sẽ <strong>cập nhật trang chi tiết dịch vụ</strong> (<code>/services/event</code>, <code>/services/booth</code>...).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#15803d', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Các section & format</p>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#374151', lineHeight: 1.8 }}>
                <li><strong>hero</strong>: <code style={{ background: '#dcfce7', padding: '0 4px' }}>{`{"title":"...", "subtitle":"..."}`}</code></li>
                <li><strong>description</strong>: đoạn văn mô tả dịch vụ</li>
                <li><strong>features</strong>: <code style={{ background: '#dcfce7', padding: '0 4px' }}>{`{"items":["Tính năng 1","Tính năng 2"]}`}</code></li>
                <li><strong>cta</strong>: <code style={{ background: '#dcfce7', padding: '0 4px' }}>{`{"title":"...", "button":"..."}`}</code></li>
              </ul>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#15803d', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tab: Hình Ảnh</p>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#374151', lineHeight: 1.8 }}>
                <li>Upload ảnh hoặc nhập URL ảnh</li>
                <li><strong>Khu vực</strong>: chọn section (hero, gallery...)</li>
                <li><strong>Thứ tự</strong>: số nhỏ hiện trước</li>
                <li>Nhấn "Lưu" từng section riêng biệt</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesManager() {
  const [activeTab, setActiveTab] = useState('event');

  const current = SERVICE_TABS.find(t => t.key === activeTab);

  function tabStyle(key) {
    const isActive = activeTab === key;
    return {
      padding: '9px 20px',
      background: isActive ? '#C9A96E' : '#fff',
      color: isActive ? '#111' : '#555',
      border: '1px solid',
      borderColor: isActive ? '#C9A96E' : '#e5e5e5',
      borderRadius: 4,
      cursor: 'pointer',
      fontSize: 13,
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: isActive ? 600 : 400,
      transition: 'all 0.15s',
      whiteSpace: 'nowrap',
    };
  }

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <GuideBox />
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Dịch Vụ</h3>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>
          Quản lý nội dung và hình ảnh cho từng trang dịch vụ. Chọn dịch vụ bên dưới rồi sửa từng section.
        </p>
      </div>

      {/* Service tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #e5e5e5' }}>
        {SERVICE_TABS.map(t => (
          <button key={t.key} style={tabStyle(t.key)} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {current && (
        <PageManager
          key={current.pageKey}
          pageKey={current.pageKey}
          contentSections={current.contentSections}
          imageSections={current.imageSections}
          title={current.title}
        />
      )}
    </div>
  );
}
