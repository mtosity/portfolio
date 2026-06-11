import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// Only this GitHub account may sign in to the notes editor.
const ALLOWED_LOGIN = "mtosity";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    // Reject everyone except the owner, even if they complete the OAuth flow.
    async signIn({ profile }) {
      return (profile as { login?: string } | undefined)?.login === ALLOWED_LOGIN;
    },
    // Keep the GitHub login on the token/session so the UI can show who's in.
    async jwt({ token, profile }) {
      if (profile && typeof (profile as { login?: string }).login === "string") {
        token.login = (profile as { login: string }).login;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { login?: string }).login = token.login as
          | string
          | undefined;
      }
      return session;
    },
  },
});
