import { 
  User, 
  Info, 
  Edit, 
  MapPin, 
  Calendar, 
  Award, 
  Shield, 
  Star,
  Phone,
  Mail,
  Clock,
  Check,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { InputField as Input } from "../../../components/base";
import Label from "../../../components/template/form/Label";
import Button from "../../../components/template/ui/button/Button";
import { Modal } from "../../../components/template/ui/modal";
import { getText } from "../../../config/texts/texts";
import { useModal } from "../../../hooks/useModal";

const InfoCard = (props) => {
  const { 
    enabledEdit,
    professional
  } = props;
  
  const name = professional?.User?.name || "Profesional";
  const lastName = professional?.User?.lastName || "";
  const email = professional?.User?.email || "";
  const phone = professional?.User?.phone || "";
  const description = professional?.bio || professional?.description || "Profesional con experiencia en el sector.";

  const { isOpen, openModal, closeModal } = useModal();
  const [expandedDescription, setExpandedDescription] = useState(false);

  // Datos reales del profesional
  const professionalInfo = {
    experience: professional?.experience ? `${professional.experience}+ años` : "1+ años",
    specialties: professional?.Specialties?.map(s => s.Specialty.name) || [],
    certifications: professional?.Certifications?.filter(c => c.isVerified).map(c => c.name) || [],
    languages: professional?.languages ? JSON.parse(professional.languages) : ["Español"],
    workingHours: professional?.workingHours || "Lun-Vie 8:00-18:00",
    emergencyService: professional?.emergencyService || false,
    insurance: professional?.insurance || "Servicio con garantía",
    location: professional?.location ? `${professional.location.city}, ${professional.location.province}` : "Por definir"
  };

  const handleSave = () => {
    console.log("Saving changes...");
    closeModal();
  };

  const truncatedDescription = description.length > 200 ? 
    description.substring(0, 200) + "..." : description;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{getText("personalInfo")}</h3>
                <p className="text-gray-600">Información profesional detallada</p>
              </div>
            </div>
            
            {enabledEdit && (
              <button
                onClick={openModal}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          {/* Información básica */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center border-2 border-orange-200">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-800 mb-2">
                  {name} {lastName}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span>{email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>{phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{professionalInfo.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Respuesta en 30min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                Acerca del profesional
              </h5>
              
              <p className="text-gray-700 leading-relaxed">
                {expandedDescription ? description : truncatedDescription}
              </p>
              
              {description.length > 200 && (
                <button
                  onClick={() => setExpandedDescription(!expandedDescription)}
                  className="mt-2 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                >
                  {expandedDescription ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          </div>

          {/* Información profesional */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda */}
            <div className="space-y-6">
              {/* Experiencia y certificaciones */}
              <div>
                <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  Experiencia y Certificaciones
                </h5>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="text-gray-700">Experiencia</span>
                    <span className="font-semibold text-orange-700">{professionalInfo.experience}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Certificaciones:</span>
                    {professionalInfo.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Especialidades */}
              <div>
                <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  Especialidades
                </h5>
                
                <div className="flex flex-wrap gap-2">
                  {professionalInfo.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-3 py-2 rounded-full text-sm font-medium border border-orange-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              {/* Horarios de trabajo */}
              <div>
                <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Disponibilidad
                </h5>
                
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-800 mb-1">Horarios regulares</div>
                    <div className="text-sm text-blue-600">{professionalInfo.workingHours}</div>
                  </div>
                  
                  {professionalInfo.emergencyService && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-sm font-medium text-red-800 mb-1 flex items-center gap-2">
                        🚨 Servicio de emergencia
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">24/7</span>
                      </div>
                      <div className="text-sm text-red-600">Disponible para urgencias</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seguros y garantías */}
              <div>
                <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-500" />
                  Seguros y Garantías
                </h5>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <div className="text-sm font-medium text-green-800">ART Cubierta</div>
                      <div className="text-sm text-green-600">{professionalInfo.insurance}</div>
                    </div>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <div className="text-sm font-medium text-green-800">Garantía de trabajos</div>
                      <div className="text-sm text-green-600">12 meses en instalaciones</div>
                    </div>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Idiomas */}
              <div>
                <h5 className="font-bold text-gray-800 mb-4">Idiomas</h5>
                <div className="flex flex-wrap gap-2">
                  {professionalInfo.languages.map((language, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-300"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[800px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[800px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
          <div className="mb-6">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar Información Personal
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Actualiza tus datos para mantener tu perfil siempre actualizado.
            </p>
          </div>

          <form className="flex flex-col">
            <div className="custom-scrollbar max-h-[500px] overflow-y-auto pb-3">
              {/* Información personal */}
              <div className="mb-8">
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Información Personal
                </h5>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <Label>Nombre</Label>
                    <Input type="text" value={name} />
                  </div>

                  <div>
                    <Label>Apellido</Label>
                    <Input type="text" value={lastName} />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={email} />
                  </div>

                  <div>
                    <Label>Teléfono</Label>
                    <Input type="tel" value={phone} />
                  </div>

                  <div className="col-span-2">
                    <Label>Descripción profesional</Label>
                    <textarea
                      className="w-full h-24 border-2 border-gray-200 rounded-xl p-3 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 resize-none"
                      value={description}
                      placeholder="Describe tu experiencia y servicios..."
                    />
                  </div>
                </div>
              </div>

              {/* Información profesional */}
              <div>
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  Información Profesional
                </h5>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div>
                    <Label>Años de experiencia</Label>
                    <Input type="text" value="15+" />
                  </div>

                  <div>
                    <Label>Zona de trabajo</Label>
                    <Input type="text" value={professionalInfo.location} />
                  </div>

                  <div>
                    <Label>Horario de trabajo</Label>
                    <Input type="text" value={professionalInfo.workingHours} />
                  </div>

                  <div>
                    <Label>Servicio de emergencia</Label>
                    <select className="w-full h-11 border-2 border-gray-200 rounded-xl px-4 focus:border-orange-400 focus:ring-2 focus:ring-orange-200">
                      <option value="true">Sí disponible</option>
                      <option value="false">No disponible</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default InfoCard;