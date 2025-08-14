import React from "react";

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormField({ label, type = "text", value, onChange }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded p-2"
      />
    </div>
  );
}
