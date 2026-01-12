import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const { user, loading, logout, signup, login, getUsers } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    return <Dashboard user={user} logout={logout} getUsers={getUsers} />;
  } else {
    return <Login signup={signup} login={login} />;
  }
}

export default App;
