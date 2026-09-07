// Vamointao Marketing — shared building blocks
// Same VMT tokens used in mobile kit, redeclared here so marketing/ can stand alone.

const VMT = {
  vermillion: '#FF3B2E', vermillionDark: '#E92518', vermillionSoft: '#FFF1EE',
  spark: '#FFD93D', sparkSoft: '#FFF4BD',
  ink: '#0A0A0A', ink800: '#161618', ink700: '#28272A', ink600: '#3F3E3A',
  ink500: '#5F5D57', ink400: '#8C8A82', ink300: '#B8B4A8', ink200: '#D4D1C8',
  ink100: '#E8E6E0', ink50: '#F4F2EC',
  paper: '#FAFAF7', white: '#FFFFFF',
  success: '#2EA862', successSoft: '#D7F3E2',
  fontDisplay: "'Bricolage Grotesque', system-ui, sans-serif",
  fontBody: "'Geist', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', ui-monospace, monospace",
};

function Sparkle({ size = 18, color = VMT.spark }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: 'none' }}>
      <path d="M12 2 L13.6 9.4 L21 11 L13.6 12.6 L12 20 L10.4 12.6 L3 11 L10.4 9.4 Z" fill={color}/>
      <circle cx="20" cy="4" r="1.4" fill={color}/>
      <circle cx="4" cy="20" r="1" fill={color}/>
    </svg>
  );
}

function StampButton({ children, variant = 'primary', size = 'md', href, onClick, style = {} }) {
  const variants = {
    primary:   { bg: VMT.vermillion, fg: '#fff', border: VMT.ink, stamp: VMT.ink },
    ink:       { bg: VMT.ink, fg: '#fff', border: VMT.ink, stamp: VMT.vermillion },
    spark:     { bg: VMT.spark, fg: VMT.ink, border: VMT.ink, stamp: VMT.ink },
    outline:   { bg: VMT.white, fg: VMT.ink, border: VMT.ink, stamp: VMT.ink },
  };
  const sizes = {
    sm: { padding: '10px 16px', fontSize: 13, borderRadius: 10, stampSize: 2 },
    md: { padding: '14px 22px', fontSize: 15, borderRadius: 14, stampSize: 3 },
    lg: { padding: '18px 28px', fontSize: 17, borderRadius: 16, stampSize: 4 },
  };
  const v = variants[variant], s = sizes[size];
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} onClick={onClick} style={{
      ...s, padding: s.padding,
      fontFamily: VMT.fontBody, fontWeight: 600, color: v.fg, background: v.bg,
      border: `2px solid ${v.border}`, boxShadow: `${s.stampSize}px ${s.stampSize}px 0 ${v.stamp}`,
      cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
      transition: 'transform 120ms, box-shadow 120ms',
      ...style,
    }}>{children}</Tag>
  );
}

function Logomark({ size = 28 }) {
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

function Wordmark({ color = VMT.ink, dot = VMT.vermillion, size = 22 }) {
  return (
    <span style={{ fontFamily: VMT.fontDisplay, fontWeight: 800, fontSize: size, letterSpacing: '-0.035em', color, position: 'relative', display: 'inline-block', lineHeight: 1 }}>
      farme
      <span style={{ position: 'absolute', top: -2, left: `${size * 2.05}px`, width: size * 0.2, height: size * 0.2, borderRadius: '50%', background: dot }}/>
      i
    </span>
  );
}

function NavBar({ active = 'product' }) {
  const items = ['Product', 'How it works', 'Pricing', 'Blog'];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: 'rgba(250,250,247,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${VMT.ink100}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Logomark size={32}/>
          <Wordmark size={20}/>
        </a>
        <nav style={{ display: 'flex', gap: 26, flex: 1 }}>
          {items.map(it => (
            <a key={it} href="#" style={{
              fontFamily: VMT.fontBody, fontWeight: 500, fontSize: 14,
              color: it.toLowerCase().startsWith(active) ? VMT.ink : VMT.ink600,
              textDecoration: 'none',
            }}>{it}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="#" style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 14, color: VMT.ink, textDecoration: 'none' }}>Log in</a>
          <StampButton variant="primary" size="sm">Get started</StampButton>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const cols = [
    { h: 'Product', items: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
    { h: 'Company', items: ['About', 'Blog', 'Careers', 'Press'] },
    { h: 'Resources', items: ['Help', 'Privacy', 'Terms', 'Status'] },
  ];
  return (
    <footer style={{ background: VMT.ink, color: '#fff', padding: '64px 28px 48px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logomark size={40}/>
            <Wordmark color="#fff" dot={VMT.vermillion} size={28}/>
          </div>
          <p style={{ marginTop: 18, fontFamily: VMT.fontBody, fontSize: 14, lineHeight: 1.6, color: VMT.ink300, maxWidth: 340 }}>
            Get the crew together. The AI picks the day so you don't have to.
          </p>
        </div>
        {cols.map(col => (
          <div key={col.h}>
            <div style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: VMT.spark }}>{col.h}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              {col.items.map(item => (
                <a key={item} href="#" style={{ fontFamily: VMT.fontBody, fontSize: 14, color: '#fff', textDecoration: 'none' }}>{item}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1280, margin: '48px auto 0', paddingTop: 28, borderTop: `1px solid ${VMT.ink700}`, display: 'flex', justifyContent: 'space-between', fontFamily: VMT.fontBody, fontSize: 13, color: VMT.ink400 }}>
        <span>© 2026 Farmei Inc.</span>
        <span>Made with ☕ in Lisbon &amp; Mexico City</span>
      </div>
    </footer>
  );
}

Object.assign(window, { VMT, Sparkle, StampButton, Logomark, Wordmark, NavBar, Footer });
