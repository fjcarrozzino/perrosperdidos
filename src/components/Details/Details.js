import React, { useEffect, useState } from "react";
import "../Details/Details.css";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { useSelector } from "react-redux";
import { selectAllUsers, selectUser } from "../../redux/userSlice";
import Randomstring from "randomstring";
import MapDetails from "./MapDetails";

const Details = () => {
  const { postId } = useParams();
  const [postData, setPostData] = useState([]);
  const [postCommentary, setPostCommentary] = useState([]);
  const [comentaryInput, setComentaryInput] = useState("");
  const [reload, setReload] = useState(false);
  const allUsers = useSelector(selectAllUsers);
  const user = useSelector(selectUser);

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
      const querySnapshot = await getDocs(
        collection(db, "mascotas", postId, "comentarios")
      );
      const comentariosData = [];
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
  }, [postId, reload]);

  const submitCommentary = async (e) => {
    e.preventDefault();
    const randomId = Randomstring.generate(20);

    const valuesToSave = {
      user: user?.given_name,
      userId: user?.sub,
      commentaryId: randomId,
      commentary: comentaryInput,
      time: new Date(),
    };
    if (user && comentaryInput.length) {
      try {
        await setDoc(
          doc(db, "mascotas", postId, "comentarios", randomId),
          valuesToSave
        );
        console.log("Your post has been submitted.");
      } catch (error) {
        console.error("Error al guardar el dato:", error);
      }
    } else {
      console.log("You must login to comment.");
    }
    // Guardar el valor en Firestore
    setReload(!reload);
    setComentaryInput("");
  };

  const renderComentarios = (infoComentarios) => {
    const sortedComments = infoComentarios.sort(
      (a, b) => a.time.seconds - b.time.seconds
    );
    return sortedComments.map((comentario) => {
      return (
        <div key={comentario?.commentaryId} className="commentary-div">
          <p className="commentary">
            {comentario?.user}: {comentario?.commentary}
          </p>
        </div>
      );
    });
  };

  const handleInputChange = (e) => {
    setComentaryInput(e.target.value);
  };

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
          <div>
            <p>{postData?.animal}</p>
            <p>{postData?.breed}</p>
            <p>{postData?.location}</p>
            <p>{postData?.user}</p>
            <p>{postData?.age}</p>
            <p>{postData?.color}</p>
          </div>
          <div>
            <MapDetails position={postData?.latLon} />
          </div>
        </div>
      </div>
      <div className="comentary-container">
        {renderComentarios(postCommentary)}
        <input
          key="comentario"
          type="text"
          name="comentario"
          value={comentaryInput}
          onChange={handleInputChange}
        />
        <button onClick={submitCommentary}>send</button>
      </div>
    </div>
  );
};

export default Details;
