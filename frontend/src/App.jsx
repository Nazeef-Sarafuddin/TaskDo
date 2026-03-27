import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";

axios.defaults.withCredentials = true;

function App() {
    const [tasks, setTasks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
    const API = 'https://mydo-smoky.vercel.app/api/tasks'

    // Apply theme to <html>
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const getTasks = async () => {
        const res = await axios.get(API);
        setTasks(res.data);
    };

    useEffect(() => {
        getTasks();
    }, []);

    const addTask = async (data) => {
        await axios.post(API, data);
        getTasks();
    };

    const toggleTask = async (id) => {
        await axios.patch(`${API}/${id}/toggle`);
        getTasks();
    };

    const deleteTask = async (id) => {
        await axios.delete(`${API}/${id}`);
        getTasks();
    };

    const updateTask = async (id, data) => {
        await axios.put(`${API}/${id}`, data);
        setEditingId(null);
        getTasks();
    };

    const done = tasks.filter(t => t.completed).length;
    const remaining = tasks.length - done;
    const isDark = theme === "dark";

    return (
        <div className="container">
            <header className="app-header">
                <div className="app-header-left">
                    <span className="app-label">Dashboard</span>
                    <h1>My Tasks</h1>
                    {tasks.length > 0 && (
                        <p className="task-count">
                            <span>{remaining} remaining</span>
                            <span className="task-count-sep">·</span>
                            <span className="task-count-done">{done} done</span>
                        </p>
                    )}
                </div>

                {/* Theme toggle */}
                <button
                    className="btn-theme"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {isDark ? (
                        /* Sun icon */
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"/>
                            <line x1="12" y1="1" x2="12" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                            <line x1="1" y1="12" x2="3" y2="12"/>
                            <line x1="21" y1="12" x2="23" y2="12"/>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </svg>
                    ) : (
                        /* Moon icon */
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    )}
                </button>
            </header>

            <AddTask addTask={addTask} />

            <div className="task-list">
                {tasks.length === 0 && (
                    <div className="empty">
                        No tasks yet. Add one above to get started.
                    </div>
                )}
                <TaskList
                    tasks={tasks}
                    toggleTask={toggleTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    setEditingId={setEditingId}
                    editingId={editingId}
                />
            </div>
        </div>
    );
}

export default App;