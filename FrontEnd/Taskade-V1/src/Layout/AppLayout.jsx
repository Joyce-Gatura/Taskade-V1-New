import { useCallback, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { Modal } from '../Components/UI'
import { ProjectForm, TaskForm } from '../Components/Forms'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [createType, setCreateType] = useState('')
  const [plansOpen, setPlansOpen] = useState(false)
  const { addProject, addTask, storageError } = useApp()
  const navigate = useNavigate()
  const openCreate = useCallback((type) => setCreateType(type), [])

  useEffect(() => {
    const openPlans = () => setPlansOpen(true)
    window.addEventListener('taskade:upgrade', openPlans)
    return () => window.removeEventListener('taskade:upgrade', openPlans)
  }, [])

  return <div className="app-shell">
    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <div className="main-column">
      <Navbar onMenu={() => setSidebarOpen(true)} onCreate={openCreate} />
      {storageError && <div className="storage-warning" role="alert">{storageError}</div>}
      <main className="main-content"><Outlet context={{ openCreate }} /></main>
    </div>
    {createType && <Modal title={createType === 'project' ? 'Create a project' : 'Create a task'} description={createType === 'project' ? 'A shared space for work your team wants to move forward.' : 'Add a clear next step to your team’s work.'} onClose={() => setCreateType('')}>
      {createType === 'project'
        ? <ProjectForm onCancel={() => setCreateType('')} onSubmit={(project) => { const id = addProject(project); setCreateType(''); navigate(`/projects/${id}`) }} />
        : <TaskForm onCancel={() => setCreateType('')} onSubmit={(task) => { const id = addTask(task); setCreateType(''); navigate(`/tasks/${id}`) }} />}
    </Modal>}
    {plansOpen && <Modal title="Workspace plans" description="Billing is not connected in this local demo." onClose={() => setPlansOpen(false)}><p className="empty-copy">Your workspace data stays in this browser. Plan upgrades are unavailable until a billing service is configured.</p><div className="modal-actions"><button className="button button-primary" onClick={() => setPlansOpen(false)}>Got it</button></div></Modal>}
  </div>
}
