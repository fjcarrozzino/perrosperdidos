import React from "react";
import UserPosts from "../components/UserPosts/UserPosts";
import Navbar from "../components/Navbar/Navbar";

const MyPosts = () => {
  return (
    <div>
      <Navbar/>
      <UserPosts />
    </div>
  );
};

export default MyPosts;
