import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Calendar from './Pages/Calendar'
import Notifications from './Pages/Notifications'
import ProjectDetails from './Pages/ProjectDetails'
import Settings from './Pages/Settings'
import TaskDetails from './Pages/TaskDetails'
import Team from './Pages/Team'
import Dashboard from './Components/Dashboard'
import Projects from './Components/Projects'
import Tasks from './Components/Tasks'
import { AppProvider } from './context/AppContext'
import AppLayout from './Layout/AppLayout'

export default function App() {
  return <AppProvider><BrowserRouter><Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:projectId" element={<ProjectDetails />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/tasks/:taskId" element={<TaskDetails />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/team" element={<Team />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/calender" element={<Navigate to="/calendar" replace />} />
      <Route path="/analytics" element={<Navigate to="/tasks" replace />} />
      <Route path="/subtasks" element={<Navigate to="/tasks" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes></BrowserRouter></AppProvider>
}