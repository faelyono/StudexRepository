import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

export default function Login() {
  const [tab, setTab]         = useState('login');
  const [form, setForm]       = useState({ name:'', email:'', password:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register }   = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (tab === 'login') { await login({ email: form.email, password: form.password }); navigate('/dashboard'); }
      else { await register(form); navigate('/courses'); }
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight:'100vh', background:'var(--bg)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      position:'relative', overflow:'hidden',
    }}>
      {/* Background wave lines */}
      <div style={{
        position:'absolute', inset:0, opacity:0.12, pointerEvents:'none',
        backgroundImage:`repeating-linear-gradient(
          -35deg,
          transparent,
          transparent 80px,
          rgba(37,99,235,0.3) 80px,
          rgba(37,99,235,0.3) 82px
        )`,
      }}/>
      <div style={{
        position:'absolute', inset:0, opacity:0.07, pointerEvents:'none',
        backgroundImage:`repeating-linear-gradient(
          35deg,
          transparent,
          transparent 120px,
          rgba(6,204,240,0.5) 120px,
          rgba(6,204,240,0.5) 121px
        )`,
      }}/>
      {/* Glow */}
      <div style={{
        position:'absolute', width:600, height:400, top:'10%', left:'50%',
        transform:'translateX(-50%)',
        background:'radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 70%)',
        pointerEvents:'none',
      }}/>

      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'2rem', position:'relative', zIndex:1 }}>
        <Logo size={42} />
        <span style={{ fontFamily:'var(--sans)', fontWeight:800, fontSize:'1.5rem', letterSpacing:'-0.01em', color:'var(--text)' }}>
          Studex
        </span>
      </div>

      {/* Form card */}
      <div style={{
        width:'100%', maxWidth:420, position:'relative', zIndex:1,
        background:'rgba(11,17,32,0.85)',
        backdropFilter:'blur(20px)',
        border:'1px solid var(--border)',
        borderRadius:'var(--r-xl)',
        padding:'2rem',
        boxShadow:'0 24px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Tabs */}
        <div style={{
          display:'flex', marginBottom:'1.8rem',
          background:'var(--surface2)', borderRadius:'var(--r-sm)',
          padding:'0.25rem',
        }}>
          {['login','register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }} style={{
              flex:1, padding:'0.55rem', borderRadius:'calc(var(--r-sm) - 2px)',
              border:'none', cursor:'pointer', fontFamily:'var(--sans)',
              fontWeight:600, fontSize:'0.82rem', transition:'all 0.18s',
              background: tab===t ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: tab===t ? 'var(--blue-light)' : 'var(--text3)',
            }}>
              {t === 'login' ? 'Log In' : 'Register'}
            </button>
          ))}
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {tab === 'register' && (
            <div>
              <label>Full Name</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)', color:'var(--text3)', fontSize:'0.85rem' }}>◎</span>
                <input placeholder="Ada Lovelace" value={form.name}
                  onChange={e => setForm(f => ({...f,name:e.target.value}))}
                  style={{ paddingLeft:'2.2rem' }} required />
              </div>
            </div>
          )}

          <div>
            <label>Operational ID (Email)</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)', color:'var(--text3)', fontSize:'0.8rem' }}>✉</span>
              <input type="email" placeholder="competitor@studex.io"
                value={form.email} onChange={e => setForm(f => ({...f,email:e.target.value}))}
                style={{ paddingLeft:'2.2rem' }} required />
            </div>
          </div>

          <div>
            <label>Access Code (Password)</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)', color:'var(--text3)', fontSize:'0.85rem' }}>⊙</span>
              <input type="password" placeholder="••••••••••••"
                value={form.password} onChange={e => setForm(f => ({...f,password:e.target.value}))}
                style={{ paddingLeft:'2.2rem' }} minLength={8} required />
            </div>
          </div>

          {tab === 'login' && (
            <div style={{ textAlign:'right', marginTop:'-0.5rem' }}>
              <span style={{ fontSize:'0.72rem', color:'var(--text3)', cursor:'pointer' }}>Recover Access Code?</span>
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{
            width:'100%', justifyContent:'center', padding:'0.85rem',
            fontSize:'0.82rem', letterSpacing:'0.06em', textTransform:'uppercase', marginTop:'0.25rem',
          }}>
            {loading ? 'Initializing…' : tab==='login' ? 'Initialize Session →' : 'Create Account →'}
          </button>
        </form>

        <div style={{ marginTop:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
            <div style={{ flex:1, height:1, background:'var(--border)' }}/>
            <span style={{ fontSize:'0.65rem', color:'var(--text3)', letterSpacing:'0.08em' }}>EXTERNAL AUTH</span>
            <div style={{ flex:1, height:1, background:'var(--border)' }}/>
          </div>
          <div style={{ display:'flex', gap:'0.75rem' }}>
            {['⊙ Google', '⊞ Apple'].map(p => (
              <button key={p} className="btn btn-ghost" style={{ flex:1, justifyContent:'center', fontSize:'0.78rem' }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p style={{ marginTop:'1.5rem', fontSize:'0.65rem', color:'var(--text3)', position:'relative', zIndex:1 }}>
        Secured by <strong style={{ color:'var(--text2)' }}>Studex Core Grid</strong>. v2.4.1
      </p>
    </div>
  );
}
