// farmei-canvas.jsx — sistema do logomark (versão final, sem A/B).
//
// O mark é o "f" da Bricolage. O wordmark é "farmei" com o pingo do i em
// spark. Esse canvas mostra a marca em todos os contextos do sistema —
// solo, lockup, app icon, fundos, e escala (favicon → display).

// ─── helpers ────────────────────────────────────────────────────
const Stage = ({ kind = 'paper', children, style = {} }) => (
  <div className={`stage ${kind}`} style={style}>{children}</div>
);

const AppIcon = ({ kind, color, sparkColor }) => (
  <div className={`stage ${kind === 'paperWarm' ? 'paper' : kind}`}>
    <div className={`app-icon ${kind === 'paperWarm' ? 'paper' : kind}`}>
      <Mark size={150} color={color}/>
      <span className="icon-caption">{kind}</span>
    </div>
  </div>
);

const ScaleItem = ({ size, label }) => (
  <div className="scale-item">
    <div className="chrome" style={{ padding: size <= 24 ? 3 : 6 }}>
      <Mark size={size} color="#0A0A0A"/>
    </div>
    <span className="size-tag">{label}</span>
  </div>
);

// ─── canvas root ────────────────────────────────────────────────
function App() {
  return (
    <DesignCanvas>

      {/* 1. A MARCA ─────────────────────────────── */}
      <DCSection id="brand" title="A marca" subtitle="Mark, wordmark, lockup. Tipografia faz o trabalho.">
        <DCArtboard id="mark-solo" label="Mark · f" width={360} height={360}>
          <Stage kind="paper">
            <Mark size={220} color="#0A0A0A"/>
          </Stage>
        </DCArtboard>
        <DCArtboard id="word-solo" label="Wordmark · farmei" width={520} height={360}>
          <Stage kind="paper">
            <Wordmark size={88} color="#0A0A0A"/>
          </Stage>
        </DCArtboard>
        <DCArtboard id="lock-h" label="Lockup horizontal" width={600} height={360}>
          <Stage kind="paper">
            <LockupH size={104} wordSize={64}/>
          </Stage>
        </DCArtboard>
        <DCArtboard id="lock-v" label="Lockup empilhado" width={360} height={420}>
          <Stage kind="paper">
            <LockupV size={120} wordSize={44}/>
          </Stage>
        </DCArtboard>
      </DCSection>

      {/* 2. APP ICON ────────────────────────────── */}
      <DCSection id="appicon" title="App icon" subtitle="iOS rounded square. O f preenche o icon. 4 fundos.">
        <DCArtboard id="icon-verm" label="vermillion" width={300} height={320}>
          <AppIcon kind="verm" color="#FAFAF7"/>
        </DCArtboard>
        <DCArtboard id="icon-paper" label="paper" width={300} height={320}>
          <AppIcon kind="paperWarm" color="#0A0A0A"/>
        </DCArtboard>
        <DCArtboard id="icon-ink" label="ink" width={300} height={320}>
          <AppIcon kind="ink" color="#FAFAF7"/>
        </DCArtboard>
        <DCArtboard id="icon-spark" label="spark" width={300} height={320}>
          <AppIcon kind="spark" color="#0A0A0A"/>
        </DCArtboard>
      </DCSection>

      {/* 3. EM CONTEXTO — fundos do sistema ──────── */}
      <DCSection id="ctx" title="Em contexto" subtitle="Como a marca completa se comporta sobre cada fundo.">
        <DCArtboard id="ctx-paper" label="sobre paper" width={420} height={240}>
          <Stage kind="paper">
            <LockupH size={72} wordSize={42} color="#0A0A0A" spark="#FFD93D"/>
          </Stage>
        </DCArtboard>
        <DCArtboard id="ctx-ink" label="sobre ink" width={420} height={240}>
          <Stage kind="ink">
            <LockupH size={72} wordSize={42} color="#FAFAF7" spark="#FFD93D"/>
          </Stage>
        </DCArtboard>
        <DCArtboard id="ctx-verm" label="sobre vermillion" width={420} height={240}>
          <Stage kind="verm">
            <LockupH size={72} wordSize={42} color="#FAFAF7" spark="#FFD93D"/>
          </Stage>
        </DCArtboard>
        <DCArtboard id="ctx-spark" label="sobre spark" width={420} height={240}>
          <Stage kind="spark">
            <LockupH size={72} wordSize={42} color="#0A0A0A" spark="#FF3B2E"/>
          </Stage>
        </DCArtboard>
      </DCSection>

      {/* 4. ESCALA ───────────────────────────────── */}
      <DCSection id="scale" title="Escala" subtitle="De favicon (16px) até billboard.">
        <DCArtboard id="scale-mark" label="Mark" width={900} height={200}>
          <Stage kind="paper" style={{ padding: '32px 28px' }}>
            <div className="scale-row">
              <ScaleItem size={16}  label="16 · favicon"/>
              <ScaleItem size={24}  label="24"/>
              <ScaleItem size={32}  label="32"/>
              <ScaleItem size={48}  label="48"/>
              <ScaleItem size={64}  label="64"/>
              <ScaleItem size={96}  label="96"/>
              <ScaleItem size={128} label="128"/>
            </div>
          </Stage>
        </DCArtboard>
        <DCArtboard id="scale-word" label="Wordmark" width={900} height={200}>
          <Stage kind="paper" style={{ padding: '20px 28px' }}>
            <div className="scale-row" style={{ alignItems: 'baseline' }}>
              {[14, 20, 28, 40, 56, 80].map((s) => (
                <div className="scale-item" key={s}>
                  <Wordmark size={s} color="#0A0A0A"/>
                  <span className="size-tag" style={{ marginTop: 8 }}>{s}px</span>
                </div>
              ))}
            </div>
          </Stage>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
