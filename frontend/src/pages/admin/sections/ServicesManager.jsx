import { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/api';
import { useAdmin } from '../../../context/AdminContext';
import PageManager from './PageManager';
import ImageUpload from '../../../components/ImageUpload';

const SERVICE_TABS = [
  {
    key: 'event',
    label: 'Sự Kiện',
    pageKey: 'service-event',
    contentSections: ['hero', 'description', 'features', 'cta'],
    imageSections: ['hero'],
    title: 'Dịch Vụ: Sự Kiện',
    defaults: {
      title: 'Event & Corporate Experiences',
      desc_en: 'Professional corporate event management — concept development, scripting, and full-package execution that truly represents your brand.',
      desc_vi: 'Tổ chức sự kiện chuyên nghiệp dành cho doanh nghiệp — xây dựng concept, kịch bản và triển khai trọn gói theo đúng tinh thần thương hiệu.',
      items_en: 'Grand Opening & Ground-Breaking\nGround-breaking ceremonies\nProduct Launch\nConference & Seminar\nYear End Party & Teambuilding',
      items_vi: 'Khai trương & Khởi công\nLễ động thổ\nRa mắt sản phẩm\nHội nghị – Hội thảo\nYear End Party & Teambuilding',
    },
  },
  {
    key: 'booth',
    label: 'Booth & Thi Công',
    pageKey: 'service-booth',
    contentSections: ['hero', 'description', 'features', 'cta'],
    imageSections: ['hero'],
    title: 'Dịch Vụ: Booth & Thi Công',
    defaults: {
      title: 'Booth Design & Event Production',
      desc_en: 'Custom design and construction of event spaces — committed to matching design specifications, timelines, and aesthetic standards.',
      desc_vi: 'Thiết kế và thi công không gian sự kiện — cam kết đúng thiết kế, đúng tiến độ, đúng tiêu chuẩn thẩm mỹ.',
      items_en: 'Exhibition & trade fair booths\nActivation booth\nStage, Backdrop & POSM\nCustom concept decoration',
      items_vi: 'Booth triển lãm & hội chợ\nActivation booth\nSân khấu – Backdrop – POSM\nTrang trí theo concept riêng',
    },
  },
  {
    key: 'livestream',
    label: 'Livestream',
    pageKey: 'service-livestream',
    contentSections: ['hero', 'description', 'features', 'cta'],
    imageSections: ['hero'],
    title: 'Dịch Vụ: Livestream',
    defaults: {
      title: 'Livestream & Sales Production',
      desc_en: 'Optimized livestream solutions for image and conversion — combining content, technology, and strategy for real-world results.',
      desc_vi: 'Giải pháp livestream tối ưu hình ảnh và chuyển đổi — kết hợp nội dung, kỹ thuật và chiến lược để mang lại hiệu quả thực tế.',
      items_en: 'Studio setup & equipment\nSales scripts\nProfessional hosts & livestream operation\nOptimized order conversion',
      items_vi: 'Setup studio & thiết bị\nKịch bản bán hàng\nHost & vận hành livestream\nTối ưu quy trình chốt đơn',
    },
  },
  {
    key: 'creative',
    label: 'Creative & Truyền Thông',
    pageKey: 'service-creative',
    contentSections: ['hero', 'description', 'features', 'cta'],
    imageSections: ['hero'],
    title: 'Dịch Vụ: Creative & Truyền Thông',
    defaults: {
      title: 'Creative & Strategic Support',
      desc_en: 'Media strategy, social content development, short video production, and marketing campaign execution support.',
      desc_vi: 'Xây dựng chiến lược truyền thông, phát triển nội dung social, sản xuất video ngắn và hỗ trợ triển khai chiến dịch marketing.',
      items_en: 'Media strategy\nSocial content development\nShort video production\nMarketing campaign support',
      items_vi: 'Chiến lược truyền thông\nPhát triển nội dung social\nSản xuất video ngắn\nHỗ trợ chiến dịch marketing',
    },
  },
  {
    key: 'sports',
    label: 'Sports & Pickleball',
    pageKey: 'service-sports',
    contentSections: ['hero', 'description', 'features', 'cta'],
    imageSections: ['hero'],
    title: 'Dịch Vụ: Sports Events & Pickleball Tournaments',
    defaults: {
      title: 'Sports Events & Pickleball Tournaments',
      desc_en: 'Organizing sports events and Pickleball tournaments for businesses and communities — from concept, operations to media, ensuring professionalism and a complete competition experience.',
      desc_vi: 'Tổ chức các sự kiện thể thao và giải đấu Pickleball dành cho doanh nghiệp và cộng đồng, từ concept, vận hành đến truyền thông, đảm bảo chuyên nghiệp và trải nghiệm thi đấu trọn vẹn.',
      items_en: 'Internal & open Pickleball tournaments\nCourt setup & equipment\nOperations coordination & competition management\nBranding & event sponsorship\nMedia coverage & event filming',
      items_vi: 'Tổ chức giải Pickleball nội bộ & mở rộng\nSetup sân bãi & trang thiết bị\nĐiều phối vận hành & thi đấu\nBranding & tài trợ sự kiện\nTruyền thông & ghi hình sự kiện',
    },
  },
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

// ─── Part 1: Card editor for homepage ────────────────────────────────────────
function ServiceCardEditor({ service }) {
  const { authHeader } = useAdmin();
  const [form, setForm] = useState({
    title: '', desc_en: '', desc_vi: '', items_en: '', items_vi: '', img: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/content/home');
      const ov = res.data?.[`service-${service.key}`];
      if (ov) {
        const en = JSON.parse(ov.content_en || '{}');
        const vi = JSON.parse(ov.content_vi || '{}');
        setForm({
          title: en.title || '',
          desc_en: en.desc || '',
          desc_vi: vi.desc || '',
          items_en: (en.items || []).join('\n'),
          items_vi: (vi.items || []).join('\n'),
          img: en.img || '',
        });
      }
    } catch { /* use defaults */ }
    finally { setLoading(false); }
  }, [service.key]);

  useEffect(() => { load(); }, [load]);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true); setError(false);
    const content_en = JSON.stringify({
      title: form.title,
      desc: form.desc_en,
      items: form.items_en.split('\n').map(s => s.trim()).filter(Boolean),
      img: form.img,
    });
    const content_vi = JSON.stringify({
      desc: form.desc_vi,
      items: form.items_vi.split('\n').map(s => s.trim()).filter(Boolean),
    });
    try {
      await api.put(
        `/api/admin/content/home/service-${service.key}`,
        { content_en, content_vi },
        { headers: authHeader() }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally { setSaving(false); }
  }

  const inp = {
    width: '100%', background: '#fafafa', border: '1px solid #e4e4e7', borderRadius: 6,
    padding: '9px 12px', fontSize: 13, fontFamily: 'Montserrat, sans-serif',
    boxSizing: 'border-box', outline: 'none', color: '#111',
  };
  const lbl = {
    display: 'block', fontSize: 11, fontWeight: 700, color: '#555',
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5,
  };

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>Đang tải...</div>
  );

  return (
    <div>
      {/* Guide */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: '#1e40af', margin: 0 }}>
          <strong>📌 Card Trang Chủ</strong> — Chỉnh sửa thẻ dịch vụ hiển thị tại section "Dịch Vụ" của trang chủ.
          Sau khi lưu, tải lại trang chủ để thấy thay đổi.
        </p>
        <p style={{ fontSize: 12, color: '#3b82f6', margin: '6px 0 0' }}>
          💡 <strong>Tiêu đề luôn là tiếng Anh.</strong> Mô tả & danh sách: nhập cả EN và VI.
          Danh sách: mỗi dòng = 1 mục.
        </p>
      </div>

      {/* Cover image */}
      <div style={{ marginBottom: 20 }}>
        <ImageUpload
          label="Ảnh bìa card (hiển thị trên trang chủ)"
          value={form.img}
          onChange={url => set('img', url)}
        />
        {!form.img && (
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '6px 0 0' }}>
            Nếu để trống, sẽ dùng ảnh mặc định của dịch vụ.
          </p>
        )}
      </div>

      {/* Title (EN only) */}
      <div style={{ marginBottom: 18 }}>
        <label style={lbl}>Tiêu đề dịch vụ <span style={{ color: '#C9A96E' }}>(chỉ tiếng Anh)</span></label>
        <input
          style={inp}
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder={service.defaults.title}
        />
      </div>

      {/* Desc EN + VI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
        <div>
          <label style={lbl}>🇬🇧 Mô tả (EN)</label>
          <textarea
            style={{ ...inp, height: 90, resize: 'vertical' }}
            value={form.desc_en}
            onChange={e => set('desc_en', e.target.value)}
            placeholder={service.defaults.desc_en}
          />
        </div>
        <div>
          <label style={lbl}>🇻🇳 Mô tả (VI)</label>
          <textarea
            style={{ ...inp, height: 90, resize: 'vertical' }}
            value={form.desc_vi}
            onChange={e => set('desc_vi', e.target.value)}
            placeholder={service.defaults.desc_vi}
          />
        </div>
      </div>

      {/* Items EN + VI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={lbl}>🇬🇧 Danh sách tính năng (EN) — mỗi dòng 1 mục</label>
          <textarea
            style={{ ...inp, height: 130, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }}
            value={form.items_en}
            onChange={e => set('items_en', e.target.value)}
            placeholder={service.defaults.items_en}
          />
        </div>
        <div>
          <label style={lbl}>🇻🇳 Danh sách tính năng (VI) — mỗi dòng 1 mục</label>
          <textarea
            style={{ ...inp, height: 130, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }}
            value={form.items_vi}
            onChange={e => set('items_vi', e.target.value)}
            placeholder={service.defaults.items_vi}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '10px 28px',
            background: error ? '#dc2626' : saved ? '#16a34a' : saving ? '#9ca3af' : '#C9A96E',
            border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Montserrat, sans-serif',
            color: (saved || error) ? '#fff' : '#111', transition: 'background 0.2s',
          }}
        >
          {error ? '✕ Lỗi' : saved ? '✓ Đã lưu & cập nhật website' : saving ? 'Đang lưu...' : '💾 Lưu Card Trang Chủ'}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ServicesManager() {
  const [activeService, setActiveService] = useState('event');
  const [activePart, setActivePart] = useState('card');
  const [toast, setToast] = useState(null);

  const current = SERVICE_TABS.find(t => t.key === activeService);

  function serviceTabStyle(key) {
    const isActive = activeService === key;
    return {
      padding: '8px 16px', background: isActive ? '#C9A96E' : '#fff',
      color: isActive ? '#111' : '#555', border: '1px solid',
      borderColor: isActive ? '#C9A96E' : '#e4e4e7', borderRadius: 6,
      cursor: 'pointer', fontSize: 13, fontFamily: 'Montserrat, sans-serif',
      fontWeight: isActive ? 700 : 400, transition: 'all 0.15s', whiteSpace: 'nowrap',
    };
  }

  function partTabStyle(key) {
    const isActive = activePart === key;
    return {
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '9px 20px', background: isActive ? '#111' : '#fff',
      color: isActive ? '#fff' : '#555', border: '1px solid',
      borderColor: isActive ? '#111' : '#e4e4e7', borderRadius: 6,
      cursor: 'pointer', fontSize: 13, fontFamily: 'Montserrat, sans-serif',
      fontWeight: isActive ? 600 : 400, transition: 'all 0.15s',
    };
  }

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Dịch Vụ</h3>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
          Mỗi dịch vụ có 2 phần: <strong>Card Trang Chủ</strong> (thẻ hiển thị ở trang chủ) và <strong>Trang Chi Tiết</strong> (nội dung trang /services/...).
        </p>
      </div>

      {/* Service selector */}
      <div style={{
        background: '#fff', border: '1px solid #e4e4e7', borderRadius: 10,
        padding: '16px 20px', marginBottom: 20,
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px' }}>
          Chọn dịch vụ
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SERVICE_TABS.map(t => (
            <button key={t.key} style={serviceTabStyle(t.key)} onClick={() => { setActiveService(t.key); setActivePart('card'); }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 10, overflow: 'hidden' }}>
          {/* Part selector header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', background: '#f9fafb', borderBottom: '1px solid #e4e4e7',
          }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{current.title}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={partTabStyle('card')} onClick={() => setActivePart('card')}>
                <span>🏠</span> Card Trang Chủ
              </button>
              <button style={partTabStyle('detail')} onClick={() => setActivePart('detail')}>
                <span>📄</span> Trang Chi Tiết
              </button>
            </div>
          </div>

          {/* Part content */}
          <div style={{ padding: '24px 20px' }}>
            {activePart === 'card' && (
              <ServiceCardEditor key={`card-${activeService}`} service={current} />
            )}
            {activePart === 'detail' && (
              <PageManager
                key={current.pageKey}
                pageKey={current.pageKey}
                contentSections={current.contentSections}
                imageSections={current.imageSections}
                title=""
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
