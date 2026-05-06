import { useState, useEffect } from 'react'
import { getMyTasks, updateTaskStatus, deleteTask } from '../services/api'
import TaskCard from '../components/TaskCard'
import './MyTasks.css'

export default function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyTasks().then(r => { setTasks(r.data); setLoading(false) })
  }, [])

  const handleStatusChange = async (taskId, status) => {
    const { default: api } = await import('../services/api')
    const res = await api.patch(`/tasks/${taskId}/status`, { status })
    setTasks(tasks.map(t => t.id === taskId ? res.data : t))
  }

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return
    await deleteTask(taskId)
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const overdue = tasks.filter(t => t.overdue)
  const filtered = filter === 'ALL' ? tasks : filter === 'OVERDUE' ? overdue : tasks.filter(t => t.status === filter)

  if (loading) return <div className="loading">Loading tasks...</div>

  return (
    <div className="my-tasks">
      <div className="page-header">
        <div>
          <h1>My Tasks</h1>
          <p>{tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you</p>
        </div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 20, background: 'white', padding: 6, borderRadius: 10, width: 'fit-content', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: 6 }}>
        {[
          { key: 'ALL', label: `All (${tasks.length})` },
          { key: 'TODO', label: `To Do (${tasks.filter(t => t.status === 'TODO').length})` },
          { key: 'IN_PROGRESS', label: `In Progress (${tasks.filter(t => t.status === 'IN_PROGRESS').length})` },
          { key: 'DONE', label: `Done (${tasks.filter(t => t.status === 'DONE').length})` },
          { key: 'OVERDUE', label: `⚠️ Overdue (${overdue.length})` },
        ].map(f => (
          <button key={f.key}
            className={`filter-tab ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
            style={{ padding: '7px 14px', borderRadius: 7, border: 'none', background: filter === f.key ? '#6366f1' : 'transparent', color: filter === f.key ? 'white' : '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <div className="empty-state"><div className="icon">✅</div><p>No tasks here</p></div>
        : <div className="tasks-list">
            {filtered.map(task => (
              <TaskCard key={task.id} task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete} />
            ))}
          </div>
      }
    </div>
  )
}
