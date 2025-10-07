import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // You can add more providers here (e.g., Credentials for custom login)
  ],
  session: {
    strategy: "jwt", // Use JWT for session
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // You can customize the token here
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass token to session
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
    signOut: "/logout",
    error: "/error", // Error page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
