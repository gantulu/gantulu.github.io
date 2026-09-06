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

function SplashScreen() {
  return (
    <main className="flex h-full min-h-0 items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border text-xl font-bold">
          BSN
        </div>
        <h1 className="text-xl font-semibold">BSN User</h1>
        <p className="mt-2 text-sm text-gray-500">Loading...</p>
      </div>
    </main>
  );
}

function Header({ user, onLogout }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b bg-white p-4">
      <h1 className="text-lg font-semibold">BSN User</h1>
      {user && (
        <button type="button" onClick={onLogout} className="min-h-10 px-3 text-sm">
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
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-6">
      <form onSubmit={login} className="w-full max-w-sm space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Login</h2>
          <p className="mt-1 text-sm text-gray-500">Sign in menggunakan phone dan password.</p>
        </div>

        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Phone"
          autoComplete="tel"
          inputMode="tel"
          required
          className="min-h-12 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
          className="min-h-12 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
        />

        {error && (
          <p role="alert" className="rounded-xl border p-3 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-xl border px-4 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}

function Main({ user }) {
  return (
    <main className="flex-1 overflow-y-auto px-4 py-5">
      <div className="mx-auto w-full max-w-lg space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Welcome</h2>
          <p className="text-sm text-gray-500">{user.personal?.full_name || user.phone}</p>
        </div>

        <pre className="overflow-x-auto rounded-xl border p-3 text-xs">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </main>
  );
}

function BottomNav({ authenticated }) {
  return (
    <nav className="flex shrink-0 items-center justify-around border-t bg-white p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <button type="button" className="min-h-11 min-w-16 px-3 text-sm">
        Home
      </button>
      {authenticated && (
        <button type="button" className="min-h-11 min-w-16 px-3 text-sm">
          Users
        </button>
      )}
      <button type="button" className="min-h-11 min-w-16 px-3 text-sm">
        Profile
      </button>
    </nav>
  );
}

function App() {
  const [splash, setSplash] = React.useState(true);
  const [user, setUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bsn_user") || "null");
    } catch {
      localStorage.removeItem("bsn_user");
      return null;
    }
  });

  React.useEffect(() => {
    const timer = window.setTimeout(() => setSplash(false), 800);
    return () => window.clearTimeout(timer);
  }, []);

  function handleLogin(data) {
    setUser(data);
    localStorage.setItem("bsn_user", JSON.stringify(data));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("bsn_user");
  }

  if (splash) {
    return <SplashScreen />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {user ? (
        <>
          <Header user={user} onLogout={logout} />
          <Main user={user} />
          <BottomNav authenticated />
        </>
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
