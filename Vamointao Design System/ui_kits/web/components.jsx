// Vamointao web app — shared components

const VMT = {
  vermillion: '#FF3B2E', vermillionDark: '#E92518', vermillionSoft: '#FFF1EE',
  spark: '#FFD93D', sparkSoft: '#FFF4BD', sparkBright: '#FFF4BD',
  ink: '#0A0A0A', ink800: '#161618', ink700: '#28272A', ink600: '#3F3E3A',
  ink500: '#5F5D57', ink400: '#8C8A82', ink300: '#B8B4A8', ink200: '#D4D1C8',
  ink100: '#E8E6E0', ink50: '#F4F2EC',
  paper: '#FAFAF7', white: '#FFFFFF',
  success: '#2EA862', successSoft: '#D7F3E2',
  warn: '#E89E18', warnSoft: '#FFF0D6',
  fontDisplay: "'Bricolage Grotesque', system-ui, sans-serif",
  fontBody: "'Geist', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",
};

const AV_COLORS = ['#FF3B2E','#2A6F7A','#7A5BAA','#C99B00','#2EA862','#9D5C2C','#3F3E3A'];

function Sparkle({ size = 16, color = VMT.spark }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: 'none' }}>
      <path d="M12 2 L13.6 9.4 L21 11 L13.6 12.6 L12 20 L10.4 12.6 L3 11 L10.4 9.4 Z" fill={color}/>
      <circle cx="20" cy="4" r="1.4" fill={color}/>
    </svg>
  );
}

function Logomark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <g transform="rotate(-4 40 40)">
        <rect x="6" y="6" width="68" height="68" rx="18" fill={VMT.vermillion} stroke={VMT.ink} strokeWidth="3"/>
        <path d="M20 24 L40 56 L60 24" fill="none" stroke={VMT.ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="40" cy="56" r="4" fill={VMT.spark} stroke={VMT.ink} strokeWidth="2"/>
      </g>
    </svg>
  );
}

function Avatar({ name, size = 28, isKey = false, idx = 0 }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: AV_COLORS[idx % AV_COLORS.length], color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: VMT.fontBody, fontWeight: 700, fontSize: size * 0.36,
      border: '2px solid #fff', flex: 'none',
      outline: isKey ? `2px solid ${VMT.vermillion}` : 'none', outlineOffset: 1,
    }}>{initials}</div>
  );
}

function AvatarStack({ people, size = 28, max = 5 }) {
  const visible = people.slice(0, max);
  const overflow = people.length - max;
  return (
    <div style={{ display: 'flex' }}>
      {visible.map((p, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -8 }}>
          <Avatar name={p.name} size={size} isKey={p.isKey} idx={p.colorIdx ?? i}/>
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          marginLeft: -8, width: size, height: size, borderRadius: '50%',
          background: VMT.ink100, color: VMT.ink700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: VMT.fontBody, fontWeight: 700, fontSize: size * 0.34,
          border: '2px solid #fff',
        }}>+{overflow}</div>
      )}
    </div>
  );
}

function Sidebar({ active, onChange }) {
  const items = [
    { key: 'inbox', label: 'Inbox', count: 3 },
    { key: 'upcoming', label: 'Upcoming', count: 7 },
    { key: 'waiting', label: 'Waiting on you', count: 2, accent: true },
    { key: 'past', label: 'Past', count: null },
    { key: 'calendar', label: 'Calendar', count: null },
  ];
  const lists = [
    { key: 'work', label: 'Work', color: '#FF3B2E' },
    { key: 'friends', label: 'Friends', color: '#7A5BAA' },
    { key: 'family', label: 'Family', color: '#2EA862' },
  ];
  return (
    <aside style={{
      width: 260, flex: 'none', background: VMT.white, borderRight: `1px solid ${VMT.ink100}`,
      display: 'flex', flexDirection: 'column', padding: '20px 14px', gap: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 10px 14px' }}>
        <Logomark size={28}/>
        <span style={{ fontFamily: VMT.fontDisplay, fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em', color: VMT.ink, position: 'relative' }}>
          farmei
          <span style={{ position: 'absolute', right: 4, top: -1, width: 5, height: 5, borderRadius: '50%', background: VMT.vermillion }}/>
        </span>
      </div>

      <button onClick={() => onChange?.('new')} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '11px 14px', borderRadius: 12,
        background: VMT.vermillion, color: '#fff', border: `2px solid ${VMT.ink}`,
        boxShadow: `2px 2px 0 ${VMT.ink}`, cursor: 'pointer',
        fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 14,
      }}>+ New event</button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(it => {
          const on = it.key === active;
          return (
            <button key={it.key} onClick={() => onChange?.(it.key)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: on ? VMT.ink50 : 'transparent',
              fontFamily: VMT.fontBody, fontWeight: 500, fontSize: 14,
              color: on ? VMT.ink : VMT.ink700,
            }}>
              <span style={{ fontWeight: on ? 600 : 500 }}>{it.label}</span>
              {it.count !== null && (
                <span style={{
                  fontFamily: VMT.fontMono, fontSize: 11, fontWeight: 600,
                  padding: '2px 7px', borderRadius: 999,
                  background: it.accent ? VMT.vermillion : VMT.ink100,
                  color: it.accent ? '#fff' : VMT.ink700,
                }}>{it.count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div>
        <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px 8px' }}>Groups</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {lists.map(l => (
            <button key={l.key} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'transparent', fontFamily: VMT.fontBody, fontWeight: 500, fontSize: 14, color: VMT.ink700, textAlign: 'left',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color }}/>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <div style={{ padding: '10px 12px', borderTop: `1px solid ${VMT.ink100}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name="Sofia Olsen" idx={3} size={32}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 13, color: VMT.ink }}>Sofia Olsen</div>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 11, color: VMT.ink500 }}>Crew · free trial</div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ title, subtitle, segment, onSegment }) {
  const segs = ['Day', 'Week', 'Month'];
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 28px', borderBottom: `1px solid ${VMT.ink100}`, background: VMT.paper,
    }}>
      <div>
        <h1 style={{ margin: 0, fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 28, letterSpacing: '-0.02em', color: VMT.ink, lineHeight: 1 }}>{title}</h1>
        {subtitle && <div style={{ marginTop: 4, fontFamily: VMT.fontBody, fontSize: 13, color: VMT.ink500 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative' }}>
          <input placeholder="Search events, people…" style={{
            width: 280, padding: '9px 14px 9px 36px', borderRadius: 999,
            border: `1px solid ${VMT.ink100}`, background: VMT.white,
            fontFamily: VMT.fontBody, fontSize: 14, outline: 'none',
          }}/>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={VMT.ink400} strokeWidth="2.2" strokeLinecap="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="7"/><path d="M21 21 L16 16"/></svg>
        </div>
        {segment !== undefined && (
          <div style={{ display: 'inline-flex', background: VMT.ink50, border: `1px solid ${VMT.ink100}`, borderRadius: 10, padding: 3, gap: 2 }}>
            {segs.map(s => (
              <button key={s} onClick={() => onSegment?.(s)} style={{
                fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 13,
                padding: '6px 14px', borderRadius: 7, border: 'none',
                background: segment === s ? VMT.white : 'transparent',
                color: segment === s ? VMT.ink : VMT.ink600,
                boxShadow: segment === s ? `0 1px 2px rgba(0,0,0,0.08)` : 'none',
                cursor: 'pointer',
              }}>{s}</button>
            ))}
          </div>
        )}
        <button style={{
          width: 36, height: 36, borderRadius: '50%', background: VMT.white,
          border: `1px solid ${VMT.ink100}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={VMT.ink600} strokeWidth="2"><path d="M15 17 H5 a2 2 0 0 1 -2 -2 V9 a2 2 0 0 1 2 -2 h14 a2 2 0 0 1 2 2 v4"/><path d="M12 11 v4"/></svg>
        </button>
      </div>
    </header>
  );
}

const SAMPLE_PEOPLE = [
  { name: 'Diego Cruz',   isKey: true,  colorIdx: 0 },
  { name: 'Maya Rivera',  isKey: false, colorIdx: 1 },
  { name: 'João Reis',    isKey: false, colorIdx: 2 },
  { name: 'Sofia Olsen',  isKey: false, colorIdx: 3 },
  { name: 'Anya Patel',   isKey: false, colorIdx: 4 },
  { name: 'Felipe Costa', isKey: false, colorIdx: 5 },
];

Object.assign(window, { VMT, AV_COLORS, Sparkle, Logomark, Avatar, AvatarStack, Sidebar, TopBar, SAMPLE_PEOPLE });
