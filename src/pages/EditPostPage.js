import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectUser } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import db from "../firebase/firebaseConfig";
import Navbar from "../components/Navbar/Navbar";
import { Toaster, toast } from "react-hot-toast";

const EditPostPage = () => {
  const { postId } = useParams();
  const [inputValues, setInputValues] = useState({
    animal: "",
    color: "",
    age: "",
    picture: "",
    location: "",
    breed: "",
    user: "",
  });

  useEffect(() => {
    const obtenerDatos = async () => {
      const docRef = await doc(db, "mascotas", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { animal, color, age, picture, location, breed, user } = docSnap.data()
        setInputValues({
          animal: animal,
          color: color,
          age: age,
          picture: picture,
          location: location,
          breed: breed,
          user: user
        })
      } else {
        console.log("No such document!");
      }

    };
    obtenerDatos();
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  };

  const navigate = useNavigate();

  const handleSubmitFirebase = async (e, dataToSave) => {
    e.preventDefault();
    const ageInputValue = parseInt(dataToSave.age);
    const valuesToSave = {
      ...dataToSave,
      age: ageInputValue,
    };

    if (isValidUrl(dataToSave.picture)) {
      try {
        await updateDoc(doc(db, "mascotas", postId), valuesToSave);
        toast.success("Your post has been submitted.");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        console.error("Error al guardar el dato:", error);
      }
    } else {
      toast.error("The picture must be a valid URL");
    }
  };

  return (
    <>
      <Navbar />
      <div className="card-container">
              <div className="cards">
                <div className="card-picture">
                  <img src={inputValues.picture} alt={inputValues.nombre}></img>
                </div>
                <div className="card-info">
                  <p>Animal: </p>
                  <select name="animal" value="animal" onChange={handleInputChange}>
                    <option
                      defaultValue={
                        inputValues.animal === "Dog" ? "Dog" : "Cat"
                      }
                    >
                      {inputValues.animal === "Dog" ? "Dog" : "Cat"}
                    </option>
                    <option
                      defaultValue={
                        inputValues.animal !== "Dog" ? "Dog" : "Cat"
                      }
                    >
                      {inputValues.animal !== "Dog" ? "Dog" : "Cat"}
                    </option>
                  </select>
                  <p>Color:</p>
                  <input
                    key="color"
                    type="text"
                    name="color"
                    defaultValue={inputValues.color}
                    onChange={handleInputChange}
                  />
                  <p>Age:</p>
                  <input
                    key="age"
                    type="number"
                    name="age"
                    defaultValue={inputValues.age}
                    onChange={handleInputChange}
                  />
                  <p>Picture Link:</p>
                  <input
                    key="picture"
                    type="text"
                    name="picture"
                    defaultValue={inputValues.picture}
                    onChange={handleInputChange}
                  />
                  <p>Breed: </p>
                  <input
                    key="breed"
                    type="text"
                    name="breed"
                    defaultValue={inputValues.breed}
                    onChange={handleInputChange}
                  />
                  <p>Location: </p>
                  <input
                    key="location"
                    type="text"
                    name="location"
                    defaultValue={inputValues.location}
                    onChange={handleInputChange}
                  />
                  <p>Created By: {inputValues.user}</p>
                  <button onClick={(e) => handleSubmitFirebase(e, inputValues)}>
                    Submit
                  </button>
                </div>
              </div>
      <Toaster position="bottom-right" reverseOrder={false} gutter={8} />

      </div>
    </>
  );
};

export default EditPostPage;
