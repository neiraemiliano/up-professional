import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { 
  Shield, 
  Lock,
  Mail,
  EyeIcon,
  EyeOffIcon,
  AlertCircle,
  UserCheck,
  Settings,
  BarChart3,
  Users
} from "lucide-react";
// import { InputField as Input } from "../../components/base";
import { useFormik } from "formik";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../../components/atoms/Button/Button";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Email inválido")
    .required("El email es requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});

export default function AdminLogin() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await authContext.login(values);
        
        // Obtener el usuario del contexto
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        
        // Verificar que sea admin
        if (user?.role !== 'admin') {
          setErrors({ 
            password: "Acceso denegado. Solo administradores pueden acceder a esta área." 
          });
          authContext.logout(); // Logout si no es admin
          return;
        }
        
        // Redirigir al admin dashboard
        navigate('/admin', { replace: true });
      } catch (error) {
        console.error("Admin login error:", error);
        const errorMessage = (error as any)?.message || "Error de autenticación";
        setErrors({ password: errorMessage });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-red-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-gray-300">Ingresa con tu cuenta de administrador</p>
          </div>

          {/* Admin Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <Users className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <span className="text-xs text-gray-300">Usuarios</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <BarChart3 className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <span className="text-xs text-gray-300">Métricas</span>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <Settings className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <span className="text-xs text-gray-300">Configuración</span>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email de Administrador
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-12 pr-4 py-4 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-400 focus:ring-red-400/50"
                        : "border-white/20 focus:border-orange-400 focus:ring-orange-400/50"
                    }`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-12 pr-12 py-4 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-400 focus:ring-red-400/50"
                        : "border-white/20 focus:border-orange-400 focus:ring-orange-400/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {formik.isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    Acceder al Panel
                  </>
                )}
              </Button>
            </form>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Acceso restringido solo para administradores autorizados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}