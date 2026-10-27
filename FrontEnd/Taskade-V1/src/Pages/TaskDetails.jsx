import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { createId } from '../data/initialData'
import Subtasks from '../Components/Subtasks'
import { Avatar, Icon, Modal } from '../Components/UI'
import { formatDate, isOverdue } from '../utils/taskUtils'
import { TaskForm } from '../Components/Forms'

export default function TaskDetails() {
  const { taskId } = useParams()
  const { tasks, projects, members, updateTask, deleteTask } = useApp()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [dependencyId, setDependencyId] = useState('')
  const navigate = useNavigate()
  const task = tasks.find((item) => item.id === taskId)
  if (!task) return <div className="page"><Link className="back-link" to="/tasks">← Back to tasks</Link><div className="not-found"><span className="empty-illustration"><Icon name="check" size={25} /></span><h1>Task not found</h1><p>It may have been deleted or the link may be out of date.</p><Link className="button button-primary" to="/tasks">Browse tasks</Link></div></div>
  const project = projects.find((item) => item.id === task.projectId)
  const member = members.find((item) => item.name === task.assignee)
  const dependencies = task.dependencies || []
  const dueOver = isOverdue(task.dueDate, task.status)
  const hasIncompleteSubtasks = task.subtasks?.some((subtask) => !subtask.done)

  function addComment(event) {
    event.preventDefault()
    const text = commentText.trim()
    if (!text) return
    updateTask(task.id, { comments: [...(task.comments || []), { id: createId(), author: 'Olivia Chen', text, time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }] })
    setCommentText('')
  }

  return <div className="page">
    <Link className="back-link" to={project ? `/projects/${project.id}` : '/tasks'}>← {project?.name || 'All tasks'}</Link>
    <div className="task-detail-layout">
      <div className="task-detail-main">
        <header className="task-detail-heading">
          <span className="task-type-label"><span className={`type-dot type-${task.type?.toLowerCase().replaceAll(' ', '-') || 'feature'}`} />{task.type || 'Task'} <span>·</span> {task.stage || 'Development'}</span>
          <h1>{task.title}</h1>
          <p>{task.description || 'No description has been added to this task yet.'}</p>
          <div className="task-detail-actions"><label className="status-select-label"><span className="sr-only">Task status</span><select aria-label="Task status" value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value })}><option>To do</option><option>In progress</option><option>In review</option><option disabled={hasIncompleteSubtasks}>Done</option></select></label><button className="button button-quiet" onClick={() => setEditing(true)}><Icon name="settings" size={15} />Edit</button><button className="button button-quiet" onClick={() => setConfirmDelete(true)}>Delete</button></div>
        </header>
        {task.labels?.length > 0 && <div className="task-labels">{task.labels.map((label) => <span className="task-label" key={label}>{label}</span>)}</div>}
        <Subtasks subtasks={task.subtasks || []} onChange={(subtasks) => updateTask(task.id, { subtasks })} />
        <section className="panel dependencies-panel">
          <div className="panel-heading"><div><h2>Dependencies <span className="section-count">{dependencies.length}</span></h2><p>Work that should happen before this task.</p></div></div>
          {dependencies.length ? <div className="dependency-list">{dependencies.map((id) => {
            const dependency = tasks.find((item) => item.id === id)
            if (!dependency) return null
            return <div className="dependency-item" key={id}><Link to={`/tasks/${id}`} className="dependency-link"><span className={`dependency-status ${dependency.status === 'Done' ? 'dependency-complete' : ''}`}><Icon name={dependency.status === 'Done' ? 'check' : 'clock'} size={14} /></span><span>{dependency.title}<small>{dependency.status}</small></span></Link><button type="button" aria-label={`Remove dependency ${dependency.title}`} onClick={() => updateTask(task.id, { dependencies: dependencies.filter((item) => item !== id) })}><Icon name="close" size={14} /></button></div>
          })}</div> : <p className="empty-copy dependency-empty">No blockers linked to this task.</p>}
          {tasks.filter((item) => item.id !== task.id && !dependencies.includes(item.id)).length > 0 && <form className="dependency-add" onSubmit={(event) => { event.preventDefault(); if (dependencyId) { updateTask(task.id, { dependencies: [...dependencies, dependencyId] }); setDependencyId('') } }}><select aria-label="Select a task dependency" value={dependencyId} onChange={(event) => setDependencyId(event.target.value)}><option value="">Choose a task to link...</option>{tasks.filter((item) => item.id !== task.id && !dependencies.includes(item.id)).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><button className="button button-quiet button-small" type="submit" disabled={!dependencyId}>Add blocker</button></form>}
        </section>
        <section className="panel comments-panel">
          <div className="panel-heading"><div><h2>Comments <span className="section-count">{task.comments?.length || 0}</span></h2><p>Keep the conversation close to the work.</p></div></div>
          {task.comments?.length ? <div className="comments-list">{task.comments.map((comment) => <article className="comment-item" key={comment.id}><Avatar name={comment.author} color="violet" /><div><div className="comment-heading"><strong>{comment.author}</strong><time>{comment.time}</time></div><p>{comment.text}</p></div></article>)}</div> : <p className="empty-copy comment-empty">No comments yet. Start the conversation.</p>}
          <form className="comment-form" onSubmit={addComment}><Avatar name="Olivia Chen" color="violet" /><label className="sr-only" htmlFor="new-comment">Write a comment</label><input id="new-comment" placeholder="Write a comment..." value={commentText} onChange={(event) => setCommentText(event.target.value)} maxLength="500" /><button className="button button-primary button-small" type="submit" disabled={!commentText.trim()}>Send</button></form>
        </section>
      </div>
      <aside className="task-detail-aside panel">
        <div className="panel-heading"><div><h2>Task details</h2><p>Ownership and delivery info.</p></div></div>
        <div className="detail-property"><span>Assignee</span><strong className="detail-person">{member && <Avatar name={member.name} color={member.color} />}{task.assignee || 'Unassigned'}</strong></div>
        <div className="detail-property"><span>Priority</span><strong className={`priority-label priority-${task.priority.toLowerCase()}`}>{task.priority}</strong></div>
        <div className="detail-property"><span>Start date</span><strong><Icon name="calendar" size={15} />{formatDate(task.startDate)}</strong></div>
        <div className="detail-property"><span>Due date</span><strong className={dueOver ? 'text-danger' : ''}><Icon name="calendar" size={15} />{formatDate(task.dueDate)}{dueOver && ' · overdue'}</strong></div>
        <div className="detail-property"><span>Project</span><strong>{project ? <Link to={`/projects/${project.id}`}>{project.name}<Icon name="external" size={13} /></Link> : 'No project'}</strong></div>
        <div className="detail-property"><span>Workflow stage</span><strong>{task.stage || 'Development'}</strong></div>
        {(task.repositoryUrl || task.issueReference || task.pullRequestUrl || task.deploymentNotes) && <div className="development-reference"><span className="eyebrow">DEVELOPMENT REFERENCES</span>
          {task.repositoryUrl && <a href={task.repositoryUrl} target="_blank" rel="noreferrer"><Icon name="external" size={14} />Repository</a>}
          {task.issueReference && <span><Icon name="check" size={14} />{task.issueReference}</span>}
          {task.pullRequestUrl && <a href={task.pullRequestUrl} target="_blank" rel="noreferrer"><Icon name="external" size={14} />Pull request</a>}
          {task.deploymentNotes && <p>{task.deploymentNotes}</p>}
        </div>}
        <div className="detail-property detail-created"><span>Task ID</span><strong>{task.id.slice(0, 12)}</strong></div>
      </aside>
    </div>
    {editing && <Modal title="Edit task" description="Update task details, ownership, and development references." onClose={() => setEditing(false)} size="modal-wide"><TaskForm task={task} onCancel={() => setEditing(false)} onSubmit={(updates) => { updateTask(task.id, updates); setEditing(false) }} /></Modal>}
    {confirmDelete && <Modal title="Delete this task?" description={`“${task.title}” will be permanently removed.`} onClose={() => setConfirmDelete(false)}><div className="modal-actions"><button className="button button-quiet" onClick={() => setConfirmDelete(false)}>Cancel</button><button className="button button-danger" onClick={() => { deleteTask(task.id); navigate(project ? `/projects/${project.id}` : '/tasks') }}>Delete task</button></div></Modal>}
  </div>
}
