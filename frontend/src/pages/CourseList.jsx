import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, enroll } from '../api';

const ICONS = {'Linear Algebra':'∑','Calculus':'∂','Discrete Mathematics':'⊕','Physics — Electricity':'⚡','Computational Thinking':'λ','Data Structures':'⟨⟩','Algorithms':'O(n)','Digital Logic':'01','Computer Architecture':'⚙'};
const TAGS  = {'Linear Algebra':'math','Calculus':'math','Discrete Mathematics':'math','Physics — Electricity':'eng','Computational Thinking':'cs','Data Structures':'cs','Algorithms':'cs','Digital Logic':'eng','Computer Architecture':'eng'};
const TAG_META = {
  cs:   { label:'CS', chip:'chip-cyan',   progress: '#06CCF0' },
  math: { label:'Math', chip:'chip-purple', progress: '#8B5CF6' },
  eng:  { label:'Engineering', chip:'chip-amber',  progress: '#F59E0B' },
};
const FILTERS = [['all','All'],['enrolled','My Courses'],['cs','Computer Science'],['math','Mathematics'],['eng','Engineering']];

export default function CourseList() {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [filter, setFilter]       = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    getCourses().then(r => setCourses(r.data)).finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (e, id) => {
    e.stopPropagation(); setEnrolling(id);
    try { await enroll(id); setCourses(cs => cs.map(c => c.id===id?{...c,enrolled:true}:c)); } catch {}
    setEnrolling(null);
  };

  const filtered = filter==='all' ? courses : filter==='enrolled' ? courses.filter(c=>c.enrolled) : courses.filter(c=>TAGS[c.title]===filter);
  const enrolledCount = courses.filter(c=>c.enrolled).length;

  return (
    <div className="fade-in">
      <div style={{ marginBottom:'1.5rem' }}>
        <p style={{ fontSize:'1rem', fontWeight:500, color:'var(--text)', marginBottom:'0.2rem' }}>My Courses</p>
        <p style={{ fontSize:'0.82rem', color:'var(--text3)' }}>
          Continue your journey. You have {enrolledCount} active quest{enrolledCount!==1?'s':''}.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {FILTERS.map(([val,label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{
            padding:'0.4rem 1rem', borderRadius:'var(--r-pill)',
            border:'1px solid var(--border)', cursor:'pointer',
            fontFamily:'var(--sans)', fontWeight:600, fontSize:'0.75rem',
            transition:'all 0.18s',
            background: filter===val ? 'rgba(59,130,246,0.2)' : 'var(--surface2)',
            color: filter===val ? 'var(--blue-light)' : 'var(--text2)',
            borderColor: filter===val ? 'var(--border2)' : 'var(--border)',
          }}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
          {[...Array(6)].map((_,i) => (
            <div key={i} style={{ height:200, borderRadius:'var(--r-lg)', background:'var(--surface)', border:'1px solid var(--border)', animation:'pulse 1.5s ease infinite' }}/>
          ))}
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
          {filtered.map(course => {
            const tag  = TAGS[course.title]||'cs';
            const meta = TAG_META[tag];
            return (
              <div key={course.id}
                className="card"
                style={{ cursor:course.enrolled?'pointer':'default', transition:'border-color 0.18s, transform 0.18s' }}
                onClick={() => course.enrolled && navigate(`/courses/${course.id}`)}
                onMouseEnter={e => { if(course.enrolled){ e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.transform='translateY(-2px)'; }}}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform=''; }}>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
                  <div style={{
                    width:38, height:38, borderRadius:'var(--r-sm)',
                    background:'rgba(37,99,235,0.12)', border:'1px solid rgba(59,130,246,0.2)',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem',
                  }}>{ICONS[course.title]||'📚'}</div>
                  <span className={`chip ${meta.chip}`}>{meta.label}</span>
                </div>

                <h3 style={{ fontWeight:700, fontSize:'0.88rem', marginBottom:'0.4rem', letterSpacing:'-0.01em' }}>{course.title}</h3>
                <p style={{ fontSize:'0.75rem', color:'var(--text3)', lineHeight:1.55, marginBottom:'1rem',
                  overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                  {course.description}
                </p>

                {course.enrolled ? (
                  <>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem' }}>
                      <span style={{ fontSize:'0.68rem', color:'var(--text3)' }}>Progress</span>
                      <span style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--blue-light)' }}>Active</span>
                    </div>
                    <div className="progress-bar" style={{ marginBottom:'0.8rem' }}>
                      <div style={{ height:'100%', background:meta.progress, borderRadius:999, width:'40%', transition:'width 0.6s ease' }}/>
                    </div>
                    <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', fontSize:'0.75rem' }}>
                      Continue →
                    </button>
                  </>
                ) : (
                  <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', fontSize:'0.75rem' }}
                    disabled={enrolling===course.id}
                    onClick={e => handleEnroll(e, course.id)}>
                    {enrolling===course.id ? 'Enrolling…' : 'Enroll →'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
