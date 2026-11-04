const { useEffect, useState } = React;
window.App = function App() {
  const getRoute = () => window.location.hash.replace(/^#/, "") || "/";
  const [route, setRoute] = useState(getRoute);
  useEffect(() => {
    const handleNavigation = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleNavigation);
    return () => window.removeEventListener("hashchange", handleNavigation);
  }, []);
  let page;
  if (route === "/" || route === "") page = <window.HomePage />;
  else if (route === "/about") page = <window.AboutPage />;
  else page = <window.NotFoundPage />;
  return <div className="site-shell"><window.Header /><main id="main-content" className="main-content">{page}</main><window.Footer /></div>;
};