import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useState } from "react";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid"
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function MweetWrite({userObj}){
  const [mweet, setMweet] = useState("");
  const [attachment, setAttachment] = useState("");
  
  const onSubmit = async(event)=>{
    if (mweet === "") {
      return;
    }
    event.preventDefault();

    let attachmentUrl = "";
    if(attachment !== ""){
      const fileRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(ref(storage, fileRef));
    }
    const mweetObj = {
      text: mweet,
      createdAt: Date.now(),
      uid: userObj.uid,
      attachmentUrl,
      writer: userObj.displayName,
      profile: userObj.photoURL,
    }
    try{
      const docRef = await addDoc(collection(db, "mweets"), mweetObj);
    }
    catch(e){
      console.log(e);
    }
    setMweet("");
    setAttachment("");
  };
  const onChange = (event)=>{
    const {target: {value}} = event;
    setMweet(value);
  };
  const onFileChange = (event)=>{
    const {target: {files}} = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent)=>{
      const {currentTarget: {result}} = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(file);
  }

  const onClearAttachment = ()=> {
    if(window.confirm("첨부한 사진을 삭제하시겠습니까?")){
      setAttachment("");
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
          <input 
            className="factoryInput__input"
            value={mweet}
            onChange={onChange}
            type="text" 
            placeholder="Write Mweet Here!" 
            maxLength={200}
          />
          <input 
            type="submit" 
            value="&rarr;" 
            className="factoryInput__arrow" />
        </div>
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}
        />
        {attachment && 
          <div className="factoryForm__attachment">
            <img 
              src={attachment} 
              style={{
                backgroundImage: attachment,
              }}
            />
            <div className="factoryForm__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>          
          </div>
        }
      </form>
    </>
  )
}
export default MweetWrite;