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
  register: (data: { name: string; lastname: string; email: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
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
    const res = await api.post('/api/users/login', { email, password })
    setToken(res.data.idToken)

    const loggedUser: User = {
      id: 'me',
      firstname: 'Usuario',
      lastname: '',
      email,
      admin: false,
      active: true
    }
    setUser(loggedUser)
    localStorage.setItem('user', JSON.stringify(loggedUser))
  }

  const register = async (data: { name: string; lastname: string; email: string; password: string }) => {
    const res = await api.post('/api/users/register', data)
    if (res.data.idToken) {
      setToken(res.data.idToken)
      const newUser: User = {
        id: res.data.id,
        firstname: res.data.name,
        lastname: res.data.lastname,
        email: res.data.email,
        admin: res.data.admin,
        active: res.data.active
      }
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      // Si no viene token, forzamos login normal
      await login(data.email, data.password)
    }
  }

  const logout = () => {
    setToken(null)
  }

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
