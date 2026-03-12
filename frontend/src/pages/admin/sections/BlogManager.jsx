import { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/api';
import { useAdmin } from '../../../context/AdminContext';
import ImageUpload from '../../../components/ImageUpload';

const CATEGORIES = ['Sự Kiện', 'Booth & Triển Lãm', 'Livestream', 'Truyền Thông', 'Tin Tức'];

const EMPTY_FORM = {
  title_en: '', title_vi: '', category: 'Events', date: '',
  thumbnail: '', excerpt_en: '', excerpt_vi: '', content_en: '', content_vi: ''
};

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
      display: 'flex', alignItems: 'center', gap: 8
    }}>
      <span>{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  );
}

function FormModal({ post, onSave, onCancel, loading }) {
  const [form, setForm] = useState(post || EMPTY_FORM);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  const inputStyle = {
    width: '100%', background: '#fafafa', border: '1px solid #ddd',
    borderRadius: 4, padding: '8px 12px', fontSize: 13,
    fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box',
    outline: 'none', color: '#111',
  };
  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 600,
    color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase',
    marginBottom: 5,
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 8, width: '100%', maxWidth: 760,
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px', borderBottom: '1px solid #eee',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#111' }}>
            {post?.id ? 'Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
          </h3>
          <button onClick={onCancel} style={{
            background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888',
          }}>×</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '24px 28px', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Tiêu đề (EN)</label>
              <input style={inputStyle} value={form.title_en}
                onChange={e => set('title_en', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Tiêu đề (VI)</label>
              <input style={inputStyle} value={form.title_vi}
                onChange={e => set('title_vi', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Danh mục</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category}
                onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ngày đăng</label>
              <input type="date" style={inputStyle} value={form.date}
                onChange={e => set('date', e.target.value)} required />
            </div>
          </div>

          {/* Thumbnail */}
          <div style={{ marginTop: 16 }}>
            <ImageUpload
              label="Ảnh đại diện"
              value={form.thumbnail}
              onChange={url => set('thumbnail', url)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <label style={labelStyle}>Tóm tắt (EN)</label>
              <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={form.excerpt_en}
                onChange={e => set('excerpt_en', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Tóm tắt (VI)</label>
              <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} value={form.excerpt_vi}
                onChange={e => set('excerpt_vi', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Nội dung (EN) — hỗ trợ HTML</label>
              <textarea style={{ ...inputStyle, height: 160, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }}
                value={form.content_en}
                onChange={e => set('content_en', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Nội dung (VI) — hỗ trợ HTML</label>
              <textarea style={{ ...inputStyle, height: 160, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }}
                value={form.content_vi}
                onChange={e => set('content_vi', e.target.value)} required />
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 24, display: 'flex', gap: 10, justifyContent: 'flex-end',
            paddingTop: 16, borderTop: '1px solid #eee',
          }}>
            <button type="button" onClick={onCancel} style={{
              padding: '9px 20px', background: '#fff', border: '1px solid #ddd',
              borderRadius: 4, fontSize: 13, cursor: 'pointer', color: '#444',
            }}>
              Hủy
            </button>
            <button type="submit" disabled={loading} style={{
              padding: '9px 24px', background: loading ? '#888' : '#C9A96E',
              border: 'none', borderRadius: 4, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
              color: '#111', fontWeight: 600,
            }}>
              {loading ? 'Đang lưu...' : 'Lưu Bài Viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BlogManager() {
  const { authHeader } = useAdmin();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalPost, setModalPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/blog', { headers: authHeader() });
      setPosts(res.data);
    } catch {
      showToast('Không thể tải bài viết', 'error');
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function handleSave(form) {
    setSaving(true);
    try {
      if (form.id) {
        await api.put(`/api/admin/blog/${form.id}`, form, { headers: authHeader() });
        showToast('Đã cập nhật bài viết');
      } else {
        await api.post('/api/admin/blog', form, { headers: authHeader() });
        showToast('Đã tạo bài viết mới');
      }
      setShowModal(false);
      fetchPosts();
    } catch {
      showToast('Không thể lưu bài viết', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/api/admin/blog/${id}`, { headers: authHeader() });
      showToast('Đã xóa bài viết');
      setDeleteId(null);
      fetchPosts();
    } catch {
      showToast('Không thể xóa bài viết', 'error');
    }
  }

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Bài Viết</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>{posts.length} bài viết</p>
        </div>
        <button
          onClick={() => { setModalPost(null); setShowModal(true); }}
          style={{
            padding: '9px 20px', background: '#111', border: 'none', borderRadius: 4,
            color: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          + Thêm Mới
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 6, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Đang tải...</div>
        ) : posts.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Chưa có bài viết.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee', background: '#fafafa' }}>
                {['Tiêu đề (EN)', 'Danh mục', 'Ngày đăng', 'Thao tác'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: 11,
                    fontWeight: 600, color: '#666', letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post, idx) => (
                <tr key={post.id} style={{
                  borderBottom: idx < posts.length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {post.thumbnail && (
                        <img src={post.thumbnail} alt=""
                          style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 3 }}
                          onError={e => (e.target.style.display = 'none')}
                        />
                      )}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{post.title_en}</div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{post.title_vi}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: '#f0f0f0', padding: '2px 8px', borderRadius: 3,
                      fontSize: 11, color: '#555',
                    }}>{post.category}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#555' }}>{post.date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => { setModalPost(post); setShowModal(true); }}
                        style={{
                          padding: '5px 14px', background: '#fff', border: '1px solid #C9A96E',
                          borderRadius: 3, fontSize: 12, cursor: 'pointer', color: '#C9A96E',
                        }}
                      >Sửa</button>
                      <button
                        onClick={() => setDeleteId(post.id)}
                        style={{
                          padding: '5px 14px', background: '#fff', border: '1px solid #fca5a5',
                          borderRadius: 3, fontSize: 12, cursor: 'pointer', color: '#ef4444',
                        }}
                      >Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form modal */}
      {showModal && (
        <FormModal
          post={modalPost}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
          loading={saving}
        />
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: 8, padding: '28px 32px', maxWidth: 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <h4 style={{ margin: '0 0 12px', color: '#111' }}>Xóa Bài Viết?</h4>
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
