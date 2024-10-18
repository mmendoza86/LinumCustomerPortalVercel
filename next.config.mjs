/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/login', // Cambia '/login' a la página que desees
          permanent: true, // true si quieres un redireccionamiento permanente (301)
        },
      ];
    },
  };
  
  export default nextConfig;