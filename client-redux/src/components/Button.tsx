import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export const Button = ({ variant = "primary", className = "", children, ...rest }: ButtonProps) => {
  return (
    <button {...rest} className={`btn btn--${variant} ${className}`.trim()}>
      {children}
    </button>
  );
};
