import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPage = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";
      
      if (isAdminPage) {
        if (isLoginPage) {
          if (isLoggedIn) return Response.redirect(new URL("/admin", nextUrl));
          return true;
        }
        return isLoggedIn; // Returns true if logged in, otherwise triggers redirect to signIn page
      }
      return true;
    },
  },
  providers: [], // Empty array, to be populated in auth.ts
} satisfies NextAuthConfig;
