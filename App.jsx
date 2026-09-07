import { useState } from "react";
import { Bell, Home as HomeIcon, Plus, User } from "lucide-react";

const APP_LOGO_URL = "https://res.cloudinary.com/daj5cu840/image/upload/v1788743341/ChatGPT_Image_Sep_7_2026_09_03_58_AM_dymqv9.png";
const BSN_USER_URL = "https://oszqantvugvbvydlizix.supabase.co/functions/v1/bsn-user";

const DEFAULT_USER_DATA = {
  balance: {
    pending: 0,
    currency: "MYR",
    available: 0,
  },
  personal: {
    email: "",
    gender: "",
    address: {
      city: "",
      state: "",
      country: "",
      postcode: "",
      address_line: "",
    },
    full_name: "",
    nationality: "",
    date_of_birth: "",
  },
  loan: {
    id: "",
    amount: 0,
    status: "",
    tenure: 0,
    approved: false,
    interest: 0,
    monthly_payment: 0,
  },
  kyc: {
    status: "",
    id_type: "",
    full_name: "",
    nationality: "",
    verified_at: "",
    id_image_url: "",
    mykad_number: "",
    date_of_birth: "",
    face_image_url: "",
    selfie_image_url: "",
  },
  bank: {
    bank_code: "",
    bank_name: "",
    account_name: "",
    account_number: "",
  },
  bills: [
    {
      id: "",
      fee: 0,
      name: "",
      amount: 0,
      method_qr: false,
      method_bank: false,
      method_qr_url: "",
      bill_is_active: false,
      method_bank_name: "",
      method_bank_number: "",
    },
  ],
};

async function bsnUser(body) {
  const response = await fetch(BSN_USER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Request failed");
  return result;
}

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [view, setView] = useState("home");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[500px] flex-col bg-white">
        {screen === "splash" && <SplashScreen onComplete={() => setScreen("auth")} />}
        {screen === "auth" && <AuthScreen onLogin={() => setScreen("app")} />}
        {screen === "app" && <AppShell view={view} setView={setView} />}
        <Overlay />
      </div>
    </div>
  );
}

function SplashScreen({ onComplete }) {
  return (
    <section className="flex min-h-screen flex-1 items-center justify-center p-6">
      <div className="flex w-full flex-col items-center gap-6 text-center">
        <img src={APP_LOGO_URL} alt="App Logo" className="h-20 w-20 rounded-2xl object-contain" />
        <h1 className="text-2xl font-bold text-gray-900">App</h1>
        <button type="button" onClick={onComplete} className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition active:scale-[0.98]">Continue</button>
      </div>
    </section>
  );
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  return (
    <section className="flex min-h-screen flex-1 items-center justify-center p-6">
      <div className="w-full">
        {mode === "login" ? (
          <LoginView onLogin={onLogin} onRegister={() => setMode("register")} />
        ) : (
          <RegisterView onRegister={() => setMode("login")} />
        )}
      </div>
    </section>
  );
}

function LoginView({ onLogin, onRegister }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const result = await bsnUser({ action: "login", phone, password });
      localStorage.setItem("bsn_user", JSON.stringify(result.data));
      onLogin();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Login</h2>
        <p className="mt-1 text-sm text-gray-500">Sign in to continue</p>
      </div>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" autoComplete="tel" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="button" onClick={handleLogin} disabled={loading} className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition active:scale-[0.98] disabled:opacity-50">{loading ? "Logging in..." : "Login"}</button>
      <button type="button" onClick={onRegister} className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-900 transition active:scale-[0.98]">Register</button>
    </div>
  );
}

function RegisterView({ onRegister }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    setError("");
    setLoading(true);
    try {
      const result = await bsnUser({
        action: "register",
        phone,
        password,
        ...DEFAULT_USER_DATA,
      });
      if (result.data) {
        localStorage.setItem("bsn_user", JSON.stringify(result.data));
      }
      onRegister();
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Register</h2>
        <p className="mt-1 text-sm text-gray-500">Create your account</p>
      </div>
      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" autoComplete="tel" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min. 6 characters)" autoComplete="new-password" className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="button" onClick={handleRegister} disabled={loading} className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition active:scale-[0.98] disabled:opacity-50">{loading ? "Registering..." : "Register"}</button>
      <button type="button" onClick={onRegister} className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-900 transition active:scale-[0.98]">Back to Login</button>
    </div>
  );
}

function AppShell({ view, setView }) {
  return (
    <section className="flex min-h-screen flex-1 flex-col">
      <Header />
      <Main view={view} />
      <BottomNav view={view} setView={setView} />
    </section>
  );
}

function Header() {
  return <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4"><Logo /><NotifButton /></header>;
}

function Logo() {
  return <img src={APP_LOGO_URL} alt="App Logo" className="h-9 w-9 rounded-lg object-contain" />;
}

function NotifButton() {
  return <button type="button" aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition active:scale-95"><Bell className="h-5 w-5" /></button>;
}

function Main({ view }) {
  return <main className="flex-1 overflow-y-auto">{view === "home" && <HomeView />}{view === "loan" && <LoanView />}{view === "profile" && <ProfileView />}</main>;
}

function HomeView() {
  return <section className="p-4"><div className="rounded-2xl bg-gray-50 p-5"><h2 className="text-xl font-bold text-gray-900">Home</h2></div></section>;
}

function LoanView() {
  return <section className="p-4"><div className="rounded-2xl bg-gray-50 p-5"><h2 className="text-xl font-bold text-gray-900">Loan</h2></div></section>;
}

function ProfileView() {
  return <section className="p-4"><div className="rounded-2xl bg-gray-50 p-5"><h2 className="text-xl font-bold text-gray-900">Profile</h2></div></section>;
}

function BottomNav({ view, setView }) {
  return (
    <nav className="relative flex h-16 shrink-0 items-center border-t border-gray-200 bg-white">
      <button type="button" onClick={() => setView("home")} className={`flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition ${view === "home" ? "text-black" : "text-gray-400"}`}><Home /><span>Home</span></button>
      <button type="button" onClick={() => setView("loan")} aria-label="Add" className="relative flex h-full flex-1 items-center justify-center"><span className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg transition active:scale-95"><Plus className="h-6 w-6" /></span></button>
      <button type="button" onClick={() => setView("profile")} className={`flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition ${view === "profile" ? "text-black" : "text-gray-400"}`}><Profile /><span>Profile</span></button>
    </nav>
  );
}

function Home() { return <HomeIcon className="h-5 w-5" />; }
function Loan() { return <Plus className="h-6 w-6" />; }
function Profile() { return <User className="h-5 w-5" />; }

function Overlay() {
  return <div className="pointer-events-none fixed inset-0 z-50 mx-auto w-full max-w-[500px]"><Modal /><BottomSheet /><Dropdown /><Popover /><Toast /><Loading /></div>;
}

function Modal() {
  return <div className="hidden"><div className="fixed inset-0 bg-black/50" /><div className="fixed left-1/2 top-1/2 w-[calc(100%-32px)] max-w-[460px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-xl"><div className="border-b border-gray-200 p-4 font-semibold">Modal Header</div><div className="p-4">Modal Content</div><div className="flex gap-2 border-t border-gray-200 p-4">Modal Actions</div></div></div>;
}

function BottomSheet() {
  return <div className="hidden"><div className="fixed inset-0 bg-black/50" /><div className="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2 rounded-t-2xl bg-white shadow-xl"><div className="border-b border-gray-200 p-4 font-semibold">BottomSheet Header</div><div className="p-4">BottomSheet Content</div><div className="border-t border-gray-200 p-4">BottomSheet Actions</div></div></div>;
}

function Dropdown() {
  return <div className="hidden"><button type="button" className="rounded-lg border border-gray-200 px-3 py-2">Dropdown Trigger</button><div className="mt-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">Dropdown Content</div></div>;
}

function Popover() {
  return <div className="hidden"><button type="button" className="rounded-lg border border-gray-200 px-3 py-2">Popover Trigger</button><div className="mt-2 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">Popover Content</div></div>;
}

function Toast() {
  return <div className="hidden"><div className="fixed bottom-20 left-4 right-4 flex items-center gap-3 rounded-xl bg-black p-4 text-white shadow-lg"><div className="shrink-0">Icon</div><div className="flex-1 text-sm">Toast Content</div><button type="button" className="shrink-0 text-sm">Close</button></div></div>;
}

function Loading() {
  return <div className="hidden"><div className="fixed inset-0 flex items-center justify-center bg-black/30"><div className="rounded-2xl bg-white p-5 shadow-xl">Loading...</div></div></div>;
}
