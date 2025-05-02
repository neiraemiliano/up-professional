// src/config/texts.ts

// 1️⃣ Objeto con textos por defecto. Agrega aquí todas las claves y sus valores.
export const defaultTexts = {
  appTitle: "Up Professional",
  loading: "Cargando",
  signIn: "Iniciar sesión",
  signInDescription: "Ingresa tu email y contraseña para iniciar sesión",
  signInWithGoogle: "Iniciar sesión con Google",
  emailPlaceholder: "Ingrese tu email",
  passwordPlaceholder: "Ingrese su contraseña",
  rememberMe: "Mantener sesión activa",
  forgotPassword: "¿Olvidaste tu contraseña?",
  noAccount: "¿No tienes una cuenta?",
  signUp: "Regístrate",
  backToDashboard: "Volver al Inicio",
  signUpDescription: "Crea tu cuenta para comenzar",
  namePlaceholder: "Ingrese su nombre",
  lastNamePlaceholder: "Ingrese su apellido",
  or: "o",
  name: "Nombre",
  lastName: "Apellido",
  email: "Email",
  password: "Contraseña",
  confirmPassword: "Confirmar contraseña",
  signUpWithGoogle: "Registrate con Google",
  alreadyHaveAccount: "¿Ya tienes una cuenta?",
  confirmPasswordPlaceholder: "Confirma tu contraseña",
  selectOption: "Selecciona una opción",
  client: "Cliente",
  professional: "Profesional",
  admin: "Administrador",
  whoYouAre: "¿Que tipo de usuario eres?",
  serviceType: "Tipo de servicio",
  zone: "Zona",

  // ... añade más textos según necesidad
} as const;

// 2️⃣ Tipo de las claves para autocompletado y seguridad de tipos
export type TextKey = keyof typeof defaultTexts;

// 3️⃣ Función para obtener el texto por clave
export function getText(key: TextKey): string {
  return defaultTexts[key] ?? key;
}
