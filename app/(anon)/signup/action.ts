"use server";

import { createClient } from "@/utils/supabase/server";
import { Message, SignupFields } from "@/types/auth";
import { nameRegex, usernameRegex, passwordRegex } from "@/lib/utils";

export async function authenticate<T = SignupFields>(_currentState: unknown, formData: FormData): Promise<Message<T>> {
  const supabase = createClient();
  const email = formData.get("email");
  const username = formData.get("username");
  const first_name = formData.get("first_name");
  const last_name = formData.get("last_name");
  const password = formData.get("password");
  const confirm_password = formData.get("confirm_password");

  if (typeof email !== "string" || email.split("@").length !== 2) {
    return {
      error: true,
      type: "validation",
      location: "email" as keyof T,
      message: "Invalid email address",
    };
  }
  if (typeof first_name !== "string" || !first_name.match(nameRegex)) {
    return {
      error: true,
      type: "validation",
      location: "first_name" as keyof T,
      message: "First Name contains invalid letters",
    };
  }
  if (typeof last_name !== "string" || !last_name.match(nameRegex)) {
    return {
      error: true,
      type: "validation",
      location: "last_name" as keyof T,
      message: "Last Name contains invalid letters",
    };
  }
  if (typeof username !== "string" || !username.match(usernameRegex)) {
    return {
      error: true,
      type: "validation",
      location: "username" as keyof T,
      message: "Invalid username",
    };
  }
  if (typeof password !== "string" || !password.match(passwordRegex)) {
    return {
      error: true,
      type: "validation",
      location: "password" as keyof T,
      message: "Weak password",
    };
  }
  if (password !== confirm_password) {
    return {
      error: true,
      type: "validation",
      location: "confirm_password" as keyof T,
      message: "Passwords do not match",
    };
  }

  const { data: usernameData, error: usernameError } = await supabase
    .from("users")
    .select("username")
    .eq("username", username);

  if (usernameError) {
    return {
      error: true,
      type: "validation",
      location: "username" as keyof T,
      message: usernameError.message || "Something went wrong",
    };
  }

  if (usernameData.length > 0) {
    return {
      error: true,
      type: "validation",
      location: "username" as keyof T,
      message: "Username is already in use",
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username.trim(),
        first_name: first_name.trim(),
        last_name: last_name.trim(),
      },
    },
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
    message: "Created account.",
  };
} 