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
            {tasks.map((task) => (
                <TaskItem
                    key={task._id}
                    task={task}
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