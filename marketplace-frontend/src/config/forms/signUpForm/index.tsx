import * as Yup from "yup";
export interface SignUpFormValues {
  name: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

export const initialValues: SignUpFormValues = {
  name: "",
  lastName: "",
  email: "",
  role: "",
  password: "",
  confirmPassword: "",
};

export const validationSchema = Yup.object<SignUpFormValues>({
  name: Yup.string().required("Requerido"),
  lastName: Yup.string().required("Requerido"),
  email: Yup.string()
    .email("El email debe tener un formato válido")
    .required("Requerido"),
  role: Yup.string().required("Requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("Requerido"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseña no coinciden")
    .required("Requerido"),
});
