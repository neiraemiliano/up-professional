import React from "react";
import ProfesionalMetaCard from "./components/ProfessionalMetaCard";
import Footer from "../../components/Footer/Footer";
import { useProfessional } from "../../hooks/api/professionals";
import { useParams } from "react-router";
import HomeHeader from "../../components/Header/HomeHeader";
import useAuth from "../../hooks/context/useAuth";
import ProfessionalInfoCard from "./components/ProfessionalInfoCard";
import ProfessionalAddressCard from "./components/ProfessionalAddressCard";
import { getText } from "../../config/texts/texts";

const ProfessionalProfile = () => {
  const { id } = useParams();
  const { user = null } = useAuth();

  const { data: professional, isLoading } = useProfessional(id);

  if (isLoading)
    return <p className="py-20 text-center">{getText("loading")}</p>;

  if (!professional)
    return (
      <p className="py-20 text-center">{getText("noFoundProfessional")}</p>
    );

  const enabledEdit = user?.id === id;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HomeHeader />
      <div className="lg:w-5xl lg:mx-auto p-2 lg:p-6">
        <div className="space-y-6">
          <ProfesionalMetaCard {...professional} enabledEdit={enabledEdit} />
          <ProfessionalInfoCard {...professional} enabledEdit={enabledEdit} />
          <ProfessionalAddressCard
            {...professional}
            enabledEdit={enabledEdit}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfessionalProfile;
