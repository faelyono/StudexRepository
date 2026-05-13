import { useEffect, useState } from 'react';
import { getGlobalLB, getCourses, getCourseLB } from '../api';
import { useAuth } from '../contexts/AuthContext';

const MEDALS = ['🥇','🥈','🥉'];
const RANK_COLORS = ['#FCD34D','#CBD5E1','#CD7C3C'];

export default function Leaderboard() {
  const { user } = useAuth();
  const [tab, setTab]         = useState('global');
  const [global, setGlobal]   = useState([]);
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [courseBoard, setCourseBoard] = useState([]);

  useEffect(() => {
    getGlobalLB().then(r => setGlobal(r.data));
    getCourses().then(r => setCourses(r.data.filter(c => c.enrolled)));
  }, []);

  const loadCourse = async (id) => {
    setSelected(id); setTab('course');
    const r = await getCourseLB(id);
    setCourseBoard(r.data);
  };

  const board  = tab === 'global' ? global : courseBoard;
  const myRank = board.findIndex(u => u.id === user?.id) + 1;
  const top3   = board.slice(0, 3);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 style={{ fontWeight:800, fontSize:'1.5rem', letterSpacing:'-0.02em', marginBottom:'0.2rem' }}>
          Competitor Rankings
        </h1>
        <p style={{ color:'var(--text3)', fontSize:'0.82rem' }}>
          XP is your rank. Study more, climb higher.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <button onClick={() => setTab('global')} style={{
          padding:'0.4rem 1rem', borderRadius:'var(--r-pill)',
          border:'1px solid var(--border)', cursor:'pointer',
          fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.75rem',
          background: tab==='global'?'rgba(59,130,246,0.15)':'var(--surface2)',
          color: tab==='global'?'var(--blue-light)':'var(--text2)',
          borderColor: tab==='global'?'var(--border2)':'var(--border)',
          transition:'all 0.15s',
        }}>🌍 Global</button>
        {courses.map(c => {
          const active = tab==='course' && selected===c.id;
          return (
            <button key={c.id} onClick={() => loadCourse(c.id)} style={{
              padding:'0.4rem 1rem', borderRadius:'var(--r-pill)',
              border:`1px solid ${active?'var(--border2)':'var(--border)'}`,
              cursor:'pointer', fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.75rem',
              background: active?'rgba(59,130,246,0.15)':'var(--surface2)',
              color: active?'var(--blue-light)':'var(--text2)',
              transition:'all 0.15s',
            }}>{c.title.split(' ')[0]}</button>
          );
        })}
      </div>

      {/* My rank banner */}
      {myRank > 0 && (
        <div style={{
          padding:'0.8rem 1.2rem', borderRadius:'var(--r)', marginBottom:'1rem',
          background:'rgba(37,99,235,0.1)', border:'1px solid rgba(59,130,246,0.2)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <span style={{ fontSize:'0.78rem', color:'var(--text2)' }}>Your rank in this board</span>
          <span style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'1.1rem', color:'var(--blue-light)' }}>#{myRank}</span>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'1.5rem' }}>
        {/* Main leaderboard table */}
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          {/* Header */}
          <div style={{
            display:'grid', gridTemplateColumns:'48px 1fr 100px 80px 70px',
            padding:'0.7rem 1.2rem', borderBottom:'1px solid var(--border)',
          }}>
            {['#','Competitor','XP','Level','Streak'].map(h => (
              <span key={h} className="section-title" style={{ marginBottom:0, textAlign:h==='XP'||h==='Level'||h==='Streak'?'right':'left' }}>{h}</span>
            ))}
          </div>

          {board.map((u, i) => {
            const isMe = u.id === user?.id;
            return (
              <div key={u.id} style={{
                display:'grid', gridTemplateColumns:'48px 1fr 100px 80px 70px',
                padding:'0.85rem 1.2rem', alignItems:'center',
                borderBottom:'1px solid var(--border)',
                background: isMe ? 'rgba(37,99,235,0.08)' : 'transparent',
                transition:'background 0.15s',
              }}
                onMouseEnter={e => { if(!isMe) e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}
                onMouseLeave={e => { if(!isMe) e.currentTarget.style.background='transparent'; }}>

                <span style={{ fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.85rem', color: RANK_COLORS[i]||'var(--text3)' }}>
                  {i<3 ? MEDALS[i] : String(i+1).padStart(2,'0')}
                </span>

                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                  <div style={{
                    width:28, height:28, borderRadius:'50%',
                    background: isMe ? 'var(--grad-btn)' : 'var(--surface3)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'0.62rem', fontWeight:700, color:'#fff', flexShrink:0,
                  }}>
                    {u.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'0.82rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                      {u.name}
                      {isMe && (
                        <span style={{
                          fontSize:'0.55rem', color:'var(--blue-light)',
                          background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.25)',
                          padding:'0.05rem 0.35rem', borderRadius:999,
                        }}>you</span>
                      )}
                    </div>
                    <div style={{ fontSize:'0.65rem', color:'var(--text3)' }}>Focused Competitor</div>
                  </div>
                </div>

                <div style={{ textAlign:'right', fontFamily:'var(--mono)', fontWeight:700, fontSize:'0.82rem', color:'var(--blue-light)' }}>
                  {u.xp.toLocaleString()}
                </div>
                <div style={{ textAlign:'right', fontFamily:'var(--mono)', fontSize:'0.72rem', color:'var(--text3)' }}>
                  Lv.{u.level}
                </div>
                <div style={{ textAlign:'right', fontFamily:'var(--mono)', fontSize:'0.72rem', color: u.streak>0?'#FB923C':'var(--text3)' }}>
                  {u.streak>0 ? `🔥${u.streak}d` : '—'}
                </div>
              </div>
            );
          })}

          {board.length === 0 && (
            <div style={{ padding:'3rem', textAlign:'center', color:'var(--text3)', fontSize:'0.78rem' }}>
              No entries yet — start studying to appear here.
            </div>
          )}
        </div>

        {/* Right: Top 3 podium */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          <div className="section-title">Top Competitors</div>

          {top3.map((u, i) => (
            <div key={u.id} className="card" style={{
              display:'flex', alignItems:'center', gap:'0.85rem',
              borderColor: i===0?'rgba(252,211,77,0.25)':'var(--border)',
              background: i===0?'rgba(252,211,77,0.04)':'var(--surface)',
              padding:'0.9rem 1rem',
            }}>
              <div style={{ fontSize:'1.4rem', flexShrink:0 }}>{MEDALS[i]}</div>
              <div style={{ minWidth:0, flex:1 }}>
                <div style={{ fontWeight:700, fontSize:'0.82rem', marginBottom:'0.1rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {u.name}
                  {u.id===user?.id && <span style={{ fontSize:'0.6rem', color:'var(--blue-light)', marginLeft:'0.4rem' }}>(you)</span>}
                </div>
                <div style={{ fontFamily:'var(--mono)', fontSize:'0.62rem', color:'var(--text3)' }}>
                  Lv.{u.level} · 🔥{u.streak}d
                </div>
              </div>
              <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.88rem', color: i===0?'#FCD34D':'var(--blue-light)', flexShrink:0 }}>
                {u.xp.toLocaleString()}
              </div>
            </div>
          ))}

          {top3.length === 0 && (
            <div className="card" style={{ textAlign:'center', padding:'2rem', color:'var(--text3)', fontSize:'0.78rem' }}>
              No competitors yet
            </div>
          )}

          {/* My stats card */}
          {user && (
            <div className="card" style={{ marginTop:'0.25rem', background:'rgba(37,99,235,0.07)', borderColor:'rgba(59,130,246,0.2)' }}>
              <div className="section-title" style={{ marginBottom:'0.8rem' }}>Your Stats</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                {[
                  { label:'XP', val:user.xp.toLocaleString(), color:'var(--blue-light)' },
                  { label:'Level', val:user.level, color:'var(--blue-light)' },
                  { label:'Streak', val:`${user.streak}d`, color:'#FB923C' },
                  { label:'Rank', val:myRank>0?`#${myRank}`:'—', color:'#FCD34D' },
                ].map(s => (
                  <div key={s.label} style={{ padding:'0.6rem', borderRadius:'var(--r-sm)', background:'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize:'0.6rem', color:'var(--text3)', marginBottom:'0.2rem' }}>{s.label}</div>
                    <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'0.95rem', color:s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
