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
            cursor: 'pointer', padding: '2px 0', fontFamily: 'Inter, sans-serif',
          }}
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </td>
  );
}

export default function SubmissionsViewer() {
  const { authHeader } = useAdmin();
  const [tab, setTab] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState({ contacts: false, inquiries: false, applications: false });

  const fetchAll = useCallback(async () => {
    setLoading({ contacts: true, inquiries: true, applications: true });
    const headers = authHeader();

    api.get('/api/admin/contacts', { headers }).then(r => {
      setContacts(r.data);
      setLoading(prev => ({ ...prev, contacts: false }));
    }).catch(() => setLoading(prev => ({ ...prev, contacts: false })));

    api.get('/api/admin/inquiries', { headers }).then(r => {
      setInquiries(r.data);
      setLoading(prev => ({ ...prev, inquiries: false }));
    }).catch(() => setLoading(prev => ({ ...prev, inquiries: false })));

    api.get('/api/admin/applications', { headers }).then(r => {
      setApplications(r.data);
      setLoading(prev => ({ ...prev, applications: false }));
    }).catch(() => setLoading(prev => ({ ...prev, applications: false })));
  }, [authHeader]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const tabs = [
    { key: 'contacts', label: 'Form Liên Hệ', count: contacts.length },
    { key: 'inquiries', label: 'Yêu Cầu Sự Kiện', count: inquiries.length },
    { key: 'applications', label: 'Đơn Ứng Tuyển', count: applications.length },
  ];

  const tabStyle = (key) => ({
    padding: '9px 18px',
    background: tab === key ? '#111' : '#fff',
    color: tab === key ? '#fff' : '#555',
    border: '1px solid', borderColor: tab === key ? '#111' : '#e5e5e5',
    borderRadius: 4, cursor: 'pointer', fontSize: 13,
    fontFamily: 'Inter, sans-serif',
    fontWeight: tab === key ? 600 : 400,
    display: 'flex', alignItems: 'center', gap: 8,
  });

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111' }}>Yêu Cầu Nhận Được</h3>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#888' }}>Chỉ xem. Tất cả form gửi từ website công khai.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} style={tabStyle(t.key)} onClick={() => setTab(t.key)}>
            {t.label}
            <span style={{
              background: tab === t.key ? 'rgba(255,255,255,0.25)' : '#f0f0f0',
              color: tab === t.key ? '#fff' : '#666',
              padding: '1px 7px', borderRadius: 10, fontSize: 11, fontWeight: 600,
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Contact Forms */}
      {tab === 'contacts' && (
        <Table
          loading={loading.contacts}
          rows={contacts}
          empty="Chưa có form liên hệ nào."
          headers={['Họ tên', 'Email', 'Điện thoại', 'Ngày sự kiện', 'Số khách', 'Tin nhắn', 'Ngày gửi']}
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
              <td style={{ padding: '10px 14px' }}><Badge text={row.attendees} /></td>
              <MessageCell text={row.message} />
              <td style={{ padding: '10px 14px', fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>
                {formatDate(row.created_at)}
              </td>
            </tr>
          )}
        />
      )}

      {/* Event Inquiries */}
      {tab === 'inquiries' && (
        <Table
          loading={loading.inquiries}
          rows={inquiries}
          empty="Chưa có yêu cầu sự kiện nào."
          headers={['Họ tên', 'Email', 'Điện thoại', 'Ngày sự kiện', 'Số khách', 'Nhận tin', 'Thông tin', 'Ngày gửi']}
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
              <CellText primary={row.guests} />
              <td style={{ padding: '10px 14px' }}>
                <span style={{
                  background: row.newsletter ? '#d1fae5' : '#f3f4f6',
                  color: row.newsletter ? '#065f46' : '#6b7280',
                  padding: '2px 8px', borderRadius: 3, fontSize: 11, fontWeight: 500,
                }}>
                  {row.newsletter ? 'Có' : 'Không'}
                </span>
              </td>
              <MessageCell text={row.info} />
              <td style={{ padding: '10px 14px', fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>
                {formatDate(row.created_at)}
              </td>
            </tr>
          )}
        />
      )}

      {/* Career Applications */}
      {tab === 'applications' && (
        <Table
          loading={loading.applications}
          rows={applications}
          empty="Chưa có đơn ứng tuyển nào."
          headers={['Họ tên', 'Email', 'Điện thoại', 'Vị trí ứng tuyển', 'Tin nhắn', 'Ngày gửi']}
          renderRow={(row, idx) => (
            <tr key={row.id}
              style={{ borderBottom: idx < applications.length - 1 ? '1px solid #f0f0f0' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <CellText primary={row.name} />
              <CellText primary={row.email} />
              <CellText primary={row.phone} />
              <td style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: 13, color: '#111' }}>{row.job_title_en || '—'}</div>
                {row.job_id && <div style={{ fontSize: 11, color: '#aaa' }}>ID: {row.job_id}</div>}
              </td>
              <MessageCell text={row.message} />
              <td style={{ padding: '10px 14px', fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>
                {formatDate(row.created_at)}
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
}
