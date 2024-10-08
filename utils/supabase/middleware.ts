import { paths } from "@/lib/constants";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { generateCases } from "../middleware";
import { Database } from "@/types/supabase";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  const { UserGoingToRoot, UserGoingToAuth, UserGoingToProtected, UserGoingToJustSettings } = generateCases(url.pathname);

  if (!user) {
    if (UserGoingToProtected) {
      url.pathname = paths.login;
      return NextResponse.redirect(url);
    }
  }
  else {
    if (UserGoingToAuth || UserGoingToRoot) {
      url.pathname = paths.dashboard;
      return NextResponse.redirect(url);
    }
    if (UserGoingToJustSettings) {
      url.pathname = paths.profile;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}