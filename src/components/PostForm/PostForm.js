import React, { useState } from "react";
import "../PostForm/PostForm.css";
import db from "../../firebase/firebaseConfig";
import "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import Randomstring from "randomstring";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";

const PostForm = () => {
  const user = useSelector(selectUser);
  const [inputValues, setInputValues] = useState({
    animal: "Dog",
    color: "",
    age: "",
    picture: "",
    location: "",
    breed: "",

  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const renderInputs = () => {
    return Object.keys(inputValues).map((inputName) => {
      if (inputName === "animal") {
        return (
          <div key={inputName}>
            <p>{inputName.charAt(0).toUpperCase() + inputName.slice(1)}</p>
            <select
              name={inputName}
              value={inputValues[inputName]}
              onChange={handleInputChange}
            >
              <option value="Dog" defaultValue="Dog">
                Dog
              </option>
              <option value="Cat" defaultValue="Cat">
                Cat
              </option>
            </select>
          </div>
        );
      } else {
        return (
          <div>
            <p>
              {inputName === "picture"
                ? "Picture Link"
                : inputName.charAt(0).toUpperCase() + inputName.slice(1)}
            </p>
            <input
              key={inputName}
              type={inputName === "age" ? "number" : "text"}
              name={inputName}
              min="0"
              max="30"
              required={true}
              value={inputValues[inputName]}
              onChange={handleInputChange}
            />
          </div>
        );
      }
    });
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmitFirebase = async (e, dataToSave) => {
    e.preventDefault();
    console.log(dataToSave);
    const areAllValuesValid = Object.values(dataToSave).every(
      (value) => value !== ""
    );
    const ageInputValue = parseInt(dataToSave.age);

    const randomId = Randomstring.generate(20)

    const valuesToSave = {
      ...dataToSave,
      age: ageInputValue,
      user: user?.given_name,
      userId: user?.sub,
      postId: randomId
    };

    if (isValidUrl(dataToSave.picture) && areAllValuesValid) {
      try {
        await setDoc(
          doc(db, "mascotas", randomId),
          valuesToSave
        );
        toast.success("Your post has been submitted.");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        console.error("Error al guardar el dato:", error);
      }
    } else {
      toast.error("The picture must be a valid URL");
      toast.error("All the fields must be completed.");
    }
    // Guardar el valor en Firestore
  };

  return (
    <div className="postform-container">
      {renderInputs()}
      <div>
        <button onClick={(e) => handleSubmitFirebase(e, inputValues)}>
          Post
        </button>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} gutter={8} />
    </div>
  );
};

export default PostForm;
