
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../services/api'
import FormField from '../components/FormField'

type Category = { _id?: string; id?: string; name: string }
type Part = { _id?: string; id?: string; name: string; categoryId: string; price: number; stock: number }

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  categoryId: z.string().min(1, 'Categoría requerida'),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative()
})

export default function Parts() {
  const [items, setItems] = useState<Part[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<
    { name: string; categoryId: string; price: number; stock: number }
  >({ resolver: zodResolver(schema) })

  const load = async () => {
    const [r1, r2] = await Promise.all([
      api.get('/api/parts'),
      api.get('/api/categories')
    ])
    setItems(r1.data)
    setCats(r2.data)
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (data: {name: string; categoryId: string; price: number; stock: number}) => {
    setLoading(True as any)
    try {
      if (editing) {
        await api.put(`/api/parts/${editing}`, data)
      } else {
        await api.post('/api/parts', data)
      }
      reset({ name: '', categoryId: '', price: 0, stock: 0 })
      setEditing(null)
      await load()
    } finally {
      setLoading(False as any)
    }
  }

  const onEdit = (p: Part) => {
    setEditing(p._id || p.id!)
    reset({ name: p.name, categoryId: p.categoryId, price: p.price, stock: p.stock })
  }

  const onDelete = async (id: string) => {
    if (!confirm('¿Eliminar autoparte?')) return
    await api.delete(`/api/parts/${id}`)
    await load()
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="title mb-2">{editing ? 'Editar Autoparte' : 'Nueva Autoparte'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <FormField label="Nombre" error={errors.name}>
            <input className="input" {...register('name')} />
          </FormField>
          <FormField label="Categoría" error={errors.categoryId}>
            <select className="input" {...register('categoryId')}>
              <option value="">Seleccione...</option>
              {cats.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
            </select>
          </FormField>
          <FormField label="Precio" error={errors.price}>
            <input className="input" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
          </FormField>
          <FormField label="Stock" error={errors.stock}>
            <input className="input" type="number" {...register('stock', { valueAsNumber: true })} />
          </FormField>
          <div className="flex gap-2">
            <button className="btn btn-primary" disabled={loading}>{editing ? 'Guardar' : 'Crear'}</button>
            {editing && <button type="button" className="btn" onClick={() => { setEditing(null); reset({ name: '', categoryId: '', price: 0, stock: 0 })}}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="title mb-2">Listado</h2>
        <div className="divide-y">
          {items.map(p => (
            <div key={p._id || p.id} className="py-3 grid grid-cols-1 md:grid-cols-2 items-center">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-gray-600 text-sm">Precio: ${p.price.toFixed(2)} | Stock: {p.stock}</div>
              </div>
              <div className="flex gap-2 md:justify-end mt-2 md:mt-0">
                <button className="btn" onClick={() => onEdit(p)}>Editar</button>
                <button className="btn" onClick={() => onDelete(p._id || p.id!)}>Eliminar</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-600">No hay autopartes.</p>}
        </div>
      </div>
    </div>
  )
}
