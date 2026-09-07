import React from "react";

const BSN_USER_URL = "https://oszqantvugvbvydlizix.supabase.co/functions/v1/bsn-user";

async function bsnUser(method, options = {}) {
  const { action, phone, body, params } = options;
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";

  const request = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body !== undefined) {
    request.body = JSON.stringify(body);
  }

  const response = await fetch(`${BSN_USER_URL}${phone && !params ? `?phone=${encodeURIComponent(phone)}` : query}`, request);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Request failed");
  }

  return result;
}

async function loginUser(phone, password) {
  return bsnUser("POST", {
    body: { action: "login", phone, password },
  });
}

function Overlay({ children, title, onClose, fullpage = false, bottomSheet = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div
        className={`flex w-full max-w-[500px] flex-col bg-white ${
          fullpage ? "h-full" : bottomSheet ? "max-h-[85%] rounded-t-3xl" : "max-h-[85%] rounded-t-2xl"
        }`}
      >
        <header className="flex shrink-0 items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
          >
            ×
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
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

function Header({ onNotification }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b bg-white px-4 py-3">
      <div className="flex items-center">
        <span className="text-lg font-semibold">BSN User</span>
      </div>

      <button
        type="button"
        onClick={onNotification}
        aria-label="Notifications"
        className="flex h-10 w-10 items-center justify-center rounded-full"
      >
        🔔
      </button>
    </header>
  );
}

function AuthPage({ onLogin }) {
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginUser(phone.trim(), password);
      onLogin(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-full min-h-0 flex-1 items-center justify-center overflow-y-auto overscroll-contain px-4 py-6">
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

function BalanceCard({ balance = {} }) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-sm text-gray-500">Available Balance</p>
      <p className="mt-1 text-2xl font-semibold">
        {balance.currency || ""} {balance.available ?? 0}
      </p>
      <p className="mt-2 text-sm text-gray-500">Pending: {balance.pending ?? 0}</p>
    </div>
  );
}

function LoanSummary({ loan = {} }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Loan Summary</h3>
        <span className="text-sm text-gray-500">{loan.status || "-"}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">ID</p>
          <p>{loan.id || "-"}</p>
        </div>
        <div>
          <p className="text-gray-500">Amount</p>
          <p>{loan.amount ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">Tenure</p>
          <p>{loan.tenure ?? 0}</p>
        </div>
        <div>
          <p className="text-gray-500">Approved</p>
          <p>{loan.approved ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}

function HomeView({ user, onBills }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Welcome</h2>
        <p className="text-sm text-gray-500">{user.personal?.full_name || user.phone}</p>
      </div>

      <BalanceCard balance={user.balance} />
      <LoanSummary loan={user.loan} />

      <button
        type="button"
        onClick={onBills}
        className="min-h-12 w-full rounded-xl border px-4 py-3 text-left font-medium"
      >
        Bills
      </button>
    </section>
  );
}

function LoanView({ user }) {
  const loan = user.loan || {};

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Loan</h2>
      <div className="rounded-2xl border p-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4"><span className="text-gray-500">ID</span><span>{loan.id || "-"}</span></div>
          <div className="flex justify-between gap-4"><span className="text-gray-500">Amount</span><span>{loan.amount ?? 0}</span></div>
          <div className="flex justify-between gap-4"><span className="text-gray-500">Interest</span><span>{loan.interest ?? 0}</span></div>
          <div className="flex justify-between gap-4"><span className="text-gray-500">Tenure</span><span>{loan.tenure ?? 0}</span></div>
          <div className="flex justify-between gap-4"><span className="text-gray-500">Monthly Payment</span><span>{loan.monthly_payment ?? 0}</span></div>
          <div className="flex justify-between gap-4"><span className="text-gray-500">Status</span><span>{loan.status || "-"}</span></div>
          <div className="flex justify-between gap-4"><span className="text-gray-500">Approved</span><span>{loan.approved ? "Yes" : "No"}</span></div>
        </div>
      </div>
    </section>
  );
}

function ProfileView({ user, onPersonal, onBank, onKYC }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="mt-2 text-sm text-gray-500">{user.personal?.full_name || user.phone}</p>
      </div>

      <div className="rounded-2xl border p-4 text-sm">
        <div className="space-y-3">
          <div className="flex justify-between gap-4"><span className="text-gray-500">Full Name</span><span>{user.personal?.full_name || "-"}</span></div>
          <div className="flex justify-between gap-4"><span className="text-gray-500">Phone</span><span>{user.phone}</span></div>
          <div className="flex justify-between gap-4"><span className="text-gray-500">Role</span><span>{user.role || "-"}</span></div>
          <div className="flex justify-between gap-4"><span className="text-gray-500">Status</span><span>{user.status || "-"}</span></div>
        </div>
      </div>

      <div className="space-y-2">
        <button type="button" onClick={onPersonal} className="min-h-12 w-full rounded-xl border px-4 py-3 text-left">Personal</button>
        <button type="button" onClick={onBank} className="min-h-12 w-full rounded-xl border px-4 py-3 text-left">Bank</button>
        <button type="button" onClick={onKYC} className="min-h-12 w-full rounded-xl border px-4 py-3 text-left">KYC</button>
      </div>
    </section>
  );
}

function BillsOverlay({ bills = [], onClose }) {
  return (
    <Overlay title="Bills" onClose={onClose} fullpage>
      <div className="space-y-3">
        {bills.length === 0 ? (
          <p className="text-sm text-gray-500">No bills available.</p>
        ) : (
          bills.map((bill, index) => (
            <div key={bill.id || index} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold">{bill.name || "Bill"}</h3>
                <span className="text-sm">{bill.amount ?? 0}</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">Fee: {bill.fee ?? 0}</p>
              <p className="mt-2 text-sm">{bill.bill_is_active ? "Active" : "Inactive"}</p>
            </div>
          ))
        )}
      </div>
    </Overlay>
  );
}

function KYCCard({ kyc = {} }) {
  const fields = [
    ["Status", kyc.status],
    ["ID Type", kyc.id_type],
    ["Full Name", kyc.full_name],
    ["Date of Birth", kyc.date_of_birth],
    ["Nationality", kyc.nationality],
    ["MyKad Number", kyc.mykad_number],
    ["Verified At", kyc.verified_at],
    ["ID Image", kyc.id_image_url],
    ["Face Image", kyc.face_image_url],
    ["Selfie Image", kyc.selfie_image_url],
  ];

  return (
    <div className="space-y-3 text-sm">
      {fields.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-1 border-b pb-3">
          <span className="text-gray-500">{label}</span>
          <span className="break-all">{value || "-"}</span>
        </div>
      ))}
    </div>
  );
}

function PersonalOverlay({ personal = {}, onClose }) {
  const address = personal.address || {};

  return (
    <Overlay title="Personal" onClose={onClose} bottomSheet>
      <div className="space-y-3 text-sm">
        <p><span className="text-gray-500">Full Name:</span> {personal.full_name || "-"}</p>
        <p><span className="text-gray-500">Date of Birth:</span> {personal.date_of_birth || "-"}</p>
        <p><span className="text-gray-500">Gender:</span> {personal.gender || "-"}</p>
        <p><span className="text-gray-500">Nationality:</span> {personal.nationality || "-"}</p>
        <p><span className="text-gray-500">Email:</span> {personal.email || "-"}</p>
        <div className="rounded-xl border p-3">
          <p className="font-medium">Address</p>
          <p className="mt-2">{address.address_line || "-"}</p>
          <p>{address.city || "-"}, {address.state || "-"}</p>
          <p>{address.country || "-"} {address.postcode || ""}</p>
        </div>
      </div>
    </Overlay>
  );
}

function BankOverlay({ bank = {}, onClose }) {
  return (
    <Overlay title="Bank" onClose={onClose} bottomSheet>
      <div className="space-y-3 text-sm">
        <p><span className="text-gray-500">Bank Code:</span> {bank.bank_code || "-"}</p>
        <p><span className="text-gray-500">Bank Name:</span> {bank.bank_name || "-"}</p>
        <p><span className="text-gray-500">Account Name:</span> {bank.account_name || "-"}</p>
        <p><span className="text-gray-500">Account Number:</span> {bank.account_number || "-"}</p>
      </div>
    </Overlay>
  );
}

function BottomNav({ activeView, onChange }) {
  const items = [
    { id: "home", label: "Home" },
    { id: "loan", label: "Loan" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <nav className="flex shrink-0 items-center justify-around border-t bg-white p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          aria-current={activeView === item.id ? "page" : undefined}
          className={`min-h-11 min-w-20 rounded-xl px-3 text-sm ${
            activeView === item.id ? "font-semibold" : "text-gray-500"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function Main({ activeView, user, overlay, setOverlay }) {
  return (
    <main className="flex min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
      <div className="mx-auto w-full max-w-lg">
        {activeView === "home" && (
          <HomeView user={user} onBills={() => setOverlay("bills")} />
        )}
        {activeView === "loan" && <LoanView user={user} />}
        {activeView === "profile" && (
          <ProfileView
            user={user}
            onPersonal={() => setOverlay("personal")}
            onBank={() => setOverlay("bank")}
            onKYC={() => setOverlay("kyc")}
          />
        )}
      </div>

      {overlay === "bills" && <BillsOverlay bills={user.bills} onClose={() => setOverlay(null)} />}
      {overlay === "kyc" && (
        <Overlay title="KYC" onClose={() => setOverlay(null)} fullpage>
          <KYCCard kyc={user.kyc} />
        </Overlay>
      )}
      {overlay === "personal" && <PersonalOverlay personal={user.personal} onClose={() => setOverlay(null)} />}
      {overlay === "bank" && <BankOverlay bank={user.bank} onClose={() => setOverlay(null)} />}
    </main>
  );
}

function AppShell({ user }) {
  const [activeView, setActiveView] = React.useState("home");
  const [overlay, setOverlay] = React.useState(null);

  function handleNotification() {
    setOverlay("notification");
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <Header onNotification={handleNotification} />
      <Main activeView={activeView} user={user} overlay={overlay} setOverlay={setOverlay} />
      <BottomNav activeView={activeView} onChange={setActiveView} />

      {overlay === "notification" && (
        <Overlay title="Notifications" onClose={() => setOverlay(null)}>
          <p className="text-sm text-gray-500">No notifications.</p>
        </Overlay>
      )}
    </div>
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
    const preventZoom = (event) => event.preventDefault();
    const preventGestureZoom = (event) => event.preventDefault();
    const preventDoubleTapZoom = (event) => event.preventDefault();

    document.addEventListener("gesturestart", preventGestureZoom, { passive: false });
    document.addEventListener("gesturechange", preventGestureZoom, { passive: false });
    document.addEventListener("gestureend", preventGestureZoom, { passive: false });
    document.addEventListener("dblclick", preventDoubleTapZoom, { passive: false });

    let lastTouchEnd = 0;
    const handleTouchEnd = (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    document.addEventListener("wheel", preventZoom, { passive: false });

    return () => {
      document.removeEventListener("gesturestart", preventGestureZoom);
      document.removeEventListener("gesturechange", preventGestureZoom);
      document.removeEventListener("gestureend", preventGestureZoom);
      document.removeEventListener("dblclick", preventDoubleTapZoom);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("wheel", preventZoom);
    };
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setSplash(false), 800);
    return () => window.clearTimeout(timer);
  }, []);

  function handleLogin(data) {
    setUser(data);
    localStorage.setItem("bsn_user", JSON.stringify(data));
  }

  if (splash) {
    return <SplashScreen />;
  }

  return user ? <AppShell user={user} /> : <AuthPage onLogin={handleLogin} />;
}

export default App;
