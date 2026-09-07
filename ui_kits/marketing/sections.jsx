// Farmei marketing sections — Hero, Features, How it works, Pricing, CTA

// ─── Hero ───────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: VMT.paper, padding: '80px 28px 100px' }}>
      {/* Decorative geometry */}
      <div style={{ position: 'absolute', top: -80, right: -100, width: 360, height: 360, borderRadius: '50%', background: VMT.vermillion, opacity: 0.95 }}/>
      <div style={{ position: 'absolute', top: 120, right: 200, width: 70, height: 70, borderRadius: '50%', background: VMT.spark, border: `3px solid ${VMT.ink}` }}/>
      <div style={{ position: 'absolute', top: 360, right: 60, width: 30, height: 30, borderRadius: '50%', background: VMT.ink }}/>

      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 60, alignItems: 'center', position: 'relative' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 6px', background: VMT.white, border: `1.5px solid ${VMT.ink}`, borderRadius: 999, boxShadow: `2px 2px 0 ${VMT.ink}` }}>
            <span style={{ background: VMT.spark, padding: '3px 9px', borderRadius: 999, fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, color: VMT.ink, letterSpacing: '0.06em', textTransform: 'uppercase' }}>New</span>
            <span style={{ fontFamily: VMT.fontBody, fontSize: 13, fontWeight: 500, color: VMT.ink700 }}>AI now respects key-person priority</span>
          </div>

          <h1 style={{
            margin: '22px 0 0', fontFamily: VMT.fontDisplay, fontWeight: 700,
            fontSize: 92, lineHeight: 0.92, letterSpacing: '-0.038em', color: VMT.ink,
            textWrap: 'pretty', maxWidth: 760,
          }}>
            Find a time<br/>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              that works<span style={{ position: 'absolute', right: -18, top: 6, width: 24, height: 24, borderRadius: '50%', background: VMT.vermillion }}/>
            </span><br/>
            for everyone.
          </h1>

          <p style={{
            margin: '52px 0 0', maxWidth: 480,
            fontFamily: VMT.fontBody, fontSize: 19, lineHeight: 1.45, color: VMT.ink600,
            textWrap: 'pretty',
          }}>
            You name the people and a window. The AI weighs everyone's availability — with extra clout for the one who has to be there — and picks the date.
          </p>

          <div style={{ marginTop: 36, display: 'flex', gap: 14, alignItems: 'center' }}>
            <StampButton variant="primary" size="lg">Start scheduling — free</StampButton>
            <StampButton variant="outline" size="lg">See how it works</StampButton>
          </div>

          <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex' }}>
              {['#FF3B2E','#2A6F7A','#7A5BAA','#C99B00'].map((c, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i === 0 ? 0 : -10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: VMT.fontBody, fontWeight: 700, fontSize: 12 }}>
                  {['D','M','JR','S'][i]}
                </div>
              ))}
            </div>
            <span style={{ fontFamily: VMT.fontBody, fontSize: 14, color: VMT.ink600 }}>
              <strong style={{ color: VMT.ink }}>12,400+</strong> meetings wrangled this month
            </span>
          </div>
        </div>

        {/* Hero visual — stacked AI suggestion card + small calendar */}
        <div style={{ position: 'relative', height: 540 }}>
          {/* Behind: tiny calendar grid */}
          <div style={{ position: 'absolute', right: 0, top: 18, transform: 'rotate(4deg)', width: 280, background: VMT.white, border: `2px solid ${VMT.ink}`, borderRadius: 18, padding: 16, boxShadow: `4px 4px 0 ${VMT.ink}` }}>
            <div style={{ fontFamily: VMT.fontMono, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Jun 2026</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {Array.from({ length: 28 }).map((_, i) => {
                const d = i + 1;
                const isPick = d === 4;
                const isOther = [3, 5, 10].includes(d);
                return (
                  <div key={i} style={{
                    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: VMT.fontMono, fontSize: 11, fontWeight: 600,
                    background: isPick ? VMT.spark : (isOther ? VMT.successSoft : 'transparent'),
                    color: isPick ? VMT.ink : (isOther ? VMT.success : VMT.ink700),
                    borderRadius: 4,
                    border: isPick ? `1.5px solid ${VMT.ink}` : 'none',
                  }}>{d}</div>
                );
              })}
            </div>
          </div>

          {/* Front: AI suggestion card */}
          <div style={{ position: 'absolute', left: 0, top: 200, width: 360, background: VMT.spark, border: `2px solid ${VMT.ink}`, borderRadius: 24, padding: '24px 26px', boxShadow: `6px 6px 0 ${VMT.ink}`, transform: 'rotate(-3deg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, color: VMT.ink, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              <Sparkle size={14} color={VMT.ink}/> Farmei AI · best fit
            </div>
            <div style={{ fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 56, lineHeight: 0.95, letterSpacing: '-0.035em', color: VMT.ink, marginTop: 12 }}>
              Tuesday<br/>Jun 4
            </div>
            <div style={{ fontFamily: VMT.fontMono, fontSize: 18, fontWeight: 600, color: VMT.ink700, marginTop: 8 }}>14:00 — 15:30</div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1.5px dashed ${VMT.ink}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex' }}>
                {['#FF3B2E','#2A6F7A','#7A5BAA','#C99B00','#2EA862'].map((c, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i === 0 ? 0 : -8 }}/>
                ))}
              </div>
              <span style={{ fontFamily: VMT.fontBody, fontSize: 13, fontWeight: 600, color: VMT.ink }}>5 of 6 in</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Name the meeting', body: 'A title, a key person, and a window. Done in 20 seconds.' },
    { n: '02', title: 'Invite the crew', body: 'Drop in names or @handles. Mark whoever has to be there.' },
    { n: '03', title: 'Everyone marks dates', body: 'A calendar tap to cycle yes / maybe / no. No accounts required.' },
    { n: '04', title: 'AI picks the day', body: 'Weighed by who matters most. Locks in with one tap.' },
  ];
  return (
    <section style={{ background: VMT.white, padding: '96px 28px', borderTop: `1px solid ${VMT.ink100}`, borderBottom: `1px solid ${VMT.ink100}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontFamily: VMT.fontBody, fontSize: 12, fontWeight: 600, color: VMT.vermillion, letterSpacing: '0.14em', textTransform: 'uppercase' }}>How it works</div>
            <h2 style={{ margin: '10px 0 0', fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 56, letterSpacing: '-0.03em', lineHeight: 1, color: VMT.ink }}>Four taps, one date.</h2>
          </div>
          <p style={{ margin: 0, maxWidth: 420, fontFamily: VMT.fontBody, fontSize: 17, lineHeight: 1.5, color: VMT.ink600 }}>
            No back-and-forth threads, no doodle hellscapes. We replaced the meeting about the meeting.
          </p>
        </div>
        <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{
              background: i === 3 ? VMT.spark : VMT.paper,
              border: `2px solid ${VMT.ink}`, borderRadius: 20, padding: 24,
              boxShadow: `4px 4px 0 ${VMT.ink}`,
              display: 'flex', flexDirection: 'column', gap: 14, minHeight: 240,
            }}>
              <div style={{ fontFamily: VMT.fontMono, fontSize: 13, fontWeight: 700, color: VMT.ink, letterSpacing: '0.08em' }}>{s.n}</div>
              {i === 3 && <Sparkle size={26} color={VMT.ink}/>}
              <div style={{ fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 22, letterSpacing: '-0.015em', color: VMT.ink, lineHeight: 1.1, marginTop: 'auto' }}>{s.title}</div>
              <div style={{ fontFamily: VMT.fontBody, fontSize: 14, lineHeight: 1.45, color: VMT.ink700, textWrap: 'pretty' }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features grid ────────────────────────────────────────────
function Features() {
  const feats = [
    { tag: 'AI', headline: 'It weighs your key person.', body: 'Mark the one person who has to attend. The AI ranks dates by them first, then everyone else.', big: true, bg: VMT.ink, fg: '#fff', accent: VMT.spark },
    { tag: 'Calendar', headline: 'Yes · maybe · no.', body: 'Tap to cycle. Maybes carry half-weight. No accounts needed for the people you invite.', bg: VMT.vermillion, fg: '#fff', accent: VMT.spark },
    { tag: 'Privacy', headline: "We don't see what's on your calendar.", body: "You tell us when you're free; we don't sync your work calendar in.", bg: VMT.white, fg: VMT.ink, accent: VMT.vermillion },
    { tag: 'Exceptions', headline: 'Pin a hard window.', body: 'Cap how far out the AI can search. Block holidays. Lock specific times of day.', bg: VMT.paper, fg: VMT.ink, accent: VMT.vermillion },
    { tag: 'Conflicts', headline: 'Heads up when someone bails.', body: 'A clear nudge with one-tap alternatives. No silent reschedules.', bg: VMT.white, fg: VMT.ink, accent: VMT.vermillion },
  ];
  return (
    <section style={{ background: VMT.paper, padding: '96px 28px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontFamily: VMT.fontBody, fontSize: 12, fontWeight: 600, color: VMT.vermillion, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Why people switch</div>
        <h2 style={{ margin: '10px 0 56px', fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 56, letterSpacing: '-0.03em', lineHeight: 1, color: VMT.ink, maxWidth: 760 }}>
          Built for the part calendars never solve — the people.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 22 }}>
          {feats.map((f, i) => (
            <div key={i} style={{
              gridColumn: f.big ? 'span 1' : 'auto',
              gridRow: f.big ? 'span 2' : 'auto',
              background: f.bg, color: f.fg,
              border: `2px solid ${VMT.ink}`, borderRadius: 22, padding: f.big ? '32px 30px' : 24,
              boxShadow: `4px 4px 0 ${VMT.ink}`,
              display: 'flex', flexDirection: 'column', gap: 12,
              minHeight: f.big ? 'auto' : 220,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  padding: '4px 10px', background: f.accent,
                  color: f.bg === VMT.spark ? VMT.ink : (f.accent === VMT.spark ? VMT.ink : '#fff'),
                  fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 999,
                  border: `1.5px solid ${VMT.ink}`,
                }}>{f.tag}</span>
              </div>
              <div style={{ fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: f.big ? 38 : 26, letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: f.big ? 'auto' : 0, textWrap: 'pretty' }}>{f.headline}</div>
              <div style={{ fontFamily: VMT.fontBody, fontSize: 15, lineHeight: 1.5, opacity: f.fg === '#fff' ? 0.85 : 0.8, textWrap: 'pretty' }}>{f.body}</div>
              {f.big && (
                <div style={{ marginTop: 24, padding: '18px 20px', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${VMT.spark}`, borderRadius: 16 }}>
                  <div style={{ fontFamily: VMT.fontMono, fontSize: 11, fontWeight: 700, color: VMT.spark, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Reasoning</div>
                  <div style={{ fontFamily: VMT.fontBody, fontSize: 14, color: '#fff', marginTop: 6, lineHeight: 1.45 }}>
                    "Tue Jun 4 is the earliest day inside your window where Diego (key) is free. Only Felipe can't make it."
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    { name: 'Free', price: '$0', sub: 'forever', desc: 'For families, friend groups, book clubs.', cta: 'Get started', highlight: false, feats: ['Unlimited events','Up to 8 invitees per event','AI date picker','Email reminders'] },
    { name: 'Crew', price: '$6', sub: 'per month', desc: 'For teams of 5–25 who meet a lot.', cta: 'Start a 14-day trial', highlight: true, feats: ['Everything in Free','Unlimited invitees','Key-person priority','Custom windows & exceptions','Group calendars','Priority AI']},
    { name: 'Org', price: 'Custom', sub: 'annual', desc: 'For companies with 100+ people.', cta: 'Talk to us', highlight: false, feats: ['Everything in Crew','SSO + SCIM','Admin controls','Custom retention','Dedicated support'] },
  ];
  return (
    <section style={{ background: VMT.white, padding: '96px 28px', borderTop: `1px solid ${VMT.ink100}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 12, fontWeight: 600, color: VMT.vermillion, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Pricing</div>
          <h2 style={{ margin: '10px 0 0', fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 56, letterSpacing: '-0.03em', lineHeight: 1, color: VMT.ink }}>Free for friends. Worth it for crews.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {tiers.map(t => (
            <div key={t.name} style={{
              background: t.highlight ? VMT.ink : VMT.paper,
              color: t.highlight ? '#fff' : VMT.ink,
              border: `2px solid ${VMT.ink}`, borderRadius: 22, padding: 28,
              boxShadow: t.highlight ? `6px 6px 0 ${VMT.vermillion}` : `4px 4px 0 ${VMT.ink}`,
              display: 'flex', flexDirection: 'column', gap: 18, position: 'relative',
            }}>
              {t.highlight && (
                <span style={{ position: 'absolute', top: -14, right: 18, background: VMT.spark, color: VMT.ink, padding: '4px 12px', borderRadius: 999, fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', border: `1.5px solid ${VMT.ink}` }}>Most popular</span>
              )}
              <div>
                <div style={{ fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 22, letterSpacing: '-0.01em' }}>{t.name}</div>
                <div style={{ fontFamily: VMT.fontBody, fontSize: 14, opacity: 0.7, marginTop: 4 }}>{t.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 56, letterSpacing: '-0.035em', lineHeight: 1 }}>{t.price}</span>
                <span style={{ fontFamily: VMT.fontBody, fontSize: 14, opacity: 0.7 }}>{t.sub}</span>
              </div>
              <div style={{ height: 1, background: t.highlight ? VMT.ink700 : VMT.ink100 }}/>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t.feats.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: VMT.fontBody, fontSize: 14 }}>
                    <span style={{
                      width: 18, height: 18, flex: 'none', borderRadius: '50%',
                      background: t.highlight ? VMT.spark : VMT.ink, color: t.highlight ? VMT.ink : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, marginTop: 2,
                    }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <StampButton variant={t.highlight ? 'spark' : 'outline'} size="md" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}>{t.cta}</StampButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Closing CTA ──────────────────────────────────────────────
function ClosingCTA() {
  return (
    <section style={{ background: VMT.vermillion, padding: '96px 28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: -120, left: -80, width: 320, height: 320, borderRadius: '50%', background: VMT.spark, border: `4px solid ${VMT.ink}` }}/>
      <div style={{ position: 'absolute', top: 60, right: 80, width: 24, height: 24, borderRadius: '50%', background: VMT.ink }}/>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <h2 style={{ margin: 0, fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 88, letterSpacing: '-0.035em', lineHeight: 0.95, color: '#fff' }}>
          ¡Vamos —<br/>let's pick a day.
        </h2>
        <p style={{ margin: '24px auto 36px', fontFamily: VMT.fontBody, fontSize: 19, color: '#fff', opacity: 0.9, maxWidth: 540 }}>
          Free, forever, for the events that matter most. No card, no calendar sync, no nonsense.
        </p>
        <StampButton variant="spark" size="lg">Start scheduling now</StampButton>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, HowItWorks, Features, Pricing, ClosingCTA });
