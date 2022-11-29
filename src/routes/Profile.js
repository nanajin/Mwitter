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
  const [initAttachment, setInitAttachment] = useState(twitterLogo);
  const [newAttachment, setNewAttachment] = useState("");
  const [myMweets, setMyMweets] = useState([]);
  const [basic, setBasic] = useState(false);
  const [fileSelect, setFileSelect] = useState(false);
  const [profile, setProfile] = useState(true);
  let mweetArr = []
  const navigate = useNavigate();
  console.log(twitterLogo);
  const onLogOutClick = ()=>{
    const ok = window.confirm("로그아웃 하시겠습니까?");
    if(ok){
      signOut(auth).then(()=>{
        navigate("/");
        }).catch(e=>{
          alert(e);
      })
    };
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
  
  useEffect(()=>{
    getMyMweets();
  },[]);

  const onChange = (event)=>{
    const {target: {value}} = event;
    setNewDisplayName(value);
  }
  const onModifyPicture = () =>{
    setFileSelect(true);
    setBasic(false);
    setProfile(false);
  }
  const onSubmit = async(event) =>{
    event.preventDefault();
    let newAttachmentUrl = "";

    if(!userObj.photoURL){
      newAttachmentUrl = twitterLogo;
    }
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
    setFileSelect(false);
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
      setBasic(false);
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
          <div className="profile__attachment profile__picture">
            <img 
              src={twitterLogo} 
              // style={{
              //   backgroundImage: twitterLogo,
              // }}
            />        
          </div> :
          <>
            {newAttachment && 
              <div className="profile__attachment profile__picture">
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
        {userObj.photoURL? 
          <>
            {!newAttachment && !basic &&
              <div className="profile__picture">
                <img 
                  src={userObj.photoURL} 
                  alt="프로필 없음"
                />
              </div>
            }
          </>:
          <>
          
            <div className="profile__picture">
              <img 
                src={twitterLogo} 
                alt="프로필 없음"
              />
            </div>
          
        </>
        }
        {/* {!newAttachment && !basic &&
          <div className="profile__picture">
            <img 
              src={userObj.photoURL} 
              alt="프로필 없음"
            />
          </div>
        } */}
        {fileSelect ? 
          <input
            id="modify-file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="formBtn"
          />:
          <button onClick={onModifyPicture} className="formBtn profile_modify_btn">사진 변경</button>
        }
        <button onClick={onClearProfile} className="formBtn profile_modify_btn">기본 이미지로 변경</button>

      </div>
      <form onSubmit={onSubmit} className="profileForm">
        <h2>Nickname</h2>
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
        <p className="my__mweets">My Mweets</p>
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