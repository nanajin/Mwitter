import { signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

function Profile({userObj}){
  const navigate = useNavigate();
  const onLogOutClick = ()=>{
    signOut(auth).then(()=>{
      navigate("/");
    }).catch(e=>{
      console.log(e);
    })
  }
  const getMyMweets = async()=>{
    const q = query(
      collection(db, "mweets"), 
      where("uid", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
      console.log(doc.data());
    })
  }
  useEffect(()=>{
    getMyMweets();
  },[]);

  return (
    <div>
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  )
}
export default Profile;