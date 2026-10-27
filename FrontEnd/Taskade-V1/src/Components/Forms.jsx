import { useState } from 'react'
import { useApp } from '../context/useApp'
import { toDateInputValue } from '../utils/taskUtils'

const today = toDateInputValue(new Date())

export function ProjectForm({ onCancel, onSubmit, project }) {
  const { members } = useApp()
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = form.get('name').trim()
    if (!name) { setError('Give your project a name to continue.'); return }
    onSubmit({
      name,
      description: form.get('description').trim(),
      status: form.get('status'),
      priority: form.get('priority'),
      startDate: form.get('startDate'),
      deadline: form.get('deadline'),
      color: form.get('color'),
      members: form.getAll('members'),
      template: form.get('template') || 'none',
    })
  }

  return <form className="form-stack" onSubmit={submit}>
    <label>Project name<input autoFocus name="name" required maxLength="80" defaultValue={project?.name} placeholder="e.g. Website refresh" /></label>
    <label>Description<textarea name="description" rows="3" maxLength="240" defaultValue={project?.description} placeholder="What are you working towards?" /></label>
    {!project && <label>Start with a template<select name="template" defaultValue="none"><option value="none">Blank project</option><option value="software">Software delivery workflow</option><option value="launch">Product launch checklist</option></select></label>}
    <div className="form-row">
      <label>Status<select name="status" defaultValue={project?.status || 'Planning'}><option>Planning</option><option>In progress</option><option>Completed</option><option>On hold</option></select></label>
      <label>Priority<select name="priority" defaultValue={project?.priority || 'Medium'}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></label>
    </div>
    <div className="form-row">
      <label>Start date<input name="startDate" type="date" required={!project} defaultValue={project ? project.startDate || '' : today} /></label>
      <label>Target date<input name="deadline" type="date" min={project ? undefined : today} defaultValue={project?.deadline} /></label>
    </div>
    <label>Project color<select name="color" defaultValue={project?.color || 'violet'}><option value="violet">Violet</option><option value="blue">Blue</option><option value="green">Green</option><option value="orange">Orange</option><option value="pink">Pink</option></select></label>
    <fieldset className="member-picker"><legend>Project members</legend><div>{members.map((member) => <label key={member.name} className="checkbox-label"><input type="checkbox" name="members" value={member.name} defaultChecked={project?.members?.includes(member.name)} />{member.name}</label>)}</div></fieldset>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="modal-actions"><button className="button button-quiet" type="button" onClick={onCancel}>Cancel</button><button className="button button-primary" type="submit">{project ? 'Save changes' : 'Create project'}</button></div>
  </form>
}

export function TaskForm({ onCancel, onSubmit, task, projectId }) {
  const { projects, members } = useApp()
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const title = form.get('title').trim()
    if (!title) { setError('Give your task a clear title to continue.'); return }
    onSubmit({
      title,
      projectId: form.get('projectId'),
      description: form.get('description').trim(),
      status: form.get('status'),
      priority: form.get('priority'),
      startDate: form.get('startDate'),
      dueDate: form.get('dueDate'),
      assignee: form.get('assignee'),
      stage: form.get('stage'),
      type: form.get('type'),
      labels: form.get('labels').split(',').map((label) => label.trim()).filter(Boolean),
      repositoryUrl: form.get('repositoryUrl').trim(),
      issueReference: form.get('issueReference').trim(),
      pullRequestUrl: form.get('pullRequestUrl').trim(),
      deploymentNotes: form.get('deploymentNotes').trim(),
    })
  }

  return <form className="form-stack" onSubmit={submit}>
    <label>Task name<input autoFocus name="title" required maxLength="120" defaultValue={task?.title} placeholder="What needs to get done?" /></label>
    <label>Description<textarea name="description" rows="3" maxLength="500" defaultValue={task?.description} placeholder="Add a little context for your team" /></label>
    <div className="form-row">
      <label>Project<select name="projectId" required defaultValue={task?.projectId || projectId || projects[0]?.id}>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
      <label>Assignee<select name="assignee" defaultValue={task?.assignee || members[0]?.name}>{members.map((member) => <option key={member.name}>{member.name}</option>)}</select></label>
    </div>
    <div className="form-row">
      <label>Status<select name="status" defaultValue={task?.status || 'To do'}><option>To do</option><option>In progress</option><option>In review</option><option>Done</option></select></label>
      <label>Priority<select name="priority" defaultValue={task?.priority || 'Medium'}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></label>
    </div>
    <div className="form-row">
      <label>Start date<input name="startDate" type="date" required={!task} defaultValue={task ? task.startDate || '' : today} /></label>
      <label>Due date<input name="dueDate" type="date" defaultValue={task?.dueDate} /></label>
    </div>
    <div className="form-row">
      <label>Workflow stage<select name="stage" defaultValue={task?.stage || 'Development'}><option>Planning</option><option>Design</option><option>Development</option><option>Testing</option><option>Code review</option><option>Deployment</option></select></label>
      <label>Work type<select name="type" defaultValue={task?.type || 'Feature'}><option>Feature</option><option>Bug</option><option>Improvement</option><option>Technical improvement</option><option>Milestone</option></select></label>
    </div>
    <label>Labels<input name="labels" defaultValue={task?.labels?.join(', ')} placeholder="Design, API (comma separated)" /></label>
    <details className="development-fields"><summary>Development references <span>Optional</span></summary><div className="form-stack">
      <label>Repository URL<input name="repositoryUrl" type="url" defaultValue={task?.repositoryUrl} placeholder="https://github.com/org/repository" /></label>
      <div className="form-row"><label>Issue reference<input name="issueReference" defaultValue={task?.issueReference} placeholder="e.g. PROJ-123" /></label><label>Pull request URL<input name="pullRequestUrl" type="url" defaultValue={task?.pullRequestUrl} placeholder="https://github.com/org/repo/pull/1" /></label></div>
      <label>Deployment notes<textarea name="deploymentNotes" rows="2" defaultValue={task?.deploymentNotes} placeholder="Release and rollback notes" /></label>
    </div></details>
    {error && <p className="form-error" role="alert">{error}</p>}
    {!projects.length && <p className="form-error" role="alert">Create a project before adding tasks.</p>}
    <div className="modal-actions"><button className="button button-quiet" type="button" onClick={onCancel}>Cancel</button><button className="button button-primary" type="submit" disabled={!projects.length}>{task ? 'Save changes' : 'Create task'}</button></div>
  </form>
}
