import React, { useEffect, useState } from "react";
import db from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "../Cards/Cards.css";
import { useNavigate } from "react-router-dom";

const Cards = () => {
  const [animales, SetAnimales] = useState("");
  const navigate = useNavigate()
  
  useEffect(() => {
    const obtenerDatos = async () => {
      const datos = await getDocs(collection(db, "mascotas"));
      SetAnimales(
        datos.docs.map((datos) => datos._document.data.value.mapValue.fields)
      );
    };
    obtenerDatos();
  }, [SetAnimales]);

  const data = animales;

  const editPost = (postId) => {
    navigate(`/postdetail/${postId}`)
  
  }

  return (
    <div className="card-container">
      {data
        ? data.map((info, index) => (
            <div key={index + info.breed.stringValue} onClick={() => editPost(info?.postId?.stringValue)} className="cards">
              <div className="card-picture">
                <img src={info?.picture?.stringValue} alt={info.nombre}></img>
              </div>
              <div className="card-info">
                <p>Animal: {info?.animal?.stringValue}</p>
                <p>Color: {info.color?.stringValue}</p>
                <p>Age: {info.age?.integerValue}</p>
                <p>Breed: {info.breed?.stringValue}</p>
                <p>Location: {info.location?.stringValue}</p>
                <p>Created By: {info.user?.stringValue}</p>
              </div>
            </div>
          ))
        : ""}
    </div>
  );
};

export default Cards;
