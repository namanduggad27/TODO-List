import { useEffect, useState } from "react";
import { addItem, getAllItems, deleteItem } from "../db/db";

export function useSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  async function enqueue(action) {
    await addItem("syncQueue", {
      id: crypto.randomUUID(),
      ...action,
      createdAt: Date.now(),
    });
  }

  async function processQueue() {
    if (!navigator.onLine) return;

    const queue = await getAllItems("syncQueue");

    for (const item of queue) {
      // Backend call would go here
      console.log("Syncing:", item);

      await deleteItem("syncQueue", item.id);
    }
  }

  return { isOnline, enqueue, processQueue };
}
