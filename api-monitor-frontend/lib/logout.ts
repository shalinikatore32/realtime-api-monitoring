// lib/logout.ts
"use client";
import Cookies from "js-cookie";

export function logout() {
  // Remove user auth details
  localStorage.removeItem("token");
  Cookies.remove("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("email");

  // Redirect to login page
  window.location.href = "/login";
}
