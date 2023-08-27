import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import db from "../../firebase/firebaseConfig";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@mui/joy";

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

  const editPost = (postId) => {
    navigate(`/postdetail/${postId}`)
  
  }

  return (
    <div className="card-container">
      {userPosts.length
        ? userPosts.map((info, index) => (
            <div key={index + info?.breed?.stringValue} onClick={() => editPost(info?.postId?.stringValue)} className="cards">
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
              <div className="edit-delete-buttons">

              <div>
                <Link to={`/editmyposts/${info?.postId?.stringValue}`}>
                <Button size="sm" variant="solid" color="primary">
                  Edit
                </Button>
                </Link>
              </div>
              <div>
                <Button size="sm" variant="solid" color="danger" onClick={() => deletePost(info?.postId?.stringValue)}>
                  Delete Post
                </Button>
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
