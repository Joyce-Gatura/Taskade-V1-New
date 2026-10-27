import { getTaskProgress } from '../utils/taskUtils'
import { ProgressBar } from './UI'

export default function TaskProgress({ task }) {
  const progress = getTaskProgress(task)
  return <div className="task-progress">
    <div className="task-progress-label"><span>Subtask progress</span><strong>{progress}%</strong></div>
    <ProgressBar value={progress} color="violet" />
  </div>
}
