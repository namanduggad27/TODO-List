import { useEffect, useState } from "react";
import { addItem, getAllItems, deleteItem } from "../db/db";
import { useSync } from "./useSync";

export function useTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [sharedTasks, setSharedTasks] = useState([]);

  const { isOnline, enqueue } = useSync();

  async function loadSharedTasks() {
    try {
      const allTasks = await getAllItems("tasks");
      const userTasks = allTasks.filter((t) => t.ownerId === userId);
      setTasks(userTasks);

      const shares = await getAllItems("taskShares");
      const tasks = await getAllItems("tasks");
      const myShared = shares.filter((s) => s.sharedWithUserId === userId);
      const result = myShared
        .map((share) => {
          const task = tasks.find((t) => t.id === share.taskId);
          if (!task) return null;
          return { ...task, permission: share.permission };
        })
        .filter(Boolean);
      setSharedTasks(result);
    } catch (error) {
      console.error("Error loading tasks:", error);
      // Optionally set tasks to empty array or show error state
      setTasks([]);
      setSharedTasks([]);
    }
  }

  useEffect(() => {
    if (!userId) return;
    loadSharedTasks();
  }, [userId]);

  /* ---------------- CREATE ---------------- */

  async function createTask(data) {
    const now = Date.now();

    const task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || "",
      status: "todo",
      priority: data.priority || "low",
      dueDate: data.dueDate || null,
      ownerId: userId,
      createdAt: now,
      updatedAt: now,
    };

    if (!isOnline) {
      await enqueue({
        entity: "task",
        action: "create",
        payload: task,
      });
    } else {
      await addItem("tasks", task);
    }

    setTasks((prev) => [...prev, task]);
  }

  /* ---------------- UPDATE ---------------- */

  async function updateTask(id, updates) {
    const existing = tasks.find((t) => t.id === id);
    if (!existing) return;

    const updatedTask = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };

    if (!isOnline) {
      await enqueue({
        entity: "task",
        action: "update",
        payload: updatedTask,
      });
    } else {
      await addItem("tasks", updatedTask);
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? updatedTask : t))
    );
  }

  /* ---------------- DELETE ---------------- */

  async function removeTask(id) {
    if (!isOnline) {
      await enqueue({
        entity: "task",
        action: "delete",
        payload: { id },
      });
    } else {
      await deleteItem("tasks", id);
    }

    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  /* ---------------- SHARE ---------------- */

  async function shareTask(taskId, targetUserId, permission) {
    const share = {
      id: crypto.randomUUID(),
      taskId,
      ownerId: userId,
      sharedWithUserId: targetUserId,
      permission,
      createdAt: Date.now(),
    };

    await addItem("taskShares", share);
    // Note: sharedTasks are only for tasks shared WITH the current user, not tasks the current user shared
  }

  /* ---------------- UPDATE SHARED ---------------- */

  async function updateSharedTask(id, updates) {
    const existing = sharedTasks.find((t) => t.id === id);
    if (!existing) return;

    const updatedTask = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };

    if (!isOnline) {
      await enqueue({
        entity: "task",
        action: "update",
        payload: updatedTask,
      });
    } else {
      await addItem("tasks", updatedTask);
    }

    setSharedTasks((prev) =>
      prev.map((t) => (t.id === id ? updatedTask : t))
    );
  }

  /* ---------------- RETURN ---------------- */

  return {
    tasks,
    sharedTasks,
    createTask,
    updateTask,
    removeTask,
    shareTask,
    updateSharedTask,
    loadSharedTasks,
  };
}
