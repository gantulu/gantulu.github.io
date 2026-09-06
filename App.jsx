const BSN_USER_URL = "https://oszqantvugvbvydlizix.supabase.co/functions/v1/bsn-user";

function Header() {
  return (
    <header className="shrink-0 border-b p-4">
      <h1 className="text-lg font-semibold">BSN User</h1>
    </header>
  );
}

function Main() {
  const [phone, setPhone] = React.useState("");
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function getUser() {
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    setUser(null);

    try {
      const response = await fetch(`${BSN_USER_URL}?phone=${encodeURIComponent(phone.trim())}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to fetch user");
      setUser(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && getUser()}
            placeholder="Phone number"
            className="w-full rounded-lg border px-3 py-2 outline-none"
          />
        </div>

        <button
          type="button"
          onClick={getUser}
          disabled={loading || !phone.trim()}
          className="w-full rounded-lg border px-4 py-2 font-medium disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get User"}
        </button>

        {error && <p className="rounded-lg border p-3 text-sm">{error}</p>}

        {user && (
          <pre className="overflow-x-auto rounded-lg border p-3 text-xs">
            {JSON.stringify(user, null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}

function BottomNav() {
  return (
    <nav className="flex shrink-0 justify-around border-t p-3">
      <button type="button">Home</button>
      <button type="button">Users</button>
      <button type="button">Profile</button>
    </nav>
  );
}

function App() {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <Main />
      <BottomNav />
    </div>
  );
}

export default App;
