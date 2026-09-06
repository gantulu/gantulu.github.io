function Header() {
  return (
    <header>
      <h1>Header</h1>
    </header>
  );
}

function Main() {
  return (
    <main>
      <h2>Main</h2>
      <p>React App berhasil berjalan.</p>
    </main>
  );
}

function BottomNav() {
  return (
    <nav>
      <button type="button">Home</button>
      <button type="button">Profile</button>
    </nav>
  );
}

function App() {
  return (
    <div>
      <Header />
      <Main />
      <BottomNav />
    </div>
  );
}

export default App;
