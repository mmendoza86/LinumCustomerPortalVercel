import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientSessionProvider from "../app/ClientSessionProvider"; // Asegúrate de importar el nuevo Client Component

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Linum - Clientes",
  description: "Portal de clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="/libs/fernetBrowser.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <ClientSessionProvider>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
