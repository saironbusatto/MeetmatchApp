// Vamointao mobile UI kit — screens (b)
// Invite, Availability, AI Result, Confirmed

// ─── 4 · Invite people ─────────────────────────────────────────
function InviteScreen({ onBack, onNext }) {
  const [invited, setInvited] = React.useState(SAMPLE_PEOPLE.slice(0, 4));
  const allCandidates = [
    { name: 'Tomás Ribeiro', colorIdx: 6 },
    { name: 'Lucia Marín',   colorIdx: 4 },
    { name: 'Felipe Costa',  colorIdx: 5 },
    { name: 'Anya Patel',    colorIdx: 4 },
  ];

  const remove = (p) => setInvited(invited.filter(x => x.name !== p.name));
  const add    = (p) => setInvited([...invited, p]);
  const isInvited = (p) => invited.some(x => x.name === p.name);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader title="Invite people" back={onBack}/>

      <div style={{ padding: '0 20px 8px' }}>
        <p style={{ margin: '4px 0 14px', fontFamily: VMT.fontBody, fontSize: 14, color: VMT.ink600 }}>
          Add the crew. Mark a <strong style={{ color: VMT.ink }}>key person</strong> whose schedule has to work.
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: VMT.white, border: `1.5px solid ${VMT.ink100}`, borderRadius: 14, padding: '11px 14px',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={VMT.ink400} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21 L16 16"/></svg>
          <input placeholder="Search name or @handle…" style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: VMT.fontBody, fontSize: 15, color: VMT.ink,
          }}/>
        </div>
      </div>

      <div style={{ padding: '12px 20px', borderBottom: `1px solid ${VMT.ink100}` }}>
        <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          {invited.length} invited
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {invited.map(p => (
            <div key={p.name} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 10px 4px 4px', borderRadius: 999,
              background: p.isKey ? VMT.ink : VMT.white,
              border: `1.5px solid ${p.isKey ? VMT.ink : VMT.ink100}`,
            }}>
              <Avatar name={p.name} size={26} idx={p.colorIdx}/>
              <span style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 13, color: p.isKey ? '#fff' : VMT.ink }}>
                {p.name.split(' ')[0]}{p.isKey && <span style={{ color: VMT.spark, marginLeft: 6, fontSize: 11 }}>KEY</span>}
              </span>
              <button onClick={() => remove(p)} style={{
                width: 18, height: 18, borderRadius: '50%',
                background: p.isKey ? 'rgba(255,255,255,0.15)' : VMT.ink50, color: p.isKey ? '#fff' : VMT.ink600,
                border: 'none', cursor: 'pointer', fontSize: 11, lineHeight: 1, padding: 0,
              }}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 4px' }}>
        <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 20px 6px' }}>Suggested</div>
        {allCandidates.filter(p => !isInvited(p)).map(p => (
          <button key={p.name} onClick={() => add(p)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left',
          }}>
            <Avatar name={p.name} size={36} idx={p.colorIdx}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 15, color: VMT.ink }}>{p.name}</div>
              <div style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink500 }}>met at Q2 planning</div>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: VMT.vermillionSoft,
              color: VMT.vermillion, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 600,
            }}>+</div>
          </button>
        ))}
      </div>

      <div style={{ padding: '12px 20px 28px', borderTop: `1px solid ${VMT.ink100}`, background: VMT.paper }}>
        <PrimaryButton onClick={onNext}>Next: pick your days →</PrimaryButton>
      </div>
    </div>
  );
}

// ─── 5 · Availability picker ───────────────────────────────────
function AvailabilityScreen({ onBack, onNext }) {
  // 12 days, Mon-Sun for two weeks of June
  const days = [
    { d: 'Mon', n: 3 },  { d: 'Tue', n: 4 },  { d: 'Wed', n: 5 },  { d: 'Thu', n: 6 },
    { d: 'Fri', n: 7 },  { d: 'Sat', n: 8 },  { d: 'Sun', n: 9 },
    { d: 'Mon', n: 10 }, { d: 'Tue', n: 11 }, { d: 'Wed', n: 12 }, { d: 'Thu', n: 13 }, { d: 'Fri', n: 14 },
  ];
  // 0 = unset, 1 = yes, 2 = maybe, 3 = no
  const [state, setState] = React.useState({ 4: 1, 5: 1, 6: 2, 9: 3, 10: 1, 11: 1, 12: 3 });
  const cycle = (n) => setState(s => ({ ...s, [n]: ((s[n] ?? 0) + 1) % 4 }));

  const styles = {
    0: { bg: VMT.white,     fg: VMT.ink500, border: VMT.ink100, label: '·' },
    1: { bg: VMT.success,   fg: '#fff',     border: VMT.success, label: '✓' },
    2: { bg: VMT.warnSoft,  fg: '#9D6B0C',  border: '#F5C66B',   label: '~' },
    3: { bg: VMT.ink900 || VMT.ink, fg: '#fff', border: VMT.ink, label: '✕' },
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader title="Your availability" back={onBack}/>
      <div style={{ padding: '0 20px 16px' }}>
        <p style={{ margin: '4px 0 14px', fontFamily: VMT.fontBody, fontSize: 14, color: VMT.ink600 }}>
          Tap to cycle: yes <strong style={{ color: VMT.success }}>✓</strong> · maybe <strong style={{ color: '#9D6B0C' }}>~</strong> · no <strong style={{ color: VMT.ink }}>✕</strong>
        </p>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink500, fontWeight: 600 }}>Quick fill:</span>
          {['All yes', 'Weekdays', 'Mornings'].map(opt => (
            <span key={opt} style={{ fontFamily: VMT.fontBody, fontSize: 12, fontWeight: 500, padding: '5px 11px', borderRadius: 999, border: `1px solid ${VMT.ink100}`, background: VMT.white, color: VMT.ink700 }}>{opt}</span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        <div style={{ background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 20, padding: 14 }}>
          <div style={{ fontFamily: VMT.fontMono, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Jun 3 — Jun 14, 2026</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {days.map(day => {
              const s = state[day.n] ?? 0;
              const st = styles[s];
              return (
                <button key={day.n} onClick={() => cycle(day.n)} style={{
                  background: st.bg, color: st.fg, border: `1.5px solid ${st.border}`,
                  borderRadius: 14, padding: '10px 6px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                }}>
                  <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 500, opacity: 0.85 }}>{day.d}</div>
                  <div style={{ fontFamily: VMT.fontMono, fontSize: 18, fontWeight: 600 }}>{day.n}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{st.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 14, padding: '14px 16px', background: VMT.spark, border: `2px solid ${VMT.ink}`, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkle size={20} color={VMT.ink}/>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 13, fontWeight: 500, color: VMT.ink, lineHeight: 1.35 }}>
            5 of 6 are in. Once you submit, the AI will pick a date.
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 20px 28px', borderTop: `1px solid ${VMT.ink100}`, background: VMT.paper }}>
        <AIButton onClick={onNext}>Submit & let AI pick</AIButton>
      </div>
    </div>
  );
}

// ─── 6 · AI Result ─────────────────────────────────────────────
function ResultScreen({ onBack, onLock }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader title="AI's pick" back={onBack}/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 20px' }}>
        {/* Hero AI card */}
        <div style={{ position: 'relative', overflow: 'hidden', background: VMT.spark, border: `2px solid ${VMT.ink}`, borderRadius: 24, padding: '20px 22px', boxShadow: `4px 4px 0 ${VMT.ink}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, color: VMT.ink, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <Sparkle size={14} color={VMT.ink}/> Farmei AI · best fit
          </div>
          <div style={{ fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 44, lineHeight: 0.98, letterSpacing: '-0.03em', color: VMT.ink, marginTop: 12 }}>
            Tuesday<br/>Jun 4
          </div>
          <div style={{ fontFamily: VMT.fontMono, fontSize: 17, fontWeight: 600, color: VMT.ink700, marginTop: 8 }}>14:00 — 15:30</div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: `1.5px dashed ${VMT.ink}` }}>
            <AvatarStack people={SAMPLE_PEOPLE.slice(0, 5)} size={30} max={5}/>
            <div style={{ flex: 1, fontFamily: VMT.fontBody, fontSize: 13, color: VMT.ink700, lineHeight: 1.3 }}>
              <strong style={{ color: VMT.ink, fontSize: 14 }}>5 of 6 in</strong><br/>
              Diego (key) ✓ · confidence 0.92
            </div>
          </div>
        </div>

        {/* AI rationale */}
        <div style={{ marginTop: 16, padding: '14px 16px', background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 16 }}>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, color: VMT.ink500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Why this date?</div>
          <p style={{ margin: 0, fontFamily: VMT.fontBody, fontSize: 14, lineHeight: 1.5, color: VMT.ink700, textWrap: 'pretty' }}>
            It's the earliest day inside your window where Diego is free, and only Felipe can't make it. Wed Jun 5 also works for 5 of 6 — but Diego marked it "maybe."
          </p>
        </div>

        {/* Conflicts */}
        <div style={{ marginTop: 14, padding: '14px 16px', background: VMT.vermillionSoft, border: `1px solid ${VMT.vermillion}30`, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name="Felipe Costa" size={36} idx={5}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 14, color: VMT.ink }}>Heads up — Felipe can't make Tuesday</div>
            <div style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink600, marginTop: 2 }}>Tap to see other options that include him</div>
          </div>
        </div>

        {/* Alternatives */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, color: VMT.ink500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, paddingLeft: 4 }}>Other options</div>
          {[
            { day: 'Wed', n: 5, ratio: '5 of 6', conf: 0.84, note: 'Diego: maybe' },
            { day: 'Mon', n: 10, ratio: '4 of 6', conf: 0.71, note: 'Diego ✓ · 2 conflicts' },
          ].map((o, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 14, marginBottom: 8 }}>
              <div style={{ textAlign: 'center', minWidth: 44 }}>
                <div style={{ fontFamily: VMT.fontBody, fontSize: 10, fontWeight: 600, color: VMT.ink500, textTransform: 'uppercase' }}>{o.day}</div>
                <div style={{ fontFamily: VMT.fontMono, fontSize: 22, fontWeight: 700, color: VMT.ink, lineHeight: 1 }}>{o.n}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 14, color: VMT.ink }}>{o.ratio} available</div>
                <div style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink500, marginTop: 2 }}>{o.note}</div>
              </div>
              <div style={{ fontFamily: VMT.fontMono, fontSize: 12, fontWeight: 600, color: VMT.ink400 }}>{o.conf}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 20px 28px', borderTop: `1px solid ${VMT.ink100}`, background: VMT.paper, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PrimaryButton onClick={onLock} size="lg">Lock in Tue, Jun 4</PrimaryButton>
      </div>
    </div>
  );
}

// ─── 7 · Confirmed event detail ────────────────────────────────
function ConfirmedScreen({ onBack, onHome }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader title="" back={onBack}/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, color: VMT.success, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          🎉 Locked in
        </div>
        <h1 style={{ margin: '14px 0 0', fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 42, letterSpacing: '-0.03em', lineHeight: 1, color: VMT.ink }}>
          Q3 planning<br/>lunch
        </h1>
        <div style={{ marginTop: 14, fontFamily: VMT.fontMono, fontSize: 18, fontWeight: 600, color: VMT.ink }}>
          Tue · Jun 4 · 14:00 — 15:30
        </div>
        <div style={{ marginTop: 6, fontFamily: VMT.fontBody, fontSize: 14, color: VMT.ink500 }}>
          In <strong style={{ color: VMT.ink }}>14 days</strong> · ¡vamos!
        </div>

        {/* Info rows */}
        <div style={{ marginTop: 22, background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 18, padding: '4px 0' }}>
          {[
            { label: 'Where', value: 'Tea & Tortas, Mission St.', sub: 'Tap to change' },
            { label: 'Who',   value: '5 of 6 going', sub: 'Diego (key) · Maya · João · Sofia · Anya' },
            { label: 'Not coming', value: 'Felipe Costa', sub: 'Sent regrets' },
          ].map((row, i) => (
            <div key={i} style={{ padding: '14px 18px', borderBottom: i < 2 ? `1px solid ${VMT.ink100}` : 'none' }}>
              <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{row.label}</div>
              <div style={{ fontFamily: VMT.fontBody, fontSize: 15, fontWeight: 600, color: VMT.ink, marginTop: 3 }}>{row.value}</div>
              <div style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink500, marginTop: 2 }}>{row.sub}</div>
            </div>
          ))}
        </div>

        {/* Attendees grid */}
        <div style={{ marginTop: 16, padding: '16px 18px', background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 18 }}>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Attendees</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            {SAMPLE_PEOPLE.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={p.name} size={30} isKey={p.isKey} idx={p.colorIdx}/>
                <div style={{ flex: 1, fontFamily: VMT.fontBody, fontSize: 14, fontWeight: 500, color: VMT.ink }}>
                  {p.name}
                  {p.isKey && <span style={{ marginLeft: 8, fontFamily: VMT.fontBody, fontSize: 10, fontWeight: 700, color: VMT.vermillion, padding: '2px 6px', background: VMT.vermillionSoft, borderRadius: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Key</span>}
                </div>
                {i === 5
                  ? <span style={{ fontFamily: VMT.fontBody, fontSize: 12, fontWeight: 600, color: VMT.ink400 }}>regrets</span>
                  : <span style={{ width: 22, height: 22, borderRadius: '50%', background: VMT.success, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 20px 28px', borderTop: `1px solid ${VMT.ink100}`, background: VMT.paper, display: 'flex', gap: 10 }}>
        <SecondaryButton onClick={onHome} full>Back to events</SecondaryButton>
        <button style={{
          fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 15, padding: '13px 18px', borderRadius: 14,
          background: VMT.ink, color: '#fff', border: `1.5px solid ${VMT.ink}`, cursor: 'pointer', flex: 'none',
        }}>Share</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  InviteScreen, AvailabilityScreen, ResultScreen, ConfirmedScreen,
});
