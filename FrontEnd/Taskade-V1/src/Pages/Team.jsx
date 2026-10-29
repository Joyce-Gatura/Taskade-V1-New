import { useState } from 'react'
import { useApp } from '../context/useApp'
import { Avatar, Icon, Modal, PageHeader } from '../Components/UI'

export default function Team() {
  const { members, projects, tasks, workspaceName, addMember } = useApp()
  const [invite, setInvite] = useState(false)
  const [error, setError] = useState('')

  function submitInvite(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = form.get('email').trim().toLowerCase()
    const name = form.get('name').trim()
    if (members.some((member) => member.email.toLowerCase() === email)) { setError('This email is already part of your workspace.'); return }
    addMember({ name, email, role: form.get('role'), color: ['blue', 'green', 'orange', 'pink'][members.length % 4] })
    setInvite(false)
  }

  return <div className="page">
    <PageHeader eyebrow={workspaceName.toUpperCase()} title="Team members" ><button className="button button-primary" onClick={() => { setError(''); setInvite(true) }}><Icon name="plus" size={16} />Invite a teammate</button></PageHeader>
    <section className="team-overview-grid"><article className="panel team-overview-card"><span className="metric-icon icon-violet"><Icon name="users" /></span><strong>{members.length}</strong><span>Team members</span></article><article className="panel team-overview-card"><span className="metric-icon icon-blue"><Icon name="folder" /></span><strong>{projects.length}</strong><span>Shared projects</span></article><article className="panel team-overview-card"><span className="metric-icon icon-green"><Icon name="check" /></span><strong>{tasks.filter((task) => task.status === 'Done').length}</strong><span>Tasks completed</span></article></section>
    <section className="panel team-panel"><div className="panel-heading"><div><h2>Workspace people</h2><p>Manage roles and see what everyone is working on.</p></div><span className="team-active-label"><span />All members</span></div>
      <div className="team-table-wrap"><table className="team-table"><thead><tr><th>Member</th><th>Role</th><th>Assigned tasks</th><th>Projects</th><th /></tr></thead><tbody>{members.map((member) => {
        const assigned = tasks.filter((task) => task.assignee === member.name)
        const memberProjects = projects.filter((project) => project.members.includes(member.name))
        return <tr key={member.email}><td><div className="team-person"><Avatar name={member.name} color={member.color} /><span><strong>{member.name}</strong><small>{member.email}</small></span></div></td><td>{member.role}</td><td><span className="team-task-count">{assigned.filter((task) => task.status !== 'Done').length} open <small>of {assigned.length}</small></span></td><td><div className="team-project-list">{memberProjects.slice(0, 2).map((project) => <span key={project.id}>{project.name}</span>)}{memberProjects.length > 2 && <span>+{memberProjects.length - 2}</span>}{!memberProjects.length && <span className="muted">No projects</span>}</div></td><td><button className="icon-button" aria-label={`More options for ${member.name}`} title="Member actions are managed by your workspace admin"><Icon name="more" /></button></td></tr>
      })}</tbody></table></div>
      {!members.length && <div className="empty-state"><span className="empty-illustration"><Icon name="users" size={25} /></span><strong>Invite your first teammate</strong><p>Projects work better when everyone is in the loop.</p><button className="button button-primary button-small" onClick={() => setInvite(true)}><Icon name="plus" size={15} />Invite teammate</button></div>}
    </section>
    {invite && <Modal title="Invite a teammate" description="Add someone to your Studio North workspace." onClose={() => setInvite(false)}><form className="form-stack" onSubmit={submitInvite}><label>Full name<input autoFocus required name="name" maxLength="80" placeholder="e.g. Jamie Rivera" /></label><label>Work email<input required name="email" type="email" placeholder="jamie@company.com" /></label><label>Role<select name="role"><option>Director</option><option>Software engineer</option><option>Software Developer</option><option>Network Engineer</option><option>Other</option></select></label>{error && <p className="form-error" role="alert">{error}</p>}<div className="modal-actions"><button type="button" className="button button-quiet" onClick={() => setInvite(false)}>Cancel</button><button type="submit" className="button button-primary">Add to workspace</button></div></form></Modal>}
  </div>
}
