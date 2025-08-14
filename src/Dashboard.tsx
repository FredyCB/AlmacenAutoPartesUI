import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="card">
        <h2 className="font-semibold text-lg">Categorías</h2>
        <p className="text-gray-600 mb-3">Gestiona categorías de autopartes (aceites, amortiguadores, etc.).</p>
        <Link to="/categories" className="btn btn-primary inline-block">Ir a Categorías</Link>
      </div>
      <div className="card">
        <h2 className="font-semibold text-lg">Autopartes</h2>
        <p className="text-gray-600 mb-3">Gestiona las autopartes del inventario.</p>
        <Link to="/parts" className="btn btn-primary inline-block">Ir a Autopartes</Link>
      </div>
    </div>
  )
}
