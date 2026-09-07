import React from "react";

const BSN_USER_URL = "https://oszqantvugvbvydlizix.supabase.co/functions/v1/bsn-user";

async function bsnUser(method, options = {}) {
  const { phone, body, params } = options;
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 backdrop-blur-sm">
      <div
        className={`flex w-full max-w-[500px] flex-col bg-[#f8faf9] text-slate-900 shadow-2xl ${
          fullpage ? "h-full" : bottomSheet ? "max-h-[85%] rounded-t-3xl" : "max-h-[85%] rounded-t-2xl"
        }`}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
          >
            ×
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function SplashScreen() {
  return (
    <main className="flex h-full min-h-0 items-center justify-center bg-[#f8faf9] px-6 text-slate-900">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white shadow-lg">
          BSN
        </div>
        <h1 className="text-xl font-semibold tracking-tight">BSN User</h1>
        <p className="mt-2 text-sm text-slate-500">Loading...</p>
      </div>
    </main>
  );
}

function Header({ onNotification }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
      <div className="flex items-center">
        <span className="text-lg font-semibold tracking-tight text-slate-900">BSN User</span>
      </div>

      <button
        type="button"
        onClick={onNotification}
        aria-label="Notifications"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
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
    <main className="flex h-full min-h-0 flex-1 items-center justify-center overflow-y-auto overscroll-contain bg-[#f8faf9] px-5 py-6 text-slate-900">
      <form onSubmit={login} className="w-full max-w-sm space-y-4">
        <div className="mb-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-lg">BSN</div>
          <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in menggunakan phone dan password.</p>
        </div>

        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Phone"
          autoComplete="tel"
          inputMode="tel"
          required
          className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
          className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}

function BalanceCard({ balance = {} }) {
  return (
    <div className="rounded-3xl bg-slate-900 p-5 text-white shadow-lg">
      <p className="text-sm text-slate-300">Available Balance</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {balance.currency || ""} {balance.available ?? 0}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-sm text-slate-300">Pending</span>
        <span className="text-sm font-medium">{balance.pending ?? 0}</span>
      </div>
    </div>
  );
}

function LoanSummary({ loan = {} }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold tracking-tight text-slate-900">Loan Summary</h3>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{loan.status || "-"}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500">ID</p>
          <p className="mt-1 font-medium text-slate-900">{loan.id || "-"}</p>
        </div>
        <div>
          <p className="text-slate-500">Amount</p>
          <p className="mt-1 font-medium text-slate-900">{loan.amount ?? 0}</p>
        </div>
        <div>
          <p className="text-slate-500">Tenure</p>
          <p className="mt-1 font-medium text-slate-900">{loan.tenure ?? 0}</p>
        </div>
        <div>
          <p className="text-slate-500">Approved</p>
          <p className="mt-1 font-medium text-slate-900">{loan.approved ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}

function HomeView({ user, onBills }) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium text-emerald-700">Overview</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Welcome</h2>
        <p className="mt-1 text-sm text-slate-500">{user.personal?.full_name || user.phone}</p>
      </div>

      <BalanceCard balance={user.balance} />
      <LoanSummary loan={user.loan} />

      <button
        type="button"
        onClick={onBills}
        className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left font-medium text-slate-900 shadow-sm transition hover:border-slate-300"
      >
        <span>Bills</span>
        <span className="text-slate-400">→</span>
      </button>
    </section>
  );
}

function LoanView({ user }) {
  const loan = user.loan || {};

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium text-emerald-700">Finance</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Loan</h2>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4 text-sm">
          <div className="flex justify-between gap-4"><span className="text-slate-500">ID</span><span className="font-medium text-slate-900">{loan.id || "-"}</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-500">Amount</span><span className="font-medium text-slate-900">{loan.amount ?? 0}</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-500">Interest</span><span className="font-medium text-slate-900">{loan.interest ?? 0}</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-500">Tenure</span><span className="font-medium text-slate-900">{loan.tenure ?? 0}</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-500">Monthly Payment</span><span className="font-medium text-slate-900">{loan.monthly_payment ?? 0}</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-500">Status</span><span className="font-medium text-emerald-700">{loan.status || "-"}</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-500">Approved</span><span className="font-medium text-slate-900">{loan.approved ? "Yes" : "No"}</span></div>
        </div>
      </div>
    </section>
  );
}

function ProfileView({ user, onPersonal, onBank, onKYC, onLogout }) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium text-emerald-700">Account</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Profile</h2>
        <p className="mt-1 text-sm text-slate-500">{user.personal?.full_name || user.phone}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-sm">
        <div className="space-y-4">
          <div className="flex justify-between gap-4"><span className="text-slate-500">Full Name</span><span className="font-medium text-slate-900">{user.personal?.full_name || "-"}</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-500">Phone</span><span className="font-medium text-slate-900">{user.phone}</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-500">Role</span><span className="font-medium text-slate-900">{user.role || "-"}</span></div>
          <div className="flex justify-between gap-4"><span className="text-slate-500">Status</span><span className="font-medium text-emerald-700">{user.status || "-"}</span></div>
        </div>
      </div>

      <div className="space-y-2">
        <button type="button" onClick={onPersonal} className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-slate-900 shadow-sm transition hover:border-slate-300"><span>Personal</span><span className="text-slate-400">→</span></button>
        <button type="button" onClick={onBank} className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-slate-900 shadow-sm transition hover:border-slate-300"><span>Bank</span><span className="text-slate-400">→</span></button>
        <button type="button" onClick={onKYC} className="flex min-h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-slate-900 shadow-sm transition hover:border-slate-300"><span>KYC</span><span className="text-slate-400">→</span></button>
        <button type="button" onClick={onLogout} className="mt-3 min-h-12 w-full rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-left font-medium text-red-700 transition hover:bg-red-100">Logout</button>
      </div>
    </section>
  );
}

function BillsOverlay({ bills = [], onClose }) {
  return (
    <Overlay title="Bills" onClose={onClose} fullpage>
      <div className="space-y-3">
        {bills.length === 0 ? (
          <p className="text-sm text-slate-500">No bills available.</p>
        ) : (
          bills.map((bill, index) => (
            <div key={bill.id || index} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-slate-900">{bill.name || "Bill"}</h3>
                <span className="text-sm font-medium text-slate-900">{bill.amount ?? 0}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">Fee: {bill.fee ?? 0}</p>
              <p className="mt-2 text-sm font-medium text-emerald-700">{bill.bill_is_active ? "Active" : "Inactive"}</p>
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
        <div key={label} className="flex flex-col gap-1 border-b border-slate-200 pb-3">
          <span className="text-slate-500">{label}</span>
          <span className="break-all font-medium text-slate-900">{value || "-"}</span>
        </div>
      ))}
    </div>
  );
}

function PersonalOverlay({ personal = {}, onClose }) {
  const address = personal.address || {};

  return (
    <Overlay title="Personal" onClose={onClose} bottomSheet>
      <div className="space-y-4 text-sm text-slate-900">
        <p><span className="text-slate-500">Full Name:</span> {personal.full_name || "-"}</p>
        <p><span className="text-slate-500">Date of Birth:</span> {personal.date_of_birth || "-"}</p>
        <p><span className="text-slate-500">Gender:</span> {personal.gender || "-"}</p>
        <p><span className="text-slate-500">Nationality:</span> {personal.nationality || "-"}</p>
        <p><span className="text-slate-500">Email:</span> {personal.email || "-"}</p>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
      <div className="space-y-4 text-sm text-slate-900">
        <p><span className="text-slate-500">Bank Code:</span> {bank.bank_code || "-"}</p>
        <p><span className="text-slate-500">Bank Name:</span> {bank.bank_name || "-"}</p>
        <p><span className="text-slate-500">Account Name:</span> {bank.account_name || "-"}</p>
        <p><span className="text-slate-500">Account Number:</span> {bank.account_number || "-"}</p>
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
    <nav className="flex shrink-0 items-center justify-around border-t border-slate-200 bg-white p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          aria-current={activeView === item.id ? "page" : undefined}
          className={`min-h-11 min-w-20 rounded-xl px-4 py-2 text-sm font-medium transition ${
            activeView === item.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function Main({ activeView, user, overlay, setOverlay, onLogout }) {
  return (
    <main className="flex min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#f8faf9] px-5 py-6 text-slate-900">
      <div className="mx-auto w-full max-w-lg">
        {activeView === "home" && <HomeView user={user} onBills={() => setOverlay("bills")} />}
        {activeView === "loan" && <LoanView user={user} />}
        {activeView === "profile" && (
          <ProfileView
            user={user}
            onPersonal={() => setOverlay("personal")}
            onBank={() => setOverlay("bank")}
            onKYC={() => setOverlay("kyc")}
            onLogout={onLogout}
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

function AppShell({ user, onLogout }) {
  const [activeView, setActiveView] = React.useState("home");
  const [overlay, setOverlay] = React.useState(null);

  function handleNotification() {
    setOverlay("notification");
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f8faf9]">
      <Header onNotification={handleNotification} />
      <Main activeView={activeView} user={user} overlay={overlay} setOverlay={setOverlay} onLogout={onLogout} />
      <BottomNav activeView={activeView} onChange={setActiveView} />

      {overlay === "notification" && (
        <Overlay title="Notifications" onClose={() => setOverlay(null)}>
          <p className="text-sm text-slate-500">No notifications.</p>
        </Overlay>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = React.useState(null);
  const [splash, setSplash] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("bsn_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("bsn_user");
      }
    }

    const timer = window.setTimeout(() => setSplash(false), 800);

    const preventGesture = (event) => event.preventDefault();
    const preventDoubleTap = (event) => event.preventDefault();
    let lastTouchEnd = 0;
    const preventTouchZoom = (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) event.preventDefault();
      lastTouchEnd = now;
    };
    const preventWheelZoom = (event) => {
      if (event.ctrlKey) event.preventDefault();
    };

    document.addEventListener("gesturestart", preventGesture, { passive: false });
    document.addEventListener("gesturechange", preventGesture, { passive: false });
    document.addEventListener("gestureend", preventGesture, { passive: false });
    document.addEventListener("dblclick", preventDoubleTap, { passive: false });
    document.addEventListener("touchend", preventTouchZoom, { passive: false });
    document.addEventListener("wheel", preventWheelZoom, { passive: false });

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      document.removeEventListener("dblclick", preventDoubleTap);
      document.removeEventListener("touchend", preventTouchZoom);
      document.removeEventListener("wheel", preventWheelZoom);
    };
  }, []);

  function handleLogin(data) {
    localStorage.setItem("bsn_user", JSON.stringify(data));
    setUser(data);
  }

  function handleLogout() {
    localStorage.removeItem("bsn_user");
    setUser(null);
  }

  if (splash) return <SplashScreen />;

  return user ? <AppShell user={user} onLogout={handleLogout} /> : <AuthPage onLogin={handleLogin} />;
}

export default App;
