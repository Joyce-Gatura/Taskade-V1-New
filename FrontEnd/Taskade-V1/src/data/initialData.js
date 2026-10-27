const dateFromToday = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export const initialData = {
  workspaceName: 'Studio North',
  preferences: { theme: 'light', notifications: true, weeklySummary: false },
  projects: [
    { id: 'atlas', name: 'Atlas redesign', description: 'A thoughtful refresh of the product experience.', color: 'violet', status: 'In progress', priority: 'High', deadline: dateFromToday(12), members: ['Olivia Chen', 'Marcus Lee', 'Amara Okafor'] },
    { id: 'mobile', name: 'Mobile app v2', description: 'Ship a faster, more personal mobile experience.', color: 'blue', status: 'In progress', priority: 'High', deadline: dateFromToday(20), members: ['Marcus Lee', 'Sofia Patel'] },
    { id: 'platform', name: 'Platform reliability', description: 'Make our infrastructure boringly dependable.', color: 'green', status: 'Planning', priority: 'Medium', deadline: dateFromToday(30), members: ['Noah Kim', 'Olivia Chen'] },
    { id: 'launch', name: 'Spring launch', description: 'Coordinate the next product launch across teams.', color: 'orange', status: 'In progress', priority: 'Medium', deadline: dateFromToday(5), members: ['Amara Okafor', 'Sofia Patel', 'Noah Kim'] },
  ],
  tasks: [
    { id: 'task-1', projectId: 'atlas', title: 'Map the onboarding journey', description: 'Document the main paths and friction points for first-time users.', status: 'Done', priority: 'High', dueDate: dateFromToday(-2), assignee: 'Olivia Chen', labels: ['Research'], stage: 'Planning', type: 'Feature', subtasks: [], comments: [] },
    { id: 'task-2', projectId: 'atlas', title: 'Create updated component library', description: 'Bring buttons, forms, and navigation in line with the new design system.', status: 'In progress', priority: 'High', dueDate: dateFromToday(2), assignee: 'Marcus Lee', labels: ['Design system'], stage: 'Design', type: 'Feature', subtasks: [{ id: 'sub-1', title: 'Audit existing components', done: true }, { id: 'sub-2', title: 'Document color and type tokens', done: false }], comments: [] },
    { id: 'task-3', projectId: 'atlas', title: 'Review responsive prototypes', description: 'Check tablet and mobile breakpoints before handoff.', status: 'In review', priority: 'Medium', dueDate: dateFromToday(4), assignee: 'Amara Okafor', labels: ['Review'], stage: 'Code review', type: 'Improvement', subtasks: [], comments: [] },
    { id: 'task-4', projectId: 'mobile', title: 'Set up crash reporting', description: 'Connect the app to our monitoring workflow and verify alerts.', status: 'To do', priority: 'Urgent', dueDate: dateFromToday(-1), assignee: 'Noah Kim', labels: ['Reliability', 'Mobile'], stage: 'Development', type: 'Technical improvement', subtasks: [], comments: [] },
    { id: 'task-5', projectId: 'mobile', title: 'Implement saved items', description: 'Allow signed-in users to save and revisit useful content.', status: 'In progress', priority: 'High', dueDate: dateFromToday(7), assignee: 'Sofia Patel', labels: ['Mobile'], stage: 'Development', type: 'Feature', subtasks: [], comments: [] },
    { id: 'task-6', projectId: 'platform', title: 'Add deployment health checks', description: 'Define health endpoints and document the rollback signal.', status: 'To do', priority: 'Medium', dueDate: dateFromToday(9), assignee: 'Noah Kim', labels: ['Infrastructure'], stage: 'Testing', type: 'Technical improvement', subtasks: [], comments: [] },
    { id: 'task-7', projectId: 'launch', title: 'Finalize release checklist', description: 'Gather sign-off from product, support, and engineering.', status: 'In progress', priority: 'High', dueDate: dateFromToday(1), assignee: 'Amara Okafor', labels: ['Launch'], stage: 'Deployment', type: 'Feature', subtasks: [], comments: [] },
    { id: 'task-8', projectId: 'launch', title: 'Verify analytics events', description: 'Confirm launch funnel events are firing in staging.', status: 'To do', priority: 'Medium', dueDate: dateFromToday(3), assignee: 'Olivia Chen', labels: ['Analytics'], stage: 'Testing', type: 'Improvement', subtasks: [], comments: [] },
  ],
  members: [
    { name: 'Olivia Chen', role: 'Product designer', initials: 'OC', color: 'violet', email: 'olivia@taskade.team' },
    { name: 'Marcus Lee', role: 'Frontend engineer', initials: 'ML', color: 'blue', email: 'marcus@taskade.team' },
    { name: 'Amara Okafor', role: 'Product manager', initials: 'AO', color: 'orange', email: 'amara@taskade.team' },
    { name: 'Noah Kim', role: 'Backend engineer', initials: 'NK', color: 'green', email: 'noah@taskade.team' },
    { name: 'Sofia Patel', role: 'Mobile engineer', initials: 'SP', color: 'pink', email: 'sofia@taskade.team' },
  ],
  activity: [
    { id: 'activity-1', text: 'Olivia completed “Map the onboarding journey”', time: 'Today, 10:42 AM', kind: 'complete' },
    { id: 'activity-2', text: 'Marcus moved “Create updated component library” to In progress', time: 'Today, 9:18 AM', kind: 'update' },
    { id: 'activity-3', text: 'Amara added a new milestone to Spring launch', time: 'Yesterday, 4:36 PM', kind: 'milestone' },
    { id: 'activity-4', text: 'Sofia joined Mobile app v2', time: 'Yesterday, 2:10 PM', kind: 'team' },
  ],
}

export const projectTemplates = {
  software: [
    { title: 'Define scope and acceptance criteria', stage: 'Planning', type: 'Feature', priority: 'High', days: 2 },
    { title: 'Build the first iteration', stage: 'Development', type: 'Feature', priority: 'Medium', days: 7 },
    { title: 'Test and review the implementation', stage: 'Testing', type: 'Improvement', priority: 'Medium', days: 10 },
    { title: 'Prepare release and deployment notes', stage: 'Deployment', type: 'Milestone', priority: 'Low', days: 14 },
  ],
  launch: [
    { title: 'Confirm launch goals and owners', stage: 'Planning', type: 'Milestone', priority: 'High', days: 2 },
    { title: 'Prepare product and support materials', stage: 'Design', type: 'Feature', priority: 'High', days: 6 },
    { title: 'Run launch readiness review', stage: 'Testing', type: 'Improvement', priority: 'Medium', days: 10 },
    { title: 'Coordinate release and monitor rollout', stage: 'Deployment', type: 'Milestone', priority: 'High', days: 14 },
  ],
}

export const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
