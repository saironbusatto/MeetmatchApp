// auth-mobile.jsx — Login / Signup / Verificar email / Email enviado
// 3 variantes por tela: A (Minimal paper), B (Hero vermillion), C (Sticker card).
// Auth = OAuth-only (Google, Apple, Instagram). Sem senha.

/* ─────────────────────────────────────────────────────────────
   Provider logos — inline SVG (cores reconhecíveis)
   ───────────────────────────────────────────────────────────── */
function GoogleLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18Z"/>
      <path fill="#FBBC05" d="M3.97 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33Z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.96l3.01 2.33A5.36 5.36 0 0 1 9 3.58Z"/>
    </svg>
  );
}
function AppleLogo({ size = 22, color = '#FAFAF7' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 384 512" fill={color} aria-hidden="true">
      <path d="M318.7 268c-.45-44.83 36.6-66.5 38.32-67.55-20.94-30.6-53.49-34.83-65-35.31-27.39-2.83-53.59 16.19-67.45 16.19-13.99 0-35.43-15.81-58.31-15.36-29.94.45-57.61 17.42-72.97 44.18-31.21 54-7.92 133.7 22.21 177.32 14.74 21.36 32.04 45.27 54.85 44.45 22.06-.91 30.39-14.21 57.04-14.21 26.65 0 34.13 14.21 57.43 13.78 23.78-.45 38.7-21.74 53.2-43.18 16.78-24.74 23.66-48.74 24.06-49.95-.53-.27-46.13-17.76-46.63-70.36zM275.07 90.05c12.05-14.72 20.21-34.93 17.99-55.18-17.32.73-39.06 11.84-51.53 26.47-11.05 12.85-20.85 33.79-18.27 53.55 19.39 1.5 39.31-9.85 51.81-24.84z"/>
    </svg>
  );
}
function InstagramLogo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="ig-bg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FCAF45"/>
          <stop offset="0.4" stopColor="#E1306C"/>
          <stop offset="1" stopColor="#5B51D8"/>
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="url(#ig-bg)"/>
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="#fff" strokeWidth="2"/>
      <circle cx="18" cy="6" r="1.4" fill="#fff"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   OAuth button — Farmei-stamped, provider colors
   ───────────────────────────────────────────────────────────── */
function OAuthButton({ provider, label, theme = 'paper' }) {
  const isApple = provider === 'apple';
  const bg    = isApple ? '#0A0A0A' : '#FFFFFF';
  const fg    = isApple ? '#FAFAF7' : '#0A0A0A';
  const Logo  = { google: GoogleLogo, apple: AppleLogo, instagram: InstagramLogo }[provider];
  return (
    <button style={{
      width: '100%', height: 54,
      borderRadius: 16,
      border: '2px solid #0A0A0A',
      background: bg, color: fg,
      font: '600 15px/1 "Geist", system-ui, sans-serif',
      letterSpacing: '-0.005em',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 22px',
      boxShadow: '2px 3px 0 #0A0A0A',
      transition: 'all 120ms cubic-bezier(0.2,0.8,0.2,1)',
    }}>
      {provider === 'apple' ? <AppleLogo size={20} color="#FAFAF7"/> : <Logo size={22}/>}
      <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   OTP input — 6 boxes, one with caret
   ───────────────────────────────────────────────────────────── */
function OTPInput({ digits = ['4', '2', '', '', '', ''], activeIndex = 2 }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {digits.map((d, i) => {
        const isActive = i === activeIndex;
        const isFilled = !!d;
        return (
          <div key={i} style={{
            width: 46, height: 58,
            border: `2px solid ${isActive ? '#FF3B2E' : '#0A0A0A'}`,
            borderRadius: 12,
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            font: '700 24px/1 "JetBrains Mono", monospace',
            color: '#0A0A0A',
            boxShadow: isActive ? '2px 3px 0 #FF3B2E' : (isFilled ? '2px 3px 0 #0A0A0A' : '2px 2px 0 rgba(10,10,10,0.15)'),
            position: 'relative',
          }}>
            {d}
            {isActive && !d && (
              <span style={{
                width: 2, height: 26, background: '#FF3B2E',
                animation: 'caret 1s steps(2) infinite',
              }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Big icon — letter envelope (for "email enviado")
   ───────────────────────────────────────────────────────────── */
function EnvelopeIllo({ size = 120 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: 28,
      background: '#FFF8C2',
      border: '2px solid #0A0A0A',
      boxShadow: '4px 5px 0 #0A0A0A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: 'rotate(-4deg)',
      position: 'relative',
    }}>
      <i className="ph-fill ph-envelope-simple" style={{
        fontSize: size * 0.55, color: '#0A0A0A', lineHeight: 1,
      }}/>
      {/* sparkle on top-right */}
      <span style={{
        position: 'absolute',
        top: -12, right: -10,
        width: 28, height: 28, borderRadius: '50%',
        background: '#FFD93D',
        border: '2px solid #0A0A0A',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '2px 2px 0 #0A0A0A',
        transform: 'rotate(8deg)',
      }}>
        <i className="ph-fill ph-sparkle" style={{ fontSize: 16, color: '#0A0A0A' }}/>
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Layout shells — A (Minimal), B (Hero), C (Sticker card)
   Each receives: headline, sub, children, footer.
   Mark + Wordmark come from farmei-marks.jsx (globals).
   ───────────────────────────────────────────────────────────── */
function LayoutA({ headline, sub, children, footer }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#FAFAF7',
      padding: '76px 28px 40px',
      boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 56 }}>
        <Mark size={32} color="#0A0A0A"/>
      </div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          font: '800 36px/1 "Bricolage Grotesque", system-ui, sans-serif',
          letterSpacing: '-0.03em',
          color: '#0A0A0A', margin: 0,
          fontOpticalSizing: 'auto',
        }}>{headline}</h1>
        <p style={{
          font: '500 16px/1.4 "Geist", system-ui, sans-serif',
          color: '#28272A', marginTop: 12, marginBottom: 0,
          letterSpacing: '-0.005em',
        }}>{sub}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
      <div style={{ flex: 1 }}/>
      <div style={{
        textAlign: 'center',
        font: '500 14px/1.4 "Geist", system-ui, sans-serif',
        color: '#5F5D57',
      }}>{footer}</div>
    </div>
  );
}

function LayoutB({ headline, sub, children, footer, heroH = 360 }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#FAFAF7',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        height: heroH,
        background: '#FF3B2E',
        color: '#FAFAF7',
        padding: '76px 28px 28px',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* deco spark stamps */}
        <span style={{ position: 'absolute', top: 90, right: -18, width: 80, height: 80, borderRadius: '50%', background: '#FFD93D', border: '2px solid #0A0A0A', opacity: 0.95 }}/>
        <span style={{ position: 'absolute', bottom: -22, left: -22, width: 60, height: 60, borderRadius: '50%', background: '#0A0A0A', opacity: 0.18 }}/>

        <div style={{ marginBottom: 'auto' }}>
          <Mark size={34} color="#FAFAF7"/>
        </div>
        <div>
          <h1 style={{
            font: '800 42px/0.98 "Bricolage Grotesque", system-ui, sans-serif',
            letterSpacing: '-0.035em',
            color: '#FAFAF7', margin: 0,
            fontOpticalSizing: 'auto',
            maxWidth: 260,
          }}>{headline}</h1>
          <p style={{
            font: '500 16px/1.4 "Geist", system-ui, sans-serif',
            color: '#FAFAF7', opacity: 0.95,
            marginTop: 12, marginBottom: 0,
            letterSpacing: '-0.005em',
            maxWidth: 260,
          }}>{sub}</p>
        </div>
      </div>

      <div style={{
        flex: 1,
        background: '#FAFAF7',
        borderRadius: '24px 24px 0 0',
        marginTop: -16,
        padding: '28px 28px 40px',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
        <div style={{ flex: 1 }}/>
        <div style={{
          textAlign: 'center',
          font: '500 14px/1.4 "Geist", system-ui, sans-serif',
          color: '#5F5D57',
        }}>{footer}</div>
      </div>
    </div>
  );
}

function LayoutC({ headline, sub, children, footer }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#FF3B2E',
      padding: '60px 22px 32px',
      boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* deco */}
      <span style={{ position: 'absolute', top: 80, right: 30, width: 22, height: 22, borderRadius: '50%', background: '#FFD93D', border: '2px solid #0A0A0A' }}/>
      <span style={{ position: 'absolute', bottom: 60, left: 20, width: 14, height: 14, borderRadius: '50%', background: '#FFD93D', border: '2px solid #0A0A0A' }}/>
      <span style={{ position: 'absolute', bottom: 80, right: 60, width: 30, height: 30, borderRadius: '50%', background: '#0A0A0A' }}/>

      <div style={{
        width: '100%',
        background: '#FAFAF7',
        border: '2px solid #0A0A0A',
        borderRadius: 24,
        padding: '26px 24px 24px',
        boxShadow: '4px 6px 0 #0A0A0A',
        transform: 'rotate(-1deg)',
      }}>
        <div style={{ marginBottom: 18 }}>
          <Mark size={30} color="#0A0A0A"/>
        </div>
        <h1 style={{
          font: '800 30px/1 "Bricolage Grotesque", system-ui, sans-serif',
          letterSpacing: '-0.03em',
          color: '#0A0A0A', margin: 0,
          fontOpticalSizing: 'auto',
        }}>{headline}</h1>
        <p style={{
          font: '500 15px/1.4 "Geist", system-ui, sans-serif',
          color: '#28272A',
          marginTop: 10, marginBottom: 22,
          letterSpacing: '-0.005em',
        }}>{sub}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
        <div style={{
          marginTop: 22, paddingTop: 16,
          borderTop: '1px solid #E8E6E0',
          textAlign: 'center',
          font: '500 13px/1.4 "Geist", system-ui, sans-serif',
          color: '#5F5D57',
        }}>{footer}</div>
      </div>
    </div>
  );
}

const Layouts = { a: LayoutA, b: LayoutB, c: LayoutC };

/* ─────────────────────────────────────────────────────────────
   Screens
   ───────────────────────────────────────────────────────────── */
function LoginScreen({ variant }) {
  const Wrap = Layouts[variant];
  return (
    <Wrap
      headline="Bora marcar?"
      sub="Entra pra ver o que tá rolando."
      footer={<>Primeira vez? <a style={{ color: '#FF3B2E', fontWeight: 700 }}>Criar conta</a></>}
    >
      <OAuthButton provider="google" label="Continuar com Google"/>
      <OAuthButton provider="apple"  label="Continuar com Apple"/>
      <OAuthButton provider="instagram" label="Continuar com Instagram"/>
    </Wrap>
  );
}

function SignupScreen({ variant }) {
  const Wrap = Layouts[variant];
  return (
    <Wrap
      headline="Cria sua conta"
      sub="Em 30s a gente já marca o primeiro rolê."
      footer={<>Já tem conta? <a style={{ color: '#FF3B2E', fontWeight: 700 }}>Entrar</a></>}
    >
      <OAuthButton provider="google" label="Criar com Google"/>
      <OAuthButton provider="apple"  label="Criar com Apple"/>
      <OAuthButton provider="instagram" label="Criar com Instagram"/>
      <p style={{
        font: '500 11px/1.4 "Geist", system-ui, sans-serif',
        color: '#8C8A82',
        margin: '6px 4px 0',
        textAlign: 'center',
      }}>
        Ao continuar você concorda com os <b style={{ color: '#28272A' }}>Termos</b> e a <b style={{ color: '#28272A' }}>Privacidade</b>.
      </p>
    </Wrap>
  );
}

function VerifyScreen({ variant }) {
  const Wrap = Layouts[variant];
  return (
    <Wrap
      headline="Confirma teu email"
      sub={<>Mandamos um código de 6 dígitos pra <b style={{ color: '#0A0A0A' }}>mari@gmail.com</b>.</>}
      footer={<>Não chegou? <a style={{ color: '#FF3B2E', fontWeight: 700 }}>Reenviar em 0:42</a></>}
    >
      <div style={{ padding: '8px 0 4px' }}>
        <OTPInput digits={['4', '2', '', '', '', '']} activeIndex={2}/>
      </div>
      <button style={{
        width: '100%', height: 54,
        borderRadius: 16,
        border: '2px solid #0A0A0A',
        background: '#FF3B2E', color: '#FAFAF7',
        font: '700 16px/1 "Geist", system-ui, sans-serif',
        letterSpacing: '-0.005em',
        cursor: 'pointer',
        boxShadow: '2px 3px 0 #0A0A0A',
      }}>Confirmar</button>
      <button style={{
        width: '100%', height: 44,
        borderRadius: 14, border: 0, background: 'transparent',
        font: '600 14px/1 "Geist", system-ui, sans-serif',
        color: '#5F5D57', cursor: 'pointer',
      }}>Trocar email</button>
    </Wrap>
  );
}

function SentScreen({ variant }) {
  const Wrap = Layouts[variant];
  return (
    <Wrap
      headline="Boa, deu certo!"
      sub={<>Te mandamos um link pra <b style={{ color: '#0A0A0A' }}>mari@gmail.com</b>. Abre lá pra confirmar.</>}
      footer={<>Não chegou em 1min? <a style={{ color: '#FF3B2E', fontWeight: 700 }}>Reenviar</a></>}
    >
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 14px' }}>
        <EnvelopeIllo size={120}/>
      </div>
      <button style={{
        width: '100%', height: 54,
        borderRadius: 16,
        border: '2px solid #0A0A0A',
        background: '#FF3B2E', color: '#FAFAF7',
        font: '700 16px/1 "Geist", system-ui, sans-serif',
        letterSpacing: '-0.005em',
        cursor: 'pointer',
        boxShadow: '2px 3px 0 #0A0A0A',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <i className="ph-bold ph-envelope-open" style={{ fontSize: 18 }}/>
        Abrir email
      </button>
    </Wrap>
  );
}

/* ─────────────────────────────────────────────────────────────
   Canvas
   ───────────────────────────────────────────────────────────── */
const variants = [
  { id: 'a', label: 'A · Minimal paper' },
  { id: 'b', label: 'B · Hero vermillion' },
  { id: 'c', label: 'C · Sticker card' },
];

function PhoneCell({ variant, Screen, theme = 'light' }) {
  return (
    <PhoneFrame theme={theme}><Screen variant={variant.id}/></PhoneFrame>
  );
}

function App() {
  const ABW = 430, ABH = 894;
  const mkRow = (id, title, sub, Screen, theme = 'light') => (
    <DCSection id={id} title={title} subtitle={sub}>
      {variants.map((v) => (
        <DCArtboard key={v.id} id={`${id}-${v.id}`} label={v.label} width={ABW} height={ABH}>
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, boxSizing: 'border-box', background: '#f0eee9',
          }}>
            <PhoneCell variant={v} Screen={Screen} theme={theme}/>
          </div>
        </DCArtboard>
      ))}
    </DCSection>
  );

  return (
    <DesignCanvas>
      {mkRow('login',  'Login',           'Entrar com OAuth (Google · Apple · Instagram).', LoginScreen)}
      {mkRow('signup', 'Signup',          'Criar conta — mesmo set de providers.',         SignupScreen)}
      {mkRow('verify', 'Verificar email', 'Código de 6 dígitos com resend countdown.',     VerifyScreen)}
      {mkRow('sent',   'Email enviado',   'Confirmação após mandar link/codigo.',          SentScreen)}
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('auth-root')).render(<App/>);
