import React from "react";

const Testimonials = () => {
  return (
    <section className="bg-violet-50 py-20" id="testimonios">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-semibold mb-12 text-violet-900">
          Lo que dicen nuestros usuarios
        </h3>
        <blockquote className="text-gray-700 italic max-w-2xl mx-auto">
          “Pedí un gasista y en 15 minutos tenía 3 presupuestos. La experiencia
          fue excelente, ¡lo super recomiendo!”
          <span className="block mt-4 not-italic font-semibold">
            — Carla G.
          </span>
        </blockquote>
      </div>
    </section>
  );
};

export default Testimonials;
