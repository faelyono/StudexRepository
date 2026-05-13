import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const NAV = [
  { to: '/dashboard',   icon: '⊞', label: 'Dashboard'   },
  { to: '/courses',     icon: '◈', label: 'Courses'      },
  { to: '/study',       icon: '▣', label: 'Flashcards',  noLink: true },
  { to: '/tasks',       icon: '≡', label: 'Tasks'        },
  { to: '/leaderboard', icon: '◉', label: 'Leaderboard'  },
  { to: '/profile',     icon: '◎', label: 'Profile'      },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { pathname }     = useLocation();
  const navigate         = useNavigate();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Logo size={30} />
          <div>
            <div className="sidebar-logo-name">STUDEX</div>
            <div className="sidebar-tagline">Focused Competitor</div>
          </div>
        </Link>
      </div>

      {/* User card */}
      {user && (
        <div style={{ padding: '0.85rem 0.75rem 0.5rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            padding: '0.65rem 0.85rem',
            background: 'var(--surface2)',
            borderRadius: 'var(--r-sm)',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: 'var(--grad)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 800, color: '#fff',
            }}>
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>
                Lv.{user.level} · {user.xp.toLocaleString()} XP
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map(({ to, icon, label, noLink }) => {
          if (noLink) return null; // Flashcards go through course flow
          const active = pathname === to || (to !== '/dashboard' && pathname.startsWith(to));
          return (
            <Link key={to} to={to} className={`nav-item ${active ? 'active' : ''}`}>
              <span className="nav-icon" style={{ fontSize: '0.95rem' }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="upgrade-btn" onClick={() => {}}>
          <span>⊕</span> Upgrade to Pro
        </button>
        <button onClick={() => { logout(); navigate('/login'); }} style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text3)', fontSize: '0.72rem', marginTop: '0.7rem',
          fontFamily: 'var(--sans)', padding: '0.3rem', textAlign: 'center',
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text2)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
