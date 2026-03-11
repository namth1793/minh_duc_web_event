import { useRef, useState } from 'react';
import api from '../lib/api';
import { useAdmin } from '../context/AdminContext';

/**
 * ImageUpload — chọn file ảnh, upload lên Cloudinary qua backend,
 * trả về URL qua onChange(url).
 *
 * Props:
 *   value      — URL hiện tại (string)
 *   onChange   — callback(url: string)
 *   label      — nhãn hiển thị (optional)
 *   required   — boolean (optional)
 */
export default function ImageUpload({ value, onChange, label = 'Hình ảnh', required = false }) {
  const { authHeader } = useAdmin();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận file ảnh (jpg, png, webp, ...)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File quá lớn. Tối đa 10MB.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/api/admin/upload', formData, {
        headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.url);
    } catch {
      setError('Upload thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e) {
    handleFile(e.target.files[0]);
    // reset input để có thể chọn lại cùng file
    e.target.value = '';
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 600,
    color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
  };

  const dropZoneStyle = {
    border: `2px dashed ${dragOver ? '#C9A96E' : uploading ? '#aaa' : '#ddd'}`,
    borderRadius: 6,
    padding: '20px 16px',
    textAlign: 'center',
    cursor: uploading ? 'wait' : 'pointer',
    background: dragOver ? 'rgba(201,169,110,0.06)' : '#fafafa',
    transition: 'all 0.2s',
    position: 'relative',
  };

  return (
    <div>
      <label style={labelStyle}>{label}{required && <span style={{ color: '#ef4444' }}> *</span>}</label>

      {/* Preview */}
      {value && !uploading && (
        <div style={{ marginBottom: 10, position: 'relative', display: 'inline-block' }}>
          <img
            src={value}
            alt="preview"
            style={{ height: 120, maxWidth: '100%', objectFit: 'cover', borderRadius: 4, display: 'block' }}
            onError={e => (e.target.style.display = 'none')}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            title="Xóa ảnh"
            style={{
              position: 'absolute', top: 4, right: 4,
              background: 'rgba(0,0,0,0.6)', color: '#fff',
              border: 'none', borderRadius: '50%',
              width: 22, height: 22, fontSize: 13, lineHeight: '22px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>
      )}

      {/* Drop zone */}
      <div
        style={dropZoneStyle}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onInputChange}
        />
        {uploading ? (
          <div style={{ color: '#888', fontSize: 13 }}>
            <div style={{ marginBottom: 6, fontSize: 20 }}>⏳</div>
            Đang upload...
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 22, marginBottom: 6, color: '#C9A96E' }}>📁</div>
            <div style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>
              {value ? 'Nhấn để thay ảnh khác' : 'Nhấn hoặc kéo thả ảnh vào đây'}
            </div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>JPG, PNG, WEBP · Tối đa 10MB</div>
          </div>
        )}
      </div>

      {error && (
        <p style={{ margin: '6px 0 0', fontSize: 12, color: '#ef4444' }}>{error}</p>
      )}
    </div>
  );
}
