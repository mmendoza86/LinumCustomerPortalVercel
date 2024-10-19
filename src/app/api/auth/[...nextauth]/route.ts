import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const url = process.env.NEXT_PUBLIC_API_LINUM + "/api/login";
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const user = await res.json();

          // Verifica si la respuesta es exitosa y tiene un access_token
          if (res.ok && user?.status === 'success' && user?.access_token) {
            return { id: user.id, access_token: user.access_token }; 
          } else {
            return null; // Retorna null si hay un error
          }
        } catch (error) {
          console.error("Error during API call:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token; // Ahora esto no debería dar error
      }
      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token as string; // Usa as string para evitar el error
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
