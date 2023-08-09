import React, { useEffect, useState } from 'react'
import db from '../../firebase/firebaseConfig'
import { collection, getDocs } from "firebase/firestore";
import '../Cards/Cards.css'

const Cards = () => {
    const [animales, SetAnimales] = useState("")

    useEffect(() => {

        const obtenerDatos = async() => {
            const datos = await getDocs(collection(db, 'mascotas'))
            SetAnimales(datos.docs.map(datos => datos._document.data.value.mapValue.fields))
        }
        obtenerDatos()
    },[SetAnimales])
    
    const data = animales

    console.log(data ? data.map((e) => e) : "")
  return (
    <div className='card-container'>
    {
      data ? data.map((info) => <div className='cards'>
      <div className='card-picture'>
        <img src={info.imagen.stringValue} alt={info.nombre}></img>
      </div>
      <div className='card-info'>
        <h1>
          {info.animal.stringValue}
        </h1>
      </div>
    </div>) : ""
    }
    </div>
  )
}

export default Cards