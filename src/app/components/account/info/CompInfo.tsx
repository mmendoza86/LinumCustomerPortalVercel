import axios from 'axios';
import React,{useEffect, useState} from 'react'
import { Router } from 'next/router';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { useSession } from "next-auth/react";

export default function CompInfo() {
  const { data: session  } = useSession();
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [telefonoMovil,setTelefonoMovil] = useState('');
  const [nombre, setnombre] = useState('');
  const [apellido, setapellido] = useState('');
  const [ErrorUpdate, setErrorUpdate] = useState("");
  const [password , setPassword] = useState("00000000");
  const [IsUpdate,setIsUpdate] = useState(false);
  const [editable, setEditable] = useState(false);
  

  useEffect(() => {
      if (ErrorUpdate || IsUpdate) {
        const timer = setTimeout(() => {
          setErrorUpdate(false);
          setIsUpdate(false);
        }, 3000); //
  
        return () => clearTimeout(timer);
      }
    }, [ErrorUpdate, IsUpdate]);

  useEffect(() => {
      axios
        .get(process.env.NEXT_PUBLIC_API_LINUM + '/api/users', {
            headers: {
                'Authorization': 'Bearer ' + session?.access_token
            }
        })
        .then((response) => {
            //SetData(response.data.user);
            setnombre(response.data.user.nombre);
            setapellido(response.data.user.apellidos);
            setEmail(response.data.user.email);
            setTelefonoMovil(response.data.user.phone1.toString().substring(2));
            setTelefono(response.data.user.phone2.toString().substring(2));
        })
        .catch((error) => {
          if(error.response?.status === 401){
              localStorage.removeItem('SessionUser');
              localStorage.removeItem('Logged');
              Router.push("/login")
          }else
            console.error('Error delivery_points:', error);
        });
  }, []);
  
const handleNombreChange = (event) => {
      setnombre(event.target.value);
  };

  const handleApellidoChange = (event) => {
      setapellido(event.target.value);
  };

  const handleEmailChange = (event) => {
      setEmail(event.target.value);
  };

  const handleTelefonoChange = (event) => {
      setTelefono(event.target.value);
  };

  const handleTelefonoMovilChange = (event) => {
      setTelefonoMovil(event.target.value);
  };

  const handlePasswordChange = (event) => {
      setPassword(event.target.value)
  }

  const handlePerfil = (event) => {
      event.preventDefault();
      
      const RegisterData = {
        nombre: nombre,
        apellidos: apellido,
        email,
        password: password === "00000000" ? undefined : password,
        telefono : telefono && parseInt(52 + telefono),
        telefono_movil : telefonoMovil && parseInt(52 + telefonoMovil)
      }

      //console.log(RegisterData);

      axios
        .put(process.env.NEXT_PUBLIC_API_LINUM + '/api/users', RegisterData, {
            headers: {
                'Authorization': 'Bearer ' + session?.access_token
            }
        })
        .then((response) => {
          //console.log(response);
           if(response.status === 200)
              setIsUpdate(true);
        })
        .catch((error) => {
          if(error.response?.status === 401){
              localStorage.removeItem('SessionUser');
              localStorage.removeItem('Logged');
              Router.push("/login")
          }else
            console.error('Error delivery_points:', error);
            setErrorUpdate(true);
        });

      
  }

  const toggleEdit = (event) => {
      event.preventDefault();
      setEditable(!editable);
      if(editable)
          handlePerfil(event);
  };

  const toggleReturn = () =>{
      setEditable(false);
  }

  return (
      <div className="ContentInfo p-6">
  <div className="PerfilInfo">
    <div className="tituloInfo text-2xl font-semibold mb-4">Información</div>
    <form className='form space-y-6'>
      <div className="row grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className='FormRow'>
          <label className='label block text-gray-700 font-medium mb-1'>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={handleNombreChange}
            placeholder="Nombre"
            required
            readOnly={!editable}
            style={{ color: editable ? 'black' : 'gray' }}
            className='FormRow w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='FormRow'>
          <label className='label block text-gray-700 font-medium mb-1'>Apellidos</label>
          <input
            type="text"
            value={apellido}
            onChange={handleApellidoChange}
            placeholder="Apellido"
            required
            readOnly={!editable}
            style={{ color: editable ? 'black' : 'gray' }}
            className='FormRow w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className="row grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className='FormRow'>
          <label className='label block text-gray-700 font-medium mb-1'>Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            required
            readOnly={!editable}
            style={{ color: editable ? 'black' : 'gray' }}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='FormRow'>
          <label className='label block text-gray-700 font-medium mb-1'>Teléfono Móvil (Notificaciones)</label>
          <input
            type="text"
            value={telefonoMovil}
            onChange={handleTelefonoMovilChange}
            placeholder="Teléfono a 10 dígitos"
            pattern="[0-9]{10}"
            title="Ingresa los 10 dígitos de tu teléfono"
            maxLength="10"
            inputMode="numeric"
            required
            readOnly={!editable}
            style={{ color: editable ? 'black' : 'gray' }}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className="row grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className='FormRow'>
          <label className='label block text-gray-700 font-medium mb-1'>Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={handleTelefonoChange}
            placeholder="Teléfono a 10 dígitos"
            pattern="[0-9]{10}"
            title="Ingresa los 10 dígitos de tu teléfono"
            maxLength="10"
            inputMode="numeric"
            readOnly={!editable}
            style={{ color: editable ? 'black' : 'gray' }}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='FormRow'>
          <label className='label block text-gray-700 font-medium mb-1'>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Contraseña"
            minLength="8"
            required
            readOnly={!editable}
            style={{ color: editable ? 'black' : 'gray' }}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='Actions flex justify-end gap-5 items-center mt-6'>
        {editable ? (
          <button
            onClick={toggleEdit}
            className='bg-primary-700  hover:bg-primary-600 text-white px-4 py-2 rounded-lg shadow focus:outline-none'
          >
            GUARDAR
          </button>
        ) : (
          <button
            onClick={toggleEdit}
            className='bg-primary-700  hover:bg-primary-600 text-white px-4 py-2 rounded-lg shadow focus:outline-none'
          >
            EDITAR
          </button>
        )}

        <BackspaceIcon className='text-red-500 cursor-pointer' onClick={toggleReturn} />
      </div>

      <div className="mejerror text-red-500 mt-4">
        {ErrorUpdate && <p>Ocurrió un error al actualizar tu información, intenta nuevamente.</p>}
      </div>

      <div className="msjeOK text-green-500 mt-4">
        {IsUpdate && <p>Se actualizó tu información con éxito.</p>}
      </div>
    </form>
  </div>
</div>

    );
  }
  