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
];

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
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Dịch Vụ</h3>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>
          Quản lý nội dung và hình ảnh cho từng trang dịch vụ.
        </p>
      </div>

      {/* Helper note */}
      <div style={{
        background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 4,
        padding: '10px 16px', marginBottom: 20, fontSize: 12, color: '#0c4a6e',
      }}>
        <strong>Định dạng section "features":</strong> Nhập JSON với cấu trúc{' '}
        <code>{'{"items": ["Tính năng 1", "Tính năng 2", ...]}'}</code> cho cả EN và VI riêng biệt.
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
