import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string | string[];
  hint?: string;
  children: ReactNode;
}

export const FormField = ({ label, htmlFor, required, error, hint, children }: FormFieldProps) => {
  const errorText = Array.isArray(error) ? error.join(", ") : error;
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={htmlFor}>
        {label}
        {required && <span className="form-field__required"> *</span>}
      </label>
      {children}
      {hint && !errorText && <div className="form-field__hint">{hint}</div>}
      {errorText && <div className="form-field__error">{errorText}</div>}
    </div>
  );
};
