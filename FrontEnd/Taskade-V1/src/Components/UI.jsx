import { useEffect } from 'react'

const paths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  folder: <><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" /><path d="M3.5 10h17" /></>,
  check: <><path d="m5 12 4 4L19 6" /><circle cx="12" cy="12" r="9" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  chart: <><path d="M4 19V5m0 14h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.7-1.4-2.4L6 15a8 8 0 0 1 0-1.9l-1.4-1.2L6 9.5l1.7.7a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.7 1.4 2.4L19.3 13a8 8 0 0 1 .1 2z" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
  plus: <path d="M12 5v14m-7-7h14" />,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  archive: <><path d="M3 4h18v5H3z" /><path d="M5 9v10h14V9m-9 4h4" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  filter: <><path d="M4 6h16M7 12h10m-7 6h4" /></>,
  external: <><path d="M14 3h7v7m-1-6-9 9" /><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" /></>,
}

export function Icon({ name, size = 18, className = '' }) {
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.grid}</svg>
}

export function Avatar({ name = 'Team member', color = 'violet', size = '' }) {
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  return <span className={`avatar avatar-${color} ${size}`} aria-label={name} title={name}>{initials}</span>
}

export function AvatarStack({ names = [], members = [], limit = 3 }) {
  return <span className="avatar-stack">{names.slice(0, limit).map((name) => {
    const member = members.find((item) => item.name === name)
    return <Avatar key={name} name={name} color={member?.color || 'violet'} />
  })}{names.length > limit && <span className="avatar avatar-extra">+{names.length - limit}</span>}</span>
}

export function StatusPill({ status }) {
  const tone = status.toLowerCase().replaceAll(' ', '-')
  return <span className={`status-pill status-${tone}`}><span className="status-dot" />{status}</span>
}

export function ProgressBar({ value, color = 'violet' }) {
  return <div className={`progress-track progress-${color}`} role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100" aria-label={`${value}% complete`}><span style={{ width: `${value}%` }} /></div>
}

export function PageHeader({ eyebrow, title, description, children }) {
  return <header className="page-header"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{children && <div className="header-actions">{children}</div>}</header>
}

export function Modal({ title, description, onClose, children, size = '' }) {
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className={`modal ${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-heading"><div><h2 id="modal-title">{title}</h2>{description && <p>{description}</p>}</div><button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}><Icon name="close" /></button></div>
      {children}
    </section>
  </div>
}
