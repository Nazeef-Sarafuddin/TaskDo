import { useState } from "react";

export default function TaskItem({
    task,
    toggleTask,
    deleteTask,
    updateTask,
    editingId,
    setEditingId,
}) {
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description || "");
    const [editDate, setEditDate] = useState(
        task.createdAt ? new Date(task.createdAt).toISOString().split("T")[0] : ""
    );

    const isEditing = editingId === task._id;

    const handleSave = () => {
        updateTask(task._id, {
            title: editTitle,
            description: editDesc,
            createdAt: editDate || task.createdAt
        });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className={`task ${task.completed ? "completed" : ""}`}>

            {/* Check button */}
            <button
                className={`btn-check ${task.completed ? "checked" : ""}`}
                onClick={() => toggleTask(task._id)}
                title="Toggle complete"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </button>

            {isEditing ? (
                <>
                    <div className="task-edit-form">
                        {/* Title */}
                        <input
                            className="task-edit-input"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Task name"
                            autoFocus
                        />
                        {/* Description + Date row */}
                        <div className="task-edit-row">
                            <input
                                className="task-edit-input"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                placeholder="Description (optional)"
                            />
                            <input
                                className="task-edit-input date-input"
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="task-actions">
                        <button className="btn-save" onClick={handleSave}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Save
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="task-body">
                        <span className="task-title" onClick={() => toggleTask(task._id)}>
                            {task.title}
                        </span>
                        {(task.description || task.createdAt) && (
                            <div className="task-meta">
                                {task.description && (
                                    <span className="task-desc">{task.description}</span>
                                )}
                                {task.createdAt && (
                                    <span className="task-date">{formatDate(task.createdAt)}</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="task-actions">
                        <button className="btn-edit" onClick={() => setEditingId(task._id)}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                        </button>
                        <div className="task-divider" />
                        <button className="btn-delete" onClick={() => deleteTask(task._id)} title="Delete">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14H6L5 6"/>
                                <path d="M10 11v6M14 11v6"/>
                                <path d="M9 6V4h6v2"/>
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}