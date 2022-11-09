import React, { useEffect, useState } from 'react'
import db from '../firebase/firebaseConfig'
import { collection, getDocs } from "firebase/firestore";

const Cards = () => {
    const [animales, SetAnimales] = useState("")

    useEffect(() => {

        const obtenerDatos = async() => {
            const datos = await getDocs(collection(db, 'perros'))
            SetAnimales(datos.docs.map(datos => datos._document.data.value.mapValue.fields))
        }
        obtenerDatos()
    },[SetAnimales])

    console.log(animales)
  return (
    <div>Cards</div>
  )
}

export default Cards