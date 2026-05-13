import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Topbar() {
  const { user } = useAuth();
  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="topbar-link">Stats</span>
        <span className="topbar-link">Rewards</span>
        <span className="topbar-link">Goals</span>
      </div>
      <div className="topbar-right">
        <div className="icon-btn" title="Streak">⚡</div>
        <div className="icon-btn" title="Notifications">◎</div>
        {user?.streak > 0 && (
          <div className="icon-btn" style={{ background: 'rgba(249,115,22,0.15)', color: '#FB923C', border: '1px solid rgba(249,115,22,0.25)', gap: '0.2rem', width: 'auto', padding: '0 0.6rem', borderRadius: 'var(--r-pill)', fontSize: '0.72rem' }}>
            🔥 {user.streak}
          </div>
        )}
        <Link to="/courses" className="study-now-btn" style={{ textDecoration: 'none' }}>
          ▶ Study Now
        </Link>
        {user && (
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg,#4338CA,#2563EB)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 800, color: '#fff', cursor: 'pointer',
          }}>
            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
