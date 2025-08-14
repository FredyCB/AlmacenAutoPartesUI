import { FieldError } from 'react-hook-form'

export default function FormField(props: {
  label: string
  error?: FieldError
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="label">{props.label}</label>
      {props.children}
      {props.error && <p className="text-sm text-red-600">{props.error.message}</p>}
    </div>
  )
}
