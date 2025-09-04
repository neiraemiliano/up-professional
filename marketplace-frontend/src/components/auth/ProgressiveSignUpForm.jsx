import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Input from "../template/form/input/InputField";
import { getText } from "../../config/texts/texts";
import { useFormik } from "formik";
import { initialValues } from "../../config/forms/signUpForm";
import useAuth from "../../hooks/context/useAuth";
import Button from "../template/ui/button/Button";
import CustomSelect from "../Select/CustomSelect";
import ProgressSteps from "../ProgressSteps/ProgressSteps";
import * as Yup from "yup";

const stepValidationSchemas = [
  // Paso 1: Datos básicos
  Yup.object({
    email: Yup.string().email("Email inválido").required("Email es requerido"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña es requerida"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
      .required("Confirma tu contraseña"),
  }),
  // Paso 2: Información personal
  Yup.object({
    name: Yup.string().required("Nombre es requerido"),
    lastName: Yup.string().required("Apellido es requerido"),
    phone: Yup.string().required("Teléfono es requerido"),
    role: Yup.string().required("Selecciona tu rol"),
  }),
];

export default function ProgressiveSignUpForm() {
  const authContext = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const steps = ["Cuenta", "Perfil"];

  const options = [
    { value: "customer", name: getText("client") },
    { value: "professional", name: getText("professional") },
  ];

  const formik = useFormik({
    initialValues,
    validationSchema: stepValidationSchemas[currentStep],
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (currentStep < steps.length - 1) {
        // Ir al siguiente paso
        setCurrentStep(currentStep + 1);
        formik.setTouched({});
      } else {
        // Registro final
        try {
          delete values.confirmPassword;
          await authContext.register(values);
          navigate("/");
        } catch (error) {
          setErrors({ password: error.message || "Error de autenticación" });
        } finally {
          setSubmitting(false);
        }
      }
    },
  });

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      formik.setTouched({});
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="space-y-5">
              <div>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  label={getText("email")}
                  placeholder={getText("emailPlaceholder")}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={formik.touched.email}
                  hint={formik.touched.email && formik.errors.email}
                />
              </div>

              <div className="relative">
                <Input
                  name="password"
                  label={getText("password")}
                  placeholder={getText("passwordPlaceholder")}
                  type={showPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={formik.touched.password}
                  hint={formik.touched.password && formik.errors.password}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-12"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>

              <div className="relative">
                <Input
                  name="confirmPassword"
                  label={getText("confirmPassword")}
                  placeholder={getText("confirmPasswordPlaceholder")}
                  type={showPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                  error={formik.touched.confirmPassword}
                  hint={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
              </div>
            </div>
          </>
        );

      case 1:
        return (
          <>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  label={getText("name")}
                  placeholder={getText("namePlaceholder")}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  error={formik.touched.name}
                  hint={formik.touched.name && formik.errors.name}
                />
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  label={getText("lastName")}
                  placeholder={getText("lastNamePlaceholder")}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  error={formik.touched.lastName}
                  hint={formik.touched.lastName && formik.errors.lastName}
                />
              </div>

              <div>
                <Input
                  type="phone"
                  id="phone"
                  name="phone"
                  label={getText("Phone")}
                  placeholder={getText("phonePlaceholder")}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  error={formik.touched.phone}
                  hint={formik.touched.phone && formik.errors.phone}
                />
              </div>

              <div>
                <CustomSelect
                  id="role"
                  name="role"
                  label={getText("whoYouAre")}
                  placeholder={getText("whoYouAre")}
                  options={options}
                  className="dark:bg-dark-900"
                  value={options.find((op) => op.value === formik.values.role) ?? null}
                  onChange={(option) => {
                    formik.setFieldValue("role", option?.value ?? "");
                    formik.setFieldTouched("role", true);
                  }}
                  error={formik.touched.role}
                  hint={formik.touched.role && formik.errors.role}
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ChevronLeftIcon className="size-5" />
          {getText("backToDashboard")}
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            {getText("signUp")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>

        <ProgressSteps steps={steps} currentStep={currentStep} />

        {/* Botón de Google solo en el primer paso */}
        {currentStep === 0 && (
          <>
            <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"/>
                <path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"/>
                <path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"/>
                <path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"/>
              </svg>
              {getText("signInWithGoogle")}
            </button>

            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white">
                  {getText("or")}
                </span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={formik.handleSubmit}>
          {renderStep()}

          <div className="flex gap-3 mt-6">
            {currentStep > 0 && (
              <Button
                type="button"
                onClick={handleBack}
                className="flex-1 px-4 py-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Atrás
              </Button>
            )}
            
            <Button
              type="submit"
              className={`px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 ${
                currentStep > 0 ? "flex-1" : "w-full"
              }`}
            >
              {currentStep < steps.length - 1 ? "Continuar" : getText("signUp")}
            </Button>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 sm:text-start">
            {getText("alreadyHaveAccount")} {""}
            <Link
              to="/signin"
              className="text-brand-500 hover:text-brand-600"
            >
              {getText("signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}