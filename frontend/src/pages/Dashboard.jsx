import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCourses, getTasks } from '../api';
import XPBar from '../components/XPBar';

const ICONS = {'Linear Algebra':'∑','Calculus':'∂','Discrete Mathematics':'⊕','Physics — Electricity':'⚡','Computational Thinking':'λ','Data Structures':'⟨⟩','Algorithms':'O(n)','Digital Logic':'01','Computer Architecture':'⚙'};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks]     = useState([]);

  useEffect(() => {
    getCourses().then(r => setCourses(r.data.filter(c => c.enrolled).slice(0,2)));
    getTasks().then(r => setTasks(r.data.filter(t => t.status==='pending').slice(0,3)));
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Competitor';
  const streak = user?.streak || 0;

  return (
    <div className="fade-in">
      {/* Welcome */}
      <div style={{ marginBottom:'1.5rem' }}>
        <p style={{ fontSize:'1rem', fontWeight:500, color:'var(--text)' }}>Welcome back, {firstName}.</p>
        <p style={{ fontSize:'0.82rem', color:'var(--text3)', marginTop:'0.2rem' }}>
          Your focus is absolute. Let's conquer today's objectives.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'1.5rem' }}>
        {/* Left column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

          {/* Daily Quest card */}
          <div className="card card-blue" style={{ padding:'1.6rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', marginBottom:'0.6rem' }}>
                  <span className="chip chip-blue">Daily Quest</span>
                  <span style={{ fontSize:'0.72rem', color:'var(--text3)', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                    ⏱ {streak > 0 ? `${streak}-day streak active` : 'Start your streak!'}
                  </span>
                </div>
                <h2 style={{ fontSize:'1.2rem', fontWeight:700, marginBottom:'0.5rem', letterSpacing:'-0.01em' }}>
                  {courses.length > 0 ? `Master ${courses[0]?.title?.split(' ')[0]} Concepts` : 'Enroll in a course to begin'}
                </h2>
                <p style={{ fontSize:'0.82rem', color:'var(--text2)', lineHeight:1.6, marginBottom:'1.2rem' }}>
                  {courses.length > 0
                    ? `Study flashcard sessions with 85%+ accuracy to level up faster.`
                    : 'Browse courses and enroll to receive your daily quest objectives.'}
                </p>

                <div style={{ marginBottom:'1rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem' }}>
                    <span style={{ fontSize:'0.72rem', color:'var(--text3)' }}>Quest Progress</span>
                    <span style={{ fontSize:'0.72rem', fontWeight:600, color:'var(--blue-light)' }}>
                      Lv.{user?.level||1} → Lv.{(user?.level||1)+1}
                    </span>
                  </div>
                  <div className="xp-track" style={{ height:8 }}>
                    <div className="xp-fill" style={{ width:`${(user?.xp||0)%100}%` }} />
                  </div>
                </div>

                <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                    <span style={{ fontSize:'0.75rem', color:'var(--blue-light)' }}>✦</span>
                    <span style={{ fontSize:'0.75rem', color:'var(--text2)' }}>
                      +{Math.floor(15 * (streak >= 7 ? 1.5 : streak >= 3 ? 1.2 : 1))} XP per session
                    </span>
                    <span style={{ fontSize:'0.72rem', color:'var(--text3)' }}>To Level {(user?.level||1)+1}</span>
                  </div>
                  <button className="btn btn-primary" onClick={() => navigate(courses.length>0?`/courses/${courses[0]?.id}`:'/courses')}
                    style={{ marginLeft:'auto', fontSize:'0.78rem' }}>
                    Engage →
                  </button>
                </div>
              </div>

              <div style={{
                width:52, height:52, borderRadius:'50%', flexShrink:0, marginLeft:'1.2rem',
                background:'rgba(37,99,235,0.2)', border:'1px solid rgba(59,130,246,0.3)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem',
              }}>
                {courses.length > 0 ? ICONS[courses[0]?.title]||'⚡' : '◈'}
              </div>
            </div>
          </div>

          {/* Active Protocols (enrolled courses) */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.8rem' }}>
              <span style={{ fontWeight:600, fontSize:'0.88rem' }}>Active Protocols</span>
              <Link to="/courses" style={{ fontSize:'0.72rem', color:'var(--text3)', textDecoration:'none' }}>
                View All →
              </Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {courses.length === 0 ? (
                <div className="card" style={{ gridColumn:'1/-1', textAlign:'center', padding:'2rem' }}>
                  <p style={{ color:'var(--text3)', fontSize:'0.82rem', marginBottom:'0.8rem' }}>No active courses</p>
                  <Link to="/courses" className="btn btn-ghost" style={{ textDecoration:'none', fontSize:'0.75rem' }}>Browse Courses →</Link>
                </div>
              ) : courses.map(c => (
                <Link key={c.id} to={`/courses/${c.id}`} style={{ textDecoration:'none' }}>
                  <div className="card" style={{ cursor:'pointer', transition:'border-color 0.18s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='var(--border2)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.8rem' }}>
                      <div style={{
                        width:34, height:34, borderRadius:'var(--r-sm)',
                        background:'rgba(37,99,235,0.15)', border:'1px solid rgba(59,130,246,0.2)',
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem',
                      }}>{ICONS[c.title]||'📚'}</div>
                      <span style={{ fontSize:'0.72rem', color:'var(--blue-light)', fontWeight:700 }}>
                        {Math.floor(Math.random()*60+20)}%
                      </span>
                    </div>
                    <div style={{ fontWeight:700, fontSize:'0.85rem', marginBottom:'0.2rem' }}>{c.title}</div>
                    <div style={{ fontSize:'0.7rem', color:'var(--text3)', marginBottom:'0.7rem' }}>Active</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width:`${Math.floor(Math.random()*60+20)}%` }}/></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {/* Global Rank */}
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.8rem' }}>
              <span style={{ fontWeight:700, fontSize:'0.95rem' }}>Global Rank</span>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(37,99,235,0.15)', border:'1px solid rgba(59,130,246,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem' }}>🏆</div>
            </div>
            <div style={{ fontSize:'2.4rem', fontWeight:800, letterSpacing:'-0.04em', marginBottom:'0.2rem' }}>
              #{((user?.level||1) * 100 + 408).toLocaleString()}
            </div>
            <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginBottom:'1rem' }}>
              ↑ +{user?.xp||0} this week
            </div>
            <div style={{ marginBottom:'0.4rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                <span style={{ fontSize:'0.68rem', color:'var(--text3)' }}>League Progression</span>
                <span style={{ fontSize:'0.68rem', color:'var(--text3)' }}>{(user?.xp||0)%100}%</span>
              </div>
              <div className="progress-bar" style={{ height:6 }}>
                <div className="progress-fill" style={{ width:`${(user?.xp||0)%100}%` }}/>
              </div>
            </div>
          </div>

          {/* Competitor Stats */}
          <div className="card">
            <div className="section-title">Competitor Stats</div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.85rem', marginBottom:'0.75rem', padding:'0.7rem', borderRadius:'var(--r-sm)', background:'var(--surface2)' }}>
              <div style={{
                width:36, height:36, borderRadius:'50%', flexShrink:0,
                background:'var(--grad-btn)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontWeight:800, fontSize:'0.9rem', color:'#fff',
              }}>{user?.level||1}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:'0.82rem' }}>Level {user?.level||1} Scholar</div>
                <div style={{ fontSize:'0.68rem', color:'var(--text3)' }}>{user?.xp||0} / {Math.ceil((user?.xp||0)/100)*100} XP</div>
              </div>
            </div>
            <div style={{ padding:'0.7rem', borderRadius:'var(--r-sm)', background:'var(--surface2)', display:'flex', alignItems:'center', gap:'0.85rem' }}>
              <div style={{
                width:36, height:36, borderRadius:'50%', background:'rgba(249,115,22,0.15)',
                border:'1px solid rgba(249,115,22,0.25)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem',
              }}>🔥</div>
              <div>
                <div style={{ fontWeight:700, fontSize:'0.82rem' }}>Current Streak</div>
                <div style={{ fontSize:'0.68rem', color:'var(--text3)' }}>Keep it up!</div>
              </div>
              <div style={{ marginLeft:'auto', fontWeight:800, fontSize:'1.1rem', color:'#FB923C' }}>{streak}</div>
            </div>
          </div>

          {/* Critical Tasks */}
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.8rem' }}>
              <span className="section-title" style={{ marginBottom:0 }}>Critical Tasks</span>
              <Link to="/tasks" style={{ width:22, height:22, borderRadius:'var(--r-sm)', background:'var(--surface2)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', color:'var(--text2)', textDecoration:'none' }}>+</Link>
            </div>
            {tasks.length===0 ? (
              <p style={{ fontSize:'0.78rem', color:'var(--text3)' }}>No pending tasks 🎉</p>
            ) : tasks.map(t => (
              <div key={t.id} style={{ display:'flex', alignItems:'flex-start', gap:'0.6rem', marginBottom:'0.65rem' }}>
                <div style={{ width:15, height:15, borderRadius:3, border:'1px solid var(--border)', flexShrink:0, marginTop:'0.1rem' }}/>
                <div>
                  <div style={{ fontSize:'0.78rem', fontWeight:500 }}>{t.title}</div>
                  {t.dueDate && (
                    <div style={{ fontSize:'0.65rem', color: new Date(t.dueDate)<new Date() ? '#FCA5A5' : 'var(--text3)', marginTop:'0.15rem', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                      📅 {new Date(t.dueDate)<new Date() ? 'Due Today' : t.dueDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
