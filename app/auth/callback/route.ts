import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful authentication, redirect to protected page
      return NextResponse.redirect(`${origin}/protected`);
    } else {
      // Authentication failed, redirect to error page
      return NextResponse.redirect(
        `${origin}/auth/error?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  // No code present, redirect to error page
  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent("No code provided")}`
  );
}
