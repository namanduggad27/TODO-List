export default function SharedList({ tasks, onUpdate, onRefresh }) {
  return (
    <div className="shared-list">
      <h3 className="section-title">Shared With Me</h3>
      <button onClick={onRefresh} className="btn">Refresh Shared Tasks</button>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              <b className="task-title">{task.title}</b> <span className="task-status">[{task.status}]</span> <span className="task-permission">({task.permission})</span>
            </div>
            {task.permission === "edit" && (
              <button
                onClick={() =>
                  onUpdate(task.id, {
                    status:["todo", "in-progress", "done"][(["todo", "in-progress", "done"].indexOf(task.status) + 1) % 3],  
                  })
                }
                className="btn"
              >
                Toggle Status
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
