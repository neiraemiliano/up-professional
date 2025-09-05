import AuthLayout from "./AuthPageLayout";
import { SignInForm } from "../../components/Auth";

export default function SignIn() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
