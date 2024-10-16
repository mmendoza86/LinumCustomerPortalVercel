import axios from 'axios';
import React,{useEffect, useState} from 'react'
import { useRouter } from 'next/navigation';
//import "../Direcciones/CompDirecciones.scss"
import AddressCard from '../AddressCard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FormDirecciones from './FormDirecciones/FormDirecciones';
import { useSession } from "next-auth/react";

const CompDirecciones = () => {
    const { data: session , status  } = useSession();
    const router = useRouter();
    const [selectedDireccion, setSelectedDireccion] = useState(null)
    const [isAddAdress , setisAddAdress] = useState(false);
    const [DeleteAddress,SetDeleteAddress] = useState(false);
    const [newAddress, SetNewAddress] = useState(false);
    const [IsEditDireccion,setIsEditDireccion] = useState(null);
    const [dataCreditCard , SetData] = useState([]);

    useEffect(() => {
        if (status === "authenticated" && session?.access_token) {
        axios
          .get(process.env.NEXT_PUBLIC_API_LINUM + '/api/delivery_points', {
              headers: {
                  'Authorization': 'Bearer ' + session.access_token
              }
          })
          .then((response) => {
              SetData(response.data.deliveries);
              SetNewAddress(false);
              SetDeleteAddress(false);

          })
          .catch((error) => {
            if(error.response?.status === 401 || error.code === 'ERR_NETWORK'){
                localStorage.removeItem('SessionUser');
                localStorage.removeItem('Logged');
                router.push("/login")
            }else
              console.error('Error delivery_points:', error);
          });
        }else {
            console.log("No access_token found in session");
          }
    }, [session]);

    const handleAddressCard = (Address) =>{
        ////console.log(Address);
    }

    const handleopenAddress = () => {
        if(!isAddAdress)
            setisAddAdress(true);
        else
        {
            setisAddAdress(false);
            setIsEditDireccion(null);
        }
    }
    const handleRegistroEliminado = (DeleteAddress) => {  //Manejador para saber si se elimino un registro
        if(DeleteAddress)
          SetDeleteAddress(true);
      };

      const handleRegistroAgregado = (newAddress) => {  //Manejador para saber si se agrego un nuevo registro
        if(newAddress)
          SetNewAddress(true);
      };

      const handleCloseAddDireccion = () =>{
        setisAddAdress(false);
      }

      const handleEditDireccion = (EditDireccion) =>{
        if(EditDireccion){
            setIsEditDireccion(EditDireccion);
            setisAddAdress(true);
        }
      }


  return (
    <div className="wrapperDirecciones">

        <div className="font-bold text-xl mb-4">Mis Direcciones</div>
            {!isAddAdress ?
                <div className="ContentDirecciones grid gap-4">
                    <div className="ContentBtn">
                        <button className="bg-primary-700  hover:bg-primary-600 text-white font-bold py-2 px-4 rounded" 
                            onClick={handleopenAddress}>
                            AGREGAR DIRECCIÓN
                        </button>
                    </div>
                    <div className="AccountDirecciones grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {dataCreditCard.map((Address, index) => (
                            <AddressCard
                            Adrs={Address}
                            selected={selectedDireccion}
                            onClick={() => handleAddressCard(Address)}
                            onRegistroEliminado={handleRegistroEliminado}
                            onEditDireccion={handleEditDireccion}
                            comp="perfil"
                            key={index}
                            />
                        ))}
                        </div>
                </div>:
                <div className="ContentAddAddress">
                    <div className='Link' onClick={handleopenAddress}>
                        <ArrowBackIosNewIcon/>
                    </div>
                    <div className="AddAddress">
                        {<FormDirecciones  
                        onRegistroAgregado = {handleRegistroAgregado} 
                        closeAddDireccion = {handleCloseAddDireccion}
                        EditDireccion = {IsEditDireccion}
                        Ref = "/Account" />}
                    </div>
                </div>
            }
        </div>
    


  )
}

export default CompDirecciones