import React, { useState} from 'react'
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import { Router } from 'next/router';
import { useSession } from "next-auth/react";


const AddTC = (props) => {
    const { data: session  } = useSession();
    const [TCName, setTCName] = useState('');
    const [TCNumber, setTCNumber] = useState('');
    const [TCCvv, setTCCvv] = useState('');
    const [TCCreate, SetTCCreate] = useState(false);
    const [DireccionCreate, SetDireccionCreate] = useState(false);
    const currentDate = new Date();
    const secretKey = "JvsZoZ4Zd83gGROprT8n4VjeANBvEJV7Mox4Un5q4sI=";

    const handleTCName = event => setTCName(event.target.value);
    const handleTCNumber = event => setTCNumber(event.target.value);
    const handleTCCvv = event => setTCCvv(event.target.value);
    const handleMes = event => setselectedMes(event.target.value);
    const handleAnio = event => setselectedAnio(event.target.value);

    const optionsMes = [
        { value: "", label: "" },
        { value: "01", label: "Enero" },
        { value: "02", label: "Febrero" },
        { value: "03", label: "Marzo" },
        { value: "04", label: "Abril" },
        { value: "05", label: "Mayo" },
        { value: "06", label: "Junio" },
        { value: "07", label: "Julio" },
        { value: "08", label: "Agosto" },
        { value: "09", label: "Septiembre" },
        { value: "10", label: "Octubre" },
        { value: "11", label: "Noviembre" },
        { value: "12", label: "Diciembre" }
    ];

    const optionsAnio = [
        { value: "", label: "" },
        { value: "23", label: "2023" },
        { value: "24", label: "2024" },
        { value: "25", label: "2025" },
        { value: "26", label: "2026" },
        { value: "27", label: "2027" },
        { value: "28", label: "2028" }
    ];

  
    const [selectedMes, setselectedMes] = useState(
        optionsMes[0].value
    );
    const [selectedAnio, setselectedAnio] = useState(
        optionsAnio[0].value
    );
    const generateUUID = () => {
        const generatedFolio = uuidv4();
        return generatedFolio.substring(0, 11);
    };

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return hours + minutes + seconds;
      };
    
      const formatDate = (date) => {
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return day + month + year;
      };
    
    const encriptar = (obj) => {        
        const objString = JSON.stringify(obj);

        const secret = new window.fernet.Secret(secretKey);
        const token = new window.fernet.Token({ secret });
        const mess_encode = token.encode(objString);
        
        return mess_encode;
    }
      
    const handleRegisterTC = (event) => {
        event.preventDefault();

        const DataTCSel = {
            id:"",
            credit_card_name: TCName,
            credit_card: TCNumber,
            fecha_expiration: selectedMes + selectedAnio,
            security_code: TCCvv,
            hora_local: formatTime(currentDate),
            fecha_local: formatDate(currentDate),
            folio: generateUUID()
        }

            axios
            .post(process.env.NEXT_PUBLIC_API_LINUM + '/api/credit_card', { data: encriptar(DataTCSel) }, {
                headers: {
                    'Authorization': 'Bearer ' + session.access_token
                }
            })
            .then((response) => {
                if(response.data?.status === "success")
                {
                    props?.onRegistroAgregado(true);
                    SetTCCreate(true);
                }
            })
            .catch((error) => {
            if(error.response?.status === 401){
                localStorage.removeItem('SessionUser');
                localStorage.removeItem('Logged');
                navigate("/CartAuth")
            }else
                console.error('Error delivery_points:', error);
            });

    }

    const HandleClose = () => {
        props.closeAddDireccion(true);
      }

  return (
<div className="wrapperTarjeta p-6">
    <div className="titulo text-xl font-semibold mb-4">Agregar Tarjeta</div>

    { !TCCreate ?
    <form onSubmit={handleRegisterTC} className='form space-y-4'>
        <div className="form-container space-y-6">
            <div className="DataTarjeta">
                <div className="row grid grid-cols-1 sm:grid-cols-1 gap-6">
                    <div className="itemform form-box">
                        <label className="block text-sm font-medium text-gray-700">Alias de la tarjeta:</label>
                        <input
                            type="text"
                            className="form-input mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={TCName}
                            onChange={handleTCName}
                            required
                        />
                    </div>
                    <div className="col2 grid grid-cols-2 gap-6">
                        <div className="itemform form-box">
                            <label className="block text-sm font-medium text-gray-700">Número de tarjeta:</label>
                            <input
                                type="text"
                                className="form-input mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={TCNumber}
                                onChange={handleTCNumber}
                                pattern="[0-9]{16}"
                                title="Ingresa los 16 dígitos de tu tarjeta" 
                                maxLength="16"
                                inputMode="numeric"
                                required
                            />
                        </div>
                        <div className="itemform form-box mt-4 sm:mt-0">
                            <label className="block text-sm font-medium text-gray-700">CVV:</label>
                            <input
                                type="text"
                                className="form-input mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={TCCvv}
                                onChange={handleTCCvv}
                                pattern="[0-9]{3,4}"
                                title="Ingresa los 3 o 4 dígitos al reverso de tu tarjeta" 
                                maxLength="4"
                                inputMode="numeric"
                                required
                            />
                        </div>
                    </div>
                    <div className="col2 grid grid-cols-2 gap-6">
                        <div className="itemform form-box">
                            <label className="block text-sm font-medium text-gray-700">Mes:</label>
                            <select
                                value={selectedMes}
                                className="form-input mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={handleMes}
                                required
                            >
                                {optionsMes.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="itemform form-box">
                            <label className="block text-sm font-medium text-gray-700">Año:</label>
                            <select
                                value={selectedAnio}
                                className="form-input mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={handleAnio}
                                required
                            >
                                {optionsAnio.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="ContentBtn mt-6">
                    <button type="submit" className='form-submit-button bg-primary-700  hover:bg-primary-600  text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                        AGREGAR
                    </button>
                </div>
            </div>
        </div>
    </form> 
    :
        <div className="usuariocreado text-center">
            <p className="text-green-500">Método de pago guardado con éxito</p>
            {props.Ref === "/Account" && (
                <div onClick={HandleClose} className="text-indigo-600 hover:underline">Métodos de pago</div>
            )}
        </div>
        }
    </div>
  )
}

export default AddTC