import React, {useState} from 'react'
import axios from 'axios';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Router } from 'next/router';
import { useSession } from "next-auth/react";

const CardTC = (props) => {
  const { data: session  } = useSession();
  const PropAdrs = props.Adrs
  const isSelected = props.selected === PropAdrs[0];
  const [IsDeleteTC,SetIsDeleteTC] = useState(false)


  const deleteTC = () => {
    SetIsDeleteTC(true)
  } 
  const ConfirmDeleteTC = (id, event) => {
    event.preventDefault();


      axios
        .delete(process.env.NEXT_PUBLIC_API_LINUM + '/api/credit_card/' + id, {
            headers: {
                'Authorization': 'Bearer ' + session.access_token
            }
        })
        .then((response) => {
          //console.log(response);
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
    ConfirmDeleteTC(PropAdrs[0], event);
  };

  const CancelDeleteTC = () => {
    SetIsDeleteTC(false);
  }


  return (
    props.comp !== "perfil" ?
    <div className={`cardAddress ${isSelected ? 'selected' : ''}`} onClick={props.onClick}>
      <div className="iconCard"><CreditCardIcon/></div>
      <div className="dir">
        <div className='item'>{PropAdrs[1]}</div>
      </div>
    </div>
    :
    <div className={`cardAddress ${isSelected ? 'selected' : ''}  bg-white hover:bg-gray-100 shadow-md rounded-lg p-6 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"`} onClick={props.onClick}>
      <div className='title item title font-semibold text-lg text-gray-800 mb-2'>{PropAdrs[2]}</div>
      <div className="tc  text-gray-600 mb-1 flex justify-between">
        <div className="dir flex gap-5">
          <div className="iconCard"><CreditCardIcon/></div>
          <div className='item'>{PropAdrs[1]}</div>
        </div>
        <div className="acciones">
        
          { !IsDeleteTC ? 
          <>
            <div className="itemAccion delete">
              <div className='Link  text-red-500 hover:underline font-medium' onClick={deleteTC}> 
                Eliminar 
              </div>
            </div>
          </>:
          <>
            <div className="itemAccion delete flex space-x-2">
              <div className='Link  text-green-500 hover:underline font-medium flex items-center' onClick={handleDeleteClick}> 
                <CheckCircleOutlineIcon/>
              </div>
              <div className='Link  text-red-500 hover:underline font-medium flex items-center' onClick={CancelDeleteTC}> 
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

export default CardTC