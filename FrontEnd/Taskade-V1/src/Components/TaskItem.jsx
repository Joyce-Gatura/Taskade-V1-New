import { Link } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { Avatar, Icon, StatusPill } from './UI'
import { formatDate, isOverdue } from '../utils/taskUtils'
import TaskProgress from './TaskProgress'

export default function TaskItem({ task, compact = false }) {
  const { projects, members, updateTask } = useApp()
  const project = projects.find((item) => item.id === task.projectId)
  const member = members.find((item) => item.name === task.assignee)
  const overdue = isOverdue(task.dueDate, task.status)
  const hasIncompleteSubtasks = task.subtasks?.some((subtask) => !subtask.done)
  return <article className={`task-item ${compact ? 'task-item-compact' : ''} ${overdue ? 'task-overdue' : ''}`}>
    <button className={`task-check ${task.status === 'Done' ? 'task-checked' : ''}`} aria-label={task.status === 'Done' ? `Reopen ${task.title}` : hasIncompleteSubtasks ? `Complete all subtasks to finish ${task.title}` : `Complete ${task.title}`} disabled={task.status !== 'Done' && hasIncompleteSubtasks} onClick={() => updateTask(task.id, { status: task.status === 'Done' ? 'To do' : 'Done' })}><Icon name="check" size={14} /></button>
    <div className="task-item-main">
      <Link className={`task-title ${task.status === 'Done' ? 'task-title-done' : ''}`} to={`/tasks/${task.id}`}>{task.title}</Link>
      {!compact && <div className="task-meta"><Link to={`/projects/${project?.id}`} className="task-project-link"><span className={`project-dot dot-${project?.color || 'violet'}`} />{project?.name || 'No project'}</Link><span className="meta-separator">·</span><span className={overdue ? 'text-danger' : ''}><Icon name="calendar" size={13} />{formatDate(task.dueDate)}{overdue ? ' · overdue' : ''}</span></div>}
      <TaskProgress task={task} />
    </div>
    <span className={`priority-label priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
    <StatusPill status={task.status} />
    {member ? <Avatar name={member.name} color={member.color} /> : <span className="avatar avatar-extra">?</span>}
  </article>
}
