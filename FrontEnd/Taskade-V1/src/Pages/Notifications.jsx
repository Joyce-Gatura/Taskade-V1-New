import { Link } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { Avatar, Icon, PageHeader } from '../Components/UI'
import { formatDate, getDueSoonTasks, isOverdue } from '../utils/taskUtils'

export default function Notifications() {
  const { activity, tasks, projects, preferences } = useApp()
  const overdue = preferences.notifications ? tasks.filter((task) => isOverdue(task.dueDate, task.status)) : []
  const dueSoon = preferences.notifications ? getDueSoonTasks(tasks) : []

  return <div className="page">
    <PageHeader title="Notifications" description="Important work updates and upcoming deadlines." />
    <div className="notification-groups">
      {overdue.length > 0 && <section className="panel notification-panel"><div className="panel-heading"><div><h2>Overdue tasks</h2><p>These items need a new plan or a quick nudge.</p></div><span className="notification-count">{overdue.length}</span></div><div className="notification-list">{overdue.map((task) => <Link className="notification-item" to={`/tasks/${task.id}`} key={task.id}><span className="notification-icon notification-alert"><Icon name="clock" size={17} /></span><span><strong>{task.title}</strong><small>{projects.find((project) => project.id === task.projectId)?.name} · Due {formatDate(task.dueDate)}</small></span><span className="notification-time">Needs attention</span></Link>)}</div></section>}
      {dueSoon.length > 0 && <section className="panel notification-panel"><div className="panel-heading"><div><h2>Coming up soon</h2><p>Deadlines in the next three days.</p></div><span className="notification-count">{dueSoon.length}</span></div><div className="notification-list">{dueSoon.map((task) => <Link className="notification-item" to={`/tasks/${task.id}`} key={task.id}><span className="notification-icon notification-upcoming"><Icon name="calendar" size={17} /></span><span><strong>{task.title}</strong><small>{projects.find((project) => project.id === task.projectId)?.name} · Due {formatDate(task.dueDate)}</small></span><span className="notification-time">{task.assignee}</span></Link>)}</div></section>}
      <section className="panel notification-panel"><div className="panel-heading"><div><h2>Activity</h2><p>Recent updates from your workspace.</p></div><span className="notification-count">{activity.length}</span></div>
        {activity.length ? <div className="notification-list">{activity.map((item) => <article className="notification-item" key={item.id}><span className={`activity-indicator activity-${item.kind}`}><Icon name={item.kind === 'complete' ? 'check' : item.kind === 'team' ? 'users' : 'folder'} size={14} /></span><span><strong>{item.text}</strong><small>{item.time}</small></span><Avatar name={item.text.split(' ')[0]} color="blue" /></article>)}</div> : <div className="empty-state compact-empty"><span className="empty-illustration"><Icon name="bell" size={25} /></span><strong>You’re all caught up</strong><p>New project updates will appear here.</p></div>}
      </section>
    </div>
  </div>
}
