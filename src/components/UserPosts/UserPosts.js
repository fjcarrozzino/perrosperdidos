import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "../../firebase/firebaseConfig";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const UserPosts = () => {
  const [animales, SetAnimales] = useState("");
  const userSelector = useSelector(selectUser);
  const [reload, setReload] = useState(false)
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

  const userPosts = data
    ? data.filter((e) => e?.userId?.stringValue === userSelector.sub)
    : [];

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "mascotas", postId));
      setReload(!reload)
      toast.success("Your post has been deleted.");
    } catch (error) {
      toast.error("Error al guardar el dato:", error);
    }
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

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

              <div>
                <Link to={`/editmyposts/${info?.postId?.stringValue}`}>
                  Edit
                </Link>
              </div>
              <div>
                <button onClick={() => deletePost(info?.postId?.stringValue)}>
                  Delete Post
                </button>
                </div>
              </div>
            </div>
          ))
        : "You don`t have posts yet."}
      <Toaster position="bottom-right" reverseOrder={false} gutter={8} />
    </div>
  );
};

export default UserPosts;
