// Vamointao mobile UI kit — screens
// Depends on components.jsx (loaded before this file).

// ─── Sample data ───────────────────────────────────────────────
const SAMPLE_PEOPLE = [
  { name: 'Diego Cruz',   isKey: true,  colorIdx: 0 },
  { name: 'Maya Rivera',  isKey: false, colorIdx: 1 },
  { name: 'João Reis',    isKey: false, colorIdx: 2 },
  { name: 'Sofia Olsen',  isKey: false, colorIdx: 3 },
  { name: 'Anya Patel',   isKey: false, colorIdx: 4 },
  { name: 'Felipe Costa', isKey: false, colorIdx: 5 },
];

const SAMPLE_EVENTS = [
  { id: 1, title: 'Q3 planning lunch',     when: 'Tue · Jun 04 · 14:00', status: 'locked',  people: SAMPLE_PEOPLE.slice(0, 6) },
  { id: 2, title: 'Birthday drinks for Sofia', when: '5 of 6 responded',      status: 'pending', people: SAMPLE_PEOPLE.slice(0, 4) },
  { id: 3, title: 'Book club: Mariana Enríquez', when: 'Sat · Jun 15 · 19:30', status: 'locked',  people: SAMPLE_PEOPLE.slice(0, 3) },
  { id: 4, title: 'Coffee with the design crew', when: '3 of 4 responded',     status: 'pending', people: SAMPLE_PEOPLE.slice(1, 4) },
];

// ─── 1 · Onboarding ────────────────────────────────────────────
function OnboardingScreen({ onContinue }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper, padding: '60px 28px 32px', position: 'relative', overflow: 'hidden' }}>
      {/* Big decorative dot */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: VMT.vermillion, opacity: 0.95 }}/>
      <div style={{ position: 'absolute', top: 40, right: 30, width: 28, height: 28, borderRadius: '50%', background: VMT.spark, border: `2px solid ${VMT.ink}` }}/>

      <div style={{ marginTop: 40, fontFamily: VMT.fontBody, fontSize: 14, fontWeight: 600, color: VMT.ink600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        👋 Hey
      </div>

      <h1 style={{
        marginTop: 10, fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 56,
        lineHeight: 0.96, letterSpacing: '-0.035em', color: VMT.ink, margin: '10px 0 0',
      }}>Let's find<br/>a time<br/>that works.</h1>

      <p style={{
        marginTop: 24, fontFamily: VMT.fontBody, fontSize: 17, lineHeight: 1.5,
        color: VMT.ink600, maxWidth: 320, textWrap: 'pretty',
      }}>You pick the people and a window. The AI does the math so nobody has to argue about Tuesday.</p>

      <div style={{ flex: 1 }}/>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PrimaryButton onClick={onContinue} size="lg">Get started — it's free</PrimaryButton>
        <GhostButton>I already have an account</GhostButton>
      </div>
    </div>
  );
}

// ─── 2 · Home / event list ─────────────────────────────────────
function EventListItem({ event, onClick }) {
  const isLocked = event.status === 'locked';
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left',
      background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 20,
      padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12,
      cursor: 'pointer', fontFamily: VMT.fontBody,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ fontFamily: VMT.fontMono, fontSize: 11, fontWeight: 600, color: VMT.ink400, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{event.when}</div>
          <div style={{ fontFamily: VMT.fontDisplay, fontSize: 19, fontWeight: 600, color: VMT.ink, letterSpacing: '-0.01em', marginTop: 4, lineHeight: 1.2 }}>{event.title}</div>
        </div>
        <span style={{
          fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 6,
          textTransform: 'uppercase', letterSpacing: '0.05em', flex: 'none',
          background: isLocked ? VMT.successSoft : VMT.warnSoft,
          color: isLocked ? VMT.success : '#9D6B0C',
        }}>{isLocked ? 'locked in' : 'waiting'}</span>
      </div>
      <AvatarStack people={event.people} size={28} max={5}/>
    </button>
  );
}

function HomeScreen({ onNewEvent, onOpen, onChangeNav }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader large title=""/>
      <div style={{ padding: '12px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 13, fontWeight: 500, color: VMT.ink500 }}>Buenas, Sofia</div>
          <h1 style={{ margin: '4px 0 0', fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 38, letterSpacing: '-0.025em', color: VMT.ink, lineHeight: 1 }}>Your events</h1>
        </div>
        <button onClick={onNewEvent} style={{
          fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 13,
          padding: '9px 14px', borderRadius: 999, background: VMT.ink, color: '#fff',
          border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>+ New</button>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, padding: '20px 20px 12px', overflowX: 'auto' }}>
        {['Upcoming', 'Waiting', 'Past', 'All'].map((c, i) => (
          <span key={c} style={{
            fontFamily: VMT.fontBody, fontSize: 13, fontWeight: 500,
            padding: '7px 14px', borderRadius: 999, flex: 'none',
            border: `1px solid ${i === 0 ? VMT.ink : VMT.ink100}`,
            background: i === 0 ? VMT.ink : VMT.white,
            color: i === 0 ? '#fff' : VMT.ink700,
          }}>{c}</span>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 20 }}>
        {SAMPLE_EVENTS.map(ev => <EventListItem key={ev.id} event={ev} onClick={() => onOpen?.(ev)}/>)}
      </div>

      <BottomNav active="home" onChange={onChangeNav}/>
    </div>
  );
}

// ─── 3 · Create event ──────────────────────────────────────────
function CreateScreen({ onBack, onNext }) {
  const [title, setTitle] = React.useState('Q3 planning lunch');
  const [keyPerson, setKeyPerson] = React.useState('Diego Cruz');
  const [from, setFrom] = React.useState('Jun 03');
  const [to, setTo] = React.useState('Jun 14');
  const [duration, setDuration] = React.useState('1.5h');

  const fieldLabel = { fontFamily: VMT.fontBody, fontSize: 12, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.04em', textTransform: 'uppercase' };
  const fieldInput = { fontFamily: VMT.fontBody, fontSize: 16, fontWeight: 500, color: VMT.ink, padding: '14px 16px', border: `1.5px solid ${VMT.ink100}`, borderRadius: 14, background: VMT.white, width: '100%', boxSizing: 'border-box', outline: 'none' };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader title="New event" back={onBack}/>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={fieldLabel}>What are we meeting about?</label>
            <input value={title} onChange={e => setTitle(e.target.value)} style={{ ...fieldInput, fontFamily: VMT.fontDisplay, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}/>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={fieldLabel}>Key person</label>
            <div style={{ ...fieldInput, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
              <Avatar name={keyPerson} size={32} isKey idx={0}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 15, color: VMT.ink }}>{keyPerson}</div>
                <div style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink500 }}>Their availability is weighted highest</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={fieldLabel}>Window</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input value={from} onChange={e => setFrom(e.target.value)} style={{ ...fieldInput, fontFamily: VMT.fontMono, fontWeight: 500 }}/>
              <input value={to}   onChange={e => setTo(e.target.value)}   style={{ ...fieldInput, fontFamily: VMT.fontMono, fontWeight: 500 }}/>
            </div>
            <div style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink500 }}>The AI will only suggest dates inside this range.</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={fieldLabel}>Duration</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['30m','1h','1.5h','2h','½ day','Custom'].map(d => (
                <button key={d} onClick={() => setDuration(d)} style={{
                  fontFamily: VMT.fontBody, fontWeight: 500, fontSize: 13,
                  padding: '8px 14px', borderRadius: 999,
                  border: `1.5px solid ${duration === d ? VMT.ink : VMT.ink100}`,
                  background: duration === d ? VMT.ink : VMT.white,
                  color: duration === d ? '#fff' : VMT.ink700, cursor: 'pointer',
                }}>{d}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 20px 28px', borderTop: `1px solid ${VMT.ink100}`, background: VMT.paper }}>
        <PrimaryButton onClick={onNext}>Next: invite people →</PrimaryButton>
      </div>
    </div>
  );
}

Object.assign(window, {
  SAMPLE_PEOPLE, SAMPLE_EVENTS,
  OnboardingScreen, HomeScreen, CreateScreen,
});
