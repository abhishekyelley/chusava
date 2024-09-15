"use client";

import { BaseAuth } from "@/components/auth/base-auth";
import { SignupForm } from "@/components/auth/signup-form";
import { useFormState } from "react-dom";
import { authenticate } from "./action";
import { SignupFields } from "@/types/auth";



export default function Page() {
  const [formState, formAction] = useFormState(
    authenticate<SignupFields>,
    undefined
  );
  return (
    <BaseAuth
      heading={"Create an account"}
      subheading={"Enter your info below to create your account"}
      terms
    >
      <SignupForm formState={formState} formAction={formAction} />
    </BaseAuth>
  );
}
