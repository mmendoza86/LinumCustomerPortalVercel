"use client";
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import Account from '../components/account/Account';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useRouter} from 'next/navigation';


export default function AccountPage() {
  const { data: session, status  } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Espera a que la sesión se cargue

    if (!session) {
      router.push("/login"); // Redirige a /login si no hay sesión
    }
  }, [session, status, router]);

  // Si la sesión está cargando, puedes mostrar un loader o similar
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
<div className="flex flex-col min-h-screen bg-gray-200">
  <Header />
  <main className="flex-grow">
    <Account />
  </main>
  <Footer />
</div>
  )
}