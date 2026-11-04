window.Header = function Header() {
  const currentRoute = window.location.hash.replace(/^#/, "") || "/";
  return <header className="site-header"><div className="container header-inner">
    <a className="brand" href="#/" aria-label="Go to homepage">gantulu<span>.</span></a>
    <nav className="main-nav" aria-label="Main navigation">
      <a className={currentRoute === "/" ? "nav-link active" : "nav-link"} href="#/">Home</a>
      <a className={currentRoute === "/about" ? "nav-link active" : "nav-link"} href="#/about">About</a>
    </nav>
  </div></header>;
};