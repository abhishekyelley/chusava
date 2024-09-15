import { ErrorResponse } from "@/types/api/error";
import { AuthApiError, AuthError, PostgrestError } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export class SupabaseError extends Error {
  status = 500;
  constructor(error: AuthError | PostgrestError | AuthApiError | ErrorResponse) {
    super(error.message, {
      cause: "cause" in error ? error.cause : undefined,
    });
    if ("code" in error && error.code && !isNaN(Number(error.code)) && !isNaN(parseInt(error.code))) {
      this.status = parseInt(error.code);
    }
    if ("status" in error && typeof error.status === "number") {
      this.status = error.status;
    }
  }
}

export function generateErrorReponse(err: unknown): NextResponse<ErrorResponse> {
  let message = "Something went wrong.", status = 500;
  if (err instanceof Error) {
    message = err.message;
  }
  if (err instanceof SupabaseError) {
    message = err.message;
    status = err.status;
  }
  return NextResponse.json({
    error: true,
    message,
    status,
  }, {
    status: status,
  });
}