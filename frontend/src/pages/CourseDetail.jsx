import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourses, getLessons } from '../api';

const ICONS = {'Linear Algebra':'∑','Calculus':'∂','Discrete Mathematics':'⊕','Physics — Electricity':'⚡','Computational Thinking':'λ','Data Structures':'⟨⟩','Algorithms':'O(n)','Digital Logic':'01','Computer Architecture':'⚙'};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse]   = useState(null);
  const [lessons, setLessons] = useState([]);
  const [open, setOpen]       = useState(null);

  useEffect(() => {
    getCourses().then(r => setCourse(r.data.find(c=>c.id==id)));
    getLessons(id).then(r => { setLessons(r.data); if(r.data.length>0) setOpen(r.data[0].id); });
  }, [id]);

  const totalTopics = lessons.reduce((a,l) => a+(l.Topics?.length||0), 0);

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem', fontSize:'0.75rem', color:'var(--text3)' }}>
        <button onClick={() => navigate('/courses')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', fontFamily:'var(--sans)', fontSize:'0.75rem', padding:0 }}>◈ Courses</button>
        <span>›</span>
        <span style={{ color:'var(--text2)' }}>Computer Science</span>
        <span>›</span>
        <span style={{ color:'var(--text)' }}>{course?.title}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'1.5rem', alignItems:'start' }}>
        {/* Left: Course hero + lessons */}
        <div>
          {/* Hero card */}
          <div className="card" style={{ marginBottom:'1.2rem' }}>
            {course && (
              <>
                <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1rem' }}>
                  <span className="chip chip-blue">LEVEL 4</span>
                  <span className="chip chip-amber">★ 4.9</span>
                </div>
                <h1 style={{ fontSize:'1.3rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:'0.6rem' }}>{course.title}</h1>
                <p style={{ fontSize:'0.82rem', color:'var(--text2)', lineHeight:1.7, marginBottom:'1.4rem' }}>{course.description}</p>
                <div style={{ display:'flex', gap:'0.75rem' }}>
                  <button className="btn btn-primary" style={{ fontSize:'0.78rem' }} onClick={() => lessons.length>0 && lessons[0].Topics?.length>0 && navigate(`/study/${lessons[0].Topics[0].id}?course=${id}&lesson=${encodeURIComponent(lessons[0].title)}&topic=${encodeURIComponent(lessons[0].Topics[0].title)}`)}>
                    ▶ Continue Course
                  </button>
                  <button className="btn btn-ghost" style={{ fontSize:'0.78rem' }}>⊕ Save</button>
                </div>
              </>
            )}
          </div>

          {/* Quest Log / Syllabus */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.8rem' }}>
            <span style={{ fontWeight:600, fontSize:'0.88rem' }}>Quest Log: Syllabus</span>
            <span className="chip chip-blue">{totalTopics} Topics Total</span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {lessons.map((lesson, i) => {
              const isOpen = open===lesson.id;
              const isActive = i===1;
              return (
                <div key={lesson.id} style={{
                  borderRadius:'var(--r)',
                  border:`1px solid ${isOpen?'rgba(59,130,246,0.3)':'var(--border)'}`,
                  background: isOpen ? 'rgba(37,99,235,0.07)' : 'var(--surface)',
                  overflow:'hidden', transition:'border-color 0.18s',
                }}>
                  <button onClick={() => setOpen(isOpen?null:lesson.id)} style={{
                    width:'100%', display:'flex', alignItems:'center', gap:'0.85rem',
                    padding:'1rem 1.2rem', background:'none', border:'none',
                    cursor:'pointer', color:'var(--text)', fontFamily:'var(--sans)', textAlign:'left',
                  }}>
                    <div style={{
                      width:26, height:26, borderRadius:'50%', flexShrink:0,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      background: i===0 ? 'var(--grad-btn)' : isOpen ? 'rgba(59,130,246,0.2)' : 'var(--surface3)',
                      border: i===0 ? 'none' : `1px solid ${isOpen?'rgba(59,130,246,0.3)':'var(--border)'}`,
                      fontSize:'0.62rem', fontWeight:700,
                      color: i===0 ? '#fff' : isOpen ? 'var(--blue-light)' : 'var(--text3)',
                    }}>
                      {i===0 ? '✓' : isOpen ? '▶' : '⊙'}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:'0.85rem' }}>
                        {i+1}. {lesson.title}
                        {isActive && <span style={{ marginLeft:'0.5rem', fontSize:'0.65rem', color:'var(--blue-light)', fontWeight:400 }}>Current</span>}
                      </div>
                    </div>
                    <span style={{ fontFamily:'var(--mono)', fontSize:'0.65rem', color:'var(--text3)' }}>
                      {lesson.Topics?.length||0} topics
                    </span>
                  </button>

                  {isOpen && lesson.Topics && (
                    <div style={{ padding:'0 1.2rem 1rem', display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                      {lesson.Topics.map((topic, ti) => (
                        <div key={topic.id} style={{
                          display:'flex', alignItems:'center', gap:'0.7rem',
                          padding:'0.55rem 0.8rem', borderRadius:'var(--r-sm)',
                          background:'rgba(255,255,255,0.02)',
                          cursor:'pointer', transition:'background 0.15s',
                        }}
                          onClick={() => navigate(`/study/${topic.id}?course=${id}&lesson=${encodeURIComponent(lesson.title)}&topic=${encodeURIComponent(topic.title)}`)}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(59,130,246,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}>
                          <div style={{
                            width:20, height:20, borderRadius:'50%',
                            background: ti===0&&i===0 ? 'var(--grad-btn)' : 'var(--surface3)',
                            border:`1px solid ${ti===0&&i===0?'transparent':'var(--border)'}`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'0.55rem', color: ti===0&&i===0?'#fff':'var(--text3)', flexShrink:0,
                          }}>{ti===0&&i===0?'✓':'○'}</div>
                          <span style={{ fontSize:'0.8rem', fontWeight:ti===1?600:400, color: ti===1?'var(--text)':'var(--text2)' }}>{topic.title}</span>
                          <span style={{ marginLeft:'auto', fontFamily:'var(--mono)', fontSize:'0.6rem', color:'var(--text3)' }}>Study →</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {/* Your Progress */}
          <div className="card">
            <div style={{ fontWeight:700, fontSize:'0.88rem', marginBottom:'0.8rem' }}>Your Progress</div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
              <span style={{ fontSize:'0.75rem', color:'var(--text2)' }}>Quest Line Alpha</span>
              <span style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--blue-light)' }}>45%</span>
            </div>
            <div className="progress-bar" style={{ marginBottom:'0.5rem' }}>
              <div className="progress-fill" style={{ width:'45%' }}/>
            </div>
            <div style={{ fontSize:'0.68rem', color:'var(--text3)' }}>
              {Math.floor(totalTopics*0.4)} / {totalTopics} Topics Completed
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
            {[
              { icon:'⏱', label:'Total Duration', val:`${lessons.length*2}h` },
              { icon:'◎', label:'Enrolled', val:'Active' },
            ].map(s => (
              <div key={s.label} className="card card-sm">
                <div style={{ fontSize:'1.2rem', marginBottom:'0.4rem' }}>{s.icon}</div>
                <div style={{ fontSize:'0.65rem', color:'var(--text3)', marginBottom:'0.2rem' }}>{s.label}</div>
                <div style={{ fontWeight:800, fontSize:'1rem' }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Completion Loot */}
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.8rem' }}>
              <span>🏆</span>
              <span style={{ fontWeight:700, fontSize:'0.85rem' }}>Completion Loot</span>
            </div>
            {[
              { icon:'✦', text:'+500 XP Points' },
              { icon:'◈', text:`'${course?.title?.split(' ')[0]} Master' Title` },
              { icon:'▣', text:'Verified Certificate' },
            ].map(l => (
              <div key={l.text} style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.5rem', fontSize:'0.78rem', color:'var(--text2)' }}>
                <span style={{ color:'var(--blue-light)', fontSize:'0.7rem' }}>{l.icon}</span>
                {l.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
