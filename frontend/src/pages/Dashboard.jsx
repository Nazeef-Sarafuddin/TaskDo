import axios from "axios";
import { useState, useEffect } from "react";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";

const API = "http://localhost:5000/api/tasks";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [theme, setTheme] = useState("dark");

  const getTasks = async () => {
    try {
      const res = await axios.get(API);

      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else if (Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);
      } else {
        setTasks([]);
      }
    } catch {
      setTasks([]);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
        {tasks.length === 0 && (
          <div className="empty">
            <h3>No tasks yet</h3>
            <p>Add one above to get started</p>
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