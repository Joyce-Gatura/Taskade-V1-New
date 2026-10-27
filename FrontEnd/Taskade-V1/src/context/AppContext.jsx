import { useCallback, useEffect, useMemo, useState } from 'react'
import { createId, initialData, projectTemplates } from '../data/initialData'
import { AppContext } from './ContextValue'
import { toDateInputValue } from '../utils/taskUtils'

const STORAGE_KEY = 'taskade-workspace-v1'

const normalizeTask = (task) => {
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : []
  if (!subtasks.length) return { ...task, subtasks }
  const allSubtasksDone = subtasks.every((subtask) => subtask?.done === true)
  return {
    ...task,
    subtasks,
    status: allSubtasksDone ? 'Done' : task.status === 'Done' ? 'In progress' : task.status,
  }
}

const readWorkspace = () => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return initialData
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed.projects) || !Array.isArray(parsed.tasks)) throw new Error('Saved workspace data is invalid.')
    return {
      ...initialData,
      ...parsed,
      tasks: parsed.tasks.map(normalizeTask),
      members: Array.isArray(parsed.members) ? parsed.members : initialData.members,
      activity: Array.isArray(parsed.activity) ? parsed.activity : initialData.activity,
      workspaceName: typeof parsed.workspaceName === 'string' && parsed.workspaceName.trim() ? parsed.workspaceName : initialData.workspaceName,
      preferences: { ...initialData.preferences, ...(parsed.preferences || {}) },
    }
  } catch (error) {
    console.error('Unable to load the saved workspace.', error)
    return initialData
  }
}

export function AppProvider({ children }) {
  const [workspace, setWorkspace] = useState(readWorkspace)
  const [storageError, setStorageError] = useState('')

  useEffect(() => {
    const onSave = () => setStorageError('')
    const onError = (event) => setStorageError(event.detail)
    window.addEventListener('taskade:storage-saved', onSave)
    window.addEventListener('taskade:storage-error', onError)
    return () => {
      window.removeEventListener('taskade:storage-saved', onSave)
      window.removeEventListener('taskade:storage-error', onError)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = workspace.preferences.theme
  }, [workspace.preferences.theme])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
      window.dispatchEvent(new CustomEvent('taskade:storage-saved'))
    } catch (error) {
      console.error('Unable to save the workspace.', error)
      window.dispatchEvent(new CustomEvent('taskade:storage-error', { detail: 'Your browser could not save this change. Check available storage and try again.' }))
    }
  }, [workspace])

  const changeWorkspace = useCallback((updater, message) => {
    setWorkspace((current) => {
      const next = updater(current)
      if (!message) return next
      return {
        ...next,
        activity: [{ id: createId(), text: message, time: 'Just now', kind: 'update' }, ...next.activity].slice(0, 30),
      }
    })
  }, [])

  const addProject = useCallback((project) => {
    const { template, ...details } = project
    const created = { ...details, id: createId(), members: project.members || [] }
    const starterTasks = (projectTemplates[template] || []).map((item) => {
      const dueDate = created.startDate ? new Date(`${created.startDate}T12:00:00`) : new Date()
      dueDate.setDate(dueDate.getDate() + item.days)
      return {
        id: createId(),
        projectId: created.id,
        title: item.title,
        description: '',
        status: 'To do',
        priority: item.priority,
        startDate: created.startDate,
        dueDate: toDateInputValue(dueDate),
        assignee: created.members[0] || 'Olivia Chen',
        labels: [],
        stage: item.stage,
        type: item.type,
        subtasks: [],
        comments: [],
      }
    })
    changeWorkspace((current) => ({ ...current, projects: [created, ...current.projects], tasks: [...starterTasks, ...current.tasks] }), `A new project was created: ${created.name}`)
    return created.id
  }, [changeWorkspace])

  const updateProject = useCallback((id, updates) => {
    changeWorkspace((current) => ({ ...current, projects: current.projects.map((project) => project.id === id ? { ...project, ...updates } : project) }), `Project details were updated`)
  }, [changeWorkspace])

  const deleteProject = useCallback((id) => {
    const project = workspace.projects.find((item) => item.id === id)
    if (!project) return
    changeWorkspace((current) => ({ ...current, projects: current.projects.filter((item) => item.id !== id), tasks: current.tasks.filter((task) => task.projectId !== id) }), `Project “${project.name}” and its tasks were deleted`)
  }, [changeWorkspace, workspace.projects])

  const addTask = useCallback((task) => {
    const created = { ...task, id: createId(), subtasks: [], comments: [], labels: task.labels || [] }
    changeWorkspace((current) => ({ ...current, tasks: [created, ...current.tasks] }), `A new task was created: ${created.title}`)
    return created.id
  }, [changeWorkspace])

  const updateTask = useCallback((id, updates) => {
    const task = workspace.tasks.find((item) => item.id === id)
    const nextTask = task ? { ...task, ...updates } : null
    if (nextTask && (Object.hasOwn(updates, 'subtasks') || Object.hasOwn(updates, 'status'))) {
      const subtasks = Array.isArray(nextTask.subtasks) ? nextTask.subtasks : []
      const allSubtasksDone = subtasks.length > 0 && subtasks.every((subtask) => subtask?.done === true)
      if (allSubtasksDone) nextTask.status = 'Done'
      else if (subtasks.length > 0 && nextTask.status === 'Done') nextTask.status = 'In progress'
      else if (!subtasks.length && Object.hasOwn(updates, 'subtasks') && task.subtasks?.length && nextTask.status === 'Done') nextTask.status = 'In progress'
    }
    const message = nextTask ? `${nextTask.title} was updated${updates.status ? ` to ${updates.status}` : ''}` : 'A task was updated'
    changeWorkspace((current) => ({ ...current, tasks: current.tasks.map((item) => item.id === id ? nextTask : item) }), message)
  }, [changeWorkspace, workspace.tasks])

  const deleteTask = useCallback((id) => {
    const task = workspace.tasks.find((item) => item.id === id)
    if (!task) return
    changeWorkspace((current) => ({ ...current, tasks: current.tasks.filter((item) => item.id !== id) }), `Task “${task.title}” was deleted`)
  }, [changeWorkspace, workspace.tasks])

  const addMember = useCallback((member) => {
    changeWorkspace((current) => ({ ...current, members: [...current.members, { ...member, initials: member.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() }] }), `${member.name} was added to the team`)
  }, [changeWorkspace])

  const updateWorkspaceName = useCallback((workspaceName) => {
    changeWorkspace((current) => ({ ...current, workspaceName }))
  }, [changeWorkspace])

  const updatePreferences = useCallback((preferences) => {
    changeWorkspace((current) => ({ ...current, preferences: { ...current.preferences, ...preferences } }))
  }, [changeWorkspace])

  const value = useMemo(() => ({
    ...workspace,
    storageError,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addMember,
    updateWorkspaceName,
    updatePreferences,
  }), [workspace, storageError, addProject, updateProject, deleteProject, addTask, updateTask, deleteTask, addMember, updateWorkspaceName, updatePreferences])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
