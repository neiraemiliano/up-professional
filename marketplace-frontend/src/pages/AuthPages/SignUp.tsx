import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/Auth/SignUpForm";
import ProgressiveSignUpForm from "../../components/Auth/ProgressiveSignUpForm";

export default function SignUp() {
  // Cambiar a ProgressiveSignUpForm para mejor UX
  const useProgressiveForm = false;

  return (
    <AuthLayout>
      {useProgressiveForm ? <ProgressiveSignUpForm /> : <SignUpForm />}
    </AuthLayout>
  );
}
