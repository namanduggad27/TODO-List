import { useState } from "react";

export default function Login({ signup, login }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      await login(email);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSignup() {
    try {
      await signup(name, email);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-container">
      <h2>Login / Signup</h2>

      <input
        placeholder="Name (for signup)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />

      <button onClick={handleLogin} className="btn">Login</button>
      <button onClick={handleSignup} className="btn">Signup</button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
