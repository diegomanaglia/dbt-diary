import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  {
    path: '/',
    label: 'Início',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        {!active && <polyline points="9 22 9 12 15 12 15 22" />}
      </svg>
    ),
  },
  {
    path: '/stats',
    label: 'Dados',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center" style={{ zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <nav
        className="flex justify-around items-center mx-4 mb-3"
        style={{
          height: 56,
          width: 'calc(100% - 32px)',
          maxWidth: 448,
          background: 'rgba(11, 13, 19, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {tabs.map(tab => {
          const active = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-0.5 relative"
              style={{
                minWidth: 64,
                minHeight: 44,
                color: active ? '#06B6D4' : '#475569',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 200ms',
              }}
            >
              {active && (
                <div style={{
                  position: 'absolute',
                  top: -1,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  background: '#06B6D4',
                  boxShadow: '0 0 8px rgba(6, 182, 212, 0.5)',
                }} />
              )}
              {tab.icon(active)}
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em' }}>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
