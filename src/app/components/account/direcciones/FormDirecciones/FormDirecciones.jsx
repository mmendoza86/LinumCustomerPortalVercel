import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';

const FormDirecciones = (props) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [calle, setcalle] = useState('');
    const [NumInterior, setNumInterior] = useState('');
    const [NumExterior, setNumExterior] = useState('');
    const [Estado, setEstado] = useState('');
    const [nombre, setnombre] = useState('');
    const [Ciudad, setCiudad] = useState('');
    const [Colonia, setColonia] = useState('');
    const [CodigoP, setCodigoP] = useState("");
    const [Pais , setPais] = useState("");
    const [telefono , setTelefono] = useState("");
    const [Referencia, setReferencia] = useState('');
    const [ErrorRegister, setErrorRegister] = useState("");
    const [DireccionCreate, SetDireccionCreate] = useState(false);
    const [DataEstados, setDataEstados] = useState();
    const currentDate = new Date();


    useEffect(()=>{ // traemos listado de estados
      axios
      .get(process.env.NEXT_PUBLIC_API_LINUM + '/api/cities', {
          headers: {
              'Authorization': 'Bearer ' + session.access_token
          }
      })
      .then((response) => {
          setDataEstados(response.data);
      })
      .catch((error) => {
        if(error.response?.status === 401){
            localStorage.removeItem('SessionUser');
            localStorage.removeItem('Logged');
            Router.push("/login")
        }else
          console.error('Error delivery_points:', error);
      });
    },[])

    useEffect(()=>{ // buscamos datos en caso de  editar
      if(props.EditDireccion !== null)
      {
        axios
          .get(process.env.NEXT_PUBLIC_API_LINUM + '/api/delivery_points/' + props.EditDireccion, {
              headers: {
                  'Authorization': 'Bearer ' + session.access_token
              }
          })
          .then((response) => {
            ////console.log(response.data)
              setDataUpdate(response.data.delivery_point);
              setcalle(response.data.delivery_point.address)
              setEstado(response.data.delivery_point.state_id)
              setnombre(response.data.delivery_point.contact_name)
              setCiudad(response.data.delivery_point.city)
              setCodigoP(response.data.delivery_point.postal_code)
              setColonia(response.data.delivery_point.neighborhood)
              setPais(response.data.delivery_point.country)
              setTelefono(response.data.delivery_point.phone)
              setNumExterior(response.data.delivery_point.street_number);
              setNumInterior(response.data.delivery_point.suite_number);
              setReferencia(response.data.delivery_point.reference);

          })
          .catch((error) => {
            if(error.response?.status === 401){
                localStorage.removeItem('SessionUser');
                localStorage.removeItem('Logged');
                router.push("/login")
            }else
              console.error('Error delivery_points:', error);
          });
      }
    },[DireccionCreate])

    const handleNombreChange = (event) => {setnombre(event.target.value);};
    const handlecalleChange = (event) => {setcalle(event.target.value);};
    const handleNumInteriorChange = (event) => {setNumInterior(event.target.value);};
    const handleNumExteriorChange = (event) => {setNumExterior(event.target.value);};
    const handleReferenciaChange = (event) => {setReferencia(event.target.value);};
    const handleEstadoChange = (event) => {setEstado(event.target.value);};
    const handleCiudadChange = (event) => {setCiudad(event.target.value);};
    const handleColoniaChange = (event) => {setColonia(event.target.value);};
    const handleCodigoPChange = (event) => {setCodigoP(event.target.value);};
    const handlePaisPChange = (event) => {setPais(event.target.value);};
    const handleTelefonoChange = (event) => {setTelefono(event.target.value);};
        
    const formatDate = (date) => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Agregar 1 al mes, ya que está indexado desde 0.
      const day = currentDate.getDate();
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      return formattedDate;
    };


    const handleRegister = (event) => {
        event.preventDefault();

        const Data =
          {
            address: calle,
            reference: Referencia,
            entry_date : formatDate(currentDate),
            city: Ciudad,
            state_id: Estado,
            postal_code: CodigoP,
            contact_name: nombre,
            neighborhood : Colonia,
            country : Pais,
            phone: telefono,
            street_number: NumExterior,
            suite_number: NumInterior
          }

        axios
        .post(process.env.NEXT_PUBLIC_API_LINUM + '/api/delivery_points', Data, {
            headers: {
                'Authorization': 'Bearer ' + session.access_token
            }
        })
        .then((response) => {
            if(response.data?.status === "success")
            {
                SetDireccionCreate(true);
                props?.onRegistroAgregado(true);
            }

        })
        .catch((error) => {
          if(error.response?.status === 401){
            localStorage.removeItem('SessionUser');
            localStorage.removeItem('Logged');
            if(props.Ref)
              navigate(props.Ref, { state: "RutaDePago" })
            else
            router.push("/login")
          }else{
            console.error('Error delivery_points_add:', error);
          }
          setErrorRegister(error.response.data.detail);
        });

      }

    const handleUpdate = (event) =>{
      event.preventDefault();
      event.preventDefault();

        const Data =
          {
            reference: Referencia,
            state_id: Estado,
            id: props.EditDireccion,
            contact_name: nombre,
            entry_date : formatDate(currentDate),
            city: Ciudad,
            address: calle,
            postal_code: CodigoP,
            neighborhood : Colonia,
            country : Pais,
            phone: telefono,
            street_number: NumExterior,
            suite_number: NumInterior,
            deleted: false
          }

        ////console.log(Data);

        axios
        .put(process.env.REACT_APP_API_LINUM + '/api/delivery_points/' + props.EditDireccion,  Data, {
            headers: {
                'Authorization': 'Bearer ' + session.access_token
            }
        })
        .then((response) => {
            ////console.log(response);
            if(response.data?.status === "success")
            {
                SetDireccionCreate(true);
                props?.onRegistroAgregado(true);
            }

        })
        .catch((error) => {
          if(error.response?.status === 401){
            localStorage.removeItem('SessionUser');
            localStorage.removeItem('Logged');
            router.push("/login")
          }else{
            console.error('Error delivery_points_edit:', error);
          }
          setErrorRegister(error.response.data.detail);
        });
    }

    const handleCloseComp = () => {
      props.closeAddDireccion(true);
    }

    

  return (
    <div className="p-6">
  {props.EditDireccion ? (
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Editar Dirección</h2>
  ) : (
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Agregar Dirección</h2>
  )}

  {!DireccionCreate ? (
    <form
      onSubmit={props.EditDireccion ? handleUpdate : handleRegister}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">Nombre de contacto</label>
          <input
            type="text"
            value={nombre}
            onChange={handleNombreChange}
            placeholder="Nombre"
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">Calle</label>
          <input
            type="text"
            value={calle}
            onChange={handlecalleChange}
            placeholder="Calle"
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">Nº Exterior</label>
          <input
            type="text"
            value={NumExterior}
            onChange={handleNumExteriorChange}
            placeholder="Numero Exterior"
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">Nº interior/Depto</label>
          <input
            type="text"
            value={NumInterior}
            onChange={handleNumInteriorChange}
            placeholder="Numero Interior"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">Estado/Provincia/Región</label>
          <select
            onChange={handleEstadoChange}
            value={Estado}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>- Selecciona una opción -</option>
            {DataEstados?.map((state) => (
              <option key={state.id} value={state.id}>
                {state.state}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">Ciudad</label>
          <input
            type="text"
            value={Ciudad}
            onChange={handleCiudadChange}
            placeholder="Ciudad"
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">Colonia</label>
          <input
            type="text"
            value={Colonia}
            onChange={handleColoniaChange}
            placeholder="Colonia"
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">Código Postal</label>
          <input
            type="text"
            value={CodigoP}
            onChange={handleCodigoPChange}
            placeholder="Código Postal"
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">País o región</label>
          <input
            type="text"
            value={Pais}
            onChange={handlePaisPChange}
            placeholder="País o región"
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={handleTelefonoChange}
            placeholder="Teléfono a 10 dígitos"
            pattern="[0-9]{10}"
            maxLength="10"
            inputMode="numeric"
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 text-sm font-medium mb-2">Referencia</label>
        <input
          type="text"
          value={Referencia}
          onChange={handleReferenciaChange}
          placeholder="Indicaciones adicionales"
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex justify-center mt-6">
        {!props.EditDireccion ? (
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            AGREGAR
          </button>
        ) : (
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
          >
            ACTUALIZAR
          </button>
        )}
      </div>

      <div className="text-red-600 mt-4">
        {ErrorRegister && ErrorRegister}
      </div>
    </form>
  ) : (
    <div className="text-center mt-6">
      <p className="text-green-600 text-sm font-medium">Actualización con éxito</p>
      {props.Ref === "/Account" && (
        <div
          onClick={handleCloseComp}
          className="text-blue-600 hover:underline"
        >
          Mis direcciones
        </div>
      )}
    </div>
  )}
</div>

  )
}

export default FormDirecciones