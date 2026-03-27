import { useState } from "react";

export default function AddTask({ addTask }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    const handleAdd = () => {
        if (!title.trim()) return;
        addTask({
            title,
            description,
            createdAt: date || new Date()
        });
        setTitle("");
        setDescription("");
        setDate("");
    };

    const handleKey = (e) => {
        if (e.key === "Enter") handleAdd();
    };

    return (
        <div className="add-form">
            <div className="add-form-row">
                <div className="field-group">
                    <label htmlFor="add-title">Task Name</label>
                    <input
                        id="add-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="e.g. Buy groceries"
                    />
                </div>
                <div className="field-group field-sm">
                    <label htmlFor="add-date">Date</label>
                    <input
                        id="add-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>
            <div className="add-form-row">
                <div className="field-group">
                    <label htmlFor="add-desc">Description</label>
                    <input
                        id="add-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional details..."
                    />
                </div>
            </div>
            <div className="add-form-footer">
                <button className="btn-add" onClick={handleAdd}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Task
                </button>
            </div>
        </div>
    );
}