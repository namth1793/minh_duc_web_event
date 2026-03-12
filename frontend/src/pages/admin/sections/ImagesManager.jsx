import { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/api';
import { useAdmin } from '../../../context/AdminContext';
import ImageUpload from '../../../components/ImageUpload';

const PAGES = [
  { key: 'home', label: 'Trang Chủ', sections: ['hero', 'about', 'services', 'mission'] },
  { key: 'brand-story', label: 'Câu Chuyện', sections: ['hero', 'vision', 'architecture', 'hospitality'] },
  { key: 'lifestyle-events', label: 'Sự Kiện', sections: ['hero', 'events'] },
  { key: 'business-events', label: 'Booth & Livestream', sections: ['hero', 'services'] },
  { key: 'blog', label: 'Blog', sections: ['hero'] },
  { key: 'careers', label: 'Tuyển Dụng', sections: ['hero', 'culture'] },
  { key: 'contact', label: 'Liên Hệ', sections: ['hero'] },
  { key: 'service-event', label: 'DV: Sự Kiện', sections: ['hero'] },
  { key: 'service-booth', label: 'DV: Booth', sections: ['hero'] },
  { key: 'service-livestream', label: 'DV: Livestream', sections: ['hero'] },
  { key: 'service-creative', label: 'DV: Creative', sections: ['hero'] },
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

const EMPTY_FORM = { section: '', label: '', url: '', sort_order: 0 };

function AddImageForm({ page, sections, onAdd, onCancel }) {
  const { authHeader } = useAdmin();
  const [form, setForm] = useState({ ...EMPTY_FORM, section: sections[0] || '' });
  const [saving, setSaving] = useState(false);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/api/admin/images', { ...form, page }, { headers: authHeader() });
      onAdd(res.data);
    } catch {
      // parent handles
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
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
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

function EditImageModal({ image, sections, onSave, onCancel }) {
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
      // parent handles
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
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
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

export default function ImagesManager() {
  const { authHeader } = useAdmin();
  const [activePage, setActivePage] = useState('home');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const pageConfig = PAGES.find(p => p.key === activePage);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchImages = useCallback(async (pageKey) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/images/${pageKey}`, { headers: authHeader() });
      setImages(res.data);
    } catch {
      showToast('Không thể tải hình ảnh', 'error');
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => {
    fetchImages(activePage);
  }, [activePage, fetchImages]);

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
      showToast('Không thể xóa', 'error');
    } finally {
      setDeleteId(null);
    }
  }

  const tabStyle = (key) => ({
    padding: '7px 14px',
    background: activePage === key ? '#111' : '#fff',
    color: activePage === key ? '#fff' : '#555',
    border: '1px solid', borderColor: activePage === key ? '#111' : '#e5e5e5',
    borderRadius: 4, cursor: 'pointer', fontSize: 12,
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: activePage === key ? 600 : 400,
    whiteSpace: 'nowrap',
  });

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Hình Ảnh Trang</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>Quản lý hình ảnh theo URL, phân loại theo trang và khu vực.</p>
        </div>
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

      {/* Page tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {PAGES.map(p => (
          <button key={p.key} style={tabStyle(p.key)} onClick={() => setActivePage(p.key)}>
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Đang tải...</div>
      ) : images.length === 0 ? (
        <div style={{
          background: '#fff', border: '2px dashed #e5e5e5', borderRadius: 8,
          padding: 48, textAlign: 'center', color: '#aaa',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🖼</div>
          <p style={{ margin: 0, fontSize: 14 }}>Chưa có ảnh nào cho {pageConfig?.label}.</p>
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
                <img src={img.url} alt={img.label || ''}
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
        <AddImageForm
          page={activePage}
          sections={pageConfig?.sections || []}
          onAdd={handleAdded}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {editImage && (
        <EditImageModal
          image={editImage}
          sections={pageConfig?.sections || []}
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
            <p style={{ margin: '0 0 20px', color: '#555', fontSize: 13 }}>Bạn có chắc muốn xóa? Hành động này không thể hoàn tác.</p>
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
