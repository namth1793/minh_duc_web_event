import { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/api';
import { useAdmin } from '../../../context/AdminContext';

const PAGES = [
  { key: 'home', label: 'Trang Chủ', sections: ['hero', 'about', 'lifestyle', 'business', 'philosophy', 'cta'] },
  { key: 'brand-story', label: 'Câu Chuyện', sections: ['hero', 'vision', 'architecture', 'hospitality', 'emotional'] },
  { key: 'lifestyle-events', label: 'Sự Kiện Cá Nhân', sections: ['hero', 'events', 'inquiry'] },
  { key: 'business-events', label: 'Sự Kiện DN', sections: ['hero', 'events', 'capacity'] },
  { key: 'blog', label: 'Blog', sections: ['hero'] },
  { key: 'careers', label: 'Tuyển Dụng', sections: ['hero', 'culture'] },
  { key: 'contact', label: 'Liên Hệ', sections: ['hero', 'form', 'info'] },
];

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: type === 'success' ? '#065f46' : '#7f1d1d',
      color: '#fff', padding: '12px 20px', borderRadius: 6,
      fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span>{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  );
}

function SectionEditor({ page, section, initialData, onSaved }) {
  const { authHeader } = useAdmin();
  const [content_en, setContentEn] = useState(initialData?.content_en || '');
  const [content_vi, setContentVi] = useState(initialData?.content_vi || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await api.put(
        `/api/admin/content/${page}/${section}`,
        { content_en, content_vi },
        { headers: authHeader() }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved?.(res.data);
    } catch {
      // let parent handle toast
    } finally {
      setSaving(false);
    }
  }

  const textareaStyle = {
    width: '100%', background: '#fafafa', border: '1px solid #ddd',
    borderRadius: 4, padding: '8px 12px', fontSize: 12,
    fontFamily: 'monospace', boxSizing: 'border-box', outline: 'none',
    color: '#111', height: 100, resize: 'vertical',
  };

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e5e5', borderRadius: 6,
      padding: '16px 20px', marginBottom: 12,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
      }}>
        <div>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#111', letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>{section}</span>
          <span style={{ fontSize: 11, color: '#aaa', marginLeft: 8 }}>
            {page} / {section}
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '5px 16px',
            background: saved ? '#065f46' : saving ? '#888' : '#C9A96E',
            border: 'none', borderRadius: 3, fontSize: 12,
            cursor: saving ? 'not-allowed' : 'pointer',
            color: saved ? '#fff' : '#111', fontWeight: 500,
            transition: 'background 0.2s',
          }}
        >
          {saved ? '✓ Đã lưu' : saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ fontSize: 10, color: '#888', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Nội dung EN (JSON hoặc văn bản)
          </label>
          <textarea
            style={textareaStyle}
            value={content_en}
            onChange={e => setContentEn(e.target.value)}
            placeholder='e.g. {"title": "Welcome", "subtitle": "..."}'
          />
        </div>
        <div>
          <label style={{ fontSize: 10, color: '#888', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Nội dung VI (JSON hoặc văn bản)
          </label>
          <textarea
            style={textareaStyle}
            value={content_vi}
            onChange={e => setContentVi(e.target.value)}
            placeholder='e.g. {"title": "Chào Mừng", "subtitle": "..."}'
          />
        </div>
      </div>
    </div>
  );
}

export default function ContentManager() {
  const { authHeader } = useAdmin();
  const [activePage, setActivePage] = useState('home');
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const pageConfig = PAGES.find(p => p.key === activePage);

  const fetchContent = useCallback(async (pageKey) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/content/${pageKey}`, { headers: authHeader() });
      const map = {};
      for (const row of res.data) {
        map[row.section] = row;
      }
      setContentMap(map);
    } catch {
      setToast({ message: 'Không thể tải nội dung', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => {
    fetchContent(activePage);
  }, [activePage, fetchContent]);

  function handleSaved(data) {
    setContentMap(prev => ({ ...prev, [data.section]: data }));
    setToast({ message: `Đã lưu: ${data.page} / ${data.section}`, type: 'success' });
  }

  const tabStyle = (key) => ({
    padding: '8px 16px',
    background: activePage === key ? '#111' : '#fff',
    color: activePage === key ? '#fff' : '#555',
    border: '1px solid',
    borderColor: activePage === key ? '#111' : '#e5e5e5',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    fontWeight: activePage === key ? 600 : 400,
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  });

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: '#111' }}>Nội Dung Trang</h3>
        <p style={{ margin: 0, fontSize: 13, color: '#888' }}>
          Chỉnh sửa nội dung văn bản cho từng khu vực trang. Nội dung được lưu dưới dạng JSON hoặc văn bản thuần.
        </p>
      </div>

      {/* Page tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {PAGES.map(p => (
          <button key={p.key} style={tabStyle(p.key)} onClick={() => setActivePage(p.key)}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Info box */}
      <div style={{
        background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4,
        padding: '10px 16px', marginBottom: 20, fontSize: 12, color: '#92400e',
      }}>
        <strong>Lưu ý:</strong> Nội dung lưu ở đây hoạt động như bản ghi đè. Frontend có thể tải từ các giá trị này qua <code>/api/admin/content/{activePage}</code>.
        Mỗi khu vực chấp nhận JSON (dữ liệu có cấu trúc) hoặc văn bản thuần.
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Đang tải...</div>
      ) : (
        <div>
          <h4 style={{ fontSize: 13, color: '#666', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {pageConfig?.label} — {pageConfig?.sections.length} khu vực
          </h4>
          {pageConfig?.sections.map(section => (
            <SectionEditor
              key={`${activePage}-${section}`}
              page={activePage}
              section={section}
              initialData={contentMap[section]}
              onSaved={handleSaved}
            />
          ))}
        </div>
      )}
    </div>
  );
}
