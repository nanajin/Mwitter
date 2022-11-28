import { signOut, updateProfile } from "firebase/auth";
import { addDoc, collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import twitterLogo from "../twitterLogo.png";
import { v4 as uuidv4 } from "uuid"
import Mweet from "../components/Mweet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function Profile({refreshUser, userObj}){
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newAttachment, setNewAttachment] = useState(userObj.photoURL);
  const [myMweets, setMyMweets] = useState([]);
  const [basic, setBasic] = useState(false);
  let mweetArr = []
  
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
      mweetArr.push({
        id: doc.id,
        ...doc.data()});
    });
    setMyMweets(mweetArr);
  }
  // useEffect(()=>{
  //   getMyMweets();
  // },[myMweets]);
  useEffect(()=>{
    getMyMweets();
  },[]);

  const onChange = (event)=>{
    const {target: {value}} = event;
    setNewDisplayName(value);
  }
  const onSubmit = async(event) =>{
    event.preventDefault();
    let newAttachmentUrl = "";
    if(newAttachment !== ""){
      const fileRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, newAttachment, "data_url");
      newAttachmentUrl = await getDownloadURL(ref(storage, fileRef));
    }
    else if(newAttachment === ""){
      newAttachmentUrl = twitterLogo;
    }
    if(userObj.displayName !== newDisplayName){
      await updateProfile(userObj, { 
        displayName: newDisplayName,
      });
      refreshUser();
    }
    if(newAttachmentUrl !== ""){
      await updateProfile(userObj, { 
        photoURL: newAttachmentUrl
      });
      refreshUser();
    }
    setNewAttachment("");
    // updateProfileDoc();
  }
  useEffect(()=>{
    myMweets.forEach((mweet)=>{
      updateProfileDoc(mweet);
    });  
  }, [userObj.photoURL]);

  const updateProfileDoc = async(mweet)=>{
      const profileRef = doc(db, "mweets", `${mweet.id}`);
      await updateDoc(profileRef, {profile: userObj.photoURL});
  }
  const onFileChange = async(event)=>{
    const {target: {files}} = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent)=>{
      const {currentTarget: {result}} = finishedEvent;
      setNewAttachment(result);
    }
    reader.readAsDataURL(file);
  };
  const onClearProfile = async()=>{
    setNewAttachment("");
    setBasic(true);
  }
  return (
    <div className="container">
      <div className="my_profile">
        {basic ?
          <div className="factoryForm__attachment">
            <img 
              src={twitterLogo} 
              style={{
                backgroundImage: twitterLogo,
              }}
            />        
          </div> :
          <>
            {newAttachment && 
              <div className="factoryForm__attachment">
                <img 
                  src={newAttachment} 
                  style={{
                    backgroundImage: newAttachment,
                  }}
                />        
              </div>
            }
          </>
        }
        <div className="factoryForm__clear" onClick={onClearProfile}>
            <FontAwesomeIcon icon={faTimes} />
        </div>  
        <img 
          src={userObj.photoURL} 
          alt="이미지 없음" 
          className="profile_picture"
        />   
        <button type="">Modify Profile Picture
          <input
            id="modify-file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            // style={{
            //   opacity: 0,
            // }}
          />
        </button>
      </div>
      <form onSubmit={onSubmit} className="profileForm">
        <h2>nickname</h2>
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

      <div style={{ marginTop: 30 }}>
        {myMweets.map((mweet)=>
          <Mweet
            key={mweet.id} 
            mweetObj = {mweet}
            isOwner = {mweet.uid === userObj.uid}  
            profile = {mweet.profile} 
          />
        )}
      </div>

      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  )
}
export default Profile;