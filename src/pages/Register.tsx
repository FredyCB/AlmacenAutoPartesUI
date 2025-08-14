
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormField from '../components/FormField'
import { useAuth } from '../modules/auth/AuthContext'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  lastname: z.string().min(2, 'Apellido muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const { register: registerUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await registerUser(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto card space-y-4">
      <h1 className="title">Registro</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <FormField label="Nombre" error={errors.name}>
          <input className="input" type="text" {...register('name')} />
        </FormField>
        <FormField label="Apellido" error={errors.lastname}>
          <input className="input" type="text" {...register('lastname')} />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <input className="input" type="email" {...register('email')} />
        </FormField>
        <FormField label="Contraseña" error={errors.password}>
          <input className="input" type="password" {...register('password')} />
        </FormField>
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Creando...' : 'Crear cuenta'}</button>
      </form>
    </div>
  )
}
