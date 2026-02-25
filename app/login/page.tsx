"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string>("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMsg("")
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setMsg(`❌ ${error.message}`)
        setLoading(false)
        return
      }

      if (!data.session) {
        setMsg("⚠️ Signed in but no session. Check Supabase Auth settings.")
        setLoading(false)
        return
      }

      setMsg("✅ Login OK. Redirecting...")
      setLoading(false)

      // Redirect tới dashboard v0 (route group)
      router.replace("/dashboard")
      router.refresh()
    } catch (err: any) {
      setLoading(false)
      setMsg("❌ Unexpected error: " + (err?.message ?? String(err)))
      console.error(err)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Login</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          style={{ padding: 12, border: "1px solid #ccc", borderRadius: 10 }}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          style={{ padding: 12, border: "1px solid #ccc", borderRadius: 10 }}
        />

        <button type="submit" disabled={loading} style={{ padding: 12, borderRadius: 10 }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {msg ? <div style={{ whiteSpace: "pre-wrap" }}>{msg}</div> : null}
      </form>
    </div>
  )
}