import { useState } from 'react'
import { useApp } from '../context/useApp'
import { Icon, PageHeader } from '../Components/UI'

export default function Settings() {
  const { workspaceName, preferences, updateWorkspaceName, updatePreferences } = useApp()
  const [saved, setSaved] = useState(false)
  function saveWorkspace(event) {
    event.preventDefault()
    const value = new FormData(event.currentTarget).get('workspaceName').trim()
    if (!value) return
    updateWorkspaceName(value)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return <div className="page">
    <PageHeader  title="Settings" description="Manage your workspace and personal preferences." />
    <div className="settings-layout">
      <nav className="settings-nav" aria-label="Settings sections"><a className="settings-nav-active" href="#workspace">Workspace</a><a href="#preferences">Preferences</a><a href="#about">About Taskade</a></nav>
      <div className="settings-content">
        <section className="panel settings-section" id="workspace"><div className="settings-section-heading"><span className="settings-icon"><Icon name="folder" /></span><span><h2>Workspace details</h2><p>Update how your team workspace appears.</p></span></div>
          <form className="settings-form" onSubmit={saveWorkspace}><label>Workspace name<input key={workspaceName} name="workspaceName" defaultValue={workspaceName} maxLength="50" required /></label><div className="settings-actions"><span role="status" className="save-message">{saved ? 'Changes saved' : ''}</span><button type="submit" className="button button-primary">Save changes</button></div></form>
        </section>
        <section className="panel settings-section" id="preferences"><div className="settings-section-heading"><span className="settings-icon"><Icon name="settings" /></span><span><h2>Preferences</h2><p>Make Taskade work the way you do.</p></span></div>
          <div className="preference-row"><span><strong>Appearance</strong><small>Choose a comfortable theme for your workspace.</small></span><select aria-label="Appearance theme" value={preferences.theme} onChange={(event) => updatePreferences({ theme: event.target.value })}><option value="light">Light</option><option value="dark">Dark</option><option value="system">System default</option></select></div>
          <div className="preference-row"><span><strong>Task notifications</strong><small>Show assignment and due date reminders in your workspace.</small></span><button className={`toggle ${preferences.notifications ? 'toggle-on' : ''}`} role="switch" aria-checked={preferences.notifications} aria-label="Task notifications" onClick={() => updatePreferences({ notifications: !preferences.notifications })}><span /></button></div>
          <div className="preference-row"><span><strong>Weekly digest preference</strong><small>Saved locally; email delivery is not connected.</small></span><button className={`toggle ${preferences.weeklySummary ? 'toggle-on' : ''}`} role="switch" aria-checked={preferences.weeklySummary} aria-label="Weekly digest preference" onClick={() => updatePreferences({ weeklySummary: !preferences.weeklySummary })}><span /></button></div>
        </section>
        <section className="panel settings-section about-section" id="about"><span className="about-mark"><Icon name="check" /></span><div><h2>Taskade workspace</h2><p>A simple space to plan, build, and ship good work together.</p><small>Workspace data is saved locally in this browser. No account or server is connected.</small></div></section>
      </div>
    </div>
  </div>
}
