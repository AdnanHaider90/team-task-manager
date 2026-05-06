import './TaskCard.css'

export default function TaskCard({ task, compact, overdue, onStatusChange, onEdit, onDelete }) {
  const statusClass = `badge badge-${task.status?.toLowerCase()}`
  const priorityClass = `badge badge-${task.priority?.toLowerCase()}`

  const isOverdue = overdue || task.overdue

  return (
    <div className={`task-card ${isOverdue ? 'task-overdue' : ''} ${compact ? 'compact' : ''}`}>
      <div className="task-card-top">
        <div className="task-title-row">
          {isOverdue && <span className="overdue-dot" title="Overdue" />}
          <span className="task-title">{task.title}</span>
        </div>
        <div className="task-badges">
          <span className={statusClass}>{task.status?.replace('_', ' ')}</span>
          <span className={priorityClass}>{task.priority}</span>
        </div>
      </div>

      {!compact && task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-meta">
        <span className="task-project">📁 {task.projectName}</span>
        {task.assignedTo && <span className="task-assignee">👤 {task.assignedTo.name}</span>}
        {task.dueDate && (
          <span className={`task-due ${isOverdue ? 'due-overdue' : ''}`}>
            📅 {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      {(onStatusChange || onEdit || onDelete) && (
        <div className="task-actions">
          {onStatusChange && task.status !== 'DONE' && (
            <button className="btn btn-sm btn-outline"
              onClick={() => onStatusChange(task.id, task.status === 'TODO' ? 'IN_PROGRESS' : 'DONE')}>
              {task.status === 'TODO' ? '▶ Start' : '✓ Done'}
            </button>
          )}
          {onEdit && <button className="btn btn-sm btn-outline" onClick={() => onEdit(task)}>✏️ Edit</button>}
          {onDelete && <button className="btn btn-sm btn-danger" onClick={() => onDelete(task.id)}>🗑</button>}
        </div>
      )}
    </div>
  )
}
