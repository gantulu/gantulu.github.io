import React from "react";

const BSN_USER_URL = "https://oszqantvugvbvydlizix.supabase.co/functions/v1/bsn-user";

async function bsnUser(action, payload) {
  const response = await fetch(BSN_USER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Request failed");
  return result;
}

function Header({ user, onLogout }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b p-4">
      <h1 className="text-lg font-semibold">BSN User</h1>
      {user && (
        <button type="button" onClick={onLogout} className="text-sm">
          Logout
        </button>
      )}
    </header>
  );
}

function Auth({ onLogin }) {
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await bsnUser("login", { phone: phone.trim(), password });
      onLogin(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center overflow-y-auto p-4">
      <form onSubmit={login} className="w-full max-w-sm space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Login</h2>
          <p className="mt-1 text-sm">Sign in menggunakan phone dan password.</p>
        </div>

        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Phone"
          required
          className="w-full rounded-lg border px-3 py-2 outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
          className="w-full rounded-lg border px-3 py-2 outline-none"
        />

        {error && <p className="rounded-lg border p-3 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg border px-4 py-2 font-medium disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}

function Main({ user }) {
  return (
    <main className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Welcome</h2>
          <p className="text-sm">{user.personal?.full_name || user.phone}</p>
        </div>

        <pre className="overflow-x-auto rounded-lg border p-3 text-xs">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </main>
  );
}

function BottomNav({ authenticated }) {
  return (
    <nav className="flex shrink-0 justify-around border-t p-3">
      <button type="button">Home</button>
      {authenticated && <button type="button">Users</button>}
      <button type="button">Profile</button>
    </nav>
  );
}

function App() {
  const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bsn_user") || "null");
    } catch {
      return null;
    }
  });

  function handleLogin(data) {
    setUser(data);
    localStorage.setItem("bsn_user", JSON.stringify(data));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("bsn_user");
  }

  return (
    <div className="flex h-full flex-col">
      <Header user={user} onLogout={logout} />
      {user ? <Main user={user} /> : <Auth onLogin={handleLogin} />}
      <BottomNav authenticated={!!user} />
    </div>
  );
}

export default App;
