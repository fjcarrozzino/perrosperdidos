import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectUser } from "../redux/userSlice";
import { useSelector } from "react-redux";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import db from "../firebase/firebaseConfig";
import Navbar from "../components/Navbar/Navbar";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import Map from "../components/Map/Map";
import MapEditPage from "../components/MapEditPage/MapEditPage";
import { Button, Input, Option, Select } from "@mui/joy";

const EditPostPage = () => {
  const { postId } = useParams();
  const [inputValues, setInputValues] = useState({
    color: "",
    age: "",
    picture: "",
    location: "",
    breed: "",
    user: "",
  });
  const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
  const [showOptions, setShowOptions] = useState(false); // Nuevo estado
  const [center, setCenter] = useState([]);
  const [searchLocation, setSearchLocation] = useState([]);
  const [postData, setPostData] = useState([]);
  const [selectInput, setSelectInput] = useState("Dog")
  useEffect(() => {
    const obtenerDatos = async () => {
      const docRef = await doc(db, "mascotas", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { animal, color, age, picture, location, breed, user } =
          // setPostData(docSnap.data());
          docSnap.data();
        setInputValues({
          animal: animal,
          color: color,
          age: age,
          picture: picture,
          location: location,
          breed: breed,
          user: user,
        });
        setPostData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    obtenerDatos();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const listContainer = document.querySelector(
        ".input-list-location-container"
      );
      if (listContainer && !listContainer.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (value.trim() === "") {
      setShowOptions(false);
      setSearchLocation([]);
      return;
    }
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
      animal: selectInput,
      age: ageInputValue,
      latLon: center.lenght ? center : postData.latLon,
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

  const lonLatSet = (lon, lat, location) => {
    setCenter([lat, lon]);
    setShowOptions(false);
    setInputValues((prevValues) => ({
      ...prevValues,
      animal: selectInput,
      location: location,
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // 👇 Get input value
      const params = {
        q: inputValues.location,
        format: "jsonv2",
      };
      const queryString = new URLSearchParams(params).toString();
      axios({
        method: "get",
        url: `${NOMINATIM_BASE_URL}${queryString}`,
      }).then((response) => {
        const uniqueData = [
          ...new Set(response.data.map((item) => item.display_name)),
        ].map((displayName) =>
          response.data.find((item) => item.display_name === displayName)
        );
        setSearchLocation(uniqueData);
        setShowOptions(true);
      });
    }
  };




  const handleSelectChange = (e) => {
    setSelectInput(e.target.textContent)
  }

  return (
    <>
      <Navbar />
      <div className="card-container">
        <div className="cards">
          <div className="card-picture">
            <img src={inputValues.picture} alt={inputValues.nombre}></img>
          </div>
          <div className="card-edit-info-container">
            <p>Animal: </p>
            <Select
              name="animal"
              // value={inputValues.animal}
              onChange={handleSelectChange}
              defaultValue="Dog"
            >
              <Option defaultValue={inputValues.animal === "Dog" ? "Dog" : "Cat"} value="Dog">{inputValues.animal === "Dog" ? "Dog" : "Cat"}</Option>
              <Option defaultValue={inputValues.animal !== "Dog" ? "Dog" : "Cat"} value="Cat">{inputValues.animal !== "Dog" ? "Dog" : "Cat"}</Option>
            </Select>
            {/* <select name="animal" value="animal" onChange={handleInputChange}>
              <option
                defaultValue={inputValues.animal === "Dog" ? "Dog" : "Cat"}
              >
                {inputValues.animal === "Dog" ? "Dog" : "Cat"}
              </option>
              <option
                defaultValue={inputValues.animal !== "Dog" ? "Dog" : "Cat"}
              >
                {inputValues.animal !== "Dog" ? "Dog" : "Cat"}
              </option>
            </select> */}
            <p>Color:</p>
            <Input
              key="color"
              type="text"
              name="color"
              value={inputValues.color}
              onChange={handleInputChange}
            />
            <p>Age:</p>
            <Input
              key="age"
              type="number"
              name="age"
              value={inputValues.age}
              onChange={handleInputChange}
            />
            <p>Picture Link:</p>
            <Input
              key="picture"
              type="text"
              name="picture"
              value={inputValues.picture}
              onChange={handleInputChange}
            />
            <p>Breed: </p>
            <Input
              key="breed"
              type="text"
              name="breed"
              value={inputValues.breed}
              onChange={handleInputChange}
            />
            <div className="map-location-container">
              <p>Location: </p>
              <div className="input-list-location-container">
                <input
                  type="text"
                  name="location"
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  value={inputValues.location}
                />
                <ul
                  className={`search-list${
                    showOptions ? "" : " hidden"
                  } search-list`}
                >
                  {searchLocation.map((option, index) => (
                    <ol
                      className="search-list-ol"
                      key={option + index}
                      onClick={() =>
                        lonLatSet(
                          option?.lon,
                          option?.lat,
                          option?.display_name
                        )
                      }
                    >
                      {option.display_name}
                    </ol>
                  ))}
                </ul>
              </div>
              <div style={{height: '400px'}}>
              <MapEditPage center={center} latLon={postData?.latLon} />
              </div>
            </div>
            <Button onClick={(e) => handleSubmitFirebase(e, inputValues)}>
              Submit
            </Button>
          </div>
        </div>
        <Toaster position="bottom-right" reverseOrder={false} gutter={8} />
      </div>
    </>
  );
};

export default EditPostPage;
