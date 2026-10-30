"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, checkPassword, tokenForSession } from "@/lib/admin-auth";

export async function login(formData: FormData) {
  const attempt = String(formData.get("password") ?? "");
  const token = tokenForSession();
  if (!token || !checkPassword(attempt)) redirect("/admin?error=1");

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin");
}
