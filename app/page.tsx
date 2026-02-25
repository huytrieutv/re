"use client"
import { supabase } from "@/lib/supabase/client"
import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.auth.getSession()
      console.log("Session:", data, error)
    }
    test()
  }, [])

  return <div>Supabase Connected</div>
}