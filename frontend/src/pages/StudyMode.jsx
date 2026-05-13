import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getCards, completeSession } from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function StudyMode() {
  const { topicId } = useParams();
  const [sp]        = useSearchParams();
  const navigate    = useNavigate();
  const { updateUser } = useAuth();

  const courseId   = sp.get('course');
  const topicName  = sp.get('topic')  || 'Flashcards';
  const lessonName = sp.get('lesson') || '';

  const [cards, setCards]         = useState([]);
  const [index, setIndex]         = useState(0);
  const [flipped, setFlipped]     = useState(false);
  const [correct, setCorrect]     = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [done, setDone]           = useState(false);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getCards(topicId).then(r => setCards(r.data)).finally(() => setLoading(false));
  }, [topicId]);

  const accuracy = (correct + incorrect) > 0
    ? Math.round((correct / (correct + incorrect)) * 100) : 0;

  const mult = accuracy>=90?2.0:accuracy>=75?1.5:accuracy>=50?1.2:1.0;

  const advance = (type) => {
    const c = type==='correct' ? correct+1 : correct;
    const w = type==='incorrect' ? incorrect+1 : incorrect;
    if (type==='correct') setCorrect(c); else if(type==='incorrect') setIncorrect(w);
    setFlipped(false);
    if (index+1 >= cards.length) finish(c, w);
    else setTimeout(() => setIndex(i => i+1), 50);
  };

  const finish = async (c, w) => {
    setDone(true);
    try {
      const r = await completeSession({ topicId:Number(topicId), correctCount:c, totalCount:c+w });
      setResult(r.data);
      updateUser({ xp:r.data.newXP, level:r.data.newLevel });
    } catch {}
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
      <p style={{ fontFamily:'var(--mono)', color:'var(--text3)', fontSize:'0.72rem' }}>Loading flashcards…</p>
    </div>
  );
  if (!cards.length) return (
    <div style={{ textAlign:'center', padding:'3rem' }}>
      <p style={{ color:'var(--text3)', marginBottom:'1rem' }}>No flashcards in this topic yet.</p>
      <button className="btn btn-ghost" onClick={() => navigate(`/courses/${courseId}`)}>← Back</button>
    </div>
  );

  if (done) {
    const finalAcc = (correct+incorrect)>0?Math.round((correct/(correct+incorrect))*100):0;
    return (
      <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center' }} className="fade-in">
        <div style={{ fontSize:'3rem', marginBottom:'0.8rem' }}>
          {finalAcc>=90?'🏆':finalAcc>=75?'⚡':finalAcc>=50?'📈':'💪'}
        </div>
        <h2 style={{ fontFamily:'var(--sans)', fontSize:'2rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:'0.4rem' }}>
          {finalAcc>=90?'Outstanding!':finalAcc>=75?'Solid work!':finalAcc>=50?'Keep pushing!':'Keep at it!'}
        </h2>
        <p style={{ color:'var(--text3)', marginBottom:'2rem', fontSize:'0.85rem' }}>Session complete</p>

        <div className="card card-blue" style={{ marginBottom:'1rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <div>
              <div style={{ fontSize:'0.68rem', color:'var(--text3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.3rem' }}>ACCURACY</div>
              <div style={{ fontSize:'2.5rem', fontWeight:800, letterSpacing:'-0.04em' }}>{finalAcc}%</div>
            </div>
            <div>
              <div style={{ fontSize:'0.68rem', color:'var(--text3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.3rem' }}>MULTIPLIER</div>
              <div style={{ fontSize:'2.5rem', fontWeight:800, letterSpacing:'-0.04em', color:'var(--blue-light)' }}>
                x{result?.accMult||mult}
              </div>
            </div>
            <div>
              <div style={{ fontSize:'0.68rem', color:'var(--text3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.3rem' }}>XP EARNED</div>
              <div style={{ fontSize:'2.5rem', fontWeight:800, letterSpacing:'-0.04em', color:'#6EE7B7' }}>
                +{result?.xpEarned||0}
              </div>
            </div>
          </div>
          {result && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
              {[
                { l:'Streak Mult.', v:`×${result.strMult}`, c:'var(--blue-light)' },
                { l:'New Total XP', v:result.newXP.toLocaleString(), c:'#FCD34D' },
              ].map(r => (
                <div key={r.l} style={{ padding:'0.6rem', borderRadius:'var(--r-sm)', background:'rgba(255,255,255,0.04)', textAlign:'left' }}>
                  <div style={{ fontSize:'0.6rem', color:'var(--text3)', marginBottom:'0.2rem' }}>{r.l}</div>
                  <div style={{ fontWeight:700, color:r.c }}>{r.v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/courses/${courseId}`)} style={{ fontSize:'0.8rem' }}>
          ← Back to Course
        </button>
      </div>
    );
  }

  const card = cards[index];
  const pct  = Math.round((index/cards.length)*100);

  return (
    <div className="fade-in">
      {/* Top stats bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <button onClick={() => navigate(`/courses/${courseId}`)} style={{
            background:'none', border:'none', cursor:'pointer', color:'var(--text3)',
            fontFamily:'var(--sans)', fontSize:'0.75rem', padding:0, marginBottom:'0.4rem', display:'block',
            transition:'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color='var(--blue-light)'}
            onMouseLeave={e => e.currentTarget.style.color='var(--text3)'}>
            ← {lessonName}
          </button>
          <h2 style={{ fontWeight:800, fontSize:'1.2rem', letterSpacing:'-0.02em' }}>{topicName}</h2>
          <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.3rem' }}>
            <span style={{ fontFamily:'var(--mono)', fontSize:'0.65rem', color:'var(--text3)', display:'flex', alignItems:'center', gap:'0.3rem' }}>
              ⏱ Card {index+1}/{cards.length}
            </span>
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <div className="card card-sm" style={{ textAlign:'center', minWidth:90, padding:'0.6rem 1rem' }}>
            <div style={{ fontSize:'0.55rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text3)', marginBottom:'0.2rem' }}>ACCURACY</div>
            <div style={{ fontWeight:800, fontSize:'1.3rem', letterSpacing:'-0.02em' }}>{accuracy}%</div>
          </div>
          <div className="card card-sm" style={{ textAlign:'center', minWidth:90, padding:'0.6rem 1rem', background:'rgba(37,99,235,0.1)', borderColor:'rgba(59,130,246,0.25)' }}>
            <div style={{ fontSize:'0.55rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text3)', marginBottom:'0.2rem' }}>MULTIPLIER</div>
            <div style={{ fontWeight:800, fontSize:'1.3rem', letterSpacing:'-0.02em', color:'var(--blue-light)' }}>x{mult}</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginBottom:'1.5rem', height:3 }}>
        <div className="progress-fill" style={{ width:`${pct}%` }}/>
      </div>

      {/* The flashcard — large, like reference screenshot 7 */}
      <div style={{ perspective:1400, marginBottom:'1.5rem' }}>
        <div onClick={() => setFlipped(f=>!f)} style={{
          position:'relative', height:320, cursor:'pointer',
          transformStyle:'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
          transition:'transform 0.5s cubic-bezier(.4,0,.2,1)',
          borderRadius:'var(--r-xl)',
        }}>
          {/* Front */}
          <div style={{
            position:'absolute', inset:0, backfaceVisibility:'hidden',
            background:'var(--surface)',
            border:'1px solid var(--border)',
            borderRadius:'var(--r-xl)',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            padding:'3rem', textAlign:'center',
          }}>
            <div style={{ position:'absolute', top:'1rem', right:'1rem' }}>
              <span style={{
                fontFamily:'var(--mono)', fontSize:'0.62rem', color:'var(--text3)',
                background:'var(--surface2)', border:'1px solid var(--border)',
                padding:'0.25rem 0.6rem', borderRadius:'var(--r-pill)',
                display:'flex', alignItems:'center', gap:'0.3rem',
              }}>⊙ Hover to Flip</span>
            </div>
            <h2 style={{ fontFamily:'var(--sans)', fontSize:'1.8rem', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.2 }}>
              {card.question}
            </h2>
          </div>
          {/* Back */}
          <div style={{
            position:'absolute', inset:0, backfaceVisibility:'hidden',
            transform:'rotateY(180deg)',
            background:'linear-gradient(135deg,rgba(67,56,202,0.15),rgba(37,99,235,0.1))',
            border:'1px solid rgba(59,130,246,0.25)',
            borderRadius:'var(--r-xl)',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            padding:'3rem', textAlign:'center',
          }}>
            <div style={{ position:'absolute', top:'1rem', left:'1rem' }}>
              <span style={{ fontFamily:'var(--mono)', fontSize:'0.58rem', color:'var(--text3)', letterSpacing:'0.08em' }}>ANSWER</span>
            </div>
            <p style={{ fontSize:'1rem', lineHeight:1.75, whiteSpace:'pre-line' }}>{card.answer}</p>
          </div>
        </div>
      </div>

      {/* Action buttons — 3 options like reference screenshot 7 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.75rem' }}>
        {[
          { type:'incorrect', icon:'✗', label:'Incorrect', sub:'1 min',  bg:'rgba(239,68,68,0.08)',   border:'rgba(239,68,68,0.2)',   color:'#FCA5A5' },
          { type:'skip',      icon:'⏱', label:'Hard',      sub:'10 min', bg:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.2)',  color:'#FCD34D' },
          { type:'correct',   icon:'✓', label:'Correct',   sub:'4 days', bg:'rgba(16,185,129,0.08)',  border:'rgba(16,185,129,0.2)',  color:'#6EE7B7' },
        ].map(btn => (
          <button key={btn.type}
            disabled={!flipped && btn.type !== 'skip'}
            onClick={() => {
              if (btn.type === 'skip') { setFlipped(false); advance('skip'); }
              else if (flipped) advance(btn.type);
              else setFlipped(true);
            }}
            style={{
              padding:'1.2rem', borderRadius:'var(--r-lg)',
              background: btn.bg, border:`1px solid ${btn.border}`,
              cursor:'pointer', transition:'all 0.18s',
              opacity: !flipped && btn.type!=='skip' ? 0.4 : 1,
            }}
            onMouseEnter={e => { if(flipped||btn.type==='skip') e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => e.currentTarget.style.transform=''}>
            <div style={{
              width:36, height:36, borderRadius:'50%',
              background:`${btn.border}`, margin:'0 auto 0.6rem',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1rem', color:btn.color,
            }}>{btn.icon}</div>
            <div style={{ fontWeight:700, fontSize:'0.82rem', marginBottom:'0.25rem' }}>{btn.label}</div>
            <div style={{
              fontFamily:'var(--mono)', fontSize:'0.6rem',
              background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)',
              padding:'0.15rem 0.5rem', borderRadius:999, color:'var(--text3)',
              display:'inline-block',
            }}>{btn.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
