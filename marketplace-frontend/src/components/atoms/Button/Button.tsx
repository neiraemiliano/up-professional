import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Enterprise-grade button variants using CVA for type safety and consistency
const buttonVariants = cva(
  // Base styles - common to all buttons
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: 
          "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600 focus-visible:ring-orange-500",
        secondary: 
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        outline: 
          "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
        ghost: 
          "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
        destructive: 
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
        success: 
          "bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-500",
        warning: 
          "bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-500",
        link: 
          "text-orange-500 underline-offset-4 hover:underline focus-visible:ring-orange-500"
      },
      size: {
        xs: "h-8 px-3 text-xs",
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-12 px-8 text-lg",
        xl: "h-14 px-10 text-xl",
        icon: "h-9 w-9"
      },
      fullWidth: {
        true: "w-full"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Button content */
  children?: React.ReactNode;
  /** Icon before text */
  startIcon?: React.ReactNode;
  /** Icon after text */
  endIcon?: React.ReactNode;
  /** Loading state with spinner */
  loading?: boolean;
  /** Loading text override */
  loadingText?: string;
  /** Render as child component */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    children, 
    startIcon, 
    endIcon, 
    loading = false,
    loadingText,
    disabled,
    asChild = false,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    
    // Loading spinner component
    const LoadingSpinner = () => (
      <svg 
        className="animate-spin h-4 w-4" 
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
    );

    // Button content with conditional loading state
    const ButtonContent = () => (
      <>
        {loading ? (
          <>
            <LoadingSpinner />
            {loadingText || children}
          </>
        ) : (
          <>
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {children}
            {endIcon && <span className="ml-2">{endIcon}</span>}
          </>
        )}
      </>
    );

    // For composition patterns (asChild)
    if (asChild) {
      return React.cloneElement(
        React.Children.only(children as React.ReactElement),
        {
          className: cn(buttonVariants({ variant, size, fullWidth }), className),
          disabled: isDisabled,
          ref,
          ...props
        }
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        <ButtonContent />
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;