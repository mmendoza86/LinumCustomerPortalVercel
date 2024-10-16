import React,{useEffect, useState} from 'react'
import axios from 'axios';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Router } from 'next/router';
import { useSession } from "next-auth/react";
import AddTC from './AddTarjeta/AddTC';
import CardTC from '../CardTC';


const CompMetodos = () => {
    const { data: session  } = useSession();
    const [isAddAdress , setisAddAdress] = useState(false);
    const [DeleteCardTC,SetDeleteCardTC] = useState(false);
    const [newCardTC, SetNewCardTC] = useState(false);
    const [dataCreditCard , setData] = useState([]);
    const [SelectedIdTC,setSelectedIdTC] = useState(null);
    const [IsEditDireccion,setIsEditDireccion] = useState(null);

useEffect(() => {
    axios
        .get(process.env.NEXT_PUBLIC_API_LINUM + '/api/credit_cards', {
            headers: {
                'Authorization': 'Bearer ' + session.access_token
            }
        })
        .then((response) => {
            setData(response.data.credit_cards);
            SetDeleteCardTC(false);
        })
        .catch((error) => {
        if(error.response?.status === 401){
            localStorage.removeItem('SessionUser');
            localStorage.removeItem('Logged');
            Router.push("/login")
        }else
            console.error('Error delivery_points:', error);
        });
}, [DeleteCardTC,newCardTC]);

const handleopenAddress = () => {
    if(!isAddAdress)
        setisAddAdress(true);
    else
    {
        setisAddAdress(false);
    }
}

const handleTC = (Data) =>{ }

const handleRegistroAgregado = (newTC) => {  //Manejador para saber si se agrego un nuevo registro
    if(newTC)
      SetNewCardTC(true);
  };
const handleRegistroEliminado = (DeleteAddress) => {  //Manejador para saber si se elimino un registro
  if(DeleteAddress)
      SetDeleteCardTC(true);
};

const handleCloseAddDireccion = () =>{
  setisAddAdress(false);
  //console.log(isAddAdress);
}


  return (
    <div className="wrapperMetodoPago">

        <div className="font-bold text-xl mb-4">Métodos de pago</div>
       
            {!isAddAdress ?
                 <div className="ContentMetodoPago grid gap-4">
                    <div className="ContentBtn">
                        <button className='bg-primary-700  hover:bg-primary-600 text-white font-bold py-2 px-4 rounded' 
                        onClick={handleopenAddress}>AGREGAR TARJETA</button>
                    </div>
                    <div className="AccountMetodoPago grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {dataCreditCard.map((DataTC,index)=>(
                        <CardTC
                            Adrs = {DataTC} 
                            index = {index}
                            selected = {SelectedIdTC} 
                            onClick={() => handleTC(DataTC)}
                            onRegistroEliminado = {handleRegistroEliminado}
                            comp={"perfil"}
                            key={index}
                        />
                        ))}
                    </div>
                </div>:
                <div className="ContentAddMetodoPago">
                    <div className='Link' onClick={handleopenAddress}>
                            <ArrowBackIosNewIcon/>
                        </div>
                    <div className="AddMetodoPago">
                        <AddTC
                        onRegistroAgregado = {handleRegistroAgregado} 
                        closeAddDireccion = {handleCloseAddDireccion}
                        Ref = "/Account" />
                    </div>
                </div>
            }
        </div>
    
  )
}

export default CompMetodos