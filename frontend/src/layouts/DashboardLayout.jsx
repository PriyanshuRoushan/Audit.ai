import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Settings, LogOut, CheckSquare } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', borderRight: '1px solid #334155', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px', fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
          Audit.ai
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#334155'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/dashboard/audits" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#334155'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <CheckSquare size={20} />
            Audits
          </Link>
          <Link to="/dashboard/forms" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#334155'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <FileText size={20} />
            Forms
          </Link>
          {user?.role === 'Admin' && (
            <Link to="/dashboard/settings" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', textDecoration: 'none', padding: '12px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#334155'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <Settings size={20} />
              Admin Panel
            </Link>
          )}
        </nav>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '24px', marginTop: 'auto' }}>
          <div style={{ marginBottom: '16px', fontSize: '14px', color: '#94a3b8' }}>
            Logged in as {user?.role}
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '12px', width: '100%', borderRadius: '8px', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#334155'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
