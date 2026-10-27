import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { Avatar, Icon } from '../Components/UI'
import { getDueSoonTasks, isOverdue } from '../utils/taskUtils'

export default function Navbar({ onMenu, onCreate }) {
  const { projects, tasks, preferences } = useApp()
  const hasAlerts = preferences.notifications && (getDueSoonTasks(tasks).length > 0 || tasks.some((task) => isOverdue(task.dueDate, task.status)))
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const searchInput = useRef(null)
  const results = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return []
    return [
      ...tasks.filter((task) => task.title.toLowerCase().includes(query)).slice(0, 4).map((task) => ({ label: task.title, detail: 'Task', to: `/tasks/${task.id}`, icon: 'check' })),
      ...projects.filter((project) => project.name.toLowerCase().includes(query)).slice(0, 3).map((project) => ({ label: project.name, detail: 'Project', to: `/projects/${project.id}`, icon: 'folder' })),
    ].slice(0, 6)
  }, [projects, search, tasks])

  useEffect(() => {
    const focusSearch = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput.current?.focus()
      }
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  return <header className="topbar">
    <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={onMenu}><Icon name="menu" /></button>
    <div className="search-wrap">
      <Icon name="search" size={17} />
      <input ref={searchInput} aria-label="Search projects and tasks" placeholder="Search anything..." value={search} onChange={(event) => setSearch(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 150)} onKeyDown={(event) => { if (event.key === 'Escape') setSearch('') }} />
      <kbd>⌘ K</kbd>
      {focused && search.trim() && <div className="search-results">{results.length ? results.map((result) => <Link key={result.to} to={result.to} onClick={() => setSearch('')}><Icon name={result.icon} size={16} /><span>{result.label}</span><small>{result.detail}</small></Link>) : <p>No matching projects or tasks</p>}</div>}
    </div>
    <div className="topbar-actions"><button className="button button-primary topbar-create" onClick={() => onCreate('task')}><Icon name="plus" size={16} />New task</button><Link className="topbar-notification icon-button" to="/notifications" aria-label="Notifications"><Icon name="bell" />{hasAlerts && <span />}</Link><Link className="topbar-avatar" to="/settings" aria-label="Open profile settings"><Avatar name="Joyce Gatura" color="violet" /><span>Joyce Gatura</span><span className="switcher-chevron">⌄</span></Link></div>
  </header>
}
