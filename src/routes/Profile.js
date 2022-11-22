import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";

function Profile({refreshUser, userObj}){
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
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
    // querySnapshot.forEach((doc)=>{
    // })
  }
  useEffect(()=>{
    getMyMweets();
  },[]);

  const onChange = (event)=>{
    const {target: {value}} = event;
    setNewDisplayName(value);
  }
  const onSubmit = async(event) =>{
    event.preventDefault();
    if(userObj.displayName !== newDisplayName){
      await updateProfile(userObj, { displayName: newDisplayName });
      //updateProfile에 프사 바꾸는 법도 있음 그거 해보면 좋을듯
      refreshUser();
    }
  }
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input 
          type="text" 
          placeholder="Display name" 
          value={newDisplayName}
          autoFocus
          onChange={onChange}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />      
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  )
}
export default Profile;