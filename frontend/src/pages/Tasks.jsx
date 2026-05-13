import { useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask, completeTask } from '../api';
import { useAuth } from '../contexts/AuthContext';

const isOverdue = d => d && new Date(d) < new Date() && new Date(d).toDateString() !== new Date().toDateString();

export default function Tasks() {
  const { updateUser } = useAuth();
  const [tasks, setTasks]         = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ title:'', description:'', dueDate:'', xpReward:50 });
  const [loading, setLoading]     = useState(true);
  const [completing, setCompleting] = useState(null);

  useEffect(() => {
    getTasks().then(r => setTasks(r.data)).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const r = await createTask(form);
      setTasks(ts => [r.data, ...ts]);
      setForm({ title:'', description:'', dueDate:'', xpReward:50 });
      setShowForm(false);
    } catch {}
  };

  const handleComplete = async (id) => {
    setCompleting(id);
    try {
      const r = await completeTask(id);
      setTasks(ts => ts.map(t => t.id===id?{...t,status:'done'}:t));
      updateUser({ xp:r.data.newXP, level:r.data.newLevel });
    } catch {}
    setCompleting(null);
  };

  const handleDelete = async (id) => {
    try { await deleteTask(id); setTasks(ts => ts.filter(t => t.id!==id)); } catch {}
  };

  const todo     = tasks.filter(t => t.status==='pending');
  const done     = tasks.filter(t => t.status==='done');

  const KanbanCol = ({ title, items, color, isEmpty }) => (
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
        <span style={{ width:8, height:8, borderRadius:'50%', background:color, display:'inline-block' }}/>
        <span style={{ fontWeight:600, fontSize:'0.85rem' }}>{title}</span>
        <span style={{ background:'var(--surface3)', color:'var(--text3)', borderRadius:'var(--r-pill)', padding:'0.1rem 0.5rem', fontFamily:'var(--mono)', fontSize:'0.65rem' }}>
          {items.length}
        </span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', minHeight:200 }}>
        {items.map(t => (
          <div key={t.id} className="card" style={{ padding:'1rem', transition:'border-color 0.18s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--border2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
              <span className={`chip ${t.xpReward>=50?'chip-red':'chip-amber'}`}>
                {t.xpReward>=50?'High Priority':'Medium Priority'}
              </span>
              <span style={{ fontFamily:'var(--mono)', fontSize:'0.65rem', color:'#FCD34D', display:'flex', alignItems:'center', gap:'0.25rem' }}>
                ✦ +{t.xpReward} XP
              </span>
            </div>
            <div style={{ fontWeight:700, fontSize:'0.85rem', marginBottom:'0.35rem', lineHeight:1.4 }}>{t.title}</div>
            {t.description && (
              <p style={{ fontSize:'0.75rem', color:'var(--text3)', lineHeight:1.5, marginBottom:'0.5rem',
                overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                {t.description}
              </p>
            )}
            {t.dueDate && (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.5rem' }}>
                <span style={{ fontSize:'0.68rem', color: isOverdue(t.dueDate)?'#FCA5A5':'var(--text3)', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                  ⏱ {isOverdue(t.dueDate)?'Overdue':t.dueDate}
                </span>
                {t.status==='pending' && (
                  <div style={{ display:'flex', gap:'0.35rem' }}>
                    <button className="btn btn-success" style={{ padding:'0.3rem 0.7rem', fontSize:'0.62rem' }}
                      disabled={completing===t.id} onClick={() => handleComplete(t.id)}>
                      {completing===t.id?'…':'✓'}
                    </button>
                    <button className="btn btn-danger" style={{ padding:'0.3rem 0.6rem', fontSize:'0.62rem' }}
                      onClick={() => handleDelete(t.id)}>✕</button>
                  </div>
                )}
              </div>
            )}
            {t.status==='done' && (
              <div style={{ marginTop:'0.5rem', fontSize:'0.68rem', color:'#6EE7B7', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                <span>✓</span> Completed
              </div>
            )}
          </div>
        ))}
        {items.length===0 && (
          <div style={{ borderRadius:'var(--r)', border:'1px dashed var(--border)', padding:'2rem', textAlign:'center', color:'var(--text3)', fontSize:'0.78rem' }}>
            No tasks here
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontWeight:800, fontSize:'1.8rem', letterSpacing:'-0.02em', marginBottom:'0.2rem' }}>Quest Log</h1>
          <p style={{ color:'var(--text3)', fontSize:'0.82rem' }}>Organize your academic objectives.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(f=>!f)} style={{ fontSize:'0.78rem' }}>
          {showForm ? '✕ Cancel' : '+ New Quest'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card fade-in" style={{ marginBottom:'1.5rem' }}>
          <div style={{ fontWeight:700, marginBottom:'1rem' }}>New Quest</div>
          <form onSubmit={handleCreate} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div style={{ gridColumn:'1/-1' }}>
              <label>Quest Title</label>
              <input placeholder="e.g. Complete Advanced Calculus Problem Set"
                value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <label>Description (optional)</label>
              <textarea rows={2} placeholder="Focus on key concepts…"
                value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
            </div>
            <div>
              <label>Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f=>({...f,dueDate:e.target.value}))} />
            </div>
            <div>
              <label>XP Reward</label>
              <input type="number" min={5} max={200} value={form.xpReward}
                onChange={e => setForm(f=>({...f,xpReward:Number(e.target.value)}))} />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <button className="btn btn-primary" type="submit" style={{ fontSize:'0.75rem' }}>Create Quest</button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban board */}
      {loading ? (
        <p style={{ color:'var(--text3)', fontFamily:'var(--mono)', fontSize:'0.72rem' }}>Loading quests…</p>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
          <KanbanCol title="To Do"    items={todo}          color='var(--blue-light)' />
          <KanbanCol title="Done"     items={done}          color='var(--green)' />
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--text3)', display:'inline-block' }}/>
              <span style={{ fontWeight:600, fontSize:'0.85rem', color:'var(--text3)' }}>Archive</span>
            </div>
            <div style={{ borderRadius:'var(--r)', border:'1px dashed var(--border)', padding:'2rem', textAlign:'center', color:'var(--text3)', fontSize:'0.78rem', minHeight:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
              Completed tasks archive
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
