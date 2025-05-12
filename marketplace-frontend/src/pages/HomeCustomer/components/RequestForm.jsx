import React from "react";

const RequestForm = () => {
  return (
    <section className="py-20 bg-white" id="presupuesto">
      <div className="max-w-xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-semibold mb-8 text-violet-900">
          ¿Necesitás un presupuesto rápido?
        </h3>
        <p className="mb-8 text-gray-600">
          Dejá tu consulta y en minutos recibirás cotizaciones sin compromiso.
        </p>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Describí tu necesidad"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-violet-900"
          />
          <input
            type="text"
            placeholder="¿Dónde?"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-violet-900"
          />
          <input
            type="text"
            placeholder="Email o WhatsApp"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-violet-900"
          />
          <button
            type="submit"
            className="w-full bg-violet-900 hover:bg-violet-800 text-white py-3 rounded-md font-medium transition-colors"
          >
            Solicitar presupuesto
          </button>
        </form>
      </div>
    </section>
  );
};

export default RequestForm;
