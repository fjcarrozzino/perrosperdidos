import React, {useState, useEffect} from "react";
import { GoogleLogin } from "@react-oauth/google";
import Randomstring from "randomstring";
import { useNavigate } from "react-router-dom";
import { login, selectAllUsers } from "../redux/userSlice";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import db from "../firebase/firebaseConfig";

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const allUsers = useSelector(selectAllUsers)
    
    const logIn = async (res) => {
      const randomId = Randomstring.generate(20)
      const userInfo = jwtDecode(res.credential)
      const usuarioLogin = allUsers.filter((e) => e.userId === userInfo?.sub)
      const valuesToSave = {
        user: userInfo?.given_name,
        userId: userInfo?.sub,
        documentId: randomId
      };

      console.log(userInfo.sub)
      console.log(usuarioLogin[0])


        

        if(userInfo?.sub === usuarioLogin[0]?.userId) {
          console.log('Usuario en la base de datos ===')
          
        } else if(userInfo?.sub === undefined) {
          console.log('Usuario en la base de datos undefined')
        } else {
          await setDoc(
            doc(db, "users", randomId),
            valuesToSave
          );
          console.log("Usuario guardado");
        }

        if (res.credential) {
            localStorage.setItem("token", res.credential)
            dispatch(
                login(jwtDecode(res.credential))
            )
            setTimeout(() => {
                navigate("/");
              }, 500);
        }
        else {
            console.log("error")
        }
    }

  return (
    <div>
      <GoogleLogin
        onSuccess={(codeResponse) => {
          console.log(codeResponse)
            logIn(codeResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      ;
    </div>
  );
};

export default Login;
