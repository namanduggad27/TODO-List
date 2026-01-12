import { useTasks } from "../hooks/useTasks";
import TaskColumn from "../components/temp";
import TaskForm from "../components/TaskForm";
import SharedList from "../components/SharedList";

export default function Dashboard({ user, logout }) {
  const { tasks, sharedTasks, createTask, updateTask, removeTask, updateSharedTask } = useTasks(user.id);

  const todoTasks = tasks.filter(t => t.status === "todo");
  const inProgressTasks = tasks.filter(t => t.status === "in-progress");
  const doneTasks = tasks.filter(t => t.status === "done");

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Tasks</h1>
        <button onClick={logout} className="btn secondary">Logout</button>
      </div>
      <p>Welcome, {user.name}!</p>

      <TaskForm onCreate={createTask} />

      <div className="board">
        <TaskColumn
          title={`🟡 Todo (${todoTasks.length})`}
          tasks={todoTasks}
          onUpdate={updateTask}
          onDelete={removeTask}
        />

        <TaskColumn
          title={`🔵 In Progress (${inProgressTasks.length})`}
          tasks={inProgressTasks}
          onUpdate={updateTask}
          onDelete={removeTask}
        />

        <TaskColumn
          title={`🟢 Done (${doneTasks.length})`}
          tasks={doneTasks}
          onUpdate={updateTask}
          onDelete={removeTask}
        />
      </div>

      <SharedList tasks={sharedTasks} onUpdate={updateSharedTask} />
    </div>
  );
}
