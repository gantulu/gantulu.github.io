import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page">
      <p className="eyebrow">404</p>
      <h1>Halaman tidak ditemukan</h1>
      <p className="lead">Halaman yang kamu cari tidak tersedia.</p>
      <Link className="text-link" to="/">Kembali ke Home</Link>
    </section>
  )
}
