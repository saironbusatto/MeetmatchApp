// Farmei mobile UI kit — shared components
// Loaded after React + ios-frame.jsx
// All components written in JSX, exported to window for cross-file access.

const VMT = {
  vermillion: '#FF3B2E',
  vermillionDark: '#E92518',
  vermillionSoft: '#FFF1EE',
  spark: '#FFD93D',
  sparkSoft: '#FFF4BD',
  ink: '#0A0A0A',
  ink800: '#161618',
  ink700: '#28272A',
  ink600: '#3F3E3A',
  ink500: '#5F5D57',
  ink400: '#8C8A82',
  ink300: '#B8B4A8',
  ink200: '#D4D1C8',
  ink100: '#E8E6E0',
  ink50: '#F4F2EC',
  paper: '#FAFAF7',
  white: '#FFFFFF',
  success: '#2EA862',
  successSoft: '#D7F3E2',
  warn: '#E89E18',
  warnSoft: '#FFF0D6',
  fontDisplay: "'Bricolage Grotesque', system-ui, sans-serif",
  fontBody: "'Geist', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",
};

// ─── Sparkle ────────────────────────────────────────────────────
function Sparkle({ size = 18, color = VMT.spark }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: 'none' }}>
      <path d="M12 2 L13.6 9.4 L21 11 L13.6 12.6 L12 20 L10.4 12.6 L3 11 L10.4 9.4 Z" fill={color}/>
      <circle cx="20" cy="4" r="1.4" fill={color}/>
      <circle cx="4" cy="20" r="1" fill={color}/>
    </svg>
  );
}

// ─── Buttons ────────────────────────────────────────────────────
function PrimaryButton({ children, onClick, full = true, size = 'md' }) {
  const sizes = {
    sm: { padding: '10px 14px', fontSize: 13, borderRadius: 12 },
    md: { padding: '15px 22px', fontSize: 16, borderRadius: 16 },
    lg: { padding: '18px 24px', fontSize: 17, borderRadius: 18 },
  };
  return (
    <button onClick={onClick} style={{
      ...sizes[size],
      fontFamily: VMT.fontBody, fontWeight: 600,
      background: VMT.vermillion, color: '#fff',
      border: `2px solid ${VMT.ink}`,
      boxShadow: `3px 3px 0 ${VMT.ink}`,
      cursor: 'pointer', width: full ? '100%' : 'auto',
      transition: 'transform 120ms, box-shadow 120ms',
    }}>{children}</button>
  );
}

function SecondaryButton({ children, onClick, full = false }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 15,
      padding: '13px 20px', borderRadius: 14,
      background: VMT.white, color: VMT.ink,
      border: `1.5px solid ${VMT.ink}`,
      cursor: 'pointer', width: full ? '100%' : 'auto',
    }}>{children}</button>
  );
}

function AIButton({ children, onClick, full = true }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 16,
      padding: '15px 22px', borderRadius: 16,
      background: VMT.ink, color: VMT.spark,
      border: `2px solid ${VMT.ink}`,
      boxShadow: `3px 3px 0 ${VMT.vermillion}`,
      cursor: 'pointer', width: full ? '100%' : 'auto',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}><Sparkle size={16} color={VMT.spark}/>{children}</button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 15,
      padding: '12px 16px', border: 'none', background: 'transparent',
      color: VMT.ink600, cursor: 'pointer',
    }}>{children}</button>
  );
}

// ─── Avatars ────────────────────────────────────────────────────
const AV_COLORS = ['#FF3B2E','#2A6F7A','#7A5BAA','#C99B00','#2EA862','#9D5C2C','#3F3E3A'];
function Avatar({ name, size = 36, isKey = false, idx = 0 }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: AV_COLORS[idx % AV_COLORS.length],
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: VMT.fontBody, fontWeight: 700, fontSize: size * 0.36,
      border: '2px solid #fff', flex: 'none',
      outline: isKey ? `2px solid ${VMT.vermillion}` : 'none', outlineOffset: 1,
    }}>{initials}</div>
  );
}

function AvatarStack({ people, size = 32, max = 4 }) {
  const visible = people.slice(0, max);
  const overflow = people.length - max;
  return (
    <div style={{ display: 'flex' }}>
      {visible.map((p, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -10 }}>
          <Avatar name={p.name} size={size} isKey={p.isKey} idx={p.colorIdx ?? i}/>
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          marginLeft: -10, width: size, height: size, borderRadius: '50%',
          background: VMT.ink100, color: VMT.ink700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: VMT.fontBody, fontWeight: 700, fontSize: size * 0.32,
          border: '2px solid #fff',
        }}>+{overflow}</div>
      )}
    </div>
  );
}

// ─── App Header ────────────────────────────────────────────────
function AppHeader({ title, back, action, large = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: large ? '8px 20px 0' : '14px 20px',
      background: VMT.paper,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 40 }}>
        {back && (
          <button onClick={back} style={{
            width: 38, height: 38, borderRadius: '50%', background: VMT.white,
            border: `1px solid ${VMT.ink100}`, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={VMT.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18 L9 12 L15 6"/></svg>
          </button>
        )}
      </div>
      {!large && (
        <div style={{ fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em', color: VMT.ink }}>{title}</div>
      )}
      <div style={{ minWidth: 40, display: 'flex', justifyContent: 'flex-end' }}>{action}</div>
    </div>
  );
}

// ─── Bottom Nav ────────────────────────────────────────────────
function BottomNav({ active = 'home', onChange }) {
  const items = [
    { key: 'home', label: 'Private', icon: 'M3 10 L12 3 L21 10 L21 20 L14 20 L14 14 L10 14 L10 20 L3 20 Z' },
    { key: 'public', label: 'Public', icon: 'M12 2 C6.48 2 2 6.48 2 12 C2 17.52 6.48 22 12 22 C17.52 22 22 17.52 22 12 C22 6.48 17.52 2 12 2 M12 20 C7.58 20 4 16.42 4 12 C4 7.58 7.58 4 12 4 C16.42 4 20 7.58 20 12 C20 16.42 16.42 20 12 20 M12.5 7 L12.5 13 L17 15.5' },
    { key: 'new', label: 'New', icon: 'M12 5 L12 19 M5 12 L19 12' },
    { key: 'me', label: 'You', icon: 'M12 12 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M4 21 C4 17 8 15 12 15 C16 15 20 17 20 21' },
  ];
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '10px 16px 24px', background: 'rgba(250,250,247,0.92)',
      backdropFilter: 'blur(12px)', borderTop: `1px solid ${VMT.ink100}`,
    }}>
      {items.map(it => {
        const on = it.key === active;
        if (it.key === 'new') {
          return (
            <button key={it.key} onClick={() => onChange?.(it.key)} style={{
              width: 56, height: 56, borderRadius: '50%', background: VMT.vermillion,
              border: `2px solid ${VMT.ink}`, boxShadow: `2px 2px 0 ${VMT.ink}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: -18,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d={it.icon}/></svg>
            </button>
          );
        }
        return (
          <button key={it.key} onClick={() => onChange?.(it.key)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 14px',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={on ? VMT.ink : 'none'} stroke={on ? VMT.ink : VMT.ink400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={it.icon}/></svg>
            <span style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 600, color: on ? VMT.ink : VMT.ink400 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  VMT, Sparkle, PrimaryButton, SecondaryButton, AIButton, GhostButton,
  Avatar, AvatarStack, AppHeader, BottomNav,
});
