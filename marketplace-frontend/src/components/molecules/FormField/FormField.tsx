// src/components/molecules/FormField/FormField.tsx
import React, { memo, forwardRef } from 'react';
import { Input, type InputProps } from '../../atoms/Input/Input';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// FormField variants using CVA
const formFieldVariants = cva(
  'space-y-2', // Base spacing
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
      },
      variant: {
        default: '',
        compact: 'space-y-1',
        spacious: 'space-y-3'
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'default'
    }
  }
);

// Label variants
const labelVariants = cva(
  'block font-medium text-gray-700 dark:text-gray-300',
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-base'
      },
      required: {
        true: 'after:content-["*"] after:ml-0.5 after:text-red-500',
        false: ''
      }
    },
    defaultVariants: {
      size: 'md',
      required: false
    }
  }
);

// Description variants
const descriptionVariants = cva(
  'text-gray-600 dark:text-gray-400',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-sm'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

// Error message variants
const errorVariants = cva(
  'text-red-600 dark:text-red-400 font-medium',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-sm'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

export interface FormFieldProps 
  extends Omit<InputProps, 'id'>,
    VariantProps<typeof formFieldVariants> {
  /** Unique identifier for the field */
  id: string;
  
  /** Field label */
  label?: string;
  
  /** Helper description text */
  description?: string;
  
  /** Error message to display */
  error?: string;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Additional className for the container */
  containerClassName?: string;
  
  /** Additional className for the label */
  labelClassName?: string;
  
  /** Additional className for the description */
  descriptionClassName?: string;
  
  /** Additional className for the error */
  errorClassName?: string;
}

/**
 * FormField - Molecule component combining Input atom with label, description, and error handling
 * 
 * Features:
 * - CVA-based variant system
 * - Accessibility with proper labeling
 * - Error state management
 * - Required field indication
 * - TypeScript support
 * - Forwardable ref
 */
const FormField = memo(forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    id,
    label,
    description,
    error,
    required = false,
    size = 'md',
    variant = 'default',
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    className,
    ...inputProps
  }, ref) => {
    // Determine input variant based on error state
    const inputVariant = error ? 'error' : inputProps.variant || 'default';
    
    return (
      <div className={cn(formFieldVariants({ size, variant }), containerClassName)}>
        {/* Label */}
        {label && (
          <label 
            htmlFor={id}
            className={cn(
              labelVariants({ size, required }),
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        
        {/* Description */}
        {description && !error && (
          <p 
            id={`${id}-description`}
            className={cn(
              descriptionVariants({ size }),
              descriptionClassName
            )}
          >
            {description}
          </p>
        )}
        
        {/* Input */}
        <Input
          ref={ref}
          id={id}
          variant={inputVariant}
          size={size}
          className={className}
          aria-describedby={cn(
            description && !error && `${id}-description`,
            error && `${id}-error`
          ).trim() || undefined}
          aria-invalid={error ? 'true' : undefined}
          {...inputProps}
        />
        
        {/* Error message */}
        {error && (
          <p 
            id={`${id}-error`}
            role="alert"
            className={cn(
              errorVariants({ size }),
              errorClassName
            )}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
));

FormField.displayName = 'FormField';

export { FormField };
export default FormField;