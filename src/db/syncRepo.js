import { addItem } from "./db";

export async function queueTaskAction(action) {
  await addItem("syncQueue", {
    id: crypto.randomUUID(),
    entity: "task",
    action: action.type,
    payload: action.payload,
    createdAt: Date.now(),
  });
}
