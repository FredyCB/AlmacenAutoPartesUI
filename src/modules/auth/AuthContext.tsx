
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'

type User = {
  id: string
  firstname: string
  lastname: string
  email: string
  admin: boolean
  active: boolean
} | null

type AuthContextType = {
  user: User
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: {name: string; lastname: string; email: string; password: string}) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // decodificar si tienes payload, aquí asumimos guardado aparte
      const cached = localStorage.getItem('user')
      if (cached) setUser(JSON.parse(cached))
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
      localStorage.removeItem('user')
    }
  }, [token])

  const login = async (email: string, password: string) => {
   const res = await api.post('/users/login', { email, password })
    setToken(res.data.idToken)
    // como el JWT es interno, no lo decodificamos, pero podemos pedir /me si existiera
    setUser({ id: 'me', firstname: 'Usuario', lastname: '', email, admin: false, active: true })
    localStorage.setItem('user', JSON.stringify({ id: 'me', firstname: 'Usuario', lastname: '', email, admin: false, active: true }))
  }

  const register = async (data: {name: string; lastname: string; email: string; password: string}) => {
    await api.post('/api/users/register', data)
    await login(data.email, data.password)
  }

  const logout = () => {
    setToken(null)
  }

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
