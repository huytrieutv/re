import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options })
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  const { data } = await supabase.auth.getUser()
  const isLoggedIn = !!data.user
  const pathname = req.nextUrl.pathname

  // Nếu chưa login mà vào /dashboard -> đá về /login
  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Nếu đã login mà vẫn vào /login -> đá sang /dashboard
  if (isLoggedIn && pathname.startsWith("/login")) {
    const url = req.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ["/login/:path*", "/dashboard/:path*"],
}