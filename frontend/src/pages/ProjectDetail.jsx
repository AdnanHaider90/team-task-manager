import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProject, getTasksByProject, createTask, updateTask, deleteTask, updateTaskStatus, getAllUsers } from '../services/api'
import TaskCard from '../components/TaskCard'
import './ProjectDetail.css'

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']
const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  const emptyForm = { title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', assignedToId: '', projectId: id }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    Promise.all([getProject(id), getTasksByProject(id), getAllUsers()]).then(([p, t, u]) => {
      setProject(p.data)
      setTasks(t.data)
      setUsers(u.data)
      setLoading(false)
    })
  }, [id])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (task) => {
    setEditing(task)
    setForm({
      title: task.title, description: task.description || '',
      status: task.status, priority: task.priority,
      dueDate: task.dueDate || '', assignedToId: task.assignedTo?.id || '',
      projectId: id
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, assignedToId: form.assignedToId || null, projectId: parseInt(id) }
    try {
      if (editing) {
        const res = await updateTask(editing.id, payload)
        setTasks(tasks.map(t => t.id === editing.id ? res.data : t))
      } else {
        const res = await createTask(payload)
        setTasks([res.data, ...tasks])
      }
      setShowModal(false)
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Something went wrong'))
    }
  }

  const handleStatusChange = async (taskId, status) => {
    const res = await updateTaskStatus(taskId, status)
    setTasks(tasks.map(t => t.id === taskId ? res.data : t))
  }

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return
    await deleteTask(taskId)
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter)

  if (loading) return <div className="loading">Loading project...</div>

  return (
    <div className="project-detail">
      <div className="page-header">
        <div>
          <div className="breadcrumb"><Link to="/projects">Projects</Link> / {project?.name}</div>
          <h1>{project?.name}</h1>
          {project?.description && <p>{project.description}</p>}
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Task</button>
      </div>

      <div className="kanban-header">
        <div className="filter-tabs">
          <button className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`} onClick={() => setFilter('ALL')}>
            All ({tasks.length})
          </button>
          {STATUSES.map(s => (
            <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {STATUS_LABELS[s]} ({tasks.filter(t => t.status === s).length})
            </button>
          ))}
        </div>
      </div>

      <div className="kanban-board">
        {STATUSES.map(status => {
          const col = tasks.filter(t => t.status === status)
          if (filter !== 'ALL' && filter !== status) return null
          return (
            <div key={status} className="kanban-col">
              <div className="kanban-col-header">
                <span className={`kanban-dot dot-${status.toLowerCase()}`} />
                <span className="kanban-col-title">{STATUS_LABELS[status]}</span>
                <span className="kanban-count">{col.length}</span>
              </div>
              <div className="kanban-tasks">
                {col.length === 0
                  ? <div className="kanban-empty">No tasks here</div>
                  : col.map(task => (
                      <TaskCard key={task.id} task={task}
                        onStatusChange={handleStatusChange}
                        onEdit={openEdit}
                        onDelete={handleDelete} />
                    ))
                }
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Task' : 'Create Task'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input className="form-control" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Task title" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Task details..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Status</label>
                  <select className="form-control" value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="form-control" value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Due Date</label>
                  <input className="form-control" type="date" value={form.dueDate}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Assign To</label>
                  <select className="form-control" value={form.assignedToId}
                    onChange={e => setForm({ ...form, assignedToId: e.target.value })}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
