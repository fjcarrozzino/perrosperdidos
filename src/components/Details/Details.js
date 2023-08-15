import React, { useEffect, useState } from "react";
import "../Details/Details.css";
import { useParams } from "react-router-dom";
import { collection, collectionGroup, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";

const Details = () => {
  const { postId } = useParams();
  const [postData, setPostData] = useState([]);
  const [postCommentary, setPostCommentary] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const docRef = await doc(db, "mascotas", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPostData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    obtenerDatos();

    const obtenerComentarios = async () => {
        const comentariosData = [];
        const querySnapshot = await getDocs(collection(db, "mascotas", postId, "comentarios"));
        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                comentariosData.push(doc.data());
            } else {
                console.log("No such document!");
            }
        });
      setPostCommentary(comentariosData);
    };
    obtenerComentarios();
  }, [postId]);

  
    console.log(postCommentary);

  return (
    <div className="detail-post-container">
      <div className="picture-description-container">
        <div className="picture-container">
          <img
            src={postData?.picture}
            alt={postData?.postId}
            className="detail-picture"
          />
        </div>
        <div className="description-container">
          <p>{postData?.animal}</p>
          <p>{postData?.breed}</p>
          <p>{postData?.location}</p>
          <p>{postData?.user}</p>
          <p>{postData?.age}</p>
          <p>{postData?.color}</p>
        </div>
      </div>
      <div className="comentary-container">comentarios</div>
    </div>
  );
};

export default Details;
