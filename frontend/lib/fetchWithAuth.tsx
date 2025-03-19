// lib/fetchWithAuth.ts
import { redirect } from "next/navigation";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    // Handle session expiration (JWT expired / invalid)
    if (res.status === 401) {
        localStorage.removeItem("token");
        redirect("/login"); // Redirect to login
    }

    return res;
}