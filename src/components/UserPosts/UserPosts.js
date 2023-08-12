import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import db from '../../firebase/firebaseConfig';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import { Link } from 'react-router-dom';

const UserPosts = () => {
    const [animales, SetAnimales] = useState("");
    const userSelector = useSelector(selectUser);


    useEffect(() => {
      const obtenerDatos = async () => {
        const datos = await getDocs(collection(db, "mascotas"));
        SetAnimales(
          datos.docs.map((datos) => datos._document.data.value.mapValue.fields)
        );
      };
      obtenerDatos();
    }, [SetAnimales]);
    
    const data = animales

    const userPosts = data ? data.filter((e) => e.userId.stringValue === userSelector.sub) : []


    
    return (
      <div className="card-container">
        {userPosts.length
          ? userPosts.map((info, index) => (
              <div key={index + info?.breed?.stringValue} className="cards">
                <div className="card-picture">
                  <img src={info?.picture?.stringValue} alt={info.nombre}></img>
                </div>
                <div className="card-info">
                  <p>Animal: {info?.animal?.stringValue}</p>
                  <p>Color: {info?.color?.stringValue}</p>
                  <p>Age: {info?.age?.integerValue}</p>
                  <p>Breed: {info?.breed?.stringValue}</p>
                  <p>Location: {info?.location?.stringValue}</p>
                  <p>Created By: {info?.user?.stringValue}</p>
                </div>
                <div>
                    <Link>
                        Edit
                    </Link>
                </div>
              </div>
            ))
          : "You don`t have posts yet."}
      </div>
    );
}

export default UserPosts