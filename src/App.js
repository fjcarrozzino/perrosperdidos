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
import Post from "./pages/Post";
import MyPosts from "./pages/MyPosts";
import EditPostPage from "./pages/EditPostPage";
import DetailsPost from "./pages/DetailsPost";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const isTokenExpired = isExpired(token);
    if (token && isTokenExpired === false) {
      dispatch(login(jwtDecode(token)));
    } else {
      dispatch(logout());
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/perros" element={<Perros />} />
          <Route path="/formulario" element={<Form />} />
          <Route path="/login" element={<Login />} />
          <Route path="/postdetail/:postId" element={<DetailsPost/>}/>
          {user ? (
            <Route path="/post" element={<Post />} />
          ) : (
            <Route path="/*" element={<Home />} />
          )}
          {user ? (
            <Route path="/myposts" element={<MyPosts />} />
          ) : (
            <Route path="/*" element={<Home />} />
          )}
          {user ? (
            <Route path="/editmyposts/:postId" element={<EditPostPage/>} />
          ) : (
            <Route path="/*" element={<Home />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
