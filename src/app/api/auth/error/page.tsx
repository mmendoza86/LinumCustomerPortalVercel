"use client";
import { useSearchParams } from "next/navigation";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  console.log(searchParams);

  let errorMessage = "";

  switch (error) {
    case "CredentialsSignin":
      errorMessage = "Credenciales incorrectas. Por favor, intenta nuevamente.";
      break;
    case "SessionRequired":
      errorMessage = "Debes iniciar sesión para acceder a esta página.";
      break;
    default:
      errorMessage = "Ocurrió un error. Por favor, intenta nuevamente.";
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-900">
      <h1 className="text-2xl font-bold">Error de autenticación</h1>
      <p className="mt-4">{errorMessage}</p>
      <a href="/login" className="mt-6 underline text-blue-600">Volver a intentar</a>
    </div>
  );
};

export default ErrorPage;
