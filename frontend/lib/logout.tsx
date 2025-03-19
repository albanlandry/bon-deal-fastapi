// lib/logout.ts
import { redirect } from "next/navigation";

export function logout() {
    fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
    }).then(_ => redirect("/login"))
}
