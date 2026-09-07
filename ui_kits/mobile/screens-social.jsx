// Farmei mobile — host management + social features

// ─── Host Dashboard (gerenciar evento público) ──────────────
function HostDashboard({ event, onBack }) {
  const [attendees, setAttendees] = React.useState([
    { ...SAMPLE_PEOPLE[0], confirmed: true,  arrivedAt: '21:50' },
    { ...SAMPLE_PEOPLE[1], confirmed: true,  arrivedAt: null },
    { ...SAMPLE_PEOPLE[2], confirmed: false, arrivedAt: null },
    { ...SAMPLE_PEOPLE[3], confirmed: true,  arrivedAt: '21:35' },
    { name: 'Tomás Ribeiro', confirmed: false, arrivedAt: null, colorIdx: 6 },
    { name: 'Lucia Marín',   confirmed: true,  arrivedAt: '21:45', colorIdx: 4 },
  ]);

  const confirmed = attendees.filter(a => a.confirmed).length;
  const arrived = attendees.filter(a => a.arrivedAt).length;

  const toggleConfirm = (idx) => {
    const updated = [...attendees];
    updated[idx].confirmed = !updated[idx].confirmed;
    setAttendees(updated);
  };

  const removeAttendee = (idx) => {
    setAttendees(attendees.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader title="Gerenciar" back={onBack}/>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        {/* Event recap */}
        <div style={{ background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 16, padding: '16px 18px', marginBottom: 18 }}>
          <div style={{ fontFamily: VMT.fontDisplay, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', color: VMT.ink, marginBottom: 6 }}>{event.title}</div>
          <div style={{ fontFamily: VMT.fontMono, fontSize: 12, color: VMT.ink600, marginBottom: 10 }}>{event.when}</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: VMT.ink50, padding: '10px 12px', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontFamily: VMT.fontMono, fontSize: 13, fontWeight: 700, color: VMT.ink }}>{confirmed}</div>
              <div style={{ fontFamily: VMT.fontBody, fontSize: 11, color: VMT.ink500 }}>confirmados</div>
            </div>
            <div style={{ background: VMT.successSoft, padding: '10px 12px', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontFamily: VMT.fontMono, fontSize: 13, fontWeight: 700, color: VMT.success }}>{arrived}</div>
              <div style={{ fontFamily: VMT.fontBody, fontSize: 11, color: VMT.success }}>chegaram</div>
            </div>
          </div>
        </div>

        {/* Attendee list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 4px' }}>Inscritos ({attendees.length})</div>
          {attendees.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 12,
            }}>
              <Avatar name={a.name} size={34} idx={a.colorIdx || i}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 14, color: VMT.ink }}>{a.name}</div>
                <div style={{ fontFamily: VMT.fontBody, fontSize: 11, color: VMT.ink500, marginTop: 2 }}>
                  {a.arrivedAt ? `Chegou ${a.arrivedAt}` : (a.confirmed ? 'Confirmado' : 'Pendente')}
                </div>
              </div>

              {/* Check in button */}
              {!a.arrivedAt && (
                <button onClick={() => {
                  const updated = [...attendees];
                  updated[i].arrivedAt = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  setAttendees(updated);
                }} style={{
                  fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 12,
                  padding: '6px 10px', borderRadius: 8,
                  background: VMT.success, color: '#fff', border: 'none', cursor: 'pointer',
                }}>✓ Check in</button>
              )}

              {/* Delete button */}
              <button onClick={() => removeAttendee(i)} style={{
                width: 28, height: 28, borderRadius: 6,
                background: VMT.vermillionSoft, color: VMT.vermillion, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, padding: 0,
              }}>×</button>
            </div>
          ))}
        </div>

        {/* Export button */}
        <button style={{
          marginTop: 20, width: '100%',
          fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 14,
          padding: '12px 16px', borderRadius: 14,
          background: VMT.ink, color: '#fff', border: `1.5px solid ${VMT.ink}`,
          cursor: 'pointer',
        }} onClick={() => alert('✓ Lista exportada para:\n📧 seu.email@example.com\n\n' + attendees.map(a => `${a.name} (${a.arrivedAt || 'não chegou'})`).join('\n'))}>
          📥 Exportar lista (merchandise)
        </button>
      </div>
    </div>
  );
}

// ─── Crush Finder (ver quem mais vai) ───────────────────────
function CrushFinder({ onBack }) {
  // Simulado: pessoas que você segue no Instagram que vão em eventos
  const instagramFriends = [
    { name: 'Maya Rivera',  mutual: true,  events: ['Volley de praia', 'Show de Rock'], color: 1, instagram: '@maya_rivera' },
    { name: 'Sofia Olsen',  mutual: true,  events: ['Pagodinho no bar'], color: 3, instagram: '@sofiao' },
    { name: 'Anya Patel',   mutual: false, events: ['Show de Rock', 'Futebol'], color: 4, instagram: '@anya_patel' },
    { name: 'Felipe Costa', mutual: true,  events: ['Futebol na quadra'], color: 5, instagram: '@felipedc' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader title="Crush finder" back={onBack}/>

      <div style={{ padding: '12px 20px', background: VMT.paper }}>
        <p style={{ margin: 0, fontFamily: VMT.fontBody, fontSize: 14, color: VMT.ink600, lineHeight: 1.5, textWrap: 'pretty' }}>
          Pessoas que você segue no Instagram e estão yendo nos mesmos eventos. Talvez encontrem-se lá.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 20px' }}>
        {instagramFriends.map((friend, i) => (
          <div key={i} style={{
            background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 16,
            padding: '14px 16px', marginBottom: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Avatar name={friend.name} size={40} idx={friend.color}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 15, color: VMT.ink }}>{friend.name}</div>
                  {friend.mutual && <span style={{ fontFamily: VMT.fontBody, fontSize: 11, color: VMT.success, fontWeight: 600 }}>👫 Mutual</span>}
                </div>
                <div style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink500, marginTop: 2 }}>{friend.instagram}</div>
              </div>
              <button style={{
                fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 12,
                padding: '7px 12px', borderRadius: 8,
                background: VMT.ink, color: '#fff', border: 'none', cursor: 'pointer',
              }}>DM</button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {friend.events.map(ev => (
                <span key={ev} style={{
                  fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 500,
                  padding: '4px 10px', borderRadius: 999,
                  background: VMT.ink50, color: VMT.ink700,
                }}>
                  📍 {ev}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Map View (eventos próximos) ────────────────────────────
function MapView({ onBack, onEventDetail }) {
  // Simulado: mapa com pins de eventos
  const [filter, setFilter] = React.useState('all');

  const nearbyEvents = [
    { title: 'Futebol na quadra de salão',    dist: '0.8 km', color: '#FF3B2E' },
    { title: 'Volley de praia',               dist: '2.1 km', color: '#2A6F7A' },
    { title: 'Show de Rock — Caverna Pub',    dist: '0.5 km', color: '#7A5BAA' },
    { title: 'Pagodinho no bar da esquina',   dist: '1.2 km', color: '#C99B00' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader title="Mapa" back={onBack}/>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto' }}>
        {['All', 'Sports', 'Music', 'Social'].map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            fontFamily: VMT.fontBody, fontSize: 13, fontWeight: 600,
            padding: '7px 14px', borderRadius: 999, flex: 'none',
            border: `1px solid ${filter === c ? VMT.ink : VMT.ink100}`,
            background: filter === c ? VMT.ink : VMT.white,
            color: filter === c ? '#fff' : VMT.ink700, cursor: 'pointer',
          }}>{c}</button>
        ))}
      </div>

      {/* Map placeholder */}
      <div style={{
        flex: 1, background: VMT.white, borderRadius: '20px 20px 0 0',
        margin: '0 16px 0 16px', marginBottom: 0,
        border: `1px solid ${VMT.ink100}`, borderBottom: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 400 300" style={{ position: 'absolute', inset: 0 }}>
          <rect width="400" height="300" fill={VMT.ink50}/>
          <circle cx="80" cy="120" r="40" fill={VMT.ink100} opacity="0.4"/>
          <circle cx="320" cy="80" r="30" fill={VMT.ink100} opacity="0.4"/>
          <circle cx="200" cy="240" r="35" fill={VMT.ink100} opacity="0.4"/>
          <circle cx="150" cy="150" r="28" fill={VMT.ink100} opacity="0.4"/>

          {/* Event pins */}
          {nearbyEvents.map((ev, i) => {
            const positions = [
              { x: 80, y: 120 },
              { x: 320, y: 80 },
              { x: 200, y: 240 },
              { x: 150, y: 150 },
            ];
            const p = positions[i];
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="18" fill={ev.color} stroke="#fff" strokeWidth="2"/>
                <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">📍</text>
              </g>
            );
          })}
        </svg>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 13, color: VMT.ink500 }}>
            👇 Scroll pra ver eventos próximos
          </div>
        </div>
      </div>

      {/* Event list below map */}
      <div style={{ padding: '12px 16px 20px', background: VMT.white, borderRadius: '0 0 20px 20px', borderTop: `1px solid ${VMT.ink100}`, overflow: 'auto', maxHeight: '140px' }}>
        {nearbyEvents.map((ev, i) => (
          <button key={i} onClick={onEventDetail} style={{
            width: '100%', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 0', borderBottom: i < nearbyEvents.length - 1 ? `1px solid ${VMT.ink100}` : 'none',
            border: 'none', background: 'transparent', cursor: 'pointer',
          }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: ev.color, flex: 'none' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: VMT.fontBody, fontSize: 13, fontWeight: 600, color: VMT.ink }}>{ev.title}</div>
              <div style={{ fontFamily: VMT.fontMono, fontSize: 11, color: VMT.ink500 }}>{ev.dist}</div>
            </div>
            <span style={{ fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink600 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Event Stories/Feed (tipo Instagram Stories) ─────────────
function EventStories({ event, onBack }) {
  const stories = [
    { user: 'Maya Rivera',  text: '🔥 vamo galera', photo: '#FFB3A7', time: '2 min atrás' },
    { user: 'Sofia Olsen',  text: 'chegando agora!', photo: '#B3D9FF', time: '5 min atrás' },
    { user: 'João Reis',    text: 'que show bom demais', photo: '#D9B3FF', time: '18 min atrás' },
  ];

  const [current, setCurrent] = React.useState(0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: VMT.paper }}>
      <AppHeader title={event.title} back={onBack}/>

      <div style={{ flex: 1, background: VMT.white, margin: '8px 16px', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Story card */}
        <div style={{
          flex: 1, background: stories[current].photo, display: 'flex',
          alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: VMT.fontDisplay, fontSize: 48, marginBottom: 10 }}>📸</div>
            <div style={{ fontFamily: VMT.fontBody, fontSize: 18, fontWeight: 600, color: VMT.ink }}>{stories[current].text}</div>
          </div>
          {/* Progress bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: VMT.ink100 }}>
            <div style={{ height: '100%', background: VMT.ink, width: `${((current + 1) / stories.length) * 100}%`, transition: 'width 3s linear' }}/>
          </div>
        </div>

        {/* Story info */}
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${VMT.ink100}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={stories[current].user} size={32}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 14, color: VMT.ink }}>{stories[current].user}</div>
            <div style={{ fontFamily: VMT.fontBody, fontSize: 11, color: VMT.ink500 }}>{stories[current].time}</div>
          </div>
          <button style={{
            fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 12,
            padding: '6px 12px', borderRadius: 8,
            background: VMT.vermillion, color: '#fff', border: 'none', cursor: 'pointer',
          }}>❤️ Like</button>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 6, padding: '12px 16px' }}>
          {stories.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i === current ? VMT.ink : VMT.ink100,
              border: 'none', cursor: 'pointer',
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HostDashboard, CrushFinder, MapView, EventStories,
});
