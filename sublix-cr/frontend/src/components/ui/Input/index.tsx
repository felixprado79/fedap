"use client";

/**
 * Input — styled text input with optional left icon and clear button.
 *
 * Wraps a native <input> so form libraries (React Hook Form, etc.) can
 * register it directly via the `ref` prop.
 */

import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  onClear?: () => void;         // Shows ✕ button when provided and input has value
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, onClear, error, className, ...props }, ref) => (
    <div className="relative w-full">
      {/* Left icon */}
      {leftIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-gray-400">
          {leftIcon}
        </div>
      )}

      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-gray-200 bg-white py-3 text-sm text-gray-900 placeholder-gray-400",
          "transition-colors focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200",
          "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
          error && "border-red-400 focus:border-red-400 focus:ring-red-200",
          leftIcon  ? "pl-10 pr-4" : "px-4",
          onClear   ? "pr-9"       : "",
          className
        )}
        {...props}
      />

      {/* Clear button — only shown when there's a value */}
      {onClear && props.value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label="Limpiar búsqueda"
        >
          <X size={15} />
        </button>
      )}

      {/* Validation error */}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
export default Input;
