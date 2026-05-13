import { useAuth } from '../contexts/AuthContext';
import XPBar from '../components/XPBar';

const STREAKS = [
  { days:3,  label:'Consistent',  mult:'×1.2', color:'#67E8F9' },
  { days:7,  label:'On Fire',     mult:'×1.5', color:'#FB923C' },
  { days:14, label:'Legendary',   mult:'×2.0', color:'#FCD34D' },
];

// Heatmap: generate 12 weeks × 7 days of fake activity data seeded from user XP
function StudyHeatmap({ xp }) {
  const weeks = 12;
  const seed  = xp || 0;
  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const r = ((seed * 1103515245 + 12345 + i * 214013) >>> 0) % 100;
    return r < 30 ? 0 : r < 55 ? 1 : r < 75 ? 2 : 3;
  });
  const COLORS = ['rgba(255,255,255,0.04)','rgba(37,99,235,0.3)','rgba(37,99,235,0.6)','rgba(6,204,240,0.8)'];
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${weeks},1fr)`, gap:3 }}>
        {Array.from({ length: weeks }, (_, w) =>
          Array.from({ length: 7 }, (_, d) => (
            <div key={`${w}-${d}`} style={{
              height: 12, borderRadius: 2,
              background: COLORS[cells[w*7+d]],
              transition: 'background 0.2s',
              cursor: 'default',
            }}
              title={`${cells[w*7+d] > 0 ? cells[w*7+d] + ' sessions' : 'No activity'}`}
            />
          ))
        )}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'0.8rem', justifyContent:'flex-end' }}>
        <span style={{ fontSize:'0.6rem', color:'var(--text3)' }}>Less</span>
        {COLORS.map((c, i) => (
          <div key={i} style={{ width:12, height:12, borderRadius:2, background:c }} />
        ))}
        <span style={{ fontSize:'0.6rem', color:'var(--text3)' }}>More</span>
      </div>
    </div>
  );
}

const ACHIEVEMENTS = [
  { icon:'◈', label:'Deep Thinker',   sub:'100 hrs focused',    color:'#818CF8', bg:'rgba(139,92,246,0.1)', border:'rgba(139,92,246,0.2)' },
  { icon:'⚡', label:'Speed Demon',    sub:'Fast completion',    color:'#60A5FA', bg:'rgba(37,99,235,0.1)',  border:'rgba(59,130,246,0.2)'  },
  { icon:'✦', label:'Perfect Score',  sub:'100% on session',    color:'#6EE7B7', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.2)'  },
];

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  const initials   = user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  const nextStreak = STREAKS.find(m => user.streak < m.days);
  const streak     = user.streak || 0;

  return (
    <div className="fade-in">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'1.5rem' }}>

        {/* ── Left column ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

          {/* Profile hero card */}
          <div className="card card-blue" style={{ padding:'1.6rem' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'1.2rem' }}>
              {/* Avatar */}
              <div style={{ position:'relative', flexShrink:0 }}>
                <div style={{
                  width:80, height:80, borderRadius:'var(--r-lg)',
                  background:'linear-gradient(135deg,#4338CA,#2563EB,#06CCF0)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.6rem', fontWeight:800, color:'#fff',
                  boxShadow:'0 8px 24px rgba(37,99,235,0.4)',
                }}>{initials}</div>
                <div style={{
                  position:'absolute', bottom:-4, right:-4,
                  background:'var(--green)', borderRadius:999,
                  padding:'0.1rem 0.45rem',
                  fontFamily:'var(--mono)', fontSize:'0.55rem', fontWeight:700, color:'#fff',
                  border:'2px solid var(--surface)',
                }}>PRO</div>
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <h1 style={{ fontWeight:800, fontSize:'1.4rem', letterSpacing:'-0.02em', marginBottom:'0.2rem' }}>{user.name}</h1>
                <p style={{ fontSize:'0.75rem', color:'var(--text3)', marginBottom:'0.8rem', fontFamily:'var(--mono)' }}>{user.email}</p>
                <p style={{ fontSize:'0.8rem', color:'var(--text2)', lineHeight:1.6, marginBottom:'1rem' }}>
                  Computer Engineering student. Focused on mastering algorithms and core CE subjects. Aiming for top XP globally this semester.
                </p>
                <div style={{ display:'flex', gap:'0.6rem' }}>
                  <div style={{
                    display:'flex', alignItems:'center', gap:'0.4rem',
                    background:'rgba(255,255,255,0.06)', border:'1px solid var(--border)',
                    padding:'0.35rem 0.8rem', borderRadius:'var(--r-pill)',
                    fontSize:'0.72rem', color:'var(--text2)',
                  }}>
                    <span style={{ color:'#FB923C' }}>🔥</span>
                    {streak} Day Streak
                  </div>
                  <div style={{
                    display:'flex', alignItems:'center', gap:'0.4rem',
                    background:'rgba(37,99,235,0.12)', border:'1px solid rgba(59,130,246,0.25)',
                    padding:'0.35rem 0.8rem', borderRadius:'var(--r-pill)',
                    fontSize:'0.72rem', color:'var(--blue-light)',
                  }}>
                    <span>◎</span>
                    Top {Math.max(1, Math.floor(100 - user.level * 2))}% Focus
                  </div>
                </div>
              </div>

              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontFamily:'var(--mono)', fontSize:'0.6rem', color:'var(--text3)', marginBottom:'0.2rem', letterSpacing:'0.08em' }}>LEVEL</div>
                <div style={{ fontWeight:800, fontSize:'2.5rem', letterSpacing:'-0.04em', lineHeight:1, color:'var(--blue-light)' }}>
                  {user.level}
                </div>
              </div>
            </div>
          </div>

          {/* Study Intensity heatmap */}
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.2rem' }}>
              <span style={{ fontWeight:700, fontSize:'1rem' }}>Study Intensity</span>
              <div style={{
                background:'var(--surface2)', border:'1px solid var(--border)',
                padding:'0.3rem 0.8rem', borderRadius:'var(--r-pill)',
                fontSize:'0.72rem', color:'var(--text2)',
              }}>Last 3 Months</div>
            </div>
            <StudyHeatmap xp={user.xp} />
          </div>

          {/* XP progress */}
          <div className="card">
            <div className="section-title" style={{ marginBottom:'0.8rem' }}>XP Progress</div>
            <XPBar xp={user.xp} level={user.level} />
            {nextStreak && (
              <p style={{ fontFamily:'var(--mono)', fontSize:'0.62rem', color:'var(--text3)', marginTop:'0.7rem' }}>
                {nextStreak.days - streak} more day{nextStreak.days-streak!==1?'s':''} to unlock{' '}
                <span style={{ color:nextStreak.color }}>{nextStreak.mult}</span> streak multiplier
              </p>
            )}
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>

          {/* Global Rank */}
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <span style={{ fontWeight:700, fontSize:'0.95rem' }}>Global Rank</span>
              <div style={{
                width:34, height:34, borderRadius:'50%',
                background:'rgba(37,99,235,0.15)', border:'1px solid rgba(59,130,246,0.25)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem',
              }}>🏆</div>
            </div>
            <div style={{ fontFamily:'var(--mono)', fontSize:'2.6rem', fontWeight:800, letterSpacing:'-0.04em', marginBottom:'0.3rem' }}>
              #{((user.level * 120) + 408).toLocaleString()}
            </div>
            <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.35rem' }}>
              <span style={{ color:'var(--green)' }}>↑</span>
              +{user.xp} this week
            </div>
            <div style={{ marginBottom:'0.35rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                <span style={{ fontSize:'0.68rem', color:'var(--text3)' }}>League Progression</span>
                <span style={{ fontSize:'0.68rem', color:'var(--text3)' }}>{user.xp % 100}%</span>
              </div>
              <div className="progress-bar" style={{ height:6 }}>
                <div className="progress-fill" style={{ width:`${user.xp % 100}%` }} />
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <span style={{ fontWeight:700, fontSize:'0.95rem' }}>Recent Achievements</span>
              <span style={{ fontSize:'0.72rem', color:'var(--text3)', cursor:'pointer' }}>View All</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {ACHIEVEMENTS.map(a => (
                <div key={a.label} style={{
                  display:'flex', alignItems:'center', gap:'0.85rem',
                  padding:'0.8rem', borderRadius:'var(--r-sm)',
                  background: a.bg, border:`1px solid ${a.border}`,
                }}>
                  <div style={{
                    width:38, height:38, borderRadius:'50%', flexShrink:0,
                    background: a.bg, border:`1px solid ${a.border}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'1.1rem', color:a.color,
                  }}>{a.icon}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'0.8rem', marginBottom:'0.1rem' }}>{a.label}</div>
                    <div style={{ fontSize:'0.65rem', color:'var(--text3)' }}>{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak milestones */}
          <div className="card">
            <div className="section-title" style={{ marginBottom:'0.8rem' }}>Streak Multipliers</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {STREAKS.map(m => {
                const achieved = streak >= m.days;
                return (
                  <div key={m.days} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'0.65rem 0.85rem', borderRadius:'var(--r-sm)',
                    background: achieved ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                    border:`1px solid ${achieved ? m.color+'33' : 'var(--border)'}`,
                    opacity: achieved ? 1 : 0.5,
                    transition:'all 0.2s',
                  }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.78rem' }}>{m.label}</div>
                      <div style={{ fontFamily:'var(--mono)', fontSize:'0.58rem', color:'var(--text3)' }}>
                        {m.days}-day streak
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:'var(--mono)', fontWeight:700, color:m.color, fontSize:'0.9rem' }}>
                        {m.mult}
                      </div>
                      <div style={{ fontFamily:'var(--mono)', fontSize:'0.58rem', color: achieved ? 'var(--green)' : 'var(--text3)', marginTop:'0.1rem' }}>
                        {achieved ? '✓ Unlocked' : `${m.days - streak}d left`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats summary */}
          <div className="card">
            <div className="section-title" style={{ marginBottom:'0.8rem' }}>Competitor Stats</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
              {[
                { label:'Total XP',   val:user.xp.toLocaleString(),  color:'var(--blue-light)' },
                { label:'Level',      val:`${user.level}`,           color:'var(--blue-light)' },
                { label:'Streak',     val:`${streak}d`,              color:'#FB923C' },
                { label:'Status',     val:'Active',                  color:'var(--green)' },
              ].map(s => (
                <div key={s.label} style={{ padding:'0.65rem', borderRadius:'var(--r-sm)', background:'var(--surface2)' }}>
                  <div style={{ fontSize:'0.6rem', color:'var(--text3)', marginBottom:'0.2rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>{s.label}</div>
                  <div style={{ fontFamily:'var(--mono)', fontWeight:800, fontSize:'1rem', color:s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
