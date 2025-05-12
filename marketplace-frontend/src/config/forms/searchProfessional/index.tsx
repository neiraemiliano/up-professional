import * as Yup from "yup";
export interface SearchProfessionalValues {
  service: string;
  location: string;
}

export const initialValues: SearchProfessionalValues = {
  service: "",
  location: "",
};

export const validationSchema = Yup.object({
  service: Yup.string().required("Selecciona un servicio"),
  location: Yup.string().required("Ingresa una zona"),
});
