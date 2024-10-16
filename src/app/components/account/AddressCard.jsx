import React,{useEffect, useState} from 'react'
import PlaceIcon from '@mui/icons-material/Place';
import axios from 'axios';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Router } from 'next/router';
import { useSession } from "next-auth/react";

const AddressCard = (props) => {
  const { data: session  } = useSession();
  const PropAdrs = props.Adrs
  const isSelected = props.selected === PropAdrs.id;
  const [DataEstado,setDataEstado] = useState(null);
  const [IsDeleteDireccion,SetIsDeleteDireccion] = useState(false)
  
  useEffect(()=>{
    axios
    .get(process.env.NEXT_PUBLIC_API_LINUM + '/api/cities', {
        headers: {
            'Authorization': 'Bearer ' + session.access_token
        }
    })
    .then((response) => {
        setDataEstado(response.data);
    })
    .catch((error) => {
      if(error.response?.status === 401){
          localStorage.removeItem('SessionUser');
          localStorage.removeItem('Logged');
          Router.push("/CartAuth")
      }else
        console.error('Error delivery_points:', error);
    });
  },[])

  const EstadoName = () => {
    const estadoEncontrado = DataEstado?.find(estado => estado.id === PropAdrs.state_id);
    
    if (estadoEncontrado) {
      return estadoEncontrado.state;
    }
    
    return null; // o un valor predeterminado si no se encuentra ningún estado
  };

  const deleteDireccion = () => {
    SetIsDeleteDireccion(true)
  } 
  const ConfirmDeleteDireccion = (id, event) => {
    event.preventDefault();

      axios
        .delete(process.env.NEXT_PUBLIC_API_LINUM + '/api/delivery_points/' + id, {
            headers: {
                'Authorization': 'Bearer ' + session.access_token
            }
        })
        .then((response) => {
            if(response.status === 204)
              props.onRegistroEliminado(true);
        })
        .catch((error) => {
          if(error.response?.status === 401){
              localStorage.removeItem('SessionUser');
              localStorage.removeItem('Logged');
              Router.push("/login")
          }else
            console.error('Error delivery_points:', error);
        });
  }

  const handleDeleteClick = (event) => {
    ConfirmDeleteDireccion(PropAdrs.id, event);
  };

  const CancelDeleteDireccion = () => {
    SetIsDeleteDireccion(false);
  }

  const EditarDireccion = () => {
     props.onEditDireccion(PropAdrs.id);
  }


  return (
    props.comp !== "perfil" ?
    <div className={`cardAddress ${isSelected ? 'selected' : ''}`} onClick={props.onClick}>
      <div className="iconCard"><PlaceIcon/></div>
      <div className="dir">
        <div className='item'><h1>{PropAdrs.contact_name}</h1></div>
        <div className='item'>{PropAdrs.address}, {PropAdrs.city}, {EstadoName()} , {PropAdrs.postal_code}</div>
      </div>
    </div>:
    <div
    className="cardAddressPerfil bg-white hover:bg-gray-100 shadow-md rounded-lg p-6 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
    onClick={props.onClick}
    >
    <div className="dir">
      {props.predeterminado && (
        <div className="Itempredeterminado bg-blue-100 text-blue-600 text-sm rounded-full px-4 py-1 inline-block mb-2">
          Predeterminada
        </div>
      )}
      <div className="itemsDir">
        <div className="item title font-semibold text-lg text-gray-800 mb-2">
          {PropAdrs.contact_name}
        </div>
        <div className="item text-gray-600 mb-1">
          {PropAdrs.address} #{PropAdrs.street_number}
        </div>
        <div className="item text-gray-600 mb-1">{PropAdrs.city}</div>
        <div className="item text-gray-600">
          {EstadoName()}, {PropAdrs.postal_code}
        </div>
      </div>
  
      <div className="acciones flex mt-4 space-x-4 justify-between">
        <div className="itemAccion">
          <div
            className="Link text-blue-500 hover:underline font-medium"
            onClick={EditarDireccion}
          >
            Editar Dirección
          </div>
        </div>
        {!IsDeleteDireccion ? (
          <div className="itemAccion delete">
            <div
              className="Link text-red-500 hover:underline font-medium"
              onClick={deleteDireccion}
            >
              Eliminar
            </div>
          </div>
        ) : (
          <div className="itemAccion delete flex space-x-2">
            <div
              className="Link text-green-500 hover:underline font-medium flex items-center"
              onClick={handleDeleteClick}
            >
              <CheckCircleOutlineIcon className="mr-1" />
            </div>
            <div
              className="Link text-red-500 hover:underline font-medium flex items-center"
              onClick={CancelDeleteDireccion}
            >
              <HighlightOffIcon className="mr-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  
  )
}

export const FacturacionCard = (props) => {
  const navigate = useNavigate();
  const PropAdrs = props.Fact
  const storedData = localStorage.getItem("SessionUser");
  const SessionUser = JSON.parse(storedData);
  const [IsDeleteDireccion,SetIsDeleteDireccion] = useState(false)
  const PropFact = props.Fact
  const isSelected = props.selected === PropFact.id;
  

  const deleteDireccion = () => {
    SetIsDeleteDireccion(true)
  } 

  const ConfirmDeleteDireccion = (id, event) => {
    event.preventDefault();

      axios
        .delete(process.env.REACT_APP_API_LINUM + '/api/invoice_data/' + id, {
            headers: {
                'Authorization': 'Bearer ' + session.access_token
            }
        })
        .then((response) => {
            if(response.status === 204)
              props.onRegistroEliminado(true);
        })
        .catch((error) => {
          if(error.response?.status === 401){
              localStorage.removeItem('SessionUser');
              localStorage.removeItem('Logged');
              if(props.Ref)
                navigate(props.Ref, { state: "RutaDePago" })
              else
                navigate("/Login")
          }else
            console.error('Error delivery_points:', error);
        });
    }

  const handleDeleteClick = (event) => {
    ConfirmDeleteDireccion(PropAdrs.id, event);
  };

  const CancelDeleteDireccion = () => {
    SetIsDeleteDireccion(false);
  }

  const EditarDireccion = () => {
    props.onEditDireccion(PropAdrs.id);
  }


  return (
    props.comp !== "perfil" ?
    <div className={`cardAddress ${isSelected ? 'selected' : ''}`} onClick={props.onClick}>
      <div className="iconCard"><PlaceIcon/></div>
      <div className="dir">
        <div className='item'><h1>{PropFact.name}</h1></div>
        <div className='item'>{PropFact.tax_id}, {PropFact.address}</div>
      </div>
    </div>:
    <div className="cardAddressPerfil" onClick={props.onClick}>
    <div className="dir">
      <div className='item'><h1>{PropFact.tax_id}</h1></div>
      <div className='item'>
        {PropFact.name}<br/>
        {PropFact.email} 
      </div>
      
      <div className="acciones">
        <div className="itemAccion"><div className='Link' onClick={EditarDireccion}> Editar </div> </div>
        { !IsDeleteDireccion ? 
        <>
          <div className="itemAccion delete">
            <div className='Link' onClick={deleteDireccion}> 
              Eliminar 
            </div>
          </div>
        </>:
        <>
          <div className="itemAccion delete">
            <div className='Link' onClick={handleDeleteClick}> 
              <CheckCircleOutlineIcon/>
            </div>
            <div className='Link' onClick={CancelDeleteDireccion}> 
              <HighlightOffIcon/>
            </div>
          </div>
        </>
        }
      </div>
    </div>
    
  </div>
  )
}

export default AddressCard