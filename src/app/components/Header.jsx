import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-primary-700 text-white p-4">
      <div className="container mx-auto max-w-[90%] flex justify-between items-center w-full">
        <Image 
            src='/img/linum.png' 
            alt='linum' 
            className='w-64 h-auto' // puedes aplicar clases de Tailwind aquí
            width={256}  // Ancho en píxeles
            height={144} // Altura en píxeles
        />
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:underline">Inicio</a></li>
            <li><a href="/Dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/perfil" className="hover:underline">Perfil</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;