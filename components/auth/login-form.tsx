"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { paths } from "@/lib/constants";
import Link from "next/link";
import { LoginFormProps } from "@/types/auth";
import { Message } from "@/components/auth/message";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  formAction,
  formState,
  ...props
}: LoginFormProps) {
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
      <Link
        href={paths.signup}
        className="underline underline-offset-4 hover:text-primary"
      >
        Don{"'"}t have an account? Signup
      </Link>
    </div>
  );
}

function Fields() {
  const { pending } = useFormStatus();
  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        <Label className="sr-only" htmlFor="email">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          placeholder="name@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          disabled={pending}
        />
      </div>
      <div className="grid gap-1">
        <Label className="sr-only" htmlFor="password">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          placeholder="●●●●●●"
          type="password"
          disabled={pending}
        />
      </div>
      <Button disabled={pending}>
        {pending && (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        )}
        Login
      </Button>
    </div>
  );
}
