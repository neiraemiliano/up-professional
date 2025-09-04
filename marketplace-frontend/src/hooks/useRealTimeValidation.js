import { useState, useEffect } from "react";

const useRealTimeValidation = (value, validationRules = []) => {
  const [errors, setErrors] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const validateValue = () => {
      const newErrors = [];
      const newSuggestions = [];

      validationRules.forEach(rule => {
        const result = rule.validate(value);
        if (!result.isValid) {
          newErrors.push(result.message);
        }
        if (result.suggestion) {
          newSuggestions.push(result.suggestion);
        }
      });

      setErrors(newErrors);
      setSuggestions(newSuggestions);
      setIsValid(newErrors.length === 0 && value !== "");
    };

    // Solo validar si hay contenido
    if (value) {
      const debounceTimer = setTimeout(validateValue, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setErrors([]);
      setSuggestions([]);
      setIsValid(false);
    }
  }, [value, validationRules]);

  return { errors, isValid, suggestions };
};

// Reglas de validación comunes
export const validationRules = {
  email: {
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return {
        isValid: emailRegex.test(value),
        message: emailRegex.test(value) ? "" : "Ingresa un email válido",
        suggestion: !emailRegex.test(value) && value.includes("@") ? 
          "Verifica que tenga el formato correcto: ejemplo@dominio.com" : null
      };
    }
  },
  
  phone: {
    validate: (value) => {
      const cleanPhone = value.replace(/\D/g, "");
      const isArgentinePhone = /^(11|15|2\d|3\d|4\d|5\d|6\d|7\d|8\d|9\d)\d{8}$/.test(cleanPhone);
      
      return {
        isValid: isArgentinePhone,
        message: isArgentinePhone ? "" : "Ingresa un teléfono argentino válido",
        suggestion: cleanPhone.length < 10 ? 
          "Los teléfonos argentinos tienen 10 dígitos" : 
          cleanPhone.length > 10 ? "Elimina el código de país (54)" : null
      };
    }
  },
  
  description: {
    validate: (value) => {
      const wordCount = value.trim().split(/\s+/).length;
      const hasDetails = /(?:cuanto|cuando|donde|como|que|necesito|quiero|urgente|hoy)/i.test(value);
      
      return {
        isValid: wordCount >= 5 && hasDetails,
        message: wordCount < 5 ? "Describe tu problema con más detalle" : 
                !hasDetails ? "Incluye más información específica" : "",
        suggestion: wordCount < 5 ? "Agrega qué necesitas, cuándo y dónde" :
                   !hasDetails ? "Menciona urgencia, fechas o detalles específicos" : null
      };
    }
  },

  password: {
    validate: (value) => {
      const hasMinLength = value.length >= 8;
      const hasNumber = /\d/.test(value);
      const hasLetter = /[a-zA-Z]/.test(value);
      
      const isValid = hasMinLength && hasNumber && hasLetter;
      
      return {
        isValid,
        message: !hasMinLength ? "Mínimo 8 caracteres" :
                !hasNumber ? "Debe incluir números" :
                !hasLetter ? "Debe incluir letras" : "",
        suggestion: !isValid ? "Usa una combinación de letras y números" : null
      };
    }
  }
};

export default useRealTimeValidation;