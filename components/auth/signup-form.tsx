"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { paths } from "@/lib/constants";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { SignupFormProps } from "@/types/auth";
import { Message } from "@/components/auth/message";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SignupForm({
  className,
  formAction,
  formState,
  ...props
}: SignupFormProps) {
  const router = useRouter();
  useEffect(() => {
    if (formState?.type === "success") {
      router.push(paths.dashboard);
    }
  }, [router, formState]);
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Message formState={formState} />
      <form action={formAction}>
        <Fields />
      </form>
      <Link href={paths.login}>Already have an account? Login</Link>
    </div>
  );
}

function Fields() {
  const { pending } = useFormStatus();
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-1">
        <Label className="sr-only" htmlFor="first_name">
          First Name
        </Label>
        <Input
          id="first_name"
          name="first_name"
          placeholder="John"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={pending}
          required
        />
        <Label className="sr-only" htmlFor="last_name">
          Last Name
        </Label>
        <Input
          id="last_name"
          name="last_name"
          placeholder="Doe"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={pending}
          required
        />
      </div>
      <div className="grid gap-1">
        <Label className="sr-only" htmlFor="email">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          placeholder="johndoe@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          disabled={pending}
          required
        />
      </div>
      <div className="grid gap-1">
        <Label className="sr-only" htmlFor="username">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          placeholder="johndough47"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={pending}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-1">
        <Label className="sr-only" htmlFor="password">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          placeholder="password"
          type="password"
          disabled={pending}
          required
        />
        <Label className="sr-only" htmlFor="confirm_password">
          Confirm Password
        </Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          placeholder="confirm password"
          type="password"
          disabled={pending}
          required
        />
      </div>
      <Button disabled={pending}>
        {pending && (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        )}
        Sign Up
      </Button>
    </div>
  );
}
