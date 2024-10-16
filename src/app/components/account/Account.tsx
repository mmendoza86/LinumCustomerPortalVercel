'use client';  // Indica que este componente es un Client Component

import { useRouter} from 'next/navigation';
import {signOut, useSession} from "next-auth/react";
import { useState } from 'react';
import CompInfo from './info/CompInfo';
import CompPedidos from './pedidos/CompPedidos';
import CompDirecciones from './direcciones/CompDirecciones';
import CompMetodos from './metodosPago/CompMetodos';
import CompFacturacion from './facturacion/CompFacturacion';
import { VerifiedUser, LocalShipping, Place, Paid, Star, Logout } from '@mui/icons-material';


const Account = () => {
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState("info");

  const { data: session } = useSession();


  const handleLogout = () => {
    localStorage.removeItem("Logged");
    localStorage.removeItem("SessionUser");
    router.push("/login");
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "info":
        return <CompInfo />;
      case "pedidos":
        return <CompPedidos />;
      case "direcciones":
        return <CompDirecciones />;
      case "MetodosPago":
        return <CompMetodos />;
      case "Factura":
        return <CompFacturacion />;
      case "CerrarSesion":
        handleLogout(); // Ejecuta el logout
        return null;    // Retorna null para que no se renderice nada
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-[90%] flex flex-col md:flex-row text-textprimary-50 gap-3 mt-3">
        <div className="md:w-1/3">
        {/* Menú para dispositivos móviles 
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md md:hidden">
        <div className="font-bold text-xl mb-4">Mi Perfil</div>
        <div className="midMobile">
            <div className="midTop">
            <div className="itemMidMenu">
                <MenuPerfilMov onMenuSeleccionado={handleMenuSeleccionado} />
            </div>
            </div>
        </div>
        </div>
        */}

        {/* Menú de perfil para pantallas más grandes */}
        <div className="hidden md:block bg-white p-4 rounded-lg shadow-md">
        <div className="font-bold text-xl mb-4" >Mi Perfil</div>
        <ul className="space-y-3">
            <li
            className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            onClick={() => handleMenuClick("info")}
            >
            <VerifiedUser className="mr-2 " /> Información
            </li>
            <li
            className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            onClick={() => handleMenuClick("pedidos")}
            >
            <LocalShipping className="mr-2 " /> Mis Pedidos
            </li>
            <li
            className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            onClick={() => handleMenuClick("direcciones")}
            >
            <Place className="mr-2 " /> Mis Direcciones
            </li>
            <li
            className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            onClick={() => handleMenuClick("MetodosPago")}
            >
            <Paid className="mr-2 " /> Métodos de Pago
            </li>
            <li
            className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            onClick={() => handleMenuClick("Factura")}
            >
            <Star className="mr-2 " /> Facturación
            </li>
            <li
            className="flex items-center cursor-pointer hover:bg-gray-200 p-2 rounded-md"
            onClick={() => {
              signOut({ callbackUrl: "/login" }); // Redirigir a la URL deseada después de cerrar sesión
            }}
            >
            <Logout className="mr-2 text-red-500" /> Cerrar Sesión
            </li>
        </ul>
        </div>
      </div>

      {/* Contenido derecho */}
      <div className="md:w-2/3 bg-white p-4 rounded-lg shadow-md mt-4 md:mt-0">
          {renderContent()}
      </div>
    </div>

  );
};

export default Account;
