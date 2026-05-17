"use client";

/**
 * SearchBar — search input for the products catalog.
 *
 * Emits onChange on every keystroke. Debouncing is handled by useProducts
 * so this component stays purely presentational.
 */

import { Search } from "lucide-react";
import Input from "@/components/ui/Input";

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar productos...",
}: SearchBarProps) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClear={() => onChange("")}
      placeholder={placeholder}
      leftIcon={<Search size={16} />}
      aria-label="Buscar productos"
    />
  );
}
