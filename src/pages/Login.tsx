import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormField from '../components/FormField';
import { useAuth } from '../modules/auth/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      nav('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card space-y-4">
      <h1 className="title">Entrar</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <FormField label="Email" error={errors.email}>
          <input className="input" type="email" disabled={loading} {...register('email')} />
        </FormField>
        <FormField label="Contraseña" error={errors.password}>
          <input className="input" type="password" disabled={loading} {...register('password')} />
        </FormField>
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link className="underline" to="/register">Regístrate</Link>
      </p>
    </div>
  );
}
