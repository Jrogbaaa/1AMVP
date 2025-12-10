import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Email sign-in provider
// In development, allows any email to sign in
// In production, you'd want to add a proper database adapter
const providers = [
  Credentials({
    id: "email",
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
    },
    async authorize(credentials) {
      if (credentials?.email && typeof credentials.email === "string") {
        const email = credentials.email;
        return {
          id: email,
          email: email,
          name: email.split("@")[0],
        };
      }
      return null;
    },
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/auth",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
});

