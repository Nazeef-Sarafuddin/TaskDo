import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  toggleTask,
  deleteTask,
  updateTask,
  editingId,
  setEditingId,
}) {
  return (
    <>
      {Array.isArray(tasks) &&
        tasks.map((task, index) => (
          <TaskItem
            key={task._id}
            task={task}
            index={index}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        ))}
    </>
  );
}