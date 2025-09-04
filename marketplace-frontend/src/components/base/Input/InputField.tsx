import type React from "react";
import type { FC, ComponentType } from "react";
import Label from "../../template/form/Label";

interface InputFieldProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | "tel" | "url" | "search";
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string | number;
  max?: string | number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  leftIcon?: ComponentType<{ size?: number; className?: string }>;
  rightIcon?: ComponentType<{ size?: number; className?: string }>;
  onRightIconClick?: () => void;
  autoComplete?: string;
  autoFocus?: boolean;
}

const InputField: FC<InputFieldProps> = ({
  type = "text",
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  className = "",
  min,
  max,
  step,
  disabled = false,
  required = false,
  readonly = false,
  success = false,
  error = false,
  hint,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  autoComplete,
  autoFocus = false,
}) => {
  /* ————— clases dinámicas con estilo premium ————— */
  let inputClasses = `h-12 w-full rounded-xl border-2 px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 placeholder:text-gray-500 focus:outline-none focus:ring-4 backdrop-blur-sm appearance-none ${className}`;

  if (disabled) {
    inputClasses += " text-gray-400 border-gray-200 bg-gray-50/50 cursor-not-allowed opacity-60 dark:bg-gray-800/50 dark:text-gray-500 dark:border-gray-700";
  } else if (error) {
    inputClasses += " border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-200/50 text-red-800 placeholder:text-red-400";
  } else if (success) {
    inputClasses += " border-green-300 bg-green-50/50 focus:border-green-400 focus:ring-green-200/50 text-green-800 placeholder:text-green-400";
  } else {
    inputClasses += " border-orange-200/50 bg-white/90 text-gray-800 focus:border-orange-400 focus:ring-orange-200/50 hover:border-orange-300 hover:shadow-xl";
  }

  /* ——— padding extra si hay íconos con mejor espaciado ——— */
  if (LeftIcon) inputClasses += " pl-12";
  if (RightIcon) inputClasses += " pr-12";

  return (
    <div className="w-full relative">
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </Label>
      )}
      
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
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          required={required}
          readOnly={readonly}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={inputClasses}
        />

        {/* Ícono a la derecha */}
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            disabled={disabled || !onRightIconClick}
            className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200 ${
              onRightIconClick && !disabled
                ? "text-gray-500 hover:text-gray-700 cursor-pointer"
                : "text-gray-400 cursor-default"
            }`}
            aria-label="Right icon action"
          >
            <RightIcon size={18} />
          </button>
        )}
      </div>

      {hint && (
        <p
          className={`mt-2 text-sm font-medium ${
            error
              ? "text-red-600"
              : success
              ? "text-green-600"
              : "text-gray-600"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default InputField;