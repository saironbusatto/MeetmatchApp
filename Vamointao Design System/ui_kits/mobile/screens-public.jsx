// Vamointao mobile — públic events screens
// Depends on components.jsx

// ─── Public Events Home ────────────────────────────────────────
function PublicEventsHome({ onNewPublic, onOpen, onChangeNav }) {
  const publicEvents = [
    {
      id: 1,
      title: 'Futebol na quadra de salão',
      when: 'Sex · Jun 07 · 20:00',
      location: 'Quadra Arena 5',
      category: 'Sports',
      people: SAMPLE_PEOPLE.slice(0, 4),
      current: 8,
      max: 12,
      color: '#FF3B2E',
      isHosted: false,
    },
    {
      id: 2,
      title: 'Volley de praia',
      when: 'Sáb · Jun 08 · 18:00',
      location: 'Praia do Leblon',
      category: 'Sports',
      people: SAMPLE_PEOPLE.slice(1, 5),
      current: 6,
      max: 10,
      color: '#2A6F7A',
      isHosted: false,
    },
    {
      id: 3,
      title: 'Show de Rock — Caverna Pub',
      when: 'Sex · Jun 07 · 22:00',
      location: 'Caverna Pub · Lapa',
      category: 'Music',
      people: SAMPLE_PEOPLE.slice(0, 5),
      current: 24,
      max: 80,
      color: '#7A5BAA',
      isHosted: false,
    },
    {
      id: 4,
      title: 'Pagodinho no bar da esquina',
      when: 'Sáb · Jun 08 · 21:00',
      location: 'Bar do Zé',
      category: 'Music',
      people: SAMPLE_PEOPLE.slice(2, 6),
      current: 12,
      max: 40,
      color: '#C99B00',
      isHosted: false,
    },
  ];

  const getOccupancy = (current, max) => Math.round((current / max) * 100);
  const occupancyColor = (pct) => {
    if (pct < 50) return VMT.success;
    if (pct < 80) return VMT.warn;
    return VMT.vermillion;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader large title=""/>
      <div style={{ padding: '12px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 13, fontWeight: 500, color: VMT.ink500 }}>O que está rolando</div>
          <h1 style={{ margin: '4px 0 0', fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 38, letterSpacing: '-0.025em', color: VMT.ink, lineHeight: 1 }}>Perto de você</h1>
        </div>
        <button onClick={onNewPublic} style={{
          fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 13,
          padding: '9px 14px', borderRadius: 999, background: VMT.ink, color: '#fff',
          border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>+ Host</button>
      </div>

      {/* Category filter chips */}
      <div style={{ display: 'flex', gap: 8, padding: '20px 20px 12px', overflowX: 'auto' }}>
        {['All', 'Sports', 'Music', 'Social', 'Food'].map((c, i) => (
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
        {publicEvents.map(ev => {
          const occ = getOccupancy(ev.current, ev.max);
          const occColor = occupancyColor(occ);
          const isFull = occ >= 100;
          return (
            <button key={ev.id} onClick={() => onOpen?.(ev)} style={{
              width: '100%', textAlign: 'left', background: VMT.white,
              border: isFull ? `2px solid ${VMT.vermillion}` : `1px solid ${VMT.ink100}`,
              borderRadius: 20, padding: '16px 18px',
              display: 'flex', flexDirection: 'column', gap: 12,
              cursor: 'pointer', fontFamily: VMT.fontBody,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: VMT.fontMono, fontSize: 11, fontWeight: 600, color: VMT.ink400, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{ev.when}</div>
                  <div style={{ fontFamily: VMT.fontDisplay, fontSize: 19, fontWeight: 600, color: VMT.ink, letterSpacing: '-0.01em', marginTop: 4, lineHeight: 1.2 }}>{ev.title}</div>
                  <div style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink500, marginTop: 4 }}>📍 {ev.location}</div>
                </div>
                <span style={{
                  fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 6,
                  textTransform: 'uppercase', letterSpacing: '0.05em', flex: 'none', background: ev.color + '20', color: ev.color,
                }}>{ev.category}</span>
              </div>

              {/* Occupancy bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 6, background: VMT.ink100, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: occColor, width: `${Math.min(occ, 100)}%`,
                    transition: 'width 200ms',
                  }}/>
                </div>
                <span style={{
                  fontFamily: VMT.fontMono, fontSize: 11, fontWeight: 600, color: occColor, minWidth: 36,
                  textAlign: 'right',
                }}>
                  {ev.current}/{ev.max}
                </span>
              </div>

              {isFull && (
                <div style={{
                  fontFamily: VMT.fontBody, fontSize: 12, fontWeight: 600,
                  color: VMT.vermillion, padding: '6px 10px',
                  background: VMT.vermillionSoft, borderRadius: 8,
                }}> ⚠️ Lotado!</div>
              )}

              <AvatarStack people={ev.people} size={28} max={5}/>
            </button>
          );
        })}
      </div>

      <BottomNav active="public" onChange={onChangeNav}/>
    </div>
  );
}

// ─── Create Public Event ───────────────────────────────────────
function CreatePublicEvent({ onBack, onNext }) {
  const [title, setTitle] = React.useState('Show de Rock');
  const [location, setLocation] = React.useState('Caverna Pub · Lapa');
  const [category, setCategory] = React.useState('Music');
  const [when, setWhen] = React.useState('Jun 07 · 22:00');
  const [maxCap, setMaxCap] = React.useState('80');
  const [desc, setDesc] = React.useState('banda ao vivo até madrugada');

  const fieldLabel = { fontFamily: VMT.fontBody, fontSize: 12, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.04em', textTransform: 'uppercase' };
  const fieldInput = { fontFamily: VMT.fontBody, fontSize: 16, fontWeight: 500, color: VMT.ink, padding: '14px 16px', border: `1.5px solid ${VMT.ink100}`, borderRadius: 14, background: VMT.white, width: '100%', boxSizing: 'border-box', outline: 'none' };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader title="Criar evento público" back={onBack}/>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={fieldLabel}>Nome do evento</label>
            <input value={title} onChange={e => setTitle(e.target.value)} style={{ ...fieldInput, fontFamily: VMT.fontDisplay, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}/>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={fieldLabel}>Local</label>
            <input value={location} onChange={e => setLocation(e.target.value)} style={fieldInput}/>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={fieldLabel}>Categoria</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...fieldInput, cursor: 'pointer' }}>
              <option>Sports</option>
              <option>Music</option>
              <option>Social</option>
              <option>Food</option>
              <option>Art</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={fieldLabel}>Data e hora</label>
            <input value={when} onChange={e => setWhen(e.target.value)} style={fieldInput}/>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={fieldLabel}>Lotação máxima</label>
            <input value={maxCap} onChange={e => setMaxCap(e.target.value)} style={{ ...fieldInput, fontFamily: VMT.fontMono }} type="number"/>
            <div style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink500 }}>Quantas pessoas cabem?</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={fieldLabel}>Descrição breve</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} style={{ ...fieldInput, minHeight: 80, fontFamily: VMT.fontBody, resize: 'vertical' }}/>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 20px 28px', borderTop: `1px solid ${VMT.ink100}`, background: VMT.paper }}>
        <PrimaryButton onClick={onNext}>Criar e começar a vender →</PrimaryButton>
      </div>
    </div>
  );
}

// ─── Public Event Details (for viewing & joining) ─────────────
function PublicEventDetails({ event, onBack, onJoin }) {
  const occ = Math.round((event.current / event.max) * 100);
  const isFull = occ >= 100;
  const occupancyColor = occ < 50 ? VMT.success : (occ < 80 ? VMT.warn : VMT.vermillion);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader title={event.title} back={onBack}/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 20px' }}>
        {/* Hero card */}
        <div style={{
          background: event.color + '15', border: `2px solid ${event.color}50`,
          borderRadius: 20, padding: '18px 20px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, color: event.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>📍 {event.location}</span>
          </div>
          <div style={{ fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 28, letterSpacing: '-0.015em', color: VMT.ink, lineHeight: 1.1, marginBottom: 8 }}>
            {event.title}
          </div>
          <div style={{ fontFamily: VMT.fontMono, fontSize: 15, fontWeight: 600, color: VMT.ink600 }}>
            {event.when}
          </div>
        </div>

        {/* Occupancy */}
        <div style={{ background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 16, padding: '16px 18px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Lotação</div>
            <div style={{ fontFamily: VMT.fontMono, fontSize: 14, fontWeight: 700, color: occupancyColor }}>{occ}% · {event.current}/{event.max}</div>
          </div>
          <div style={{ height: 8, background: VMT.ink100, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ height: '100%', background: occupancyColor, width: `${Math.min(occ, 100)}%` }}/>
          </div>
          {isFull
            ? <div style={{ fontFamily: VMT.fontBody, fontSize: 13, color: VMT.vermillion, fontWeight: 600 }}>⚠️ Evento lotado</div>
            : <div style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink600 }}>Ainda há {event.max - event.current} lugares</div>}
        </div>

        {/* Attendees */}
        <div style={{ background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 16, padding: '16px 18px', marginBottom: 16 }}>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Quem já vai</div>
          <AvatarStack people={event.people} size={36} max={6}/>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 13, color: VMT.ink600, marginTop: 12 }}>
            <strong style={{ color: VMT.ink }}>+{event.current - event.people.length} outras pessoas</strong> já se inscreveram.
          </div>
        </div>

        {/* About */}
        <div style={{ background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 16, padding: '16px 18px' }}>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>O que é</div>
          <p style={{ margin: 0, fontFamily: VMT.fontBody, fontSize: 14, color: VMT.ink700, lineHeight: 1.5 }}>
            {event.title}. Venha se divertir, conhecer gente legal, e quem sabe encontrar alguém especial lá.
          </p>
        </div>
      </div>

      <div style={{ padding: '12px 20px 28px', borderTop: `1px solid ${VMT.ink100}`, background: VMT.paper }}>
        <PrimaryButton onClick={onJoin} disabled={isFull}>
          {isFull ? '❌ Lotado' : '✓ Eu vou!'}
        </PrimaryButton>
      </div>
    </div>
  );
}

Object.assign(window, {
  PublicEventsHome, CreatePublicEvent, PublicEventDetails,
});
