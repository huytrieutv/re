import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  // dùng publishable key là đủ cho signOut ở route này
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  await supabase.auth.signOut()

  const url = new URL("/login", "http://localhost")
  return NextResponse.redirect(url)
}