import React from "react";

const BSN_USER_URL = "https://oszqantvugvbvydlizix.supabase.co/functions/v1/bsn-user";

const ACTIONS = [
  { id: "get", label: "Get User" },
  { id: "login", label: "Login" },
  { id: "register", label: "Register" },
  { id: "update", label: "Update" },
  { id: "change_password", label: "Change Password" },
  { id: "delete", label: "Delete" },
];

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || result.message || `Request failed (${response.status})`);
  }
  return result;
}

function Header() {
  return (
    <header className="shrink-0 border-b px-4 py-3">
      <h1 className="text-lg font-semibold">BSN User Manager</h1>
      <p className="text-xs opacity-60">Supabase Edge Function: bsn-user</p>
    </header>
  );
}

function Main() {
  const [action, setAction] = React.useState("get");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [personal, setPersonal] = React.useState("{}");
  const [balance, setBalance] = React.useState('{"available":0,"pending":0,"currency":"MYR"}');
  const [loan, setLoan] = React.useState("{}");
  const [kyc, setKyc] = React.useState("{}");
  const [bank, setBank] = React.useState("{}");
  const [bills, setBills] = React.useState("[]");
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function parseJson(value, field) {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`${field} harus berupa JSON yang valid.`);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      let response;

      if (action === "get") {
        if (!phone.trim()) throw new Error("Phone wajib diisi.");
        response = await request(`${BSN_USER_URL}?phone=${encodeURIComponent(phone.trim())}`);
      } else if (action === "login") {
        response = await request(BSN_USER_URL, {
          method: "POST",
          body: JSON.stringify({ action, phone: phone.trim(), password }),
        });
      } else if (action === "register") {
        response = await request(BSN_USER_URL, {
          method: "POST",
          body: JSON.stringify({
            action,
            phone: phone.trim(),
            password,
            balance: parseJson(balance, "Balance"),
            personal: parseJson(personal, "Personal"),
            loan: parseJson(loan, "Loan"),
            kyc: parseJson(kyc, "KYC"),
            bank: parseJson(bank, "Bank"),
            bills: parseJson(bills, "Bills"),
          }),
        });
      } else if (action === "change_password") {
        response = await request(BSN_USER_URL, {
          method: "POST",
          body: JSON.stringify({
            action,
            phone: phone.trim(),
            current_password: currentPassword,
            new_password: newPassword,
          }),
        });
      } else if (action === "delete") {
        response = await request(BSN_USER_URL, {
          method: "POST",
          body: JSON.stringify({ action, phone: phone.trim(), password }),
        });
      } else if (action === "update") {
        response = await request(`${BSN_USER_URL}?phone=${encodeURIComponent(phone.trim())}`, {
          method: "PATCH",
          body: JSON.stringify({
            phone: phone.trim(),
            password,
            balance: parseJson(balance, "Balance"),
            personal: parseJson(personal, "Personal"),
            loan: parseJson(loan, "Loan"),
            kyc: parseJson(kyc, "KYC"),
            bank: parseJson(bank, "Bank"),
            bills: parseJson(bills, "Bills"),
          }),
        });
      }

      setResult(response);
    } catch (err) {
      setError(err.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  const showPassword = action === "login" || action === "register" || action === "update" || action === "delete";
  const showData = action === "register" || action === "update";

  return (
    <main className="flex-1 overflow-y-auto p-4">
      <form onSubmit={submit} className="mx-auto max-w-xl space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ACTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setAction(item.id);
                setError("");
                setResult(null);
              }}
              className={`rounded-lg border px-3 py-2 text-sm ${action === item.id ? "font-semibold" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <section className="space-y-3 rounded-xl border p-4">
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">Phone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none"
              required
            />
          </div>

          {showPassword && (
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 outline-none"
              />
            </div>
          )}

          {action === "change_password" && (
            <>
              <div>
                <label htmlFor="current-password" className="mb-1 block text-sm font-medium">Current Password</label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="mb-1 block text-sm font-medium">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2 outline-none"
                />
              </div>
            </>
          )}

          {showData && (
            <div className="space-y-3">
              {[
                ["balance", balance, setBalance],
                ["personal", personal, setPersonal],
                ["loan", loan, setLoan],
                ["kyc", kyc, setKyc],
                ["bank", bank, setBank],
                ["bills", bills, setBills],
              ].map(([name, value, setter]) => (
                <div key={name}>
                  <label htmlFor={name} className="mb-1 block text-sm font-medium capitalize">{name}</label>
                  <textarea
                    id={name}
                    value={value}
                    onChange={(event) => setter(event.target.value)}
                    rows={name === "personal" ? 4 : 3}
                    className="w-full rounded-lg border px-3 py-2 font-mono text-xs outline-none"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border px-4 py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Processing..." : ACTIONS.find((item) => item.id === action)?.label}
          </button>
        </section>

        {error && <div className="rounded-lg border p-3 text-sm">{error}</div>}

        {result && (
          <section className="rounded-xl border p-4">
            <h2 className="mb-2 text-sm font-semibold">Response</h2>
            <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </section>
        )}
      </form>
    </main>
  );
}

function BottomNav() {
  return (
    <nav className="flex shrink-0 justify-around border-t p-3 text-sm">
      <span>BSN</span>
      <span>Users</span>
      <span>API</span>
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
