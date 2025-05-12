import { useState } from "react";
import Label from "./Label";
import { getText } from "../../../config/texts/texts";

interface Option {
  value: string;
  name: string;
}

interface SelectProps {
  id: string;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  defaultValue?: string;
  hint?: string;
  error?: boolean;
  success?: boolean;
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  options,
  placeholder = getText("selectOption"),
  onChange,
  className = "",
  defaultValue = "",
  hint,
  error = false,
  success = false,
}) => {
  // Manage the selected value
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(e); // Trigger parent handler
  };

  let selectClasses = ` h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30   ${
    selectedValue
      ? "text-gray-800 dark:text-white/90"
      : "text-gray-400 dark:text-gray-400"
  } ${className}`;

  if (error) {
    selectClasses += `  border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    selectClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    selectClasses += ` bg-transparent text-gray-400 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;
  }

  return (
    <div className="sm:col-span-1 w-full">
      {label && (
        <Label>
          {label}
          <span className="text-error-500">*</span>
        </Label>
      )}
      <select
        id={id}
        name={selectedValue}
        className={selectClasses}
        value={selectedValue}
        onChange={handleChange}
      >
        {/* Placeholder option */}
        <option
          value=""
          disabled
          className="text-gray-400 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
        {/* Map over options */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.name}
          </option>
        ))}
      </select>
      {hint && (
        <p
          className={` mt-1.5 text-xs ${
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
};

export default Select;
