import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h1>TaskDo 🚀</h1>
      <p>Manage your tasks like a pro</p>

      <button
        className="btn-add"
        onClick={() => navigate("/dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
}