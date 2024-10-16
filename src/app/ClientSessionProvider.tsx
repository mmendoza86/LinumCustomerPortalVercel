"use client"; // Este es un Client Component

import { SessionProvider } from "next-auth/react";

export default function ClientSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}