import React from "react";
import { Menu, Users, CheckCircle, UserPlus, DollarSign } from "lucide-react";
import { Link } from "react-router";
import { getText } from "../../config/texts/texts";

export default function ProfessionalLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header */}

      <header className="absolute inset-x-0 top-0 z-20 flex items-center px-16 py-10">
        <div className="flex items-center gap-3">
          <Menu className="w-6 h-6 lg:hidden text-white" />
          <Link
            to="/"
            className="flex items-center align-top gap-2 font-bold text-2xl lg:text-6xl text-white"
          >
            UpProfessional
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col lg:flex-row lg:min-h-[100vh]">
        {/* Text Column */}
        <div className="bg-violet-900 text-white flex-1 flex flex-col justify-center py-20 gap-6">
          <div className="flex flex-col items-start gap-10 px-16 lg:w-full">
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-md">
              ¿Sos <br className="sm:hidden" /> profesional?
            </h2>
            <p className="text-lg max-w-md">
              Conseguí más clientes mostrando tus servicios en nuestra
              plataforma.
            </p>
            <ul className="space-y-2 text-base max-w-md">
              <li className="flex gap-2 items-start">
                <CheckCircle className="w-5 h-5 mt-0.5" />
                Accedé a oportunidades de trabajo cerca tuyo
              </li>
              <li className="flex gap-2 items-start">
                <CheckCircle className="w-5 h-5 mt-0.5" />
                Conectá con personas que buscan tus habilidades
              </li>
              <li className="flex gap-2 items-start">
                <CheckCircle className="w-5 h-5 mt-0.5" />
                Creá y gestioná tu perfil profesional
              </li>
            </ul>
            <div className="flex flex-col gap-4 min-w-md">
              <Link
                to="/signup"
                className="inline-block bg-white text-violet-900 px-6 py-3 rounded-md font-medium shadow hover:bg-violet-50 transition-colors lg:w-full sm:w-auto text-center"
              >
                {getText("signUp")}
              </Link>
              <p className="text-sm text-white-700 text-center lg:w-full">
                <span className="mr-2">¿Ya tenés una cuenta?</span>
                <a
                  href="/signin"
                  className="text-white font-bold hover:underline"
                >
                  Iniciar sesión
                </a>
              </p>
            </div>
          </div>
        </div>
        {/* Image Column */}
        <div
          className="flex-1 h-full lg:h-auto bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/professional-landing.png')",
          }}
          aria-hidden
        />
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-14 text-violet-900">
            Cómo funciona
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <Step
              icon={UserPlus}
              number={1}
              title="Creá un perfil"
              desc="Enlistá los servicios que ofrecés"
            />
            <Step
              icon={Users}
              number={2}
              title="Recibí solicitudes"
              desc="Respondé a clientes interesados"
            />
            <Step
              icon={DollarSign}
              number={3}
              title="Hacé un trabajo y cobrá"
              desc="Realizá el trabajo y cobrá por él"
            />
          </div>
          <p className="mt-16 text-sm text-gray-700">
            <span className="mr-2">¿Ya tenés una cuenta?</span>
            <a
              href="/signin"
              className="text-violet-900 font-medium hover:underline"
            >
              Iniciar sesión
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-violet-900 text-violet-100 py-6 text-center text-sm">
        © 2025 UpProfessional. Todos los derechos reservados.
      </footer>
    </div>
  );
}

/**
 * Step component – icon + number + title + desc
 */
function Step({ icon: Icon, number, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs mx-auto">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center">
          <Icon className="w-8 h-8 text-violet-900" />
        </div>
        <span className="absolute -top-2 -right-2 bg-violet-900 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-semibold">
          {number}
        </span>
      </div>
      <p className="text-lg font-semibold mb-1">{title}</p>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}
