import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { db, storage } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

function Mweet({mweetObj, isOwner}){
  const [edit, setEdit] = useState(false);
  const [newMweet, setNewMweet] = useState(mweetObj.text);
  const mweetTextRef = doc(db, "mweets", `${mweetObj.id}`);

  const toggleEdit = () =>{
    setEdit((prev)=>!prev);
  }

  const onDelete = async()=>{
    const ok = window.confirm("Want you delete?");
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
        <h4>{mweetObj.text}</h4>
        {mweetObj.attachmentUrl && 
          <img src={mweetObj.attachmentUrl}/>}
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