import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { db, storage } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import twitterLogo from "../twitterLogo.png";

function Mweet({mweetObj, isOwner, profile}){
  const [edit, setEdit] = useState(false);
  const [newMweet, setNewMweet] = useState(mweetObj.text);
  const mweetTextRef = doc(db, "mweets", `${mweetObj.id}`);
  const date = new Date(mweetObj.createdAt);
  
  const toggleEdit = () =>{
    setEdit((prev)=>!prev);
  }

  const onDelete = async()=>{
    const ok = window.confirm("므윗을 삭제하시겠습니까?");
    const deleteRef = ref(storage, mweetObj.attachmentUrl);
    if(ok){
      if(mweetObj.attachmentUrl !== ""){
        await deleteObject(deleteRef);
      }
      await deleteDoc(mweetTextRef);
    }
  }
  const onEditSubmit = async(event)=>{
    event.preventDefault();
    await updateDoc(mweetTextRef, {text: newMweet});
    setEdit(false);
  }
  const onChange = (event)=>{
    const {target: {value}} = event;
    setNewMweet(value);
  }
  return(
    <div className="nweet">
      {edit ? <>
        <form onSubmit={onEditSubmit} className="container nweetEdit">
          <input 
            type="text" 
            placeholder = "Edit your mweet" 
            value={newMweet} 
            required
            onChange={onChange}
            autoFocus
            className="formInput"
          />
          <input type="submit" value="Update" className="formBtn"/>
        </form>
        <button onClick={toggleEdit} className="formBtn cancelBtn">Cancel</button>
      </>: 
      <>
        <div>
          <img 
            src={profile} 
            alt={twitterLogo} 
            className="profile_picture"
          />           
          <p>{mweetObj.writer}</p>
          <p>{`${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}.`}</p>
        </div>
        <div>
          <h4>{mweetObj.text}</h4>
        </div>
        {mweetObj.attachmentUrl && 
          <img src={mweetObj.attachmentUrl} className="mweet__attachment"/>}
        {isOwner && 
          <div className="nweet__actions">
            <button onClick={onDelete}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={toggleEdit}>
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
          </div>
        }
      </>
  }
    </div>
  )
}
export default Mweet;