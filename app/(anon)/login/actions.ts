"use server";

import { createClient } from "@/utils/supabase/server";
import { Message } from "@/types/auth";

export async function authenticate<T>(_currentState: unknown, formData: FormData): Promise<Message<T>> {
  const supabase = createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: true,
      type: "authentication",
      message: error.message || "Unknown error.",
    };
  }

  return {
    type: "success",
    message: "Logged in.",
  };
} 