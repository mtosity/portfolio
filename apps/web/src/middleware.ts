import { auth } from "@/auth";

// Guard the editor pages: bounce anonymous visitors to the GitHub sign-in.
// (API admin routes additionally re-check auth server-side as defense in depth.)
export default auth((req) => {
  if (!req.auth) {
    const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
