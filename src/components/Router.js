import React, { useState } from "react";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

function AppRouter({isLoggedIn, userObj}){
  return(
    <>
      <BrowserRouter>
      {isLoggedIn && <Navigation/>}
        <Routes>
          {isLoggedIn? 
          <>
            <Route path="/" element={<Home userObj={userObj}/>}/>
            <Route path="/profile" element={<Profile userObj={userObj}/>}/>
          </> :
          <>
            <Route path="/" element={<Auth/>}/>
          </>
          }
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default AppRouter;