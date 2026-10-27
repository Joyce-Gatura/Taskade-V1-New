import { Link, useOutletContext } from 'react-router-dom'
import { useApp } from '../context/useApp'
import TaskItem from './TaskItem'
import { AvatarStack, Icon, PageHeader, ProgressBar } from './UI'
import { formatDate, getDueSoonTasks, getProjectProgress, isOverdue } from '../utils/taskUtils'

export default function Dashboard() {
  const { projects, tasks, activity, members } = useApp()
  const { openCreate } = useOutletContext()
  const activeProjects = projects.filter((project) => !project.archived)
  const completed = tasks.filter((task) => task.status === 'Done').length
  const overdue = tasks.filter((task) => isOverdue(task.dueDate, task.status))
  const upcomingCount = getDueSoonTasks(tasks, 7).length
  const upcoming = getDueSoonTasks(tasks, 30).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4)
  const focusTasks = [...new Map([...overdue, ...tasks.filter((task) => task.status !== 'Done' && !isOverdue(task.dueDate, task.status) && task.priority === 'Urgent')].map((task) => [task.id, task])).values()].slice(0, 4)
  const statusCounts = [
    { name: 'To do', count: tasks.filter((task) => task.status === 'To do').length, color: 'todo' },
    { name: 'In progress', count: tasks.filter((task) => task.status === 'In progress').length, color: 'progress' },
    { name: 'In review', count: tasks.filter((task) => task.status === 'In review').length, color: 'review' },
    { name: 'Done', count: completed, color: 'done' },
  ]

  return <div className="page dashboard-page">
    <PageHeader eyebrow={`${new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}, YOUR WORKSPACE`} title={`${new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}, Joyce`} description="Here’s what’s happening across your projects today.">
      <button className="button button-quiet" onClick={() => openCreate('project')}><Icon name="plus" size={16} />New project</button>
      <button className="button button-primary" onClick={() => openCreate('task')}><Icon name="plus" size={16} />Add task</button>
    </PageHeader>

    <section className="metric-grid" aria-label="Workspace overview">
      <article className="metric-card"><div className="metric-top"><span className="metric-icon icon-violet"><Icon name="folder" /></span><span className="metric-trend">This workspace</span></div><strong>{activeProjects.length}</strong><span className="metric-label">Active projects</span><div className="metric-foot"><span>{activeProjects.filter((project) => project.status === 'In progress').length} in progress</span><Link to="/projects">View all <Icon name="arrow" size={13} /></Link></div></article>
      <article className="metric-card"><div className="metric-top"><span className="metric-icon icon-green"><Icon name="check" /></span><span className="metric-trend trend-positive">Keep it up</span></div><strong>{completed}<small>/{tasks.length}</small></strong><span className="metric-label">Tasks completed</span><div className="metric-foot"><ProgressBar value={tasks.length ? Math.round(completed / tasks.length * 100) : 0} color="green" /><span>{tasks.length ? Math.round(completed / tasks.length * 100) : 0}%</span></div></article>
      <article className="metric-card"><div className="metric-top"><span className="metric-icon icon-blue"><Icon name="clock" /></span><span className="metric-trend">Across all projects</span></div><strong>{tasks.length - completed}</strong><span className="metric-label">Open tasks</span><div className="metric-foot"><span>{tasks.filter((task) => task.status === 'In review').length} waiting for review</span><Link to="/tasks">See tasks <Icon name="arrow" size={13} /></Link></div></article>
      <article className="metric-card"><div className="metric-top"><span className="metric-icon icon-orange"><Icon name="calendar" /></span><span className={overdue.length ? 'metric-trend trend-danger' : 'metric-trend'}>{overdue.length ? 'Needs attention' : 'All caught up'}</span></div><strong>{overdue.length}</strong><span className="metric-label">Overdue tasks</span><div className="metric-foot"><span>{upcomingCount} upcoming this week</span><Link to="/calendar">Open calendar <Icon name="arrow" size={13} /></Link></div></article>
    </section>

    <section className="dashboard-main-grid">
      <div className="dashboard-column">
        <section className="panel">
          <div className="panel-heading"><div><h2>Projects</h2><p>Your team’s active work, at a glance.</p></div><Link className="text-link" to="/projects">All projects <Icon name="arrow" size={14} /></Link></div>
          {activeProjects.length ? <div className="project-preview-grid">{activeProjects.slice(0, 4).map((project) => {
            const projectTasks = tasks.filter((task) => task.projectId === project.id)
            const progress = getProjectProgress(project.id, tasks)
            return <Link className="project-preview" to={`/projects/${project.id}`} key={project.id}>
              <div className="project-preview-head"><span className={`project-mark mark-${project.color}`}><Icon name="folder" size={17} /></span></div>
              <h3>{project.name}</h3><p>{project.description || 'No description yet.'}</p>
              <div className="project-progress-label"><span>{progress}% complete</span><span>{projectTasks.length} tasks</span></div><ProgressBar value={progress} color={project.color} />
              <div className="project-preview-foot"><AvatarStack names={project.members} members={members} /><span><Icon name="calendar" size={13} />{formatDate(project.deadline)}</span></div>
            </Link>
          })}</div> : <EmptyState title="Your projects start here" action="Create your first project" onClick={() => openCreate('project')} />}
        </section>
        <section className="panel focus-panel">
          <div className="panel-heading"><div><h2>Needs your attention</h2><p>Overdue and urgent work, so nothing slips.</p></div><Link className="text-link" to="/tasks">View all tasks <Icon name="arrow" size={14} /></Link></div>
          {focusTasks.length ? <div className="task-list">{focusTasks.map((task) => <TaskItem task={task} key={task.id} />)}</div> : <div className="inline-empty"><span className="empty-check"><Icon name="check" /></span><span><strong>You’re all caught up</strong><small>No overdue or urgent work right now.</small></span></div>}
        </section>
      </div>
      <aside className="dashboard-column dashboard-aside">
        <section className="panel activity-panel">
          <div className="panel-heading"><div><h2>Recent activity</h2><p>Your team’s latest updates.</p></div><Link className="icon-button subtle-icon" to="/notifications" aria-label="View all activity"><Icon name="arrow" size={16} /></Link></div>
          <div className="activity-list">{activity.slice(0, 5).map((item) => <div className="activity-item" key={item.id}><span className={`activity-indicator activity-${item.kind}`}><Icon name={item.kind === 'complete' ? 'check' : item.kind === 'team' ? 'users' : 'folder'} size={13} /></span><span><strong>{item.text}</strong><small>{item.time}</small></span></div>)}</div>
          {!activity.length && <p className="empty-copy">Your team updates will show up here.</p>}
        </section>
        <section className="panel workload-panel">
          <div className="panel-heading"><div><h2>Task overview</h2><p>Current status across your workspace.</p></div><span className="panel-icon"><Icon name="chart" /></span></div>
          <div className="workload-total"><strong>{tasks.length}</strong><span>total tasks</span></div>
          <div className="status-bar" aria-label="Task status distribution">{statusCounts.map((item) => <span key={item.name} className={`bar-${item.color}`} style={{ width: `${tasks.length ? item.count / tasks.length * 100 : 0}%` }} />)}</div>
          <div className="status-legend">{statusCounts.map((item) => <div key={item.name}><span className={`legend-dot bar-${item.color}`} />{item.name}<strong>{item.count}</strong></div>)}</div>
        </section>
        <section className="panel deadlines-panel">
          <div className="panel-heading"><div><h2>Upcoming deadlines</h2><p>Coming up next.</p></div><Link className="icon-button subtle-icon" to="/calendar" aria-label="View calendar"><Icon name="calendar" size={16} /></Link></div>
          {upcoming.length ? <div className="deadline-list">{upcoming.map((task) => <Link to={`/tasks/${task.id}`} key={task.id} className="deadline-item"><span className="deadline-date"><strong>{new Date(`${task.dueDate}T12:00:00`).getDate()}</strong><small>{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short' })}</small></span><span><strong>{task.title}</strong><small>{projects.find((project) => project.id === task.projectId)?.name}</small></span></Link>)}</div> : <p className="empty-copy">No upcoming deadlines. Enjoy the breathing room.</p>}
        </section>
      </aside>
    </section>
  </div>
}

function EmptyState({ title, action, onClick }) {
  return <div className="empty-state"><span className="empty-illustration"><Icon name="folder" size={25} /></span><strong>{title}</strong><p>Bring your team together around a shared goal.</p><button className="button button-primary button-small" onClick={onClick}><Icon name="plus" size={15} />{action}</button></div>
}
