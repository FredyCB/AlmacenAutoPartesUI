import React from "react";
import { FieldError } from "react-hook-form";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
}

export default function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
