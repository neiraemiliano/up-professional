// Update the import path below if the actual file location or filename is different.
// For example, if the file is named 'signinForm.jsx' or located in a different folder, update accordingly.
import { SignInForm } from "../../components/Auth";
import AuthLayout from "./AuthPageLayout";

const SignIn = () => {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
};

export default SignIn;
