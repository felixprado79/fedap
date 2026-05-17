/**
 * schemas.ts  —  Zod validation schemas for client-side form validation
 *
 * These schemas are used with React Hook Form + zodResolver.
 * They mirror the backend Pydantic schemas so validation errors
 * are caught in the browser before a request is ever sent.
 *
 * Usage with React Hook Form:
 *   import { useForm } from "react-hook-form";
 *   import { zodResolver } from "@hookform/resolvers/zod";
 *   import { contactFormSchema, type ContactFormData } from "@/lib/validation/schemas";
 *
 *   const form = useForm<ContactFormData>({ resolver: zodResolver(contactFormSchema) });
 */

import { z } from "zod";

// ── Contact form ──────────────────────────────────────────────────────────────

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2,   { message: "El nombre debe tener al menos 2 caracteres." })
    .max(100, { message: "El nombre no puede superar los 100 caracteres." })
    .regex(/^[\p{L}\p{M}\s'-]+$/u, {
      message: "El nombre solo puede contener letras, espacios, guiones y apóstrofes.",
    }),

  email: z
    .string()
    .email({ message: "Por favor ingresá un email válido." })
    .max(254, { message: "El email es demasiado largo." }),

  phone: z
    .string()
    .max(20, { message: "El teléfono no puede superar los 20 caracteres." })
    // Costa Rican numbers: 8 digits, optionally with country code +506
    .regex(/^(\+506)?[\s-]?\d{4}[\s-]?\d{4}$/, {
      message: "Ingresá un número de teléfono costarricense válido (ej: 8888-8888).",
    })
    .optional()
    .or(z.literal("")),

  subject: z
    .string()
    .min(3,   { message: "El asunto debe tener al menos 3 caracteres." })
    .max(200, { message: "El asunto no puede superar los 200 caracteres." }),

  message: z
    .string()
    .min(10,   { message: "El mensaje debe tener al menos 10 caracteres." })
    .max(2000, { message: "El mensaje no puede superar los 2000 caracteres." }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;


// ── Product search ────────────────────────────────────────────────────────────

export const searchSchema = z.object({
  query: z
    .string()
    .max(100, { message: "La búsqueda no puede superar los 100 caracteres." })
    // Prevent search queries that are pure punctuation / injection attempts
    .regex(/^[\p{L}\p{M}\p{N}\s.,'-]*$/u, {
      message: "La búsqueda contiene caracteres no permitidos.",
    })
    .optional(),

  category: z.string().optional(),
});

export type SearchData = z.infer<typeof searchSchema>;
