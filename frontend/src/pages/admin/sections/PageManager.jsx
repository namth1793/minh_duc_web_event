import { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/api';
import { useAdmin } from '../../../context/AdminContext';
import ImageUpload from '../../../components/ImageUpload';

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

const SECTION_HINTS = {
  hero: {
    label: 'Banner đầu trang',
    hint: 'Tiêu đề và phụ đề hiển thị trên ảnh nền hero',
    format: '{"title": "Tiêu đề lớn", "subtitle": "Phụ đề nhỏ phía dưới"}',
  },
  description: {
    label: 'Mô tả dịch vụ',
    hint: 'Đoạn văn giới thiệu dịch vụ, hiển thị phía dưới hero',
    format: 'Nhập văn bản thuần (không cần JSON)',
  },
  features: {
    label: 'Danh sách tính năng',
    hint: 'Các tính năng/điểm mạnh của dịch vụ, hiển thị dạng bullet list',
    format: '{"items": ["Tính năng 1", "Tính năng 2", "Tính năng 3"]}',
  },
  cta: {
    label: 'Kêu gọi hành động (CTA)',
    hint: 'Nút và tiêu đề kêu gọi khách hàng liên hệ ở cuối trang',
    format: '{"title": "Sẵn sàng bắt đầu?", "subtitle": "Mô tả ngắn", "button": "Liên Hệ Ngay"}',
  },
  vision: {
    label: 'Tầm nhìn',
    hint: 'Section tầm nhìn công ty',
    format: '{"title": "Tiêu đề", "p1": "Đoạn 1", "p2": "Đoạn 2"}',
  },
  architecture: {
    label: 'Kiến trúc / Mục tiêu',
    hint: 'Section mô tả định hướng, chiến lược',
    format: '{"title": "Tiêu đề", "p1": "Đoạn 1", "p2": "Đoạn 2"}',
  },
  hospitality: {
    label: 'Lý do chọn chúng tôi',
    hint: 'Section giải thích tại sao chọn Elevate Media',
    format: '{"title": "Tiêu đề", "p1": "Nội dung 1", "p2": "Nội dung 2"}',
  },
  emotional: {
    label: 'Triết lý / Cảm hứng',
    hint: 'Đoạn kết thúc cảm xúc, thương hiệu',
    format: '{"title": "Tiêu đề", "p1": "Đoạn 1", "p2": "Đoạn 2"}',
  },
  events: {
    label: 'Danh sách loại sự kiện',
    hint: 'Các loại sự kiện hiển thị trên trang Lifestyle Events',
    format: 'Nhập văn bản hoặc JSON tuỳ cấu trúc trang',
  },
  inquiry: {
    label: 'Form yêu cầu báo giá',
    hint: 'Tiêu đề và mô tả của form yêu cầu sự kiện',
    format: '{"title": "Tiêu đề form", "subtitle": "Mô tả ngắn"}',
  },
  capacity: {
    label: 'Sức chứa / Quy trình',
    hint: 'Thông tin quy trình làm việc hoặc sức chứa',
    format: '{"title": "Tiêu đề", "items": [...]}',
  },
  culture: {
    label: 'Văn hoá công ty',
    hint: 'Mô tả văn hoá làm việc tại Elevate Media',
    format: '{"title": "Tiêu đề", "p1": "Đoạn 1", "p2": "Đoạn 2"}',
  },
  'open-application': {
    label: 'Đơn tự nguyện',
    hint: 'Section khuyến khích ứng viên gửi đơn tự nguyện',
    format: '{"title": "Tiêu đề", "body": "Mô tả", "cta": "Text nút"}',
  },
  info: {
    label: 'Thông tin liên hệ',
    hint: 'Địa chỉ, email, SĐT, giờ làm việc hiển thị trang contact',
    format: '{"phone": "0333...", "email": "...", "address": "...", "hours": "..."}',
  },
  form: {
    label: 'Tiêu đề form liên hệ',
    hint: 'Tiêu đề và mô tả của form gửi tin nhắn',
    format: '{"title": "Tiêu đề", "subtitle": "Mô tả"}',
  },
};

function SectionEditor({ pageKey, section, initialData }) {
  const { authHeader } = useAdmin();
  const [content_en, setContentEn] = useState(initialData?.content_en || '');
  const [content_vi, setContentVi] = useState(initialData?.content_vi || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setContentEn(initialData?.content_en || '');
    setContentVi(initialData?.content_vi || '');
  }, [initialData]);

  async function handleSave() {
    setSaving(true);
    setError(false);
    try {
      await api.put(
        `/api/admin/content/${pageKey}/${section}`,
        { content_en, content_vi },
        { headers: authHeader() }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 3000);
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

  const hint = SECTION_HINTS[section];

  return (
    <div style={{
      background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8,
      overflow: 'hidden', marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: '14px 18px', background: '#fafafa', borderBottom: '1px solid #e4e4e7',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#111', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {hint?.label || section}
            </span>
            <span style={{ fontSize: 10, color: '#9ca3af', background: '#f3f4f6', padding: '1px 6px', borderRadius: 4 }}>
              {section}
            </span>
          </div>
          {hint && (
            <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{hint.hint}</p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '6px 18px', flexShrink: 0, marginLeft: 12,
            background: error ? '#dc2626' : saved ? '#16a34a' : saving ? '#9ca3af' : '#C9A96E',
            border: 'none', borderRadius: 6, fontSize: 12,
            cursor: saving ? 'not-allowed' : 'pointer',
            color: (saved || error) ? '#fff' : '#111', fontWeight: 600,
            transition: 'background 0.2s',
          }}
        >
          {error ? '✕ Lỗi' : saved ? '✓ Đã lưu' : saving ? 'Đang lưu...' : '💾 Lưu'}
        </button>
      </div>

      {/* Format hint */}
      {hint?.format && (
        <div style={{ padding: '8px 18px', background: '#fffbeb', borderBottom: '1px solid #fef3c7' }}>
          <span style={{ fontSize: 11, color: '#92400e' }}>
            <strong>Format:</strong>{' '}
            <code style={{ background: '#fef3c7', padding: '1px 6px', borderRadius: 3, fontSize: 11 }}>{hint.format}</code>
          </span>
        </div>
      )}

      {/* Editors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <div style={{ padding: '14px 18px', borderRight: '1px solid #e4e4e7' }}>
          <label style={{ fontSize: 10, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            🇬🇧 Tiếng Anh (EN)
          </label>
          <textarea
            style={{ ...textareaStyle, height: 110 }}
            value={content_en}
            onChange={e => setContentEn(e.target.value)}
            placeholder={hint?.format || '{"title": "...", "subtitle": "..."}'}
          />
        </div>
        <div style={{ padding: '14px 18px' }}>
          <label style={{ fontSize: 10, color: '#6b7280', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            🇻🇳 Tiếng Việt (VI)
          </label>
          <textarea
            style={{ ...textareaStyle, height: 110 }}
            value={content_vi}
            onChange={e => setContentVi(e.target.value)}
            placeholder={hint?.format?.replace(/[A-Za-z]+/g, '...') || '{"title": "...", "subtitle": "..."}'}
          />
        </div>
      </div>
    </div>
  );
}

function ImageAddModal({ pageKey, imageSections, onAdd, onCancel }) {
  const { authHeader } = useAdmin();
  const [form, setForm] = useState({ section: imageSections[0] || '', label: '', url: '', sort_order: 0 });
  const [saving, setSaving] = useState(false);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/api/admin/images', { ...form, page: pageKey }, { headers: authHeader() });
      onAdd(res.data);
    } catch {
      // parent handles toast
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: '100%', background: '#fafafa', border: '1px solid #ddd', borderRadius: 4,
    padding: '8px 12px', fontSize: 13, fontFamily: 'Montserrat, sans-serif',
    boxSizing: 'border-box', outline: 'none', color: '#111',
  };
  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 600, color: '#555',
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5,
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 8, width: '100%', maxWidth: 560,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 28px', borderBottom: '1px solid #eee',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111' }}>Thêm Hình Ảnh</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Khu vực</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.section}
                onChange={e => set('section', e.target.value)}>
                {imageSections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Nhãn</label>
              <input style={inputStyle} value={form.label} placeholder="e.g. Hero Banner"
                onChange={e => set('label', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Thứ tự</label>
              <input type="number" style={inputStyle} value={form.sort_order}
                onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <ImageUpload
              label="Hình ảnh"
              value={form.url}
              onChange={url => set('url', url)}
              required
            />
          </div>
          <div style={{
            marginTop: 24, display: 'flex', gap: 10, justifyContent: 'flex-end',
            paddingTop: 16, borderTop: '1px solid #eee',
          }}>
            <button type="button" onClick={onCancel} style={{
              padding: '9px 20px', background: '#fff', border: '1px solid #ddd',
              borderRadius: 4, fontSize: 13, cursor: 'pointer', color: '#444',
            }}>Hủy</button>
            <button type="submit" disabled={saving} style={{
              padding: '9px 24px', background: saving ? '#888' : '#C9A96E',
              border: 'none', borderRadius: 4, fontSize: 13,
              cursor: saving ? 'not-allowed' : 'pointer', color: '#111', fontWeight: 600,
            }}>
              {saving ? 'Đang thêm...' : 'Thêm Hình Ảnh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImageEditModal({ image, imageSections, onSave, onCancel }) {
  const { authHeader } = useAdmin();
  const [form, setForm] = useState({ ...image });
  const [saving, setSaving] = useState(false);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/api/admin/images/${image.id}`, form, { headers: authHeader() });
      onSave(res.data);
    } catch {
      // parent handles toast
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: '100%', background: '#fafafa', border: '1px solid #ddd', borderRadius: 4,
    padding: '8px 12px', fontSize: 13, fontFamily: 'Montserrat, sans-serif',
    boxSizing: 'border-box', outline: 'none', color: '#111',
  };
  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 600, color: '#555',
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5,
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 8, width: '100%', maxWidth: 560,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 28px', borderBottom: '1px solid #eee',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111' }}>Sửa Hình Ảnh</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Khu vực</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.section}
                onChange={e => set('section', e.target.value)}>
                {imageSections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Nhãn</label>
              <input style={inputStyle} value={form.label || ''} placeholder="e.g. Hero Banner"
                onChange={e => set('label', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Thứ tự</label>
              <input type="number" style={inputStyle} value={form.sort_order}
                onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <ImageUpload
              label="Hình ảnh"
              value={form.url}
              onChange={url => set('url', url)}
              required
            />
          </div>
          <div style={{
            marginTop: 24, display: 'flex', gap: 10, justifyContent: 'flex-end',
            paddingTop: 16, borderTop: '1px solid #eee',
          }}>
            <button type="button" onClick={onCancel} style={{
              padding: '9px 20px', background: '#fff', border: '1px solid #ddd',
              borderRadius: 4, fontSize: 13, cursor: 'pointer', color: '#444',
            }}>Hủy</button>
            <button type="submit" disabled={saving} style={{
              padding: '9px 24px', background: saving ? '#888' : '#C9A96E',
              border: 'none', borderRadius: 4, fontSize: 13,
              cursor: saving ? 'not-allowed' : 'pointer', color: '#111', fontWeight: 600,
            }}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ContentTab({ pageKey, contentSections }) {
  const { authHeader } = useAdmin();
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchContent = useCallback(async () => {
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
  }, [pageKey, authHeader]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Đang tải...</div>
      ) : (
        <div>
          <p style={{ fontSize: 12, color: '#999', margin: '0 0 16px' }}>
            {contentSections.length} khu vực nội dung
          </p>
          {contentSections.map(section => (
            <SectionEditor
              key={`${pageKey}-${section}`}
              pageKey={pageKey}
              section={section}
              initialData={contentMap[section]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ImagesTab({ pageKey, imageSections }) {
  const { authHeader } = useAdmin();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/images/${pageKey}`, { headers: authHeader() });
      setImages(res.data);
    } catch {
      showToast('Không thể tải hình ảnh', 'error');
    } finally {
      setLoading(false);
    }
  }, [pageKey, authHeader]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  function handleAdded(img) {
    setImages(prev => [...prev, img]);
    setShowAdd(false);
    showToast('Đã thêm hình ảnh');
  }

  function handleEdited(img) {
    setImages(prev => prev.map(i => i.id === img.id ? img : i));
    setEditImage(null);
    showToast('Đã cập nhật hình ảnh');
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/api/admin/images/${id}`, { headers: authHeader() });
      setImages(prev => prev.filter(i => i.id !== id));
      showToast('Đã xóa hình ảnh');
    } catch {
      showToast('Không thể xóa hình ảnh', 'error');
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: '9px 20px', background: '#111', border: 'none', borderRadius: 4,
            color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
          }}
        >
          + Thêm Hình Ảnh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Đang tải...</div>
      ) : images.length === 0 ? (
        <div style={{
          background: '#fff', border: '2px dashed #e5e5e5', borderRadius: 8,
          padding: 48, textAlign: 'center', color: '#aaa',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🖼</div>
          <p style={{ margin: 0, fontSize: 14 }}>Chưa có ảnh nào cho trang này.</p>
          <p style={{ margin: '6px 0 0', fontSize: 12 }}>Nhấn "Thêm Hình Ảnh" để bắt đầu.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {images.map(img => (
            <div key={img.id} style={{
              background: '#fff', border: '1px solid #e5e5e5', borderRadius: 6,
              overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <div style={{ position: 'relative', paddingTop: '66%', background: '#f5f5f5' }}>
                <img
                  src={img.url}
                  alt={img.label || ''}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentNode.style.background = '#f0f0f0';
                  }}
                />
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#111', marginBottom: 2, wordBreak: 'break-word' }}>
                  {img.label || 'Chưa đặt tên'}
                </div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>
                  Khu vực: <span style={{ color: '#555' }}>{img.section}</span>
                </div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>
                  Thứ tự: {img.sort_order}
                </div>
                <div style={{ fontSize: 10, color: '#aaa', wordBreak: 'break-all', marginBottom: 10, lineHeight: 1.4 }}>
                  {img.url.length > 50 ? img.url.slice(0, 50) + '...' : img.url}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setEditImage(img)}
                    style={{
                      flex: 1, padding: '5px', background: '#fff', border: '1px solid #C9A96E',
                      borderRadius: 3, fontSize: 11, cursor: 'pointer', color: '#C9A96E',
                    }}
                  >Sửa</button>
                  <button
                    onClick={() => setDeleteId(img.id)}
                    style={{
                      flex: 1, padding: '5px', background: '#fff', border: '1px solid #fca5a5',
                      borderRadius: 3, fontSize: 11, cursor: 'pointer', color: '#ef4444',
                    }}
                  >Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <ImageAddModal
          pageKey={pageKey}
          imageSections={imageSections}
          onAdd={handleAdded}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {editImage && (
        <ImageEditModal
          image={editImage}
          imageSections={imageSections}
          onSave={handleEdited}
          onCancel={() => setEditImage(null)}
        />
      )}

      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: 8, padding: '28px 32px', maxWidth: 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <h4 style={{ margin: '0 0 12px', color: '#111' }}>Xóa Hình Ảnh?</h4>
            <p style={{ margin: '0 0 20px', color: '#555', fontSize: 13 }}>
              Bạn có chắc muốn xóa? Hành động này không thể hoàn tác.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{
                padding: '8px 18px', background: '#fff', border: '1px solid #ddd',
                borderRadius: 4, cursor: 'pointer', fontSize: 13,
              }}>Hủy</button>
              <button onClick={() => handleDelete(deleteId)} style={{
                padding: '8px 18px', background: '#ef4444', border: 'none',
                borderRadius: 4, cursor: 'pointer', color: '#fff', fontSize: 13,
              }}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PageManager({ pageKey, contentSections, imageSections, title, description }) {
  const [activeTab, setActiveTab] = useState('content');

  const tabs = [
    { key: 'content', label: 'Nội Dung' },
    { key: 'images', label: 'Hình Ảnh' },
  ];

  function tabStyle(key) {
    const isActive = activeTab === key;
    return {
      padding: '9px 20px',
      background: isActive ? '#111' : '#fff',
      color: isActive ? '#fff' : '#555',
      border: '1px solid',
      borderColor: isActive ? '#111' : '#e5e5e5',
      borderRadius: 4,
      cursor: 'pointer',
      fontSize: 13,
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: isActive ? 600 : 400,
      transition: 'all 0.15s',
    };
  }

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>{title}</h3>
        {description && (
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>{description}</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.key} style={tabStyle(t.key)} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'content' && (
        <ContentTab pageKey={pageKey} contentSections={contentSections} />
      )}
      {activeTab === 'images' && (
        <ImagesTab pageKey={pageKey} imageSections={imageSections} />
      )}
    </div>
  );
}
