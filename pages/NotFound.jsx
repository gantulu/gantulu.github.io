window.NotFoundPage = function NotFoundPage() {
  return <section className="container content-page not-found">
    <p className="eyebrow">404 · PAGE NOT FOUND</p><h1>This page isn’t here.</h1>
    <p className="page-intro">The address may be incorrect or the page may have moved.</p>
    <a className="primary-link" href="#/">Return home <span aria-hidden="true">→</span></a>
  </section>;
};