import { useState } from 'react'
import { createId } from '../data/initialData'
import { Icon } from './UI'
import TaskProgress from './TaskProgress'

export default function Subtasks({ subtasks = [], onChange }) {
  const [title, setTitle] = useState('')
  const completed = subtasks.filter((item) => item.done).length

  function addSubtask(event) {
    event.preventDefault()
    const value = title.trim()
    if (!value) return
    onChange([...subtasks, { id: createId(), title: value, done: false }])
    setTitle('')
  }

  return <section className="panel subtasks-panel">
    <div className="panel-heading"><div><h2>Subtasks <span className="section-count">{completed}/{subtasks.length}</span></h2><p>Make the next step feel manageable.</p></div></div>
    <TaskProgress task={{ subtasks }} />
    {subtasks.length > 0 && <div className="subtask-list">{subtasks.map((item) => <div className="subtask-row" key={item.id}><label><input type="checkbox" checked={item.done} onChange={(event) => onChange(subtasks.map((subtask) => subtask.id === item.id ? { ...subtask, done: event.target.checked } : subtask))} /><span className={item.done ? 'subtask-done' : ''}>{item.title}</span></label><button className="icon-button" aria-label={`Remove ${item.title}`} onClick={() => onChange(subtasks.filter((subtask) => subtask.id !== item.id))}><Icon name="close" size={15} /></button></div>)}</div>}
    <form className="subtask-add" onSubmit={addSubtask}><Icon name="plus" size={16} /><input aria-label="New subtask title" placeholder="Add a subtask..." value={title} onChange={(event) => setTitle(event.target.value)} maxLength="100" /><button className="button button-quiet button-small" type="submit" disabled={!title.trim()}>Add</button></form>
  </section>
}
