import { CheckCircle, FileText, MessageCircle, Users } from "lucide-react";

const HowItWork = () => {
  return (
    <section className="bg-violet-900 text-white py-20" id="how-it-works">
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
  );
};

export default HowItWork;

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
