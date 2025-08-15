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
    try {
      const res = await api.post('/api/users/login', { email, password })
      setToken(res.data.idToken)

      // Guardamos usuario con datos reales si el backend los devuelve
      const loggedUser: User = {
        id: res.data.id || 'me',
        firstname: res.data.firstname || 'Usuario',
        lastname: res.data.lastname || '',
        email,
        admin: res.data.admin ?? false,
        active: res.data.active ?? true
      }
      setUser(loggedUser)
      localStorage.setItem('user', JSON.stringify(loggedUser))
    } catch (err: any) {
      console.error('Error en login:', err)
      throw err
    }
  }

  const register = async (data: { name: string; lastname: string; email: string; password: string }) => {
    try {
      await api.post('/api/users/register', data)
      // Hacemos login inmediato tras registro
      await login(data.email, data.password)
    } catch (err: any) {
      console.error('Error en register:', err)
      throw err
    }
  }

  const logout = () => {
    setToken(null)
  }

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
