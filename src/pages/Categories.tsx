
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../services/api'
import FormField from '../components/FormField'

type Category = { _id?: string; id?: string; name: string; description?: string }

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional()
})

export default function Categories() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<
    { name: string; description?: string }
  >({ resolver: zodResolver(schema) })

  const load = async () => {
    const res = await api.get('/api/categories')
    setItems(res.data)
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (data: {name: string; description?: string}) => {
    setLoading(true)
    try {
      if (editing) {
        await api.put(`/api/categories/${editing}`, data)
      } else {
        await api.post('/api/categories', data)
      }
      reset({ name: '', description: '' })
      setEditing(null)
      await load()
    } finally {
      setLoading(false)
    }
  }

  const onEdit = (c: Category) => {
    setEditing(c._id || c.id!)
    reset({ name: c.name, description: c.description || '' })
  }

  const onDelete = async (id: string) => {
    if (!confirm('¿Eliminar categoría?')) return
    await api.delete(`/api/categories/${id}`)
    await load()
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="title mb-2">{editing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <FormField label="Nombre" error={errors.name}>
            <input className="input" {...register('name')} />
          </FormField>
          <FormField label="Descripción" error={errors.description as any}>
            <textarea className="input" rows={3} {...register('description')} />
          </FormField>
          <div className="flex gap-2">
            <button className="btn btn-primary" disabled={loading}>{editing ? 'Guardar' : 'Crear'}</button>
            {editing && <button type="button" className="btn" onClick={() => { setEditing(null); reset({ name: '', description: '' })}}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="title mb-2">Listado</h2>
        <div className="divide-y">
          {items.map(c => (
            <div key={c._id || c.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{c.name}</div>
                {c.description && <div className="text-gray-600 text-sm">{c.description}</div>}
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={() => onEdit(c)}>Editar</button>
                <button className="btn" onClick={() => onDelete(c._id || c.id!)}>Eliminar</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-600">No hay categorías.</p>}
        </div>
      </div>
    </div>
  )
}
