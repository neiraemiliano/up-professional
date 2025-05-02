import React from "react";
import {
  FileText,
  Users,
  CheckCircle,
  MessageCircle,
  Menu,
  Sun,
} from "lucide-react";

/**
 * HomeCustomer – Landing page para clientes
 * Colores principales basados en el login: morado #512ab3 (primary) y blanco
 * Usa Tailwind para layout y tipografía coherente con la maqueta
 */
export default function HomeCustomer() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* ===== Header ===== */}
      <header className="w-full flex items-center justify-between px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Menu className="w-6 h-6 text-violet-700 lg:hidden" />
          <h1 className="text-2xl font-bold text-violet-700">UpProfessional</h1>
        </div>
        <nav className="hidden lg:flex items-center gap-8 font-medium">
          <a href="#buscar" className="hover:text-violet-700 transition-colors">
            Buscar profesional
          </a>
          <a
            href="#presupuesto"
            className="hover:text-violet-700 transition-colors"
          >
            Solicitar presupuesto
          </a>
          <a href="#faq" className="hover:text-violet-700 transition-colors">
            FAQ
          </a>
        </nav>
        <button className="bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-md hidden sm:block whitespace-nowrap transition-colors">
          Soy profesional
        </button>
      </header>

      {/* ===== Hero ===== */}
      <section
        className="relative isolate overflow-hidden bg-white py-20"
        id="buscar"
      >
        {/* Grid overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[length:60px_60px] bg-grid-violet-100"
        />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Encontrá al
            <br className="sm:hidden" /> profesional ideal
            <br /> para tu proyecto
          </h2>
          <p className="max-w-2xl mx-auto text-lg mb-10">
            Más de{" "}
            <span className="font-semibold text-violet-700">
              10.000 profesionales verificados
            </span>{" "}
            listos para ayudarte.
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-3xl mx-auto">
            <select className="flex-1 border border-gray-300 rounded-md px-4 py-3 focus:outline-violet-700">
              <option disabled selected>
                Tipo de servicio
              </option>
              <option>Electricista</option>
              <option>Plomero</option>
              <option>Gasista</option>
              <option>Carpintero</option>
            </select>
            <input
              type="text"
              placeholder="Zona / Localidad"
              className="flex-1 border border-gray-300 rounded-md px-4 py-3 focus:outline-violet-700"
            />
            <button className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-3 rounded-md whitespace-nowrap transition-colors">
              Buscar profesional
            </button>
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="bg-violet-700 text-white py-20" id="como-funciona">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-12">¿Cómo funciona?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <Step icon={FileText} title="Contanos" desc="qué necesitás" />
            <Step icon={Users} title="Recibí" desc="propuestas" />
            <Step icon={CheckCircle} title="Elegí" desc="el mejor" />
            <Step icon={MessageCircle} title="Contactá" desc="directamente" />
          </div>
        </div>
      </section>

      {/* ===== Quick request form ===== */}
      <section className="py-20 bg-white" id="presupuesto">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-8 text-violet-700">
            ¿Necesitás un presupuesto rápido?
          </h3>
          <p className="mb-8 text-gray-600">
            Dejá tu consulta y en minutos recibirás cotizaciones sin compromiso.
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Describí tu necesidad"
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-violet-700"
            />
            <input
              type="text"
              placeholder="¿Dónde?"
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-violet-700"
            />
            <input
              type="text"
              placeholder="Email o WhatsApp"
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-violet-700"
            />
            <button
              type="submit"
              className="w-full bg-violet-700 hover:bg-violet-800 text-white py-3 rounded-md font-medium transition-colors"
            >
              Solicitar presupuesto
            </button>
          </form>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="bg-violet-50 py-20" id="testimonios">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-12 text-violet-700">
            Lo que dicen nuestros usuarios
          </h3>
          <blockquote className="text-gray-700 italic max-w-2xl mx-auto">
            “Pedí un gasista y en 15 minutos tenía 3 presupuestos. La
            experiencia fue excelente, ¡lo super recomiendo!”
            <span className="block mt-4 not-italic font-semibold">
              — Carla G.
            </span>
          </blockquote>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-violet-700 text-violet-100 py-6 text-center text-sm">
        <p>© 2025 UpProfessional. Todos los derechos reservados.</p>
        <div className="mt-2 flex gap-2 justify-center">
          <Sun className="w-4 h-4" />
          <span>Hecho con pasión</span>
        </div>
      </footer>
    </div>
  );
}

function Step({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Icon className="w-12 h-12 mb-4" />
      <p className="font-semibold text-xl leading-tight">
        {title} <br /> <span className="font-normal text-lg">{desc}</span>
      </p>
    </div>
  );
}
