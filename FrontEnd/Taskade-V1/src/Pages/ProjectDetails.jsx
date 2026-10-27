import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/useApp'
import TaskItem from '../Components/TaskItem'
import { AvatarStack, Icon, Modal, PageHeader, ProgressBar, StatusPill } from '../Components/UI'
import { formatDate, getProjectProgress } from '../utils/taskUtils'
import { ProjectForm, TaskForm } from '../Components/Forms'

export default function ProjectDetails() {
  const { projectId } = useParams()
  const { projects, tasks, members, workspaceName, updateProject, deleteProject, addTask } = useApp()
  const [edit, setEdit] = useState(false)
  const [createTask, setCreateTask] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const navigate = useNavigate()
  const project = projects.find((item) => item.id === projectId)
  if (!project) return <div className="page"><Link className="back-link" to="/projects">← Back to projects</Link><div className="not-found"><span className="empty-illustration"><Icon name="folder" size={25} /></span><h1>Project not found</h1><p>It may have been deleted or the link may be out of date.</p><Link className="button button-primary" to="/projects">Browse projects</Link></div></div>
  const projectTasks = tasks.filter((task) => task.projectId === project.id)
  const doneCount = projectTasks.filter((task) => task.status === 'Done').length
  const progress = getProjectProgress(project.id, tasks)

  return <div className="page">
    <Link className="back-link" to="/projects">← All projects</Link>
    <PageHeader eyebrow="PROJECT DETAILS" title={project.name} description={project.description}>
      <button className="button button-quiet" onClick={() => updateProject(project.id, { archived: !project.archived })}><Icon name="archive" size={16} />{project.archived ? 'Restore project' : 'Archive project'}</button><button className="button button-quiet" onClick={() => setEdit(true)}><Icon name="settings" size={16} />Edit project</button><button className="button button-primary" onClick={() => setCreateTask(true)}><Icon name="plus" size={16} />Add task</button>
    </PageHeader>
    <section className="project-detail-summary">
      <div className="project-detail-identity"><span className={`project-mark mark-${project.color}`}><Icon name="folder" size={19} /></span><span><strong>{project.name}</strong><small>Created for {workspaceName}</small></span></div>
      <div className="project-detail-stat"><span>Status</span><StatusPill status={project.archived ? 'Archived' : project.status} /></div>
      <div className="project-detail-stat"><span>Start date</span><strong>{formatDate(project.startDate)}</strong></div>
      <div className="project-detail-stat"><span>Due date</span><strong>{formatDate(project.deadline)}</strong></div>
      <div className="project-detail-stat"><span>Priority</span><strong className={`priority-label priority-${project.priority.toLowerCase()}`}>{project.priority}</strong></div>
      <div className="project-detail-stat"><span>Team</span><AvatarStack names={project.members} members={members} limit={4} /></div>
    </section>
    <section className="project-progress-panel panel"><div><span className="eyebrow">PROJECT PROGRESS</span><h2>{progress}% <small>complete</small></h2><p>{doneCount} of {projectTasks.length} tasks completed</p></div><div className="project-progress-wide"><ProgressBar value={progress} color={project.color} /></div></section>
    <section className="panel project-task-panel"><div className="panel-heading"><div><h2>Project tasks</h2><p>Plan, track, and ship together.</p></div><button className="button button-quiet button-small" onClick={() => setCreateTask(true)}><Icon name="plus" size={15} />Add task</button></div>
      {projectTasks.length ? <div className="task-list">{projectTasks.map((task) => <TaskItem task={task} key={task.id} />)}</div> : <div className="empty-state compact-empty"><span className="empty-illustration"><Icon name="check" size={25} /></span><strong>This project is ready for its first task</strong><p>Break the goal into small steps your team can own.</p><button className="button button-primary button-small" onClick={() => setCreateTask(true)}><Icon name="plus" size={15} />Add the first task</button></div>}
    </section>
    <section className="project-detail-footer"><span><Icon name="users" size={16} />{project.members.length} team members</span><button className="text-danger-button" onClick={() => setConfirmDelete(true)}>Delete project</button></section>
    {edit && <Modal title="Edit project" description="Update details and responsibilities." onClose={() => setEdit(false)}><ProjectForm project={project} onCancel={() => setEdit(false)} onSubmit={(updates) => { updateProject(project.id, updates); setEdit(false) }} /></Modal>}
    {createTask && <Modal title="Add a project task" description={`Create a next step for ${project.name}.`} onClose={() => setCreateTask(false)}><TaskForm projectId={project.id} onCancel={() => setCreateTask(false)} onSubmit={(task) => { addTask(task); setCreateTask(false) }} /></Modal>}
    {confirmDelete && <Modal title="Delete this project?" description={`“${project.name}” and its ${projectTasks.length} tasks will be permanently removed.`} onClose={() => setConfirmDelete(false)}><div className="modal-actions"><button className="button button-quiet" onClick={() => setConfirmDelete(false)}>Cancel</button><button className="button button-danger" onClick={() => { deleteProject(project.id); navigate('/projects') }}>Delete project</button></div></Modal>}
  </div>
}
