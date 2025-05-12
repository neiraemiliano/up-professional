// components/Select/CustomSelect.tsx
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  KeyboardEvent,
} from "react";
import { X } from "lucide-react";
import Label from "../template/form/Label";
import { getText } from "../../config/texts/texts";

interface Option {
  value: string | number;
  name: string;
}

interface CustomSelectProps {
  id: string;
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  value: Option | null;
  onChange: (option: Option | null) => void;
  leftIcon?: ComponentType<{ size?: number; className?: string }>;
  className?: string;
  hint?: string;
  error?: boolean;
  success?: boolean;
}

export default function CustomSelect({
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
}: CustomSelectProps) {
  /* -------------------------------------------------- */
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* ————— cerrar al click fuera ————— */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ————— clases dinámicas ————— */
  let inputClasses = `h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3
       dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (error) {
    inputClasses +=
      " border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400";
  } else if (success) {
    inputClasses +=
      " border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400";
  } else {
    inputClasses +=
      " bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700";
  }

  if (LeftIcon) inputClasses += " pl-10";
  if (value) inputClasses += " pr-10";

  /* -------------------------------------------------- */
  const clearSelection = () => {
    onChange(null);
    setHighlight(0);
  };

  const handleSelect = (option: Option) => {
    onChange(option);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + options.length) % options.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(options[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  /* -------------------------------------------------- */
  return (
    <div ref={wrapperRef} className="sm:col-span-1 w-full relative z-50">
      {label && (
        <Label htmlFor={id}>
          {label}
          <span className="text-error-500">*</span>
        </Label>
      )}

      {/* WRAPPER RELATIVE PARA ICONOS */}
      <div className="relative">
        {LeftIcon && (
          <LeftIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        )}

        {/* INPUT (readonly) */}
        <input
          id={id}
          name={name}
          type="text"
          readOnly
          placeholder={placeholder}
          className={inputClasses + " cursor-pointer"}
          value={value?.name ?? ""}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
        />

        {/* Botón “borrar” */}
        {value && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="clear"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* LISTA DESPLEGABLE */}
      {open && options.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-sm border border-gray-200 bg-white shadow-lg dark:bg-gray-800">
          {options.map((option, idx) => (
            <li
              key={option.value}
              className={`cursor-pointer px-4 py-2 text-sm border-b border-gray-200 ${
                idx === highlight
                  ? "bg-brand-50 dark:bg-brand-700/40"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700/40"
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
