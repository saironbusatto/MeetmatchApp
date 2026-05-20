// phone-frame.jsx — minimal iPhone 15 Pro frame for design previews.
//   <PhoneFrame theme="light|dark"><YourScreen/></PhoneFrame>

function PhoneFrame({ children, theme = 'light', time = '9:41' }) {
  const isDark = theme === 'dark';
  const statusColor = isDark ? '#FAFAF7' : '#0A0A0A';
  return (
    <div style={{
      width: 393, height: 852,
      borderRadius: 56,
      background: '#0A0A0A',
      padding: 7,
      boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 24px 60px rgba(0,0,0,0.18)',
      position: 'relative',
    }}>
      <div style={{
        width: '100%', height: '100%',
        borderRadius: 49,
        overflow: 'hidden',
        background: '#fff',
        position: 'relative',
      }}>
        {/* status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 54,
          padding: '17px 30px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          font: '600 16px/1 -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          color: statusColor,
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{time}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            {/* signal bars */}
            <svg width="17" height="11" viewBox="0 0 17 11" fill={statusColor}><rect x="0"  y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="3" width="3" height="8" rx="0.5"/><rect x="13.5" y="0" width="3" height="11" rx="0.5"/></svg>
            {/* wifi */}
            <svg width="16" height="11" viewBox="0 0 16 11" fill={statusColor}><path d="M8 0a13.8 13.8 0 0 0-8 2.7l1.3 1.6A11.7 11.7 0 0 1 8 2c2.5 0 4.8.8 6.7 2.3L16 2.7A13.8 13.8 0 0 0 8 0Zm0 4a9.4 9.4 0 0 0-5.5 1.8l1.5 1.5A7.4 7.4 0 0 1 8 6c1.5 0 2.9.5 4 1.3l1.5-1.5A9.4 9.4 0 0 0 8 4Zm0 4a4.2 4.2 0 0 0-3 1.2L8 11l3-1.8A4.2 4.2 0 0 0 8 8Z"/></svg>
            {/* battery */}
            <svg width="27" height="12" viewBox="0 0 27 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke={statusColor} strokeOpacity="0.4"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill={statusColor}/><rect x="24" y="4" width="2" height="4" rx="1" fill={statusColor} opacity="0.4"/></svg>
          </span>
        </div>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 124, height: 36, background: '#0A0A0A', borderRadius: 20, zIndex: 11,
          pointerEvents: 'none',
        }}/>
        {/* content layer (children paint behind status bar; they should add safe-area top padding) */}
        <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 3,
          background: isDark ? 'rgba(250,250,247,0.5)' : 'rgba(10,10,10,0.45)',
          zIndex: 12,
          pointerEvents: 'none',
        }}/>
      </div>
    </div>
  );
}

Object.assign(window, { PhoneFrame });
