import { NextResponse, type NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // cho phép public routes
  if (pathname.startsWith("/login") || pathname.startsWith("/_next") || pathname === "/") {
    return NextResponse.next()
  }

  // Chặn dashboard nếu chưa đăng nhập (tạm thời: dựa vào cookie supabase)
  // Ở bước tiếp theo mình sẽ nâng cấp lên chuẩn @supabase/ssr refresh session.
  const hasAuthCookie = req.cookies.get("sb-access-token") || req.cookies.get("sb-refresh-token")
  if (!hasAuthCookie && pathname.startsWith("/dashboard")) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}