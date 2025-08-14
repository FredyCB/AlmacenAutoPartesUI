
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Parts from './pages/Parts'
import { ProtectedRoute } from './modules/auth/ProtectedRoute'
import { useAuth } from './modules/auth/AuthContext'

export default function App() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Almacén de Autopartes</Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/categories" className="hover:underline">Categorías</Link>
                <Link to="/parts" className="hover:underline">Autopartes</Link>
                <button className="btn btn-primary" onClick={logout}>Salir</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Entrar</Link>
                <Link to="/register" className="hover:underline">Registro</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/parts" element={<ProtectedRoute><Parts /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
