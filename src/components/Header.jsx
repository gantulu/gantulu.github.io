import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <NavLink className="brand" to="/">React App</NavLink>
        <nav aria-label="Navigasi utama" className="navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </div>
    </header>
  )
}
