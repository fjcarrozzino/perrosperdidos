import React, {useState, useEffect} from "react";
import { GoogleLogin } from "@react-oauth/google";

import { useNavigate } from "react-router-dom";
import { login } from "../redux/userSlice";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const logIn = (res) => {
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
