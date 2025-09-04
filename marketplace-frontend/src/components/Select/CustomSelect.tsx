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

  /* ————— clases dinámicas con estilo premium ————— */
  let inputClasses = `h-12 w-full rounded-xl border-2 px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 placeholder:text-gray-500 focus:outline-none focus:ring-4 backdrop-blur-sm cursor-pointer
       dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

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

  if (LeftIcon) inputClasses += " pl-12";
  if (value) inputClasses += " pr-12";

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
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10"
          />
        )}

        {/* INPUT (readonly) */}
        <input
          id={id}
          name={name}
          type="text"
          readOnly
          placeholder={placeholder}
          className={inputClasses}
          value={value?.name ?? ""}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
        />

        {/* Botón "borrar" */}
        {value && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 z-10"
            aria-label="clear"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* LISTA DESPLEGABLE */}
      {open && options.length > 0 && (
        <ul className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border-2 border-orange-200/50 bg-white/95 shadow-2xl backdrop-blur-lg dark:bg-gray-900/95 dark:border-gray-700">
          {options.map((option, idx) => (
            <li
              key={option.value}
              className={`cursor-pointer px-4 py-3 text-sm font-medium transition-all duration-200 ${
                idx === highlight
                  ? "bg-orange-100/60 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200"
                  : "hover:bg-gray-50/80 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800/50"
              } ${
                idx === options.length - 1 ? "" : "border-b border-orange-100/50 dark:border-gray-700/50"
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
