window.AboutPage = function AboutPage() {
  return <section className="container content-page">
    <p className="eyebrow">ABOUT</p><h1>About this website</h1>
    <p className="page-intro">This is a minimal, client-rendered React website served directly as static files. It does not require a package manager, build step, or application server.</p>
    <div className="info-panel"><h2>Technology</h2><ul>
      <li>Static HTML as the document entry point</li><li>React and ReactDOM loaded from CDN</li>
      <li>Babel Standalone for in-browser JSX compilation</li><li>Native CSS for layout and styling</li><li>GitHub Pages for static hosting</li>
    </ul></div>
    <a className="text-link" href="#/">← Back to home</a>
  </section>;
};