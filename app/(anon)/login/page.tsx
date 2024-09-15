"use client";

import { BaseAuth } from "@/components/auth/base-auth";
import { LoginForm } from "@/components/auth/login-form";
import { useFormState } from "react-dom";
import { authenticate } from "./actions";
import { LoginFields } from "@/types/auth";

export default function Page() {
  const [formState, formAction] = useFormState(
    authenticate<LoginFields>,
    undefined
  );
  return (
    <BaseAuth
      heading={"Login with your credentials"}
      subheading={"Enter your email below to create your account"}
    >
      <LoginForm formState={formState} formAction={formAction} />
    </BaseAuth>
  );
}
