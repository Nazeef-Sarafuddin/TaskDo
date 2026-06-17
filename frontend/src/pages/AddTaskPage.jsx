import AddTask from "../components/AddTask";
import { useNavigate } from "react-router-dom";

export default function AddTaskPage() {
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h1>Add Task</h1>
      <AddTask addTask={handleAdd} />
    </div>
  );
}