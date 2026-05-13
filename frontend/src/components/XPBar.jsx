export default function XPBar({ xp, level }) {
  const xpInLevel = xp % 100;
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem' }}>
        <span style={{ fontSize:'0.72rem', color:'var(--text2)', fontWeight:600 }}>
          Level {level} Scholar
        </span>
        <span style={{ fontSize:'0.68rem', color:'var(--text3)' }}>
          {xp} / {Math.ceil(xp/100)*100} XP
        </span>
      </div>
      <div className="xp-track">
        <div className="xp-fill" style={{ width:`${xpInLevel}%` }} />
      </div>
    </div>
  );
}
