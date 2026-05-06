import { useState, useEffect } from 'react'
import { getDashboard } from '../services/api'
import { useAuth } from '../context/AuthContext'
import TaskCard from '../components/TaskCard'
import './Dashboard.css'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    getDashboard().then(r => { setData(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading dashboard...</div>

  const stats = [
    { label: 'Total Projects', value: data?.totalProjects || 0, icon: '📁', color: '#6366f1', bg: '#e0e7ff' },
    { label: 'Total Tasks', value: data?.totalTasks || 0, icon: '📋', color: '#3b82f6', bg: '#dbeafe' },
    { label: 'In Progress', value: data?.inProgressCount || 0, icon: '🔄', color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Overdue', value: data?.overdueCount || 0, icon: '⚠️', color: '#ef4444', bg: '#fee2e2' },
  ]

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Here's what's happening with your projects today.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label} style={{ '--accent': s.color, '--accent-bg': s.bg }}>
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="task-progress">
        <h3>Task Overview</h3>
        <div className="progress-bars">
          <ProgressItem label="To Do" count={data?.todoCount || 0} total={data?.totalTasks || 1} color="#94a3b8" />
          <ProgressItem label="In Progress" count={data?.inProgressCount || 0} total={data?.totalTasks || 1} color="#6366f1" />
          <ProgressItem label="Done" count={data?.doneCount || 0} total={data?.totalTasks || 1} color="#10b981" />
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="section">
          <h3>Recent Tasks</h3>
          {data?.recentTasks?.length > 0
            ? data.recentTasks.map(t => <TaskCard key={t.id} task={t} compact />)
            : <div className="empty-state"><div className="icon">📭</div><p>No tasks yet</p></div>}
        </div>

        <div className="section">
          <h3>⚠️ Overdue Tasks</h3>
          {data?.overdueTasks?.length > 0
            ? data.overdueTasks.map(t => <TaskCard key={t.id} task={t} compact overdue />)
            : <div className="empty-state"><div className="icon">🎉</div><p>No overdue tasks!</p></div>}
        </div>
      </div>
    </div>
  )
}

function ProgressItem({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="progress-item">
      <div className="progress-meta">
        <span>{label}</span>
        <span>{count} ({pct}%)</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
