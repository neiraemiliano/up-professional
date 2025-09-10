import React from "react";
import { Link } from "react-router";
import { Building, Shield, Clock, Users, AlertTriangle, FileText } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Home Fixed</h1>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Términos y Condiciones</h2>
          <p className="text-gray-600 text-lg">
            Última actualización: {new Date().toLocaleDateString('es-AR')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">1. Introducción</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Bienvenido a Home Fixed, una plataforma digital que conecta clientes con profesionales 
              calificados para servicios del hogar en Argentina. Al utilizar nuestros servicios, 
              aceptas cumplir con estos términos y condiciones.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">2. Descripción del Servicio</h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                Home Fixed es una plataforma marketplace que facilita la conexión entre:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Clientes:</strong> Personas que buscan servicios profesionales para el hogar</li>
                <li><strong>Profesionales:</strong> Prestadores de servicios calificados y verificados</li>
              </ul>
              <p>
                Nuestra plataforma no presta servicios directamente, sino que actúa como intermediario 
                facilitando el contacto y la contratación entre las partes.
              </p>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">3. Responsabilidades del Usuario</h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Para todos los usuarios:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Proporcionar información veraz y actualizada</li>
                  <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                  <li>Usar la plataforma de manera responsable y legal</li>
                  <li>Respetar los derechos de otros usuarios</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Para profesionales:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Mantener las certificaciones y permisos requeridos</li>
                  <li>Cumplir con los estándares de calidad acordados</li>
                  <li>Responder a solicitudes en tiempo oportuno</li>
                  <li>Completar los trabajos según lo acordado</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payments and Fees */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">4. Pagos y Comisiones</h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                Los pagos por servicios se realizan directamente entre cliente y profesional. 
                Home Fixed puede cobrar una comisión por el uso de la plataforma según los 
                siguientes criterios:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Comisión por conexión exitosa entre cliente y profesional</li>
                <li>Tarifas por servicios premium (perfiles destacados, etc.)</li>
                <li>Todas las comisiones serán informadas claramente antes de su aplicación</li>
              </ul>
            </div>
          </section>

          {/* Liability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">5. Limitación de Responsabilidad</h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                Home Fixed actúa únicamente como intermediario. Por tanto:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>No nos hacemos responsables por la calidad de los servicios prestados</li>
                <li>No garantizamos la disponibilidad continua de profesionales</li>
                <li>Los usuarios son responsables de verificar credenciales y referencias</li>
                <li>Cualquier disputa debe resolverse directamente entre las partes involucradas</li>
              </ul>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">6. Privacidad y Datos</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              El tratamiento de datos personales se rige por nuestra{" "}
              <Link 
                to="/privacy" 
                className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
              >
                Política de Privacidad
              </Link>
              , que forma parte integral de estos términos.
            </p>
          </section>

          {/* Updates */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">7. Modificaciones</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán notificados a través de la plataforma y entrarán en vigor 
              inmediatamente después de su publicación.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">8. Legislación Aplicable</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Estos términos se rigen por las leyes de la República Argentina. 
              Cualquier disputa será sometida a la jurisdicción de los tribunales 
              competentes de la Ciudad Autónoma de Buenos Aires.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">Contacto</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Para consultas sobre estos términos y condiciones, puedes contactarnos a través de:
            </p>
            <div className="mt-3 space-y-1 text-gray-600">
              <p><strong>Email:</strong> legal@homefixed.com.ar</p>
              <p><strong>Teléfono:</strong> +54 11 1234-5678</p>
              <p><strong>Dirección:</strong> Buenos Aires, Argentina</p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;