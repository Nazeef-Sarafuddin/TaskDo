import { useState, useEffect } from "react";

export default function TaskItem({
  task,
  toggleTask,
  deleteTask,
  updateTask,
  editingId,
  setEditingId,
}) {
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDate, setEditDate] = useState("");

  const isEditing = editingId === task._id;

  // ✅ FIX: sync state when editing changes
  useEffect(() => {
    if (isEditing) {
      setEditTitle(task.title);
      setEditDesc(task.description || "");
      setEditDate(
        task.createdAt
          ? new Date(task.createdAt).toISOString().split("T")[0]
          : ""
      );
    }
  }, [isEditing, task]);

  const handleSave = () => {
    updateTask(task._id, {
      title: editTitle,
      description: editDesc,
      createdAt: editDate || task.createdAt,
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={`task ${task.completed ? "completed" : ""}`}>
      <button
        className={`btn-check ${task.completed ? "checked" : ""}`}
        onClick={() => toggleTask(task._id)}
      >
        ✓
      </button>

      {isEditing ? (
        <>
          <div className="task-edit-form">
            <input
              className="task-edit-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
            />

            <div className="task-edit-row">
              <input
                className="task-edit-input"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
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
              Save
            </button>

            {/* ✅ NEW */}
            <button onClick={() => setEditingId(null)}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="task-body">
            <span
              className="task-title"
              onClick={() => toggleTask(task._id)}
            >
              {task.title}
            </span>

            {(task.description || task.createdAt) && (
              <div className="task-meta">
                {task.description && (
                  <span className="task-desc">{task.description}</span>
                )}
                {task.createdAt && (
                  <span className="task-date">
                    {formatDate(task.createdAt)}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="task-actions">
            <button
              className="btn-edit"
              onClick={() => setEditingId(task._id)}
            >
              Edit
            </button>

            <button
              className="btn-delete"
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}