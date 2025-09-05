import { useFormik } from "formik";
import {
  ArrowRight,
  Building,
  Heart,
  Lock,
  Mail,
  MapPin,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { initialValues, validationSchema } from "../../config/forms/signInForm";
import { getText } from "../../config/texts/texts";
import { AuthContext } from "../../context/AuthContext";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import { InputField as Input } from "../base";
import Checkbox from "../template/form/input/Checkbox";
import Button from "../template/ui/button/Button";

export default function SignInForm() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const benefits = [
    {
      icon: Users,
      title: "Más de 15,000 usuarios",
      description: "La comunidad más grande de profesionales de Argentina",
    },
    {
      icon: Zap,
      title: "Conexión instantánea",
      description: "Conectate con clientes o profesionales al instante",
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Plataforma verificada y protegida para tu tranquilidad",
    },
  ];

  const testimonials = [
    {
      name: "Ana R.",
      location: "San Telmo, CABA",
      text: "Desde que uso Home Fixed, conseguir clientes es súper fácil.",
      rating: 5,
      avatar: "👩‍🎨",
    },
    {
      name: "Roberto S.",
      location: "Belgrano, CABA",
      text: "La mejor plataforma para encontrar profesionales confiables.",
      rating: 5,
      avatar: "👨‍💼",
    },
  ];

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await authContext.login(values);

        // Obtener el usuario actualizado del contexto
        const user = JSON.parse(localStorage.getItem("user"));

        // Check if there's a return URL from ReviewForm or other components
        const returnTo =
          location.state?.returnTo || location.state?.from?.pathname;

        // Redirección basada en el rol del usuario
        let redirectTo;
        if (returnTo) {
          // If there's a specific return URL, use it
          redirectTo = returnTo;
        } else if (user?.role === "admin") {
          redirectTo = "/admin";
        } else if (user?.role === "professional") {
          redirectTo = "/professional-dashboard";
        } else if (user?.role === "customer") {
          redirectTo = "/customer-dashboard";
        } else {
          redirectTo = "/";
        }

        navigate(redirectTo, { replace: true });
      } catch (error) {
        console.error("Login form error:", error);
        const errorMessage = error?.message || "Error de autenticación";
        setErrors({ password: errorMessage });
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
                  ¡Bienvenido de vuelta!
                </span>
                <br />
                Te extrañamos
              </h2>

              <p className="text-white/90 text-lg leading-relaxed">
                Miles de profesionales y clientes confían en Home Fixed todos
                los días.
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
                Usuarios felices:
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

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="text-white font-bold mb-4 text-center">
                Conectamos cada día:
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-orange-300">500+</div>
                  <div className="text-white/80 text-xs">Nuevas conexiones</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-300">98%</div>
                  <div className="text-white/80 text-xs">Satisfacción</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-300">2hs</div>
                  <div className="text-white/80 text-xs">
                    Respuesta promedio
                  </div>
                </div>
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
                <Heart className="w-4 h-4" />
                <span>¡Nos alegramos de verte!</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 mb-3">
                Iniciá sesión
              </h2>
              <p className="text-gray-600 text-lg">
                Accedé a tu cuenta y seguí conectando con la mejor comunidad
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
                  O continuá con tu email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Email */}
              <Input
                id="email"
                name="email"
                label={getText("email")}
                type="email"
                placeholder={getText("emailPlaceholder")}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && formik.errors.email}
                hint={formik.touched.email && formik.errors.email}
                leftIcon={Mail}
                required
              />

              {/* Password */}
              <Input
                id="password"
                name="password"
                label={getText("password")}
                type={showPassword ? "text" : "password"}
                placeholder={getText("passwordPlaceholder")}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && formik.errors.password}
                hint={formik.touched.password && formik.errors.password}
                leftIcon={Lock}
                rightIcon={showPassword ? EyeIcon : EyeCloseIcon}
                onRightIconClick={() => setShowPassword(!showPassword)}
                required
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={isChecked}
                    onChange={setIsChecked}
                    className="w-5 h-5 accent-orange-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {getText("rememberMe")}
                  </span>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors"
                >
                  {getText("forgotPassword")}
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <span className="relative z-10 flex items-center justify-center gap-3">
                  {formik.isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Ingresando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      ⚡ INICIAR SESIÓN
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </span>
              </Button>

              {/* Security indicators */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Conexión segura</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>Datos protegidos</span>
                  </div>
                </div>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {getText("noAccount")}{" "}
                <Link
                  to="/signup"
                  className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors"
                >
                  {getText("signUp")}
                </Link>
              </p>
            </div>

            {/* Quick Access for Mobile */}
            <div className="lg:hidden mt-8 p-4 bg-orange-50 rounded-xl border border-orange-200">
              <h3 className="font-semibold text-gray-800 mb-2 text-center">
                ¿Nuevo en Home Fixed?
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-2xl mb-1">+15K</div>
                  <div className="text-xs text-gray-600">Usuarios</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">4.9⭐</div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
