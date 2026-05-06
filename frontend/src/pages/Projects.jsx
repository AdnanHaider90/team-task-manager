import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProjects, createProject, updateProject, deleteProject, getAllUsers } from '../services/api'
import { useAuth } from '../context/AuthContext'
import './Projects.css'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const [form, setForm] = useState({ name: '', description: '', memberIds: [] })

  useEffect(() => {
    Promise.all([getProjects(), getAllUsers()]).then(([p, u]) => {
      setProjects(p.data)
      setUsers(u.data)
      setLoading(false)
    })
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '', memberIds: [] })
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({ name: p.name, description: p.description || '', memberIds: p.members.map(m => m.id) })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        const res = await updateProject(editing.id, form)
        setProjects(projects.map(p => p.id === editing.id ? res.data : p))
      } else {
        const res = await createProject(form)
        setProjects([res.data, ...projects])
      }
      setShowModal(false)
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Something went wrong'))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return
    await deleteProject(id)
    setProjects(projects.filter(p => p.id !== id))
  }

  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      memberIds: f.memberIds.includes(id) ? f.memberIds.filter(x => x !== id) : [...f.memberIds, id]
    }))
  }

  if (loading) return <div className="loading">Loading projects...</div>

  return (
    <div className="projects-page">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Project</button>
      </div>

      {projects.length === 0
        ? <div className="empty-state"><div className="icon">📁</div><p>No projects yet. Create your first one!</p></div>
        : <div className="projects-grid">
            {projects.map(p => (
              <div className="project-card" key={p.id}>
                <div className="project-card-header">
                  <div className="project-icon">{p.name.charAt(0).toUpperCase()}</div>
                  <div className="project-actions-menu">
                    {(user?.role === 'ADMIN' || p.createdBy === user?.name) && (
                      <>
                        <button className="icon-btn" onClick={() => openEdit(p)} title="Edit">✏️</button>
                        <button className="icon-btn danger" onClick={() => handleDelete(p.id)} title="Delete">🗑</button>
                      </>
                    )}
                  </div>
                </div>
                <Link to={`/projects/${p.id}`}>
                  <h3 className="project-name">{p.name}</h3>
                </Link>
                <p className="project-desc">{p.description || 'No description'}</p>
                <div className="project-footer">
                  <div className="project-members">
                    {p.members?.slice(0, 4).map(m => (
                      <div key={m.id} className="member-avatar" title={m.name}>
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {p.members?.length > 4 && <div className="member-avatar more">+{p.members.length - 4}</div>}
                  </div>
                  <Link to={`/projects/${p.id}`} className="btn btn-sm btn-outline">
                    View Tasks →
                  </Link>
                </div>
                <div className="project-stats">
                  <span>📋 {p.taskCount} tasks</span>
                  <span>👤 {p.createdBy}</span>
                </div>
              </div>
            ))}
          </div>
      }

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Project' : 'Create Project'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Name *</label>
                <input className="form-control" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Mobile App" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" />
              </div>
              <div className="form-group">
                <label>Team Members</label>
                <div className="members-list">
                  {users.map(u => (
                    <label key={u.id} className="member-check">
                      <input type="checkbox" checked={form.memberIds.includes(u.id)}
                        onChange={() => toggleMember(u.id)} />
                      <span className="member-check-avatar">{u.name.charAt(0)}</span>
                      <span>{u.name}</span>
                      <span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span>
                    </label>
                  ))}
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
