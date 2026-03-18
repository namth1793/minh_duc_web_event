import { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/api';
import { useAdmin } from '../../../context/AdminContext';

function formatDate(str) {
  if (!str) return '—';
  try {
    return new Date(str).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return str;
  }
}

function Badge({ text }) {
  return (
    <span style={{
      background: '#f0f0f0', padding: '2px 8px', borderRadius: 3,
      fontSize: 11, color: '#555', whiteSpace: 'nowrap',
    }}>{text || '—'}</span>
  );
}

function Table({ headers, rows, renderRow, loading, empty }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 6, overflow: 'hidden' }}>
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Đang tải...</div>
      ) : rows.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>
          {empty || 'Chưa có dữ liệu.'}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee', background: '#fafafa' }}>
                {headers.map(h => (
                  <th key={h} style={{
                    padding: '11px 14px', textAlign: 'left', fontSize: 11,
                    fontWeight: 600, color: '#666', letterSpacing: '0.08em',
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => renderRow(row, idx))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CellText({ primary, secondary }) {
  return (
    <td style={{ padding: '10px 14px', verticalAlign: 'top' }}>
      <div style={{ fontSize: 13, color: '#111' }}>{primary || '—'}</div>
      {secondary && <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{secondary}</div>}
    </td>
  );
}

function MessageCell({ text }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return <td style={{ padding: '10px 14px', color: '#aaa', fontSize: 12 }}>—</td>;
  const short = text.length > 60 ? text.slice(0, 60) + '...' : text;
  return (
    <td style={{ padding: '10px 14px', maxWidth: 240 }}>
      <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>
        {expanded ? text : short}
      </div>
      {text.length > 60 && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            background: 'none', border: 'none', color: '#C9A96E', fontSize: 11,
            cursor: 'pointer', padding: '2px 0', fontFamily: 'Montserrat, sans-serif',
          }}
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </td>
  );
}

function ContactsTab() {
  const { authHeader } = useAdmin();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/contacts', { headers: authHeader() });
      setContacts(res.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  return (
    <div>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: '#888' }}>
        Chỉ xem. {contacts.length} form liên hệ nhận được.
      </p>
      <Table
        loading={loading}
        rows={contacts}
        empty="Chưa có form liên hệ nào."
        headers={['Họ tên', 'Email', 'Điện thoại', 'Ngày sự kiện', 'Tin nhắn', 'Ngày gửi']}
        renderRow={(row, idx) => (
          <tr key={row.id}
            style={{ borderBottom: idx < contacts.length - 1 ? '1px solid #f0f0f0' : 'none' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <CellText primary={row.name} />
            <CellText primary={row.email} />
            <CellText primary={row.phone} />
            <CellText primary={row.event_date} />
            <MessageCell text={row.message} />
            <td style={{ padding: '10px 14px', fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>
              {formatDate(row.created_at)}
            </td>
          </tr>
        )}
      />
    </div>
  );
}

function InquiriesTab() {
  const { authHeader } = useAdmin();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/inquiries', { headers: authHeader() });
      setInquiries(res.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  return (
    <div>
      <p style={{ margin: '0 0 16px', fontSize: 13, color: '#888' }}>
        Chỉ xem. {inquiries.length} yêu cầu sự kiện nhận được.
      </p>
      <Table
        loading={loading}
        rows={inquiries}
        empty="Chưa có yêu cầu sự kiện nào."
        headers={['Họ tên', 'Email', 'Điện thoại', 'Ngày sự kiện', 'Số khách', 'Thông tin', 'Ngày gửi']}
        renderRow={(row, idx) => (
          <tr key={row.id}
            style={{ borderBottom: idx < inquiries.length - 1 ? '1px solid #f0f0f0' : 'none' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <CellText primary={row.name} />
            <CellText primary={row.email} />
            <CellText primary={row.phone} />
            <CellText primary={row.event_date} />
            <td style={{ padding: '10px 14px' }}>
              <Badge text={row.guests} />
            </td>
            <MessageCell text={row.info} />
            <td style={{ padding: '10px 14px', fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>
              {formatDate(row.created_at)}
            </td>
          </tr>
        )}
      />
    </div>
  );
}

function GuideBox() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, marginBottom: 20 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1d4ed8' }}>📖 Hướng dẫn — Quản lý Liên Hệ</span>
        <span style={{ fontSize: 11, color: '#6b7280', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #bfdbfe' }}>
          <p style={{ fontSize: 13, color: '#1e40af', margin: '12px 0 8px' }}>
            Trang này chỉ <strong>xem dữ liệu</strong> — hiển thị tất cả form khách hàng gửi qua website.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tab: Form Liên Hệ</p>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#374151', lineHeight: 1.7 }}>
                <li>Nguồn: form tại trang <strong>/contact</strong></li>
                <li>Thông tin: họ tên, email, SĐT, ngày sự kiện, tin nhắn</li>
                <li>Nhấn "Xem thêm" để đọc nội dung đầy đủ</li>
              </ul>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tab: Yêu Cầu Sự Kiện</p>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#374151', lineHeight: 1.7 }}>
                <li>Nguồn: form tại trang <strong>/lifestyle-events</strong></li>
                <li>Thông tin: họ tên, email, SĐT, ngày sự kiện, số khách, mô tả</li>
                <li>Liên hệ lại qua email hoặc SĐT trong danh sách</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactManager() {
  const [activeTab, setActiveTab] = useState('contacts');

  const tabs = [
    { key: 'contacts', label: 'Form Liên Hệ' },
    { key: 'inquiries', label: 'Yêu Cầu Sự Kiện' },
  ];

  function tabStyle(key) {
    const isActive = activeTab === key;
    return {
      padding: '9px 18px',
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
      <GuideBox />
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Liên Hệ</h3>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>
          Chỉ xem. Tất cả form gửi từ website công khai.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.key} style={tabStyle(t.key)} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'contacts' && <ContactsTab />}
      {activeTab === 'inquiries' && <InquiriesTab />}
    </div>
  );
}
