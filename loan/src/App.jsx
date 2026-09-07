import { useEffect, useMemo, useState } from "react";

const loans = [
  { id: "LN-24081", name: "Personal Loan", amount: 15000000, remaining: 9750000, rate: 8.5, due: "18 Sep 2026", status: "Active" },
  { id: "LN-19342", name: "Emergency Loan", amount: 5000000, remaining: 0, rate: 7.9, due: "Paid", status: "Completed" }
];

const bills = [
  { id: 1, title: "Monthly Loan Payment", subtitle: "Personal Loan · Sep 2026", amount: 1250000, due: "18 Sep", status: "Due" },
  { id: 2, title: "Admin Fee", subtitle: "Personal Loan", amount: 25000, due: "18 Sep", status: "Due" }
];

const navItems = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "loan", label: "Loan", icon: "↗" },
  { id: "bills", label: "Bills", icon: "▣" },
  { id: "kyc", label: "KYC", icon: "✓" },
  { id: "profile", label: "Profile", icon: "○" }
];

function formatIDR(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setScreen(user ? "home" : "auth"), 1200);
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const activeLoan = useMemo(() => loans.find((loan) => loan.status === "Active"), []);

  function login(event) {
    event.preventDefault();
    setUser({ name: "Gantulu", email: "gantulu@example.com" });
    setScreen("home");
    setToast("Welcome back!");
  }

  function register(event) {
    event.preventDefault();
    setUser({ name: "Gantulu", email: "gantulu@example.com" });
    setScreen("kyc");
    setToast("Account created successfully");
  }

  function logout() {
    setUser(null);
    setScreen("auth");
    setToast("You have been signed out");
  }

  function navigate(next) {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (screen === "splash") return <SplashScreen />;
  if (screen === "auth") return <AuthScreen mode={authMode} setMode={setAuthMode} onLogin={login} onRegister={register} />;

  return (
    <div className="viewport">
      <div className="app">
        <Header screen={screen} user={user} onProfile={() => navigate("profile")} />
        <main className="main">
          {screen === "home" && <HomeScreen activeLoan={activeLoan} onNavigate={navigate} onLoanSelect={setSelectedLoan} />}
          {screen === "loan" && <LoanScreen onSelect={setSelectedLoan} />}
          {screen === "bills" && <BillsScreen onPay={() => setModal("payment")} />}
          {screen === "kyc" && <KycScreen onComplete={() => { setToast("KYC submitted for review"); navigate("home"); }} />}
          {screen === "profile" && <ProfileScreen user={user} onLogout={logout} onToast={setToast} />}
        </main>
        <BottomNavigation screen={screen} onNavigate={navigate} />
        {selectedLoan && <LoanModal loan={selectedLoan} onClose={() => setSelectedLoan(null)} onApply={() => { setSelectedLoan(null); setToast("Loan application started"); }} />}
        {modal === "payment" && <PaymentModal onClose={() => setModal(null)} onSuccess={() => { setModal(null); setToast("Payment submitted"); }} />}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="viewport splash-bg">
      <div className="splash-content">
        <div className="logo-mark">L</div>
        <h1>Loan</h1>
        <p>Simple. Clear. In control.</p>
      </div>
    </div>
  );
}

function AuthScreen({ mode, setMode, onLogin, onRegister }) {
  const isLogin = mode === "login";
  return (
    <div className="viewport auth-bg">
      <div className="auth-card">
        <div className="brand-row"><div className="logo-mark small">L</div><strong>Loan</strong></div>
        <div className="auth-copy">
          <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p>{isLogin ? "Manage your loans and payments in one place." : "Start your loan journey in a few simple steps."}</p>
        </div>
        <form onSubmit={isLogin ? onLogin : onRegister}>
          {!isLogin && <Field label="Full name" placeholder="Your name" />}
          <Field label="Email" type="email" placeholder="you@example.com" />
          <Field label="Password" type="password" placeholder="••••••••" />
          <Button type="submit" full>{isLogin ? "Sign in" : "Create account"}</Button>
        </form>
        {isLogin && <button className="text-button forgot">Forgot password?</button>}
        <div className="auth-switch">
          <span>{isLogin ? "New here?" : "Already have an account?"}</span>
          <button className="text-button" onClick={() => setMode(isLogin ? "register" : "login")}>{isLogin ? "Create account" : "Sign in"}</button>
        </div>
      </div>
    </div>
  );
}

function Header({ screen, user, onProfile }) {
  const title = { home: "Overview", loan: "My Loans", bills: "Bills & Payments", kyc: "Verification", profile: "Profile" }[screen] || "Loan";
  return (
    <header className="header">
      <div><span className="eyebrow">MY ACCOUNT</span><h2>{title}</h2></div>
      <button className="avatar" onClick={onProfile} aria-label="Open profile">{user?.name?.[0] || "G"}</button>
    </header>
  );
}

function HomeScreen({ activeLoan, onNavigate, onLoanSelect }) {
  return (
    <div className="screen-stack">
      <section className="hero-card">
        <div className="hero-top"><span>AVAILABLE CREDIT</span><span className="status-dot">● Active</span></div>
        <strong>{formatIDR(25000000)}</strong>
        <div className="credit-bar"><span /></div>
        <div className="hero-meta"><span>Limit {formatIDR(50000000)}</span><span>50% available</span></div>
      </section>

      <section className="section-heading"><div><span className="eyebrow">CURRENT LOAN</span><h3>Your active loan</h3></div><button className="link-button" onClick={() => onNavigate("loan")}>View all</button></section>
      <button className="loan-card" onClick={() => onLoanSelect(activeLoan)}>
        <div className="loan-icon">↗</div><div className="loan-info"><strong>{activeLoan.name}</strong><span>{activeLoan.id} · {activeLoan.rate}% p.a.</span><div className="progress"><span style={{ width: "65%" }} /></div><small>{formatIDR(activeLoan.remaining)} remaining</small></div><span className="chevron">›</span>
      </button>

      <section className="quick-grid">
        <ActionCard icon="↗" label="Apply loan" onClick={() => onNavigate("loan")} />
        <ActionCard icon="▣" label="Pay bill" onClick={() => onNavigate("bills")} />
        <ActionCard icon="✓" label="Complete KYC" onClick={() => onNavigate("kyc")} />
        <ActionCard icon="?" label="Support" onClick={() => onNavigate("profile")} />
      </section>

      <section className="section-heading"><div><span className="eyebrow">UPCOMING</span><h3>Next payment</h3></div></section>
      <Card>
        <div className="payment-row"><div><strong>18 Sep 2026</strong><span>Monthly installment</span></div><strong>{formatIDR(1250000)}</strong></div>
        <Button full onClick={() => onNavigate("bills")}>View payment</Button>
      </Card>
    </div>
  );
}

function LoanScreen({ onSelect }) {
  return (
    <div className="screen-stack">
      <section className="apply-banner"><div><span className="eyebrow">NEED MORE FUNDS?</span><h3>Find a loan that fits you.</h3><p>Flexible terms with transparent pricing.</p></div><Button onClick={() => onSelect({ id: "NEW", name: "Personal Loan", amount: 0, remaining: 0, rate: 8.5, status: "New" })}>Apply</Button></section>
      <section className="section-heading"><div><span className="eyebrow">LOAN HISTORY</span><h3>All loans</h3></div></section>
      {loans.map((loan) => <button className="list-card" key={loan.id} onClick={() => onSelect(loan)}><div className="loan-icon">↗</div><div className="list-main"><strong>{loan.name}</strong><span>{loan.id}</span><small>{loan.status === "Active" ? `${formatIDR(loan.remaining)} remaining` : "Fully paid"}</small></div><div className={`pill ${loan.status === "Active" ? "green" : "gray"}`}>{loan.status}</div></button>)}
    </div>
  );
}

function BillsScreen({ onPay }) {
  return (
    <div className="screen-stack">
      <section className="balance-card"><span>TOTAL DUE</span><strong>{formatIDR(1275000)}</strong><p>2 payments scheduled this month</p></section>
      <section className="section-heading"><div><span className="eyebrow">SEPTEMBER 2026</span><h3>Payments</h3></div></section>
      {bills.map((bill) => <Card key={bill.id}><div className="payment-row"><div><strong>{bill.title}</strong><span>{bill.subtitle}</span><small>Due {bill.due}</small></div><strong>{formatIDR(bill.amount)}</strong></div></Card>)}
      <Button full onClick={onPay}>Pay {formatIDR(1275000)}</Button>
    </div>
  );
}

function KycScreen({ onComplete }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="screen-stack">
      <Card className="kyc-intro"><div className="kyc-icon">✓</div><span className="eyebrow">IDENTITY VERIFICATION</span><h3>Verify your identity</h3><p>Complete KYC to unlock higher loan limits and faster approvals.</p></Card>
      <div className="steps">
        <KycStep number="01" title="Personal details" done />
        <KycStep number="02" title="Identity document" />
        <KycStep number="03" title="Review & submit" />
      </div>
      <Card><label className="check-row"><input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} /><span>I confirm that the information I provide is accurate.</span></label><Button full disabled={!checked} onClick={onComplete}>Continue verification</Button></Card>
    </div>
  );
}

function ProfileScreen({ user, onLogout, onToast }) {
  return (
    <div className="screen-stack">
      <Card className="profile-card"><div className="profile-avatar">{user?.name?.[0] || "G"}</div><h3>{user?.name || "Gantulu"}</h3><p>{user?.email || "gantulu@example.com"}</p></Card>
      <div className="settings-list">
        <Setting icon="♙" title="Personal information" onClick={() => onToast("Personal information opened")} />
        <Setting icon="⌕" title="Security" onClick={() => onToast("Security settings opened")} />
        <Setting icon="?" title="Help & support" onClick={() => onToast("Support opened")} />
        <Setting icon="i" title="About Loan" onClick={() => onToast("Loan App v1.0")} />
      </div>
      <button className="logout" onClick={onLogout}>Sign out</button>
    </div>
  );
}

function BottomNavigation({ screen, onNavigate }) {
  return <nav className="bottom-nav">{navItems.map((item) => <button key={item.id} className={screen === item.id ? "active" : ""} onClick={() => onNavigate(item.id)}><span className="nav-icon">{item.icon}</span><small>{item.label}</small></button>)}</nav>;
}

function LoanModal({ loan, onClose, onApply }) {
  const isNew = loan.status === "New";
  return <Modal title={isNew ? "Apply for a loan" : loan.name} onClose={onClose}><div className="modal-amount">{isNew ? "Up to" : "Outstanding balance"}<strong>{formatIDR(isNew ? 25000000 : loan.remaining)}</strong></div><div className="detail-grid"><div><span>Interest</span><strong>{loan.rate}% p.a.</strong></div><div><span>Loan ID</span><strong>{loan.id}</strong></div><div><span>Status</span><strong>{loan.status}</strong></div><div><span>Due date</span><strong>{loan.due || "—"}</strong></div></div>{isNew ? <Button full onClick={onApply}>Start application</Button> : <Button full onClick={onClose}>Close</Button>}</Modal>;
}

function PaymentModal({ onClose, onSuccess }) {
  return <Modal title="Confirm payment" onClose={onClose}><div className="modal-amount">Amount due<strong>{formatIDR(1275000)}</strong></div><div className="method"><span>Payment method</span><strong>Bank transfer</strong><small>Virtual account · **** 2401</small></div><Button full onClick={onSuccess}>Confirm payment</Button></Modal>;
}

function Modal({ title, onClose, children }) {
  return <div className="overlay" onMouseDown={onClose}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><h3>{title}</h3><button onClick={onClose}>×</button></div>{children}</div></div>;
}

function Field({ label, type = "text", placeholder }) {
  return <label className="field"><span>{label}</span><input type={type} placeholder={placeholder} required /></label>;
}

function Button({ children, onClick, full = false, type = "button", disabled = false }) {
  return <button className={`button ${full ? "full" : ""}`} type={type} onClick={onClick} disabled={disabled}>{children}</button>;
}

function Card({ children, className = "" }) { return <div className={`card ${className}`}>{children}</div>; }
function ActionCard({ icon, label, onClick }) { return <button className="action-card" onClick={onClick}><span>{icon}</span><strong>{label}</strong></button>; }
function KycStep({ number, title, done = false }) { return <div className="kyc-step"><div className={`step-number ${done ? "done" : ""}`}>{done ? "✓" : number}</div><div><strong>{title}</strong><span>{done ? "Completed" : "Not started"}</span></div></div>; }
function Setting({ icon, title, onClick }) { return <button className="setting" onClick={onClick}><span className="setting-icon">{icon}</span><strong>{title}</strong><span>›</span></button>; }

const styles = `
*{box-sizing:border-box}html,body,#root{margin:0;min-height:100%;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#e9edf3;color:#111827}body{overflow-x:hidden}button,input{font:inherit}button{cursor:pointer}.viewport{min-height:100vh;display:flex;justify-content:center}.app{width:100%;max-width:480px;min-height:100vh;background:#f7f8fa;display:flex;flex-direction:column;position:relative;overflow:hidden}.main{flex:1;overflow-y:auto;padding:24px 18px 106px}.header{height:82px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:18px;background:#fff;border-bottom:1px solid #edf0f4}.header h2{margin:2px 0 0;font-size:20px;letter-spacing:-.03em}.eyebrow{font-size:10px;font-weight:800;letter-spacing:.12em;color:#8992a3}.avatar,.profile-avatar{border:0;border-radius:50%;background:#111827;color:#fff;font-weight:800}.avatar{width:42px;height:42px}.screen-stack{display:flex;flex-direction:column;gap:16px}.hero-card{padding:22px;border-radius:24px;background:#111827;color:#fff;box-shadow:0 16px 34px rgba(17,24,39,.16)}.hero-top,.hero-meta{display:flex;justify-content:space-between;align-items:center}.hero-top{font-size:10px;font-weight:800;letter-spacing:.1em;color:#aeb7c6}.status-dot{color:#72d49b;letter-spacing:0}.hero-card>strong{display:block;font-size:32px;letter-spacing:-.05em;margin:16px 0}.credit-bar,.progress{height:6px;background:#30394a;border-radius:20px;overflow:hidden}.credit-bar span,.progress span{display:block;height:100%;background:#fff;border-radius:20px}.credit-bar span{width:50%}.hero-meta{font-size:11px;color:#aeb7c6;margin-top:9px}.section-heading{display:flex;justify-content:space-between;align-items:end;margin-top:6px}.section-heading h3{margin:4px 0 0;font-size:17px;letter-spacing:-.02em}.link-button,.text-button{background:none;border:0;color:#4b63d3;font-weight:750;padding:4px}.loan-card,.list-card{width:100%;border:1px solid #e8ebf0;background:#fff;border-radius:18px;padding:16px;display:flex;align-items:center;text-align:left;gap:13px;box-shadow:0 5px 18px rgba(20,29,48,.04)}.loan-icon,.setting-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:13px;background:#eef1ff;color:#4b63d3;font-size:19px;font-weight:800;flex:none}.loan-info,.list-main{display:flex;flex-direction:column;min-width:0;flex:1}.loan-info strong,.list-main strong{font-size:14px}.loan-info span,.list-main span,.loan-info small,.list-main small{color:#8992a3;font-size:11px;margin-top:3px}.progress{height:5px;margin:12px 0 5px;background:#eef0f3}.progress span{background:#4b63d3}.chevron{font-size:24px;color:#a1a9b6}.quick-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.action-card{border:1px solid #e8ebf0;background:#fff;border-radius:17px;padding:15px;text-align:left;display:flex;align-items:center;gap:10px}.action-card span{width:34px;height:34px;display:grid;place-items:center;background:#f0f2f7;border-radius:11px;color:#4b63d3;font-weight:800}.action-card strong{font-size:12px}.card{background:#fff;border:1px solid #e8ebf0;border-radius:18px;padding:17px;box-shadow:0 5px 18px rgba(20,29,48,.035)}.payment-row{display:flex;align-items:flex-start;justify-content:space-between;gap:15px}.payment-row div{display:flex;flex-direction:column;gap:3px}.payment-row strong{font-size:13px}.payment-row span,.payment-row small{font-size:11px;color:#8992a3}.button{border:0;background:#111827;color:#fff;border-radius:13px;padding:12px 17px;font-weight:750;font-size:13px;transition:.2s}.button:hover{transform:translateY(-1px)}.button:disabled{opacity:.4;cursor:not-allowed}.button.full{width:100%;margin-top:15px}.apply-banner{background:#eef1ff;border:1px solid #dfe4ff;border-radius:20px;padding:18px;display:flex;align-items:end;justify-content:space-between;gap:12px}.apply-banner h3{margin:4px 0;font-size:17px}.apply-banner p{margin:0;color:#667085;font-size:11px;line-height:1.5}.pill{font-size:10px;font-weight:800;padding:6px 9px;border-radius:20px}.pill.green{background:#e7f8ef;color:#188553}.pill.gray{background:#f0f1f4;color:#6b7280}.balance-card{background:#fff;border:1px solid #e8ebf0;border-radius:20px;padding:20px}.balance-card span{font-size:10px;font-weight:800;letter-spacing:.1em;color:#8992a3}.balance-card strong{display:block;font-size:28px;letter-spacing:-.04em;margin:8px 0}.balance-card p{margin:0;color:#8992a3;font-size:11px}.kyc-intro{text-align:center;padding:24px}.kyc-icon{margin:0 auto 15px;width:52px;height:52px;display:grid;place-items:center;border-radius:16px;background:#e7f8ef;color:#188553;font-weight:900;font-size:22px}.kyc-intro h3{margin:6px 0;font-size:20px}.kyc-intro p{margin:0;color:#8992a3;font-size:12px;line-height:1.6}.steps{display:flex;flex-direction:column}.kyc-step{display:flex;gap:12px;align-items:center;padding:13px 3px}.step-number{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#eef0f4;color:#737b89;font-size:10px;font-weight:800}.step-number.done{background:#111827;color:#fff}.kyc-step div:last-child{display:flex;flex-direction:column}.kyc-step strong{font-size:13px}.kyc-step span{font-size:10px;color:#8992a3;margin-top:2px}.check-row{display:flex;align-items:flex-start;gap:10px;color:#667085;font-size:11px;line-height:1.5}.check-row input{margin-top:2px;accent-color:#111827}.profile-card{text-align:center;padding:25px}.profile-avatar{width:68px;height:68px;display:grid;place-items:center;margin:0 auto 12px;font-size:22px}.profile-card h3{margin:0;font-size:18px}.profile-card p{margin:4px 0 0;color:#8992a3;font-size:12px}.settings-list{background:#fff;border:1px solid #e8ebf0;border-radius:18px;overflow:hidden}.setting{width:100%;border:0;border-bottom:1px solid #edf0f4;background:#fff;padding:13px 14px;display:flex;align-items:center;gap:11px;text-align:left}.setting:last-child{border-bottom:0}.setting strong{font-size:12px;flex:1}.setting>span:last-child{font-size:21px;color:#a1a9b6}.setting-icon{width:34px;height:34px;border-radius:10px;font-size:14px}.logout{border:0;background:#fff;color:#c23b4a;border:1px solid #f0d9dd;border-radius:14px;padding:12px;font-size:12px;font-weight:800}.bottom-nav{position:absolute;bottom:0;left:0;right:0;height:76px;background:rgba(255,255,255,.96);backdrop-filter:blur(16px);border-top:1px solid #e8ebf0;display:grid;grid-template-columns:repeat(5,1fr);z-index:5}.bottom-nav button{border:0;background:transparent;color:#9aa2af;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}.bottom-nav button.active{color:#111827}.nav-icon{font-size:19px;line-height:1}.bottom-nav small{font-size:9px;font-weight:750}.toast{position:absolute;z-index:20;bottom:88px;left:50%;transform:translateX(-50%);background:#111827;color:#fff;border-radius:12px;padding:10px 14px;font-size:11px;box-shadow:0 10px 30px rgba(0,0,0,.2);white-space:nowrap}.overlay{position:absolute;inset:0;background:rgba(8,13,24,.48);z-index:10;display:flex;align-items:flex-end}.modal{background:#fff;border-radius:25px 25px 0 0;width:100%;padding:20px 18px 28px;box-shadow:0 -10px 40px rgba(0,0,0,.15)}.modal-head{display:flex;justify-content:space-between;align-items:center}.modal-head h3{margin:0;font-size:18px}.modal-head button{border:0;background:#f1f2f5;width:32px;height:32px;border-radius:50%;font-size:22px;color:#6b7280}.modal-amount{padding:20px 0;border-bottom:1px solid #edf0f4;color:#8992a3;font-size:11px}.modal-amount strong{display:block;color:#111827;font-size:28px;margin-top:5px;letter-spacing:-.04em}.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:18px 0}.detail-grid div,.method{display:flex;flex-direction:column;gap:3px}.detail-grid span,.method span{font-size:10px;color:#8992a3}.detail-grid strong,.method strong{font-size:12px}.method{padding:15px;border:1px solid #e8ebf0;border-radius:14px;margin:17px 0 2px}.method small{font-size:10px;color:#8992a3}.splash-bg{background:#111827;color:#fff;align-items:center}.splash-content{text-align:center}.logo-mark{width:66px;height:66px;border-radius:20px;background:#fff;color:#111827;display:grid;place-items:center;font-size:32px;font-weight:900;margin:0 auto 15px}.logo-mark.small{width:36px;height:36px;border-radius:11px;font-size:18px;margin:0}.splash-content h1{margin:0;font-size:28px}.splash-content p{color:#9ca6b6;font-size:12px}.auth-bg{background:#eef1f5;align-items:center;padding:18px}.auth-card{width:100%;max-width:440px;background:#fff;border-radius:25px;padding:25px;box-shadow:0 20px 50px rgba(20,29,48,.09)}.brand-row{display:flex;align-items:center;gap:9px;font-size:16px}.auth-copy{margin:42px 0 25px}.auth-copy h1{margin:0;font-size:25px;letter-spacing:-.04em}.auth-copy p{margin:7px 0 0;color:#8992a3;font-size:12px;line-height:1.5}.field{display:flex;flex-direction:column;gap:7px;margin-bottom:15px}.field span{font-size:10px;font-weight:800;color:#667085}.field input{border:1px solid #e0e4ea;border-radius:12px;padding:12px 13px;outline:none;font-size:13px;background:#fafbfc}.field input:focus{border-color:#9aa8e8;background:#fff}.forgot{display:block;margin:11px auto 0;font-size:11px}.auth-switch{border-top:1px solid #edf0f4;margin-top:25px;padding-top:18px;display:flex;justify-content:center;gap:5px;font-size:11px;color:#8992a3}
@media(min-width:481px){.viewport{padding:20px}.app{min-height:calc(100vh - 40px);height:calc(100vh - 40px);border-radius:28px;box-shadow:0 20px 60px rgba(20,29,48,.14)}.splash-bg{padding:20px}.auth-bg{min-height:calc(100vh - 40px);border-radius:28px}}
`;

if (typeof document !== "undefined" && !document.getElementById("loan-styles")) {
  const style = document.createElement("style");
  style.id = "loan-styles";
  style.textContent = styles;
  document.head.appendChild(style);
}
