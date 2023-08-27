import React, { useEffect, useState } from "react";
import "../PostForm/PostForm.css";
import db from "../../firebase/firebaseConfig";
import "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import Randomstring from "randomstring";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import Map from "../Map/Map";
import { Autocomplete, Box, TextField } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import { Button, Input, Option, Select } from "@mui/joy";

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
  const [center, setCenter] = useState([]);
  const [searchLocation, setSearchLocation] = useState([]);
  const navigate = useNavigate();

  const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
  const [showOptions, setShowOptions] = useState(false); // Nuevo estado

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const listContainer = document.querySelector(".input-list-location-container");
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

  const handleSubmitFirebase = async (e, dataToSave) => {
    e.preventDefault();
    const areAllValuesValid = Object.values(dataToSave).every(
      (value) => value !== ""
    );
    const ageInputValue = parseInt(dataToSave.age);

    const randomId = Randomstring.generate(20);

    const valuesToSave = {
      ...dataToSave,
      age: ageInputValue,
      user: user?.given_name,
      userId: user?.sub,
      postId: randomId,
      latLon: center,
    };

    if (isValidUrl(dataToSave.picture) && areAllValuesValid) {
      try {
        await setDoc(doc(db, "mascotas", randomId), valuesToSave);
        toast.success("Your post has been submitted.");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        console.error("Error al guardar el dato:", error);
      }
    } else {
      toast.error("The picture must be a valid URL");
      toast.error("All the fields must be completed.");
    }
    // Guardar el valor en Firestore
  };

  const lonLatSet = (lon, lat, location) => {
    setCenter([lat, lon]);
    setShowOptions(false);
    setInputValues((prevValues) => ({
      ...prevValues,
      location: location
    }))
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
        setShowOptions(true)
      });
    }
  };

  return (
    <div className="postform-container">
      <div className="post-form">
        <p>Animal: </p>
        <Select
          name="animal"
          value={inputValues.animal}
          onChange={handleInputChange}
        >
          <Option value="Dog" defaultValue="Dog">
            Dog
          </Option>
          <Option value="Cat" defaultValue="Cat">
            Cat
          </Option>
        </Select>
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
        <div className="post-button">
          <Button onClick={(e) => handleSubmitFirebase(e, inputValues)}>
            Post
          </Button>
        </div>
      </div>
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
            className={`search-list${showOptions ? "" : " hidden"} search-list`}
          >
            {
              searchLocation.map((option, index) => (
                <ol
                  className="search-list-ol"
                  key={option + index}
                  onClick={() => lonLatSet(option?.lon, option?.lat, option?.display_name)}
                >
                  {option.display_name}
                </ol>
              ))
         }
          </ul>

        </div>
        <Map center={center} />
      </div>
      <Toaster position="bottom-right" reverseOrder={false} gutter={8} />
    </div>
  );
};

export default PostForm;
