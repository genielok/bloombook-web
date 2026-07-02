import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/client/login",
  },

  //   callbacks: {
  //     authorized({ auth, request: { nextUrl } }) {
  //       const isLoggedIn = !!auth?.user;
  //       const pathname = nextUrl.pathname;

  //       const isOnAdmin = pathname.startsWith("/admin");
  //       const isOnConfirm = pathname.startsWith("/client/confirm");
  //       const isOnLogin = pathname.startsWith("/client/login");

  //       // need login page
  //       if (isOnAdmin || isOnConfirm) {
  //         return isLoggedIn;
  //       }

  //       // already login
  //       if (isOnLogin && isLoggedIn) {
  //         return Response.redirect(new URL("/client/explore", nextUrl));
  //       }

  //       // others
  //       return true;
  //     },
  //   },

  providers: [],
} satisfies NextAuthConfig;
