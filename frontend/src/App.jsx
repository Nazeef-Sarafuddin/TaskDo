import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";

axios.defaults.withCredentials = true;

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/tasks`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(true);

  const getTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);

      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else if (Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ✅ Optimized add
  const addTask = async (data) => {
    const res = await axios.post(API, data);
    setTasks((prev) => [...prev, res.data]);
  };

  // ✅ Optimized toggle
  const toggleTask = async (id) => {
    const res = await axios.patch(`${API}/${id}/toggle`);
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? res.data : t))
    );
  };

  // ✅ Optimized delete
  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const updateTask = async (id, data) => {
    const res = await axios.put(`${API}/${id}`, data);
    setEditingId(null);
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? res.data : t))
    );
  };

  const done = tasks.filter((t) => t.completed).length;
  const remaining = tasks.length - done;

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

        <button
          className="btn-theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </header>

      <AddTask addTask={addTask} />

      <div className="task-list">
        {loading && (
          <div className="empty">Loading...</div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="empty">
            No tasks yet. Add one above to get started.
          </div>
        )}

        <TaskList
          tasks={tasks}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          updateTask={updateTask}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      </div>
    </div>
  );
}

export default App;