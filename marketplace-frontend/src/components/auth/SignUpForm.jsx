import { useFormik } from "formik";
import {
  ArrowRight,
  Building,
  Clock,
  Heart,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Star,
  User,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { initialValues, validationSchema } from "../../config/forms/signUpForm";
import { getText } from "../../config/texts/texts";
import useAuth from "../../hooks/context/useAuth";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import { InputField as Input } from "../base";
import CustomSelect from "../Select/CustomSelect";
import Checkbox from "../template/form/input/Checkbox";
import Button from "../template/ui/button/Button";

export default function SignUpForm() {
  const authContext = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const options = [
    {
      value: "customer",
      name: "🏠 " + getText("client") + " (Busco profesionales)",
    },
    {
      value: "professional",
      name: "🔧 " + getText("professional") + " (Ofrezco servicios)",
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: "Más de 15,000 usuarios",
      description: "Conectate con la comunidad más grande de Argentina",
    },
    {
      icon: Shield,
      title: "100% Verificado",
      description: "Todos nuestros profesionales están verificados",
    },
    {
      icon: Zap,
      title: "Súper rápido",
      description: "Respuestas en menos de 2 horas garantizadas",
    },
  ];

  const testimonials = [
    {
      name: "María G.",
      location: "Palermo, CABA",
      text: "¡Increíble plataforma! Encontré al profesional perfecto.",
      rating: 5,
      avatar: "👩‍💼",
    },
    {
      name: "Carlos M.",
      location: "Villa Crespo, CABA",
      text: "Como profesional, mis ingresos aumentaron un 180%.",
      rating: 5,
      avatar: "👨‍🔧",
    },
  ];

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        delete values.confirmPassword;
        await authContext.register(values);

        // Check if professional needs onboarding
        const requiresOnboarding = localStorage.getItem("requiresOnboarding");

        if (values.role === "professional") {
          if (requiresOnboarding) {
            localStorage.removeItem("requiresOnboarding");
            navigate("/professional-onboarding", {
              state: { userData: authContext.user },
            });
          } else {
            // Professional registered successfully, go to professional dashboard
            navigate("/professional-dashboard");
          }
        } else if (values.role === "customer") {
          navigate("/customer-dashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        setErrors({ password: error.message || "Error de autenticación" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/20 to-red-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Benefits & Testimonials */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-gray-900 via-orange-900 to-red-900 text-white p-12 flex-col justify-center relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red-500/20 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10 space-y-12">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Home Fixed</h1>
                  <p className="text-white/80 text-sm">
                    Tu marketplace de confianza
                  </p>
                </div>
              </div>

              <h2 className="text-4xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent">
                  ¡Unite a la comunidad
                </span>
                <br />
                más grande de Argentina
              </h2>

              <p className="text-white/90 text-lg leading-relaxed">
                Miles de profesionales y clientes ya confían en nosotros para
                conectar y hacer negocios.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                    <benefit.icon className="w-6 h-6 text-orange-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-orange-300 mb-4">
                Lo que dicen nuestros usuarios:
              </h3>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-white/70 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location}
                      </p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/90 text-sm italic">
                    "{testimonial.text}"
                  </p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-orange-300">+15K</div>
                <div className="text-white/80 text-xs">Usuarios activos</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-orange-300">4.9⭐</div>
                <div className="text-white/80 text-xs">Calificación</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col justify-center p-6 lg:p-12 relative z-10">
          <div className="w-full max-w-md mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                {getText("backToDashboard")}
              </Link>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Home Fixed</h1>
              </div>
            </div>

            {/* Form Header */}
            <div className="mb-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-orange-200">
                <Sparkles className="w-4 h-4" />
                <span>¡Registro 100% gratis!</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 mb-3">
                Creá tu cuenta
              </h2>
              <p className="text-gray-600 text-lg">
                Empezá a conectar con profesionales o clientes en menos de 2
                minutos
              </p>
            </div>

            {/* Google Button */}
            <div className="mb-6">
              <button className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 text-sm font-semibold text-gray-700 transition-all bg-white rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                {getText("signInWithGoogle")}
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-500 bg-white">
                  {getText("or")}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  label={getText("name")}
                  placeholder={getText("namePlaceholder")}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && formik.errors.name}
                  hint={formik.touched.name && formik.errors.name}
                  leftIcon={User}
                  required
                />
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  label={getText("lastName")}
                  placeholder={getText("lastNamePlaceholder")}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && formik.errors.lastName}
                  hint={formik.touched.lastName && formik.errors.lastName}
                  leftIcon={User}
                  required
                />
              </div>

              {/* Email */}
              <Input
                type="email"
                id="email"
                name="email"
                label={getText("email")}
                placeholder={getText("emailPlaceholder")}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && formik.errors.email}
                hint={formik.touched.email && formik.errors.email}
                leftIcon={Mail}
                required
              />

              {/* Phone */}
              <Input
                type="tel"
                id="phone"
                name="phone"
                label={getText("Phone")}
                placeholder="+54 9 11 1234-5678"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && formik.errors.phone}
                hint={formik.touched.phone && formik.errors.phone}
                leftIcon={Phone}
                required
              />

              {/* Role */}
              <CustomSelect
                id="role"
                name="role"
                label={getText("whoYouAre")}
                placeholder="Selecciona tu tipo de cuenta"
                options={options}
                leftIcon={UserCheck}
                value={
                  options.find((op) => op.value === formik.values.role) ?? null
                }
                onChange={(option) => {
                  formik.setFieldValue("role", option?.value ?? "");
                  formik.setFieldTouched("role", true);
                }}
                error={formik.touched.role && formik.errors.role}
                hint={formik.touched.role && formik.errors.role}
              />

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="password"
                  name="password"
                  label={getText("password")}
                  placeholder={getText("passwordPlaceholder")}
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && formik.errors.password}
                  hint={formik.touched.password && formik.errors.password}
                  leftIcon={Lock}
                  rightIcon={showPassword ? EyeIcon : EyeCloseIcon}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  required
                />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  label={getText("confirmPassword")}
                  placeholder={getText("confirmPasswordPlaceholder")}
                  type={showPassword ? "text" : "password"}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  hint={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  leftIcon={Lock}
                  required
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  className="w-5 h-5 mt-1 accent-orange-500"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="text-sm text-gray-600 leading-relaxed">
                  Al crear una cuenta aceptás nuestros{" "}
                  <Link
                    to="/terms"
                    className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
                  >
                    Términos y Condiciones
                  </Link>{" "}
                  y nuestra{" "}
                  <Link
                    to="/privacy"
                    className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
                  >
                    Política de Privacidad
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isChecked || formik.isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <span className="relative z-10 flex items-center justify-center gap-3">
                  {formik.isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      🚀 CREAR CUENTA GRATIS
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </span>
              </Button>

              {/* Benefits below button */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>100% Seguro</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Setup en 2 min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span>Gratis siempre</span>
                  </div>
                </div>
              </div>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {getText("alreadyHaveAccount")}{" "}
                <Link
                  to="/signin"
                  className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors"
                >
                  {getText("signIn")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
