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
                <div>
                <p> <span>Animal:</span> {info?.animal?.stringValue}</p>
                <p><span>Breed:</span> {info.breed?.stringValue}</p>
                </div>
                <div>
                <p><span>Color:</span> {info.color?.stringValue}</p>
                <p><span>Age:</span> {info.age?.integerValue}</p>
                </div>
                <p><span>Location:</span> {info.location?.stringValue}</p>
                <p className="created-by">Created By: {info.user?.stringValue}</p>
              </div>
            </div>
          ))
        : ""}
    </div>
  );
};

export default Cards;
