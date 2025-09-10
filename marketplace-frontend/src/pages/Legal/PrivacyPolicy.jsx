import React from "react";
import { Link } from "react-router";
import { Building, Shield, Lock, Eye, Database, UserCheck, Globe, FileText } from "lucide-react";

const PrivacyPolicy = () => {
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
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Política de Privacidad</h2>
          <p className="text-gray-600 text-lg">
            Última actualización: {new Date().toLocaleDateString('es-AR')}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">1. Introducción</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              En Home Fixed valoramos tu privacidad y estamos comprometidos con la protección 
              de tus datos personales. Esta política explica cómo recopilamos, usamos, 
              almacenamos y protegemos tu información personal de acuerdo con las leyes 
              argentinas de protección de datos.
            </p>
          </section>

          {/* Information Collection */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">2. Información que Recopilamos</h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Información que nos proporcionas:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Datos de registro: nombre, apellido, email, teléfono</li>
                  <li>Información de perfil: descripción, habilidades, ubicación</li>
                  <li>Documentos de verificación para profesionales</li>
                  <li>Comunicaciones que mantienes con nosotros</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Información recopilada automáticamente:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Datos de uso de la plataforma</li>
                  <li>Información del dispositivo y navegador</li>
                  <li>Dirección IP y ubicación general</li>
                  <li>Cookies y tecnologías similares</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">3. Cómo Utilizamos tu Información</h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Utilizamos tu información para:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Facilitar la conexión entre clientes y profesionales</li>
                <li>Verificar la identidad y credenciales de los usuarios</li>
                <li>Procesar pagos y transacciones</li>
                <li>Enviar notificaciones importantes sobre el servicio</li>
                <li>Mejorar la plataforma y desarrollar nuevas funcionalidades</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
                <li>Prevenir fraudes y garantizar la seguridad</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">4. Compartir Información</h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Podemos compartir tu información en las siguientes circunstancias:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Entre usuarios:</strong> Información de perfil visible para facilitar conexiones</li>
                <li><strong>Proveedores de servicios:</strong> Para procesamiento de pagos y servicios técnicos</li>
                <li><strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o autoridades competentes</li>
                <li><strong>Protección de derechos:</strong> Para proteger nuestros derechos, usuarios y plataforma</li>
              </ul>
              <p className="font-semibold text-gray-800 mt-4">
                Nunca vendemos tu información personal a terceros.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">5. Seguridad de los Datos</h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Implementamos medidas de seguridad técnicas y organizacionales para proteger tu información:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Encriptación de datos sensibles en tránsito y reposo</li>
                <li>Autenticación de dos factores disponible</li>
                <li>Acceso restringido a datos personales por personal autorizado</li>
                <li>Auditorías regulares de seguridad</li>
                <li>Servidores seguros con protección contra intrusiones</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">6. Tus Derechos</h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>De acuerdo con la legislación argentina, tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Acceso:</strong> Solicitar información sobre los datos que tenemos sobre ti</li>
                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos personales</li>
                <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos en ciertos casos</li>
                <li><strong>Limitación:</strong> Restringir el procesamiento de tus datos</li>
              </ul>
              <p className="mt-3">
                Para ejercer estos derechos, contáctanos en: <strong>privacy@homefixed.com.ar</strong>
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">7. Cookies y Tecnologías Similares</h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Utilizamos cookies y tecnologías similares para:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Mantener tu sesión iniciada</li>
                <li>Recordar tus preferencias</li>
                <li>Analizar el uso de la plataforma</li>
                <li>Personalizar tu experiencia</li>
              </ul>
              <p>
                Puedes controlar las cookies a través de la configuración de tu navegador. 
                Sin embargo, deshabilitar ciertas cookies puede afectar la funcionalidad de la plataforma.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">8. Retención de Datos</h3>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Conservamos tu información personal mientras:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Tu cuenta esté activa</li>
                <li>Sea necesario para proporcionar nuestros servicios</li>
                <li>Tengamos obligaciones legales de conservación</li>
                <li>Sea necesario para resolver disputas o hacer cumplir acuerdos</li>
              </ul>
              <p>
                Una vez que elimines tu cuenta, procederemos a eliminar o anonimizar 
                tu información personal, salvo que estemos obligados a conservarla por ley.
              </p>
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">9. Transferencias Internacionales</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              En caso de transferir datos fuera de Argentina, garantizamos que se implementen 
              las medidas de protección adecuadas conforme a la legislación local y los 
              estándares internacionales de protección de datos.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">10. Cambios en esta Política</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos 
              sobre cambios significativos a través de la plataforma o por email. 
              Te recomendamos revisar esta página periódicamente.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-600" />
              <h3 className="text-2xl font-bold text-gray-800">Contacto</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Si tienes preguntas sobre esta política de privacidad o el tratamiento de tus datos:
            </p>
            <div className="mt-3 space-y-1 text-gray-600">
              <p><strong>Email:</strong> privacy@homefixed.com.ar</p>
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

export default PrivacyPolicy;