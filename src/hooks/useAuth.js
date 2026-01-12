import { useEffect, useState } from "react";
import { addItem, getAllItems, deleteItem } from "../db/db";

const SESSION_ID = "current-session";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session on app start
  useEffect(() => {
    // Disabled auto-login to start from login page
    setLoading(false);
  }, []);

  // Signup (mock)
  async function signup(name, email) {
    const id = crypto.randomUUID();
    const newUser = { id, name, email };

    await addItem("users", newUser);
    await createSession(id);

    setUser(newUser);
  }

  // Login (mock)
  async function login(email) {
    const users = await getAllItems("users");
    const existing = users.find((u) => u.email === email);

    if (!existing) {
      throw new Error("User not found");
    }

    await createSession(existing.id);
    setUser(existing);
  }

  async function createSession(userId) {
    await addItem("authSession", {
      id: SESSION_ID,
      userId,
      token: "mock-token",
      expiresAt: Date.now() + 86400000,
    });
  }

  async function logout() {
    await deleteItem("authSession", SESSION_ID);
    setUser(null);
  }

  async function getUsers() {
    return await getAllItems("users");
  }

  return { user, loading, signup, login, logout, getUsers };
}
