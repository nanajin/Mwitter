import React from "react";
import {Routes, Route, HashRouter} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import DetailMweet from "./DetailMweet";
import EditMweet from "./EditMweet";
import MweetWrite from "./MweetWrite";
import Navigation from "./Navigation";

function AppRouter({refreshUser, isLoggedIn, userObj}){
  return(
    <>
      <HashRouter>
      {isLoggedIn && <Navigation userObj={userObj}/>}
      <div
        style={{
          maxWidth: 890,
          width: "100%",
          margin: "0 auto",
          marginTop: 80,
          display: "flex",
          justifyContent: "center",
        }}>
        <Routes>
          {isLoggedIn? 
          <>
            <Route path="/" element={<Home userObj={userObj}/>}/>
            <Route path="/profile" element={<Profile userObj={userObj} refreshUser={refreshUser}/>}/>
            <Route path="/detail/:id/:owner" element={<DetailMweet/>}/>
            <Route path="/edit/:id" element={<EditMweet/>}/>
            <Route path="/mweetwrite" element={<MweetWrite userObj={userObj}/>}/>
          </>:
          <>
            <Route path="/" element={<Auth/>}/>
          </>
          }
        </Routes>
      </div>
      </HashRouter>
    </>
  )
}
export default AppRouter;