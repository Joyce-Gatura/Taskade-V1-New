export const formatDate = (date) => {
  if (!date) return 'No date'
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const toDateInputValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}

export const getTaskProgress = (task) => {
  const subtasks = Array.isArray(task?.subtasks) ? task.subtasks : []
  if (!subtasks.length) return 0
  return Math.round((subtasks.filter((subtask) => subtask?.done === true).length / subtasks.length) * 100)
}

export const getProjectProgress = (projectId, tasks) => {
  const projectTasks = tasks.filter((task) => task.projectId === projectId)
  if (!projectTasks.length) return 0
  return Math.round((projectTasks.filter((task) => task.status === 'Done').length / projectTasks.length) * 100)
}

export const isOverdue = (date, status) => Boolean(date && status !== 'Done' && date < toDateInputValue(new Date()))

export const getDueSoonTasks = (tasks, days = 3) => {
  const today = new Date()
  const start = toDateInputValue(today)
  const cutoff = toDateInputValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() + days))
  return tasks.filter((task) => task.status !== 'Done' && task.dueDate && task.dueDate >= start && task.dueDate <= cutoff)
}
