const DB_NAME = "offline_todo_db";
const DB_VERSION = 1;

let db = null;

export function openDB() {
  console.log("Opening DB");
  if (db) return Promise.resolve(db);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("Failed to open IndexedDB");
      reject("Failed to open IndexedDB");
    };

    request.onsuccess = () => {
      db = request.result;
      console.log("DB opened successfully");
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // 1. users
      if (!database.objectStoreNames.contains("users")) {
        database.createObjectStore("users", { keyPath: "id" });
      }

      // 2. tasks
      if (!database.objectStoreNames.contains("tasks")) {
        const taskStore = database.createObjectStore("tasks", {
          keyPath: "id",
        });
        taskStore.createIndex("ownerId", "ownerId", { unique: false });
        taskStore.createIndex("status", "status", { unique: false });
      }

      // 3. taskShares
      if (!database.objectStoreNames.contains("taskShares")) {
        database.createObjectStore("taskShares", { keyPath: "id" });
      }

      // 4. authSession
      if (!database.objectStoreNames.contains("authSession")) {
        database.createObjectStore("authSession", { keyPath: "id" });
      }

      // 5. syncQueue
      if (!database.objectStoreNames.contains("syncQueue")) {
        database.createObjectStore("syncQueue", { keyPath: "id" });
      }
    };
  });
}
export async function addItem(storeName, item) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.put(item);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("Failed to add item:", error);
    throw error;
  }
}

export async function getAllItems(storeName) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to get all items:", error);
    throw error;
  }
}

export async function deleteItem(storeName, id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("Failed to delete item:", error);
    throw error;
  }
}
