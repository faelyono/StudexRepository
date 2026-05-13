import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:'1rem', background:'var(--bg)' }}>
      <Logo size={48} />
      <span style={{ fontSize:'0.65rem', color:'var(--text3)', fontFamily:'var(--mono)', letterSpacing:'0.12em' }}>LOADING…</span>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}
