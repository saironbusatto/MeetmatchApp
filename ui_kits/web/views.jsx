// Vamointao web app — views: Dashboard, Calendar
// Depends on components.jsx (loaded first)

// ─── Dashboard ─────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 18,
      padding: '20px 22px', flex: 1, minWidth: 180,
    }}>
      <div style={{ fontFamily: VMT.fontBody, fontSize: 12, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
        <div style={{ fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 40, letterSpacing: '-0.025em', color: accent || VMT.ink, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontFamily: VMT.fontBody, fontSize: 13, color: VMT.ink500 }}>{sub}</div>}
      </div>
    </div>
  );
}

function PendingRow({ ev }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px',
      background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 14, marginBottom: 8,
    }}>
      <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 4, background: ev.color }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 600, color: VMT.ink500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{ev.when}</div>
        <div style={{ fontFamily: VMT.fontDisplay, fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', color: VMT.ink, marginTop: 2 }}>{ev.title}</div>
      </div>
      <AvatarStack people={ev.people} size={28} max={4}/>
      <div style={{ fontFamily: VMT.fontMono, fontSize: 12, fontWeight: 600, color: VMT.ink600, minWidth: 80, textAlign: 'right' }}>
        {ev.responded}/{ev.people.length} in
      </div>
      <button style={{
        fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 13,
        padding: '8px 14px', borderRadius: 10,
        background: VMT.ink, color: '#fff', border: `1.5px solid ${VMT.ink}`,
        cursor: 'pointer',
      }}>Nudge →</button>
    </div>
  );
}

function DashboardView() {
  const pending = [
    { title: 'Birthday drinks for Sofia', when: 'Waiting on 1 · close on Jun 12', responded: 5, people: SAMPLE_PEOPLE.slice(0, 6), color: '#FF3B2E' },
    { title: 'Coffee with the design crew', when: 'Waiting on 1 · close on Jun 9',  responded: 3, people: SAMPLE_PEOPLE.slice(1, 4), color: '#7A5BAA' },
  ];
  const upcoming = [
    { day: 'TUE', n: 4,  title: 'Q3 planning lunch', when: '14:00 — 15:30', loc: 'Tea & Tortas', going: 5, total: 6, color: '#FF3B2E' },
    { day: 'SAT', n: 15, title: 'Book club: Mariana Enríquez', when: '19:30 — 21:00', loc: 'Felipe\u2019s', going: 3, total: 3, color: '#7A5BAA' },
    { day: 'THU', n: 20, title: 'Family dinner', when: '20:00 — 22:00', loc: 'home', going: 4, total: 5, color: '#2EA862' },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: VMT.paper, padding: '24px 28px 32px' }}>
      {/* AI hero card */}
      <div style={{
        background: VMT.spark, border: `2px solid ${VMT.ink}`, borderRadius: 22,
        padding: '22px 26px', boxShadow: `4px 4px 0 ${VMT.ink}`, marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: VMT.ink, color: VMT.spark, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <Sparkle size={28} color={VMT.spark}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, color: VMT.ink, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Farmei AI</div>
          <div style={{ fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 24, letterSpacing: '-0.015em', color: VMT.ink, marginTop: 4, lineHeight: 1.15 }}>
            "Q3 planning lunch" — Tue Jun 4 works for 5 of 6. Lock it in?
          </div>
          <div style={{ fontFamily: VMT.fontBody, fontSize: 13, color: VMT.ink700, marginTop: 6 }}>
            Diego (key) is free. Only Felipe can't make Tuesday.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 14, padding: '11px 18px', borderRadius: 12, background: VMT.white, color: VMT.ink, border: `1.5px solid ${VMT.ink}`, cursor: 'pointer' }}>See options</button>
          <button style={{ fontFamily: VMT.fontBody, fontWeight: 600, fontSize: 14, padding: '11px 18px', borderRadius: 12, background: VMT.ink, color: '#fff', border: `1.5px solid ${VMT.ink}`, cursor: 'pointer', boxShadow: `2px 2px 0 ${VMT.vermillion}` }}>Lock in →</button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 32 }}>
        <StatCard label="This week" value="3" sub="events"/>
        <StatCard label="Waiting on you" value="2" sub="responses needed" accent={VMT.vermillion}/>
        <StatCard label="Locked in" value="7" sub="this month"/>
        <StatCard label="People wrangled" value="42" sub="all-time"/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 22, letterSpacing: '-0.015em', color: VMT.ink }}>Pending — your call</h2>
            <a href="#" style={{ fontFamily: VMT.fontBody, fontSize: 13, fontWeight: 500, color: VMT.ink600, textDecoration: 'none' }}>See all →</a>
          </div>
          {pending.map((p, i) => <PendingRow key={i} ev={p}/>)}

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '32px 0 14px' }}>
            <h2 style={{ margin: 0, fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 22, letterSpacing: '-0.015em', color: VMT.ink }}>Upcoming</h2>
            <a href="#" style={{ fontFamily: VMT.fontBody, fontSize: 13, fontWeight: 500, color: VMT.ink600, textDecoration: 'none' }}>Calendar view →</a>
          </div>
          {upcoming.map((u, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '14px 18px', background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 14, marginBottom: 8 }}>
              <div style={{ textAlign: 'center', minWidth: 52 }}>
                <div style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, color: u.color, letterSpacing: '0.06em' }}>{u.day}</div>
                <div style={{ fontFamily: VMT.fontMono, fontSize: 26, fontWeight: 700, color: VMT.ink, lineHeight: 1 }}>{u.n}</div>
              </div>
              <div style={{ width: 1, alignSelf: 'stretch', background: VMT.ink100 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: VMT.fontDisplay, fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em', color: VMT.ink }}>{u.title}</div>
                <div style={{ fontFamily: VMT.fontMono, fontSize: 12, color: VMT.ink600, marginTop: 4 }}>{u.when} · {u.loc}</div>
              </div>
              <span style={{ fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 6, background: VMT.successSoft, color: VMT.success, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{u.going}/{u.total}</span>
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ margin: '0 0 14px', fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 22, letterSpacing: '-0.015em', color: VMT.ink }}>Activity</h2>
          <div style={{ background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 16, padding: '8px 0' }}>
            {[
              { who: 'Diego Cruz',   what: 'said yes to', target: 'Q3 planning lunch', when: '2m', color: 0 },
              { who: 'Maya Rivera',  what: 'said maybe to', target: 'Birthday drinks', when: '14m', color: 1 },
              { who: 'AI',           what: 'suggested', target: 'Tue Jun 4 for Q3 planning lunch', when: '1h', color: -1 },
              { who: 'Sofia Olsen',  what: 'created', target: 'Book club: Enríquez', when: '3h', color: 3 },
              { who: 'João Reis',    what: 'locked in', target: 'Coffee with design crew', when: 'yesterday', color: 2 },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', alignItems: 'flex-start' }}>
                {a.color === -1
                  ? <div style={{ width: 28, height: 28, borderRadius: '50%', background: VMT.spark, border: `1.5px solid ${VMT.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Sparkle size={14} color={VMT.ink}/></div>
                  : <Avatar name={a.who} size={28} idx={a.color}/>}
                <div style={{ flex: 1, fontFamily: VMT.fontBody, fontSize: 13, lineHeight: 1.4, color: VMT.ink700 }}>
                  <strong style={{ color: VMT.ink }}>{a.who}</strong> {a.what} <strong style={{ color: VMT.ink }}>{a.target}</strong>
                </div>
                <span style={{ fontFamily: VMT.fontMono, fontSize: 11, color: VMT.ink400, flex: 'none' }}>{a.when}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Calendar view ─────────────────────────────────────────────
function CalendarView() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  // First Mon = May 25. Grid covers May 25 – Jul 5 (6 rows × 7 = 42)
  const cells = Array.from({ length: 42 }).map((_, i) => {
    const dayOfMonth = i - 6; // May 25 starts at idx 0, Jun 1 at idx 7
    const date = dayOfMonth; // for Jun: 1..30
    let inMonth = date >= 1 && date <= 30;
    let displayDate;
    if (date < 1)        displayDate = 25 + i;        // May
    else if (date > 30)  displayDate = date - 30;     // Jul
    else                 displayDate = date;
    return { i, inMonth, date: displayDate, isToday: date === 1 };
  });

  const events = {
    4:  { color: VMT.vermillion, title: 'Q3 planning lunch', time: '14:00', isLocked: true, isAI: true },
    8:  { color: '#7A5BAA',     title: 'Sofia\u2019s birthday', time: 'tbd', isPending: true },
    12: { color: '#2EA862',     title: 'Coffee · design',  time: '10:00' },
    15: { color: '#7A5BAA',     title: 'Book club',        time: '19:30', isLocked: true },
    20: { color: '#2EA862',     title: 'Family dinner',    time: '20:00' },
    24: { color: '#C99B00',     title: 'Quarterly review', time: '15:00' },
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: VMT.paper, padding: '24px 28px 32px' }}>
      {/* Calendar header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: VMT.white, border: `1px solid ${VMT.ink100}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={VMT.ink} strokeWidth="2.2" strokeLinecap="round"><path d="M15 18 L9 12 L15 6"/></svg>
          </button>
          <h2 style={{ margin: 0, fontFamily: VMT.fontDisplay, fontWeight: 700, fontSize: 32, letterSpacing: '-0.025em', color: VMT.ink, lineHeight: 1 }}>June 2026</h2>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: VMT.white, border: `1px solid ${VMT.ink100}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={VMT.ink} strokeWidth="2.2" strokeLinecap="round"><path d="M9 6 L15 12 L9 18"/></svg>
          </button>
          <button style={{ fontFamily: VMT.fontBody, fontWeight: 500, fontSize: 13, padding: '8px 14px', borderRadius: 10, background: VMT.white, color: VMT.ink, border: `1px solid ${VMT.ink100}`, cursor: 'pointer', marginLeft: 6 }}>Today</button>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, fontFamily: VMT.fontBody, fontSize: 12, color: VMT.ink600 }}>
            {[['Work','#FF3B2E'], ['Friends','#7A5BAA'], ['Family','#2EA862']].map(([n, c]) => (
              <span key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: c }}/>
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ background: VMT.white, border: `1px solid ${VMT.ink100}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: VMT.ink50, borderBottom: `1px solid ${VMT.ink100}` }}>
          {days.map(d => (
            <div key={d} style={{ padding: '10px 14px', fontFamily: VMT.fontBody, fontSize: 11, fontWeight: 700, color: VMT.ink500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '108px' }}>
          {cells.map(c => {
            const ev = c.inMonth ? events[c.date] : null;
            return (
              <div key={c.i} style={{
                borderRight: `1px solid ${VMT.ink100}`, borderBottom: `1px solid ${VMT.ink100}`,
                padding: 8, position: 'relative',
                background: c.inMonth ? VMT.white : VMT.ink50,
                opacity: c.inMonth ? 1 : 0.6,
              }}>
                <div style={{
                  fontFamily: VMT.fontMono, fontSize: 12, fontWeight: 600,
                  color: c.isToday ? '#fff' : (c.inMonth ? VMT.ink : VMT.ink400),
                  background: c.isToday ? VMT.vermillion : 'transparent',
                  width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%',
                }}>{c.date}</div>
                {ev && (
                  <div style={{
                    marginTop: 6, padding: '5px 8px', borderRadius: 7,
                    background: ev.isAI ? VMT.spark : (ev.isPending ? VMT.warnSoft : VMT.white),
                    border: ev.isAI ? `1.5px solid ${VMT.ink}` : `1px solid ${ev.color}30`,
                    borderLeft: `3px solid ${ev.color}`,
                  }}>
                    {ev.isAI && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Sparkle size={10} color={VMT.ink}/><span style={{ fontFamily: VMT.fontBody, fontSize: 9, fontWeight: 700, color: VMT.ink, letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI pick</span></div>}
                    <div style={{ fontFamily: VMT.fontBody, fontSize: 12, fontWeight: 600, color: VMT.ink, marginTop: ev.isAI ? 2 : 0, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                    <div style={{ fontFamily: VMT.fontMono, fontSize: 10, color: VMT.ink600, marginTop: 1 }}>{ev.time}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardView, CalendarView });
