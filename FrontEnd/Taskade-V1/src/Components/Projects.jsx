import { useMemo, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { AvatarStack, Icon, Modal, PageHeader, ProgressBar, StatusPill } from './UI'
import { formatDate, getProjectProgress } from '../utils/taskUtils'
import { ProjectForm } from './Forms'

export default function Projects() {
  const { projects, tasks, members, addProject, updateProject, deleteProject } = useApp()
  const { openCreate } = useOutletContext()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All projects')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()
  const filtered = useMemo(() => projects.filter((project) => {
    const matchesSearch = `${project.name} ${project.description}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = filter === 'Archived' ? project.archived : !project.archived && (filter === 'All projects' || project.status === filter)
    return matchesSearch && matchesStatus
  }), [filter, projects, query])

  function save(project) {
    if (editing) updateProject(editing.id, project)
    else addProject(project)
    setEditing(null)
  }

  return <div className="page">
    <PageHeader title="Projects" description="Keep every initiative moving in the right direction.">
      <button className="button button-primary" onClick={() => openCreate('project')}><Icon name="plus" size={16} />New project</button>
    </PageHeader>
    <section className="panel project-page-panel">
      <div className="list-toolbar"><div className="inline-search"><Icon name="search" size={16} /><input aria-label="Search projects" placeholder="Find a project..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><label className="filter-control"><Icon name="filter" size={15} /><select aria-label="Filter projects by status" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All projects</option><option>In progress</option><option>Planning</option><option>Completed</option><option>On hold</option><option>Archived</option></select></label><span className="result-count">{filtered.length} projects</span></div>
      {filtered.length ? <div className="projects-grid">{filtered.map((project) => {
        const count = tasks.filter((task) => task.projectId === project.id).length
        const progress = getProjectProgress(project.id, tasks)
        return <article key={project.id} className="project-card">
          <div className="project-card-top"><Link to={`/projects/${project.id}`} className={`project-mark mark-${project.color}`}><Icon name="folder" size={18} /></Link><div className="project-actions"><button aria-label={`Edit ${project.name}`} title="Edit project" className="icon-button" onClick={() => setEditing(project)}><Icon name="settings" size={16} /></button><button aria-label={`${project.archived ? 'Restore' : 'Archive'} ${project.name}`} title={project.archived ? 'Restore project' : 'Archive project'} className="icon-button" onClick={() => updateProject(project.id, { archived: !project.archived })}><Icon name="archive" size={16} /></button><button aria-label={`Delete ${project.name}`} title="Delete project" className="icon-button" onClick={() => setDeleting(project)}><Icon name="close" size={16} /></button></div></div>
          <Link className="project-card-link" to={`/projects/${project.id}`}><h2>{project.name}</h2></Link><p className="project-card-description">{project.description || 'No description added yet.'}</p>
          <div className="project-card-status"><StatusPill status={project.archived ? 'Archived' : project.status} /><span className={`priority-label priority-${project.priority.toLowerCase()}`}>{project.priority} priority</span></div>
          <div className="project-progress-label"><span>Progress</span><strong>{progress}%</strong></div><ProgressBar value={progress} color={project.color} />
          <div className="project-card-footer"><AvatarStack names={project.members} members={members} /><span className="project-task-count">{count} {count === 1 ? 'task' : 'tasks'}</span><span className="project-deadline"><Icon name="calendar" size={13} />{formatDate(project.deadline)}</span></div>
        </article>
      })}</div> : <div className="empty-state"><span className="empty-illustration"><Icon name="folder" size={25} /></span><strong>{projects.length ? 'No projects match your search' : 'A fresh start for your next big thing'}</strong><p>{projects.length ? 'Try a different name or status filter.' : 'Create your first project and invite your team in.'}</p>{projects.length ? <button className="button button-quiet" onClick={() => { setQuery(''); setFilter('All projects') }}>Clear filters</button> : <button className="button button-primary button-small" onClick={() => openCreate('project')}><Icon name="plus" size={15} />Create a project</button>}</div>}
    </section>
    {editing && <Modal title="Edit project" description="Update your project details and team." onClose={() => setEditing(null)}><ProjectForm project={editing} onCancel={() => setEditing(null)} onSubmit={save} /></Modal>}
    {deleting && <Modal title="Delete this project?" description={`“${deleting.name}” and its tasks will be permanently removed from this browser workspace.`} onClose={() => setDeleting(null)}><div className="modal-actions"><button className="button button-quiet" onClick={() => setDeleting(null)}>Keep project</button><button className="button button-danger" onClick={() => { deleteProject(deleting.id); setDeleting(null); navigate('/projects') }}>Delete project</button></div></Modal>}
  </div>
}
