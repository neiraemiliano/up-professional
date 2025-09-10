import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

// Enterprise-grade input variants
const inputVariants = cva(
  // Base styles - consistent across all inputs
  "flex w-full rounded-lg border bg-white dark:bg-gray-800 px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 focus-visible:ring-orange-500 dark:border-gray-600 dark:bg-gray-800",
        error:
          "border-red-500 bg-red-50 focus-visible:ring-red-500 dark:border-red-400 dark:bg-red-950/20",
        success:
          "border-green-500 bg-green-50 focus-visible:ring-green-500 dark:border-green-400 dark:bg-green-950/20",
        warning:
          "border-yellow-500 bg-yellow-50 focus-visible:ring-yellow-500 dark:border-yellow-400 dark:bg-yellow-950/20",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  /** Click handler for right icon */
  onRightIconClick?: () => void;
  /** Error state and message */
  error?: boolean | string;
  /** Success state and message */
  success?: boolean | string;
  /** Warning state and message */
  warning?: boolean | string;
  /** Helper text below input */
  helperText?: string;
  /** Label for the input */
  label?: string;
  /** Required field indicator */
  required?: boolean;
  /** Loading state */
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant,
      size,
      leftIcon,
      rightIcon,
      onRightIconClick,
      error,
      success,
      warning,
      helperText,
      label,
      required,
      loading,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine variant based on states
    const computedVariant = error
      ? "error"
      : success
      ? "success"
      : warning
      ? "warning"
      : variant;

    // Get helper text from state messages
    const computedHelperText =
      (typeof error === "string" ? error : "") ||
      (typeof success === "string" ? success : "") ||
      (typeof warning === "string" ? warning : "") ||
      helperText;

    const isDisabled = disabled || loading;
    const hasLeftIcon = leftIcon || loading;
    const hasRightIcon = rightIcon;

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {hasLeftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <span className="text-gray-400">{leftIcon}</span>
              )}
            </div>
          )}

          {/* Input Field */}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: computedVariant, size }),
              hasLeftIcon && "pl-10",
              hasRightIcon && "pr-10",
              className
            )}
            ref={ref}
            disabled={isDisabled}
            {...props}
          />

          {/* Right Icon */}
          {hasRightIcon && (
            <div
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2",
                onRightIconClick && "cursor-pointer hover:text-gray-600"
              )}
              onClick={onRightIconClick}
            >
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {computedHelperText && (
          <p
            className={cn(
              "text-xs",
              error
                ? "text-red-600 dark:text-red-400"
                : success
                ? "text-green-600 dark:text-green-400"
                : warning
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {computedHelperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
export type { InputProps };
export default Input;
