import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/Auth/SignUpForm.jsx";
import ProgressiveSignUpForm from "../../components/Auth/ProgressiveSignUpForm.jsx";

export default function SignUp() {
  // Cambiar a ProgressiveSignUpForm para mejor UX
  const useProgressiveForm = false;

  return (
    <AuthLayout>
      {useProgressiveForm ? <ProgressiveSignUpForm /> : <SignUpForm />}
    </AuthLayout>
  );
}
