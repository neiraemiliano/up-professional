import * as Yup from "yup";

export interface SignInFormValues {
  email: string;
  password: string;
}

export const initialValues: SignInFormValues = {
  email: "",
  password: "",
};

export const validationSchema = Yup.object<SignInFormValues>({
  email: Yup.string()
    .email("El email debe tener un formato válido")
    .required("Requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("Requerido"),
});
