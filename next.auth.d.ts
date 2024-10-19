import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    access_token: string; // Agrega la propiedad access_token aquí
  }

  interface Session {
    access_token: string; // Agrega la propiedad access_token aquí
  }
  interface JWT {
    access_token?: string; // Agrega la propiedad access_token aquí
  }
}