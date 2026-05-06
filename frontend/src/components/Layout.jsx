import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">TaskFlow</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📁</span> Projects
          </NavLink>
          <NavLink to="/my-tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">✅</span> My Tasks
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">⏻</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
