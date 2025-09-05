import AuthLayout from "./AuthPageLayout";
import { SignUpForm } from "../../components/Auth";

export default function SignUp() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
