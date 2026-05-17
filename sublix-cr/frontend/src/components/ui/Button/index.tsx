"use client";

/**
 * Button — reusable button component with variants and sizes.
 *
 * Variants: primary | secondary | outline | ghost | whatsapp
 * Sizes:    sm | md | lg
 *
 * Renders a <button>. For links styled as buttons use ButtonLink below.
 */

import { cn } from "@/lib/utils/cn";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white shadow-sm hover:bg-brand-600 focus-visible:ring-brand-500",
  secondary:
    "bg-brand-50 text-brand-700 hover:bg-brand-100 focus-visible:ring-brand-400",
  outline:
    "border-2 border-brand-500 text-brand-600 hover:bg-brand-50 focus-visible:ring-brand-500",
  ghost:
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400",
  whatsapp:
    "bg-[#25D366] text-white shadow-sm hover:bg-[#1ebe5d] focus-visible:ring-[#25D366]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "gap-1.5 rounded-lg px-4 py-2 text-sm",
  md: "gap-2   rounded-xl px-6 py-3 text-base",
  lg: "gap-2.5 rounded-xl px-8 py-4 text-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth = false, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-semibold",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
export default Button;
