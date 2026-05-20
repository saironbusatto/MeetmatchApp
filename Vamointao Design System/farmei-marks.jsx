// farmei-marks.jsx
// Logomark do Farmei — tipográfico puro.
// O mark é só a letra "f" minúscula em Bricolage Grotesque 800.
// O wordmark é "farmei" com o pingo do i em spark yellow.
// Sem geometria custom, sem conceito abstrato. A fonte faz o trabalho.

/* ─────────────────────────────────────────────────────────────
   Mark — o "f" minúsculo solo
   ───────────────────────────────────────────────────────────── */
function Mark({ size = 96, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" aria-label="Farmei">
      <text
        x="100" y="172"
        fontFamily='"Bricolage Grotesque", system-ui, sans-serif'
        fontSize="220"
        fontWeight="800"
        textAnchor="middle"
        fill={color}
        style={{ letterSpacing: '-0.04em', fontOpticalSizing: 'auto' }}
      >
        f
      </text>
    </svg>
  );
}

// Aliases — old canvas refs to MarkA/MarkB now both point to the single mark.
const MarkA = Mark;
const MarkB = Mark;

/* ─────────────────────────────────────────────────────────────
   Wordmark "farmei" — Bricolage + spark dot sobre o i
   ───────────────────────────────────────────────────────────── */
function Wordmark({ size = 56, color = 'currentColor', spark = '#FFD93D' }) {
  // O dot natural da fonte fica ESCONDIDO via text-stroke trick: usamos um
  // span aparte com o "i" cobrindo só a haste, e desenhamos nosso próprio
  // pingo spark por cima. Como é Bricolage e o pingo da fonte é redondo, dá
  // pra simplesmente sobrepor um circle bem maior por cima.
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'baseline',
      position: 'relative',
      fontFamily: '"Bricolage Grotesque", system-ui, sans-serif',
      fontWeight: 800,
      fontSize: size,
      letterSpacing: '-0.045em',
      lineHeight: 1,
      color,
      fontOpticalSizing: 'auto',
    }}>
      farme
      <span style={{ position: 'relative', display: 'inline-block' }}>
        i
        <span style={{
          position: 'absolute',
          top: `-${size * 0.02}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: size * 0.24,
          height: size * 0.24,
          borderRadius: '50%',
          background: spark,
          border: `${Math.max(1.5, size * 0.03)}px solid ${color}`,
          boxSizing: 'border-box',
        }}/>
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Lockups
   ───────────────────────────────────────────────────────────── */
function LockupH({ Mark: M = Mark, size = 80, wordSize = 44, color = 'currentColor', spark = '#FFD93D' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.22 }}>
      <M size={size} color={color}/>
      <Wordmark size={wordSize} color={color} spark={spark}/>
    </div>
  );
}

function LockupV({ Mark: M = Mark, size = 96, wordSize = 36, color = 'currentColor', spark = '#FFD93D', gap }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: gap ?? size * 0.18 }}>
      <M size={size} color={color}/>
      <Wordmark size={wordSize} color={color} spark={spark}/>
    </div>
  );
}

Object.assign(window, { Mark, MarkA, MarkB, Wordmark, LockupH, LockupV });
