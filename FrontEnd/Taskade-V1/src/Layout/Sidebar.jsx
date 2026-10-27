import { NavLink } from 'react-router-dom'
import { Icon } from '../Components/UI'
import { useApp } from '../context/useApp'
import { getDueSoonTasks, isOverdue } from '../utils/taskUtils'

const primaryLinks = [
  { to: '/', label: 'Overview', icon: 'grid', end: true },
  { to: '/projects', label: 'Projects', icon: 'folder' },
  { to: '/tasks', label: 'My tasks', icon: 'check' },
  { to: '/calendar', label: 'Calendar', icon: 'calendar' },
]
const teamLinks = [
  { to: '/team', label: 'Team members', icon: 'users' },
  { to: '/notifications', label: 'Notifications', icon: 'bell' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

export default function Sidebar({ open, onClose }) {
  const { tasks, workspaceName, preferences } = useApp()
  const openTasks = tasks.filter((task) => task.assignee === 'Olivia Chen' && task.status !== 'Done').length
  const hasAlerts = preferences.notifications && (getDueSoonTasks(tasks).length > 0 || tasks.some((task) => isOverdue(task.dueDate, task.status)))
  return <>
    {open && <button className="sidebar-scrim" aria-label="Close navigation" onClick={onClose} />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Icon name="check" size={19} /></span><span>Taskade<span className="brand-period">.</span></span></div>
      <div className="workspace-switcher"><span className="workspace-avatar">{workspaceName.slice(0, 1).toUpperCase()}</span><span><strong>{workspaceName}</strong><small> Workspace</small></span></div>
      <nav aria-label="Main navigation">
        <p className="nav-heading">WORKSPACE</p>
        {primaryLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.end} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><Icon name={link.icon} /><span>{link.label}</span>{link.to === '/tasks' && openTasks > 0 && <span className="nav-count">{openTasks}</span>}</NavLink>)}
        <div className="nav-section-divider" />
        <p className="nav-heading">YOUR TEAM</p>
        {teamLinks.map((link) => <NavLink key={link.to} to={link.to} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><Icon name={link.icon} /><span>{link.label}</span>{link.to === '/notifications' && hasAlerts && <span className="notification-dot" />}</NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card"><span className="upgrade-spark">✦</span><strong>Make room for big ideas</strong><p>Upgrade your workspace to unlock more.</p><button onClick={() => window.dispatchEvent(new CustomEvent('taskade:upgrade'))}>Explore plans <Icon name="arrow" size={14} /></button></div>
        <div className="profile-card"><span className="avatar avatar-violet">JG</span><span><strong>Joyce Gatura</strong><small>joyce@taskade.team</small></span></div>
      </div>
    </aside>
  </>
}
