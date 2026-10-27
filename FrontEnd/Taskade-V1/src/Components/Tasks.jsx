import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { Icon, Modal, PageHeader, StatusPill } from './UI'
import { formatDate, isOverdue } from '../utils/taskUtils'
import TaskProgress from './TaskProgress'
import { TaskForm } from './Forms'
import TaskItem from './TaskItem'

const statuses = ['To do', 'In progress', 'In review', 'Done']

export default function Tasks() {
  const { tasks, projects, addTask, updateTask, members } = useApp()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [priority, setPriority] = useState('All priorities')
  const [assignee, setAssignee] = useState('Olivia Chen')
  const [project, setProject] = useState('All projects')
  const [sortBy, setSortBy] = useState('dueDate')
  const [view, setView] = useState('list')
  const [showForm, setShowForm] = useState(false)
  const filtered = useMemo(() => tasks.filter((task) => {
    const search = `${task.title} ${task.description} ${(task.labels || []).join(' ')}`.toLowerCase()
    return search.includes(query.toLowerCase()) &&
      (status === 'All statuses' || task.status === status) &&
      (priority === 'All priorities' || task.priority === priority) &&
      (assignee === 'Everyone' || task.assignee === assignee) &&
      (project === 'All projects' || task.projectId === project)
  }).sort((first, second) => {
    if (sortBy === 'priority') {
      const priorityOrder = { Urgent: 0, High: 1, Medium: 2, Low: 3 }
      return priorityOrder[first.priority] - priorityOrder[second.priority]
    }
    if (sortBy === 'title') return first.title.localeCompare(second.title)
    return (first.dueDate || '9999-99-99').localeCompare(second.dueDate || '9999-99-99')
  }), [assignee, priority, project, query, sortBy, status, tasks])

  return <div className="page">
    <PageHeader title="My tasks" description="A clear view of what’s next, what’s moving, and what’s done.">
      <button className={`button button-quiet ${view === 'list' ? 'view-selected' : ''}`} aria-label="List view" onClick={() => setView('list')}><span className="view-symbol">☷</span>List</button>
      <button className={`button button-quiet ${view === 'board' ? 'view-selected' : ''}`} aria-label="Board view" onClick={() => setView('board')}><span className="view-symbol">▦</span>Board</button>
      <button className="button button-primary" onClick={() => setShowForm(true)}><Icon name="plus" size={16} />New task</button>
    </PageHeader>
    <section className="panel tasks-panel">
      <div className="task-filters">
        <div className="inline-search task-search"><Icon name="search" size={16} /><input aria-label="Search tasks" placeholder="Search tasks..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <label><span className="sr-only">Status</span><select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span className="sr-only">Priority</span><select aria-label="Filter by priority" value={priority} onChange={(event) => setPriority(event.target.value)}><option>All priorities</option><option>Urgent</option><option>High</option><option>Medium</option><option>Low</option></select></label>
        <label><span className="sr-only">Assignee</span><select aria-label="Filter by assignee" value={assignee} onChange={(event) => setAssignee(event.target.value)}><option>Everyone</option>{members.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
        <label><span className="sr-only">Project</span><select aria-label="Filter by project" value={project} onChange={(event) => setProject(event.target.value)}><option>All projects</option>{projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label><span className="sr-only">Sort tasks</span><select aria-label="Sort tasks" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="dueDate">Due date</option><option value="priority">Priority</option><option value="title">Title</option></select></label>
        <span className="result-count">{filtered.length} tasks</span>
      </div>
      {view === 'list' ? <div className="task-list task-list-page">{filtered.map((task) => <TaskItem task={task} key={task.id} />)}{!filtered.length && <div className="empty-inline">{tasks.length ? 'No tasks match those filters.' : 'No tasks yet. Add a task to get started.'}</div>}</div> : <div className="board">{statuses.map((stage) => {
        const column = filtered.filter((task) => task.status === stage)
        return <section className="board-column" key={stage}><div className="board-heading"><span><StatusPill status={stage} /></span><span className="board-count">{column.length}</span></div>{column.map((task) => <article className="board-task" key={task.id}>
          <div className="board-task-top"><span className={`priority-label priority-${task.priority.toLowerCase()}`}>{task.priority}</span><button className="task-check board-check" aria-label={`Complete ${task.title}`} disabled={stage !== 'Done' && task.subtasks?.some((subtask) => !subtask.done)} onClick={() => updateTask(task.id, { status: stage === 'Done' ? 'To do' : 'Done' })}><Icon name="check" size={13} /></button></div>
          <Link to={`/tasks/${task.id}`} className="board-task-title">{task.title}</Link><p>{task.description || 'No description added.'}</p>
          <TaskProgress task={task} />
          <div className="board-task-foot"><span className={isOverdue(task.dueDate, task.status) ? 'text-danger' : ''}><Icon name="calendar" size={13} />{formatDate(task.dueDate)}</span><span className="board-assignee">{task.assignee?.split(' ').map((part) => part[0]).join('')}</span></div>
        </article>)}{!column.length && <div className="board-empty">Nothing here yet</div>}</section>
      })}</div>}
    </section>
    {showForm && <Modal title="Create a task" description="Break your project into clear, actionable work." onClose={() => setShowForm(false)}><TaskForm onCancel={() => setShowForm(false)} onSubmit={(task) => { addTask(task); setShowForm(false) }} /></Modal>}
  </div>
}
