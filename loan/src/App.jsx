import { useEffect, useMemo, useState } from "react";
import { bsnUser } from "../../src/services/bsnUser.js";

const SESSION_KEY = "bsn_session";
const loans = [{ id: "LN-24081", name: "Personal Loan", remaining: 9750000, rate: 8.5, status: "Active" }, { id: "LN-19342", name: "Emergency Loan", remaining: 0, rate: 7.9, status: "Completed" }];
const bills = [{ id: 1, title: "Monthly Loan Payment", amount: 1250000, due: "18 Sep 2026" }, { id: 2, title: "Admin Fee", amount: 25000, due: "18 Sep 2026" }];
const formatIDR = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const activeLoan = useMemo(() => loans[0], []);

  useEffect(() => {
    const phone = localStorage.getItem(SESSION_KEY);
    if (!phone) { const timer = setTimeout(() => setScreen("auth"), 900); return () => clearTimeout(timer); }
    bsnUser.getUser(phone).then(({ data }) => { setUser(data); setScreen("home"); }).catch(() => { localStorage.removeItem(SESSION_KEY); setScreen("auth"); });
  }, []);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 2400); return () => clearTimeout(timer); }, [toast]);

  async function handleAuth(event) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const password = String(form.get("password") || "");
    try {
      const result = authMode === "login" ? await bsnUser.login(phone, password) : await bsnUser.register(name, phone, password);
      localStorage.setItem(SESSION_KEY, phone);
      setUser(result.data); setScreen(authMode === "register" ? "kyc" : "home"); setToast(result.message || "Success");
    } catch (err) { setError(err.message || "Authentication failed"); }
    finally { setLoading(false); }
  }
  function logout() { localStorage.removeItem(SESSION_KEY); setUser(null); setScreen("auth"); }
  function navigate(next) { setScreen(next); window.scrollTo({ top: 0, behavior: "smooth" }); }

  if (screen === "splash") return <div className="viewport splash-bg"><div className="splash-content"><div className="logo-mark">L</div><h1>Loan</h1><p>Simple. Clear. In control.</p></div></div>;
  if (screen === "auth") return <AuthScreen mode={authMode} setMode={setAuthMode} onSubmit={handleAuth} loading={loading} error={error} />;
  const titles = { home: "Overview", loan: "My Loans", bills: "Bills & Payments", kyc: "Verification", profile: "Profile" };
  return <div className="viewport"><div className="app"><header className="header"><div><span className="eyebrow">MY ACCOUNT</span><h2>{titles[screen]}</h2></div><button className="avatar" onClick={() => navigate("profile")}>{user?.name?.[0] || "U"}</button></header><main className="main">
    {screen === "home" && <Home loan={activeLoan} navigate={navigate} select={setSelectedLoan} />}
    {screen === "loan" && <LoanList select={setSelectedLoan} />}
    {screen === "bills" && <Bills />}
    {screen === "kyc" && <Kyc onDone={() => { setToast("KYC submitted"); navigate("home"); }} />}
    {screen === "profile" && <Profile user={user} logout={logout} />}
  </main><nav className="bottom-nav">{["home", "loan", "bills", "kyc", "profile"].map((item) => <button key={item} className={screen === item ? "active" : ""} onClick={() => navigate(item)}><span>{item === "home" ? "⌂" : item === "loan" ? "↗" : item === "bills" ? "▣" : item === "kyc" ? "✓" : "○"}</span><small>{item}</small></button>)}</nav>{selectedLoan && <div className="overlay" onMouseDown={() => setSelectedLoan(null)}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><h3>{selectedLoan.name}</h3><button onClick={() => setSelectedLoan(null)}>×</button></div><strong>{formatIDR(selectedLoan.remaining)}</strong><p>{selectedLoan.rate}% p.a. · {selectedLoan.status}</p><button className="button full" onClick={() => setSelectedLoan(null)}>Close</button></div></div>}{toast && <div className="toast">{toast}</div>}</div></div>;
}

function AuthScreen({ mode, setMode, onSubmit, loading, error }) {
  const login = mode === "login";
  return <div className="viewport auth-bg"><div className="auth-card"><div className="brand-row"><div className="logo-mark small">L</div><strong>Loan</strong></div><div className="auth-copy"><h1>{login ? "Welcome back" : "Create your account"}</h1><p>{login ? "Sign in with your phone and password." : "Register with your name, phone and password."}</p></div><form onSubmit={onSubmit}>{!login && <Field name="name" label="Full name" placeholder="Your name" />}<Field name="phone" label="Phone" placeholder="+60..." type="tel" /><Field name="password" label="Password" placeholder="••••••••" type="password" minLength={6} />{error && <p role="alert">{error}</p>}<button className="button full" type="submit" disabled={loading}>{loading ? "Please wait..." : login ? "Sign in" : "Create account"}</button></form><div className="auth-switch"><span>{login ? "New here?" : "Already have an account?"}</span><button className="text-button" onClick={() => setMode(login ? "register" : "login")}>{login ? "Create account" : "Sign in"}</button></div></div></div>;
}
function Field({ name, label, placeholder, type = "text", minLength }) { return <label className="field"><span>{label}</span><input name={name} type={type} placeholder={placeholder} minLength={minLength} required /></label>; }
function Home({ loan, navigate, select }) { return <div className="screen-stack"><section className="hero-card"><span>AVAILABLE CREDIT</span><strong>{formatIDR(25000000)}</strong><p>Limit {formatIDR(50000000)}</p></section><section className="section-heading"><h3>Your active loan</h3><button className="link-button" onClick={() => navigate("loan")}>View all</button></section><button className="loan-card" onClick={() => select(loan)}><div className="loan-icon">↗</div><div className="loan-info"><strong>{loan.name}</strong><span>{loan.id} · {loan.rate}% p.a.</span><small>{formatIDR(loan.remaining)} remaining</small></div></button><div className="quick-grid"><button className="action-card" onClick={() => navigate("loan")}>Apply loan</button><button className="action-card" onClick={() => navigate("bills")}>Pay bill</button><button className="action-card" onClick={() => navigate("kyc")}>Complete KYC</button><button className="action-card" onClick={() => navigate("profile")}>Support</button></div></div>; }
function LoanList({ select }) { return <div className="screen-stack"><h3>All loans</h3>{loans.map((loan) => <button className="list-card" key={loan.id} onClick={() => select(loan)}><div className="loan-icon">↗</div><div className="list-main"><strong>{loan.name}</strong><span>{loan.id}</span><small>{formatIDR(loan.remaining)} remaining</small></div><span>{loan.status}</span></button>)}</div>; }
function Bills() { return <div className="screen-stack"><section className="balance-card"><span>TOTAL DUE</span><strong>{formatIDR(1275000)}</strong></section>{bills.map((bill) => <div className="card" key={bill.id}><div className="payment-row"><div><strong>{bill.title}</strong><small>Due {bill.due}</small></div><strong>{formatIDR(bill.amount)}</strong></div></div>)}</div>; }
function Kyc({ onDone }) { const [ok, setOk] = useState(false); return <div className="screen-stack"><div className="card"><span className="eyebrow">IDENTITY VERIFICATION</span><h3>Verify your identity</h3><p>Complete KYC to unlock higher loan limits.</p></div><div className="card"><label className="check-row"><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} /><span>I confirm my information is accurate.</span></label><button className="button full" disabled={!ok} onClick={onDone}>Continue verification</button></div></div>; }
function Profile({ user, logout }) { return <div className="screen-stack"><div className="card profile-card"><div className="profile-avatar">{user?.name?.[0] || "U"}</div><h3>{user?.name || "User"}</h3><p>{user?.phone || ""}</p></div><button className="logout" onClick={logout}>Sign out</button></div>; }
