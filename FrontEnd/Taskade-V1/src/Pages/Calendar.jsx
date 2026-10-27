import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { Icon, PageHeader } from '../Components/UI'

export default function Calendar() {
  const { tasks, projects } = useApp()
  const { openCreate } = useOutletContext()
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells = useMemo(() => Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - firstDay + 1
    return day > 0 && day <= daysInMonth ? day : null
  }), [daysInMonth, firstDay])
  const today = new Date()
  const upcoming = tasks.filter((task) => task.dueDate && task.status !== 'Done').sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 6)

  return <div className="page">
    <PageHeader eyebrow="PLAN AHEAD" title="Calendar" ><button className="button button-primary" onClick={() => openCreate('task')}><Icon name="plus" size={16} />New task</button></PageHeader>
    <div className="calendar-layout">
      <section className="panel calendar-panel">
        <div className="calendar-toolbar"><div><h2>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2><p>{tasks.filter((task) => task.dueDate?.startsWith(`${year}-${String(monthIndex + 1).padStart(2, '0')}`)).length} tasks with deadlines this month</p></div><div className="calendar-nav"><button className="icon-button" aria-label="Previous month" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}>‹</button><button className="button button-quiet button-small" onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>Today</button><button className="icon-button" aria-label="Next month" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}>›</button></div></div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="calendar-weekday">{day}</div>)}
          {cells.map((day, index) => {
            const dayKey = day ? `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''
            const dayTasks = tasks.filter((task) => task.dueDate === dayKey)
            const isToday = day && today.getDate() === day && today.getMonth() === monthIndex && today.getFullYear() === year
            return <div className={`calendar-cell ${day ? '' : 'calendar-blank'} ${isToday ? 'calendar-today' : ''}`} key={`${dayKey || 'blank'}-${index}`}>
              {day && <><span className="calendar-day-number">{day}</span><div className="calendar-events">{dayTasks.slice(0, 3).map((task) => <Link key={task.id} to={`/tasks/${task.id}`} className={`calendar-event event-${projects.find((project) => project.id === task.projectId)?.color || 'violet'} ${task.status === 'Done' ? 'event-done' : ''}`} title={`${task.title} · ${task.status}`}><span />{task.title}</Link>)}{dayTasks.length > 3 && <span className="calendar-more">+{dayTasks.length - 3} more</span>}</div></>}
            </div>
          })}
        </div>
      </section>
      <aside className="panel calendar-upcoming"><div className="panel-heading"><div><h2>Coming up</h2></div><Icon name="clock" /></div>
        {upcoming.length ? <div className="deadline-list">{upcoming.map((task) => <Link to={`/tasks/${task.id}`} key={task.id} className="deadline-item"><span className="deadline-date"><strong>{new Date(`${task.dueDate}T12:00:00`).getDate()}</strong><small>{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short' })}</small></span><span><strong>{task.title}</strong><small>{projects.find((project) => project.id === task.projectId)?.name} · {task.assignee}</small></span></Link>)}</div> : <p className="empty-copy">No upcoming deadlines.</p>}
        <button className="button button-quiet calendar-create" onClick={() => openCreate('task')}><Icon name="plus" size={15} />Add a task</button>
      </aside>
    </div>
  </div>
}
