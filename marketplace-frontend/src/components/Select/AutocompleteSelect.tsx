import { useEffect, useRef, useState, type ComponentType } from "react";
import { getText } from "../../config/texts/texts";
import Label from "../template/form/Label";
import { X } from "lucide-react";

interface Option {
  value: string;
  name: string;
}

interface AutocompleteSelectProps {
  id: string;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  value: Option | null;
  onChange: (option: Option | null) => void; // 🔸
  leftIcon?: ComponentType<{ size?: number; className?: string }>;
  className?: string;
  hint?: string;
  error?: boolean;
  success?: boolean;
}

export default function AutocompleteSelect({
  id,
  name,
  label,
  options,
  placeholder = getText("selectOption"),
  value,
  onChange,
  leftIcon: LeftIcon,
  className = "",
  hint,
  error = false,
  success = false,
}: AutocompleteSelectProps) {
  /* -------------------------------------------------- */
  const [query, setQuery] = useState<string>(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered =
    query.length >= 3
      ? options.filter((o) =>
          o.name.toLowerCase().includes(query.toLowerCase())
        )
      : [];

  /* ————— cerrar al click fuera ————— */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
        // Si el texto no coincide con ninguna opción, lo limpiamos
        if (!options.find((o) => o.name === query)) {
          setQuery("");
          onChange(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query, onChange, options]);

  /* ————— clases dinámicas con estilo premium ————— */
  let inputClasses = `h-12 w-full rounded-xl border-2 px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 placeholder:text-gray-500 focus:outline-none focus:ring-4 backdrop-blur-sm ${className}`;

  if (error) {
    inputClasses +=
      " border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-200/50 text-red-800 placeholder:text-red-400";
  } else if (success) {
    inputClasses +=
      " border-green-300 bg-green-50/50 focus:border-green-400 focus:ring-green-200/50 text-green-800 placeholder:text-green-400";
  } else {
    inputClasses +=
      " border-orange-200/50 bg-white/90 text-gray-800 focus:border-orange-400 focus:ring-orange-200/50 hover:border-orange-300 hover:shadow-xl";
  }

  /* ——— padding extra si hay íconos con mejor espaciado ——— */
  if (LeftIcon) inputClasses += " pl-12";
  if (query) inputClasses += " pr-12";

  /* -------------------------------------------------- */
  const clearQuery = () => {
    setQuery("");
    onChange(null);
    setHighlight(0);
  };

  /* -------------------------------------------------- */
  const handleSelect = (option: Option) => {
    onChange(option);
    setQuery(option.name);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(filtered[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  /* -------------------------------------------------- */
  return (
    <div ref={wrapperRef} className="sm:col-span-1 w-full relative z-99999">
      {label && (
        <Label>
          {label}
          <span className="text-error-500">*</span>
        </Label>
      )}
      {/* WRAPPER RELATIVE PARA ICONOS */}
      <div className="relative">
        {/* Ícono a la izquierda */}
        {LeftIcon && (
          <LeftIcon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10"
          />
        )}

        {/* INPUT */}
        <input
          id={id}
          name={name}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          className={inputClasses}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />

        {/* Botón "borrar" */}
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 z-10"
            aria-label={"clear"}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* LISTA DESPLEGABLE */}
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border-2 border-orange-200/50 bg-white/95 shadow-2xl backdrop-blur-lg dark:bg-gray-900/95 dark:border-gray-700">
          {filtered.map((option, idx) => (
            <li
              key={option.value}
              className={`cursor-pointer px-4 py-3 text-sm font-medium transition-all duration-200 ${
                idx === highlight
                  ? "bg-orange-100/60 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200"
                  : "hover:bg-gray-50/80 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800/50"
              } ${
                idx === filtered.length - 1 ? "" : "border-b border-orange-100/50 dark:border-gray-700/50"
              }`}
              onMouseEnter={() => setHighlight(idx)}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(option);
              }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
