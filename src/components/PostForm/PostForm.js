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
import Map from "../Map/Map";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";

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
  const [ center, setCenter] = useState([])
  const [searchLocation, setSearchLocation] = useState([])
  const navigate = useNavigate();
  const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

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

  const handleSubmitFirebase = async (e, dataToSave) => {
    e.preventDefault();
    console.log(dataToSave);
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

  const lonLatSet = (lon, lat) => {
    setCenter([lat, lon])
  }

  console.log(searchLocation)

  return (
    <div className="postform-container">
      <div className="card-info">
        <p>Animal: </p>
        <select
          name="animal"
          value={inputValues.animal}
          onChange={handleInputChange}
        >
          <option value="Dog" defaultValue="Dog">
            Dog
          </option>
          <option value="Cat" defaultValue="Cat">
            Cat
          </option>
        </select>
        <p>Color:</p>
        <input
          key="color"
          type="text"
          name="color"
          value={inputValues.color}
          onChange={handleInputChange}
        />
        <p>Age:</p>
        <input
          key="age"
          type="number"
          name="age"
          value={inputValues.age}
          onChange={handleInputChange}
        />
        <p>Picture Link:</p>
        <input
          key="picture"
          type="text"
          name="picture"
          value={inputValues.picture}
          onChange={handleInputChange}
        />
        <p>Breed: </p>
        <input
          key="breed"
          type="text"
          name="breed"
          value={inputValues.breed}
          onChange={handleInputChange}
        />
        <div>
          <button onClick={(e) => handleSubmitFirebase(e, inputValues)}>
            Post
          </button>
        </div>
      </div>
      <div className="map-location-container">
        <p>Location: </p>
        <div>
          <input
            key="location"
            type="text"
            name="location"
            value={inputValues.location}
            onChange={handleInputChange}
          />
          <button
            onClick={() => {
              // Search
              const params = {
                q: inputValues.location,
                format: "jsonv2",
              };
              const queryString = new URLSearchParams(params).toString();
              axios({
                method: 'get',
                url: `${NOMINATIM_BASE_URL}${queryString}`,
              })
                .then((response) =>  {
                  setSearchLocation(response.data)
                });
            }}
          >
            submit
          </button>
        </div>
        <List component="nav" aria-label="main mailbox folders">
          {searchLocation?.map((item, index) => {
            return (
              <div key={index}>
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary={item?.display_name} onClick={() => lonLatSet(item?.lon, item?.lat)} />
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </List>
        <Map center={center}/>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} gutter={8} />
    </div>
  );
};

export default PostForm;
