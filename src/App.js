import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Form from "./pages/Form";
import Home from "./pages/Home";
import Perros from "./pages/Perros";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./redux/userSlice";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { isExpired } from "react-jwt";

function App() {
  const dispatch = useDispatch()
  const userSelector = useSelector(selectUser);
  const token = localStorage.getItem("token")
  console.log(userSelector)

  useEffect(() => {
    const isTokenExpired = isExpired(token)
    if(token && isTokenExpired === false) {
      dispatch(
        login(jwtDecode(token))
    )
    } else {
      dispatch(logout());
    }
  // eslint-disable-next-line
  }, [])
  
  

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/perros" element={<Perros />} />
          <Route path="/formulario" element={<Form />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
