import { MessageCircle, Phone, Mail } from "lucide-react";
import Button from "../template/ui/button/Button";
import { useAnalytics } from "../../utils/analytics";

const ContactButtons = ({ professional, className = "" }) => {
  const { trackProfessionalContact } = useAnalytics();

  const handleWhatsApp = () => {
    const phone = professional?.phone || "5491123456789"; // Formato argentino
    const message = encodeURIComponent(
      `Hola ${professional?.name}! Vi tu perfil en la plataforma y me interesa contratar tus servicios. ¿Podrías darme más información?`
    );
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    
    // Track professional contact
    trackProfessionalContact(professional?.id, 'whatsapp', {
      professionalName: professional?.name,
      professionalCategory: professional?.category,
      source: 'contact_buttons'
    });
    
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCall = () => {
    if (professional?.phone) {
      // Track phone contact
      trackProfessionalContact(professional?.id, 'phone', {
        professionalName: professional?.name,
        professionalCategory: professional?.category,
        source: 'contact_buttons'
      });
      
      window.location.href = `tel:${professional.phone}`;
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Consulta desde la plataforma - ${professional?.name}`);
    const body = encodeURIComponent(
      `Hola ${professional?.name},\n\nVi tu perfil en la plataforma y me gustaría consultar sobre tus servicios.\n\n¡Gracias!`
    );
    
    // Track email contact
    trackProfessionalContact(professional?.id, 'email', {
      professionalName: professional?.name,
      professionalCategory: professional?.category,
      source: 'contact_buttons'
    });
    
    window.location.href = `mailto:${professional?.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {/* WhatsApp - Botón principal */}
      <Button
        onClick={handleWhatsApp}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span>WhatsApp</span>
      </Button>

      {/* Botones secundarios */}
      <div className="flex gap-2 sm:gap-3">
        <Button
          onClick={handleCall}
          className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
          title="Llamar"
        >
          <Phone className="w-5 h-5" />
        </Button>

        {professional?.email && (
          <Button
            onClick={handleEmail}
            className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
            title="Enviar email"
          >
            <Mail className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContactButtons;