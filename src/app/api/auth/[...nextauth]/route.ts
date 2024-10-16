import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try{
          // Realiza la llamada a tu API de autenticación
          const url = process.env.NEXT_PUBLIC_API_LINUM + "/api/login"
          console.log("API Response URL:", url);
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
          // Retorna el usuario con el id y el token
          return { id: user.id, access_token: user.access_token }; 
          } else {
            return null; // Retorna null si hay un error
          }
        }
        catch (error) {
          console.error("Error during API call:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // Define la ruta para la página de inicio de sesión
    error: '/auth/error', // Define la ruta para la página de error
  },
  session: {
    strategy: "jwt", // Usa JWT para manejar sesiones
  },
  callbacks: {
    async jwt({ token, user }) {
      // Almacena el access_token en el token JWT
      if (user) {
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Incluye el access_token en el objeto de sesión
      session.access_token = token.access_token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Define un secreto para las cookies de sesión
});

export { handler as GET, handler as POST }; // Exporta el manejador para GET y POST
