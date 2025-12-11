import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Email sign-in provider with onboarding data
// In development, allows any email to sign in
// In production, you'd want to add a proper database adapter
const providers = [
  Credentials({
    id: "email",
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      name: { label: "Name", type: "text" },
      healthProvider: { label: "Health Provider", type: "text" },
    },
    async authorize(credentials) {
      if (credentials?.email && typeof credentials.email === "string") {
        const email = credentials.email;
        const name = credentials.name && typeof credentials.name === "string" 
          ? credentials.name 
          : email.split("@")[0];
        const healthProvider = credentials.healthProvider && typeof credentials.healthProvider === "string"
          ? credentials.healthProvider
          : undefined;
        
        return {
          id: email,
          email: email,
          name: name,
          healthProvider: healthProvider,
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
    async jwt({ token, user }) {
      if (user) {
        token.healthProvider = user.healthProvider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.healthProvider = token.healthProvider as string | undefined;
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

