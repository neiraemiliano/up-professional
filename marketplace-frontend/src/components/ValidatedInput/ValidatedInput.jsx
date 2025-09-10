import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { Input } from "../atoms/Input/Input";
import useRealTimeValidation from "../../hooks/useRealTimeValidation";

const ValidatedInput = ({ 
  validationRules = [], 
  showValidation = true,
  ...inputProps 
}) => {
  const { errors, isValid, suggestions } = useRealTimeValidation(
    inputProps.value, 
    validationRules
  );

  const getValidationIcon = () => {
    if (!inputProps.value) return null;
    
    if (isValid) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (errors.length > 0) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    
    return null;
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          {...inputProps}
          className={`${inputProps.className || ""} ${
            showValidation && inputProps.value ? 
              isValid ? "border-green-300 focus:border-green-500" :
              errors.length > 0 ? "border-red-300 focus:border-red-500" : ""
            : ""
          }`}
        />
        
        {showValidation && getValidationIcon() && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getValidationIcon()}
          </div>
        )}
      </div>

      {showValidation && inputProps.value && (
        <div className="space-y-1">
          {/* Errores */}
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          ))}

          {/* Sugerencias */}
          {suggestions.map((suggestion, index) => (
            <p key={index} className="text-sm text-blue-600 flex items-center gap-2">
              <Info className="w-4 h-4" />
              {suggestion}
            </p>
          ))}

          {/* Mensaje de éxito */}
          {isValid && (
            <p className="text-sm text-green-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              ¡Perfecto!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidatedInput;