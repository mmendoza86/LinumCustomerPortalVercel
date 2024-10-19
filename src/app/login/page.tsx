"use client";
import { useState } from 'react'
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter} from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from "next-auth/react";


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { data: session, status  } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Espera a que la sesión se cargue

    if (session) {
      router.push("/account"); // Redirige a /login si no hay sesión
    }
  }, [session, status, router]);

  const handleErrorAuth = (err: string)=>{
    switch (err) {
        case "CredentialsSignin":
            return "Credenciales incorrectas. Por favor, intenta nuevamente.";
        case "SessionRequired":
            return "Debes iniciar sesión para acceder a esta página.";
        default:
            return "Ocurrió un error. Por favor, intenta nuevamente.";
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log(res);

    if (res?.error) {
      console.log("Error during sign-in:", res.error);
      setError(res.error);
    } else {
        router.push('/account'); // Redirigir después de inicio de sesión
    }
  };

  return (
      <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <Image 
                  src='/img/linum.png' 
                  alt='linum' 
                  className='w-64 h-auto' // puedes aplicar clases de Tailwind aquí
                  width={256}  // Ancho en píxeles
                  height={144} // Altura en píxeles
              />
              </a>
              <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                          Iniciar sesión
                      </h1>
                      {error && <p style={{ color: 'red' }}>{handleErrorAuth(error)}</p>}
                      <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                          <div>
                              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                              <input type="email" 
                                      name="email" 
                                      id="email" 
                                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                      placeholder="name@company.com" 
                                      onChange={(e) => setEmail(e.target.value)}
                                      required />
                          </div>
                          <div>
                              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                              <input type="password" 
                                    name="password" 
                                    id="password" 
                                    placeholder="••••••••" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                          </div>
                          <div className="flex items-center justify-between">
                              {/*<div className="flex items-start">
                                  <div className="flex items-center h-5">
                                      <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                  </div>
                                  <div className="ml-3 text-sm">
                                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                  </div>
                              </div>*/}
                              <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">¿Olvidaste tu contraseña?</a>
                          </div>
                          <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                      </form>
                  </div>
              </div>
          </div>
      </section>
  );
}
