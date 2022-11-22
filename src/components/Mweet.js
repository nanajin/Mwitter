import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";
import { db, storage } from "../firebase";

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
    <div>
      {edit ? <>
        <form onSubmit={onEditSubmit}>
          <input 
            type="text" 
            placeholder = "Edit your mweet" 
            value={newMweet} 
            required
            onChange={onChange}
          />
          <input type="submit" value="Update"/>
        </form>
        <button onClick={toggleEdit}>Cancel</button>
      </>: 
      <>
        <h4>{mweetObj.text}</h4>
        {mweetObj.attachmentUrl && 
          <img 
            src={mweetObj.attachmentUrl} 
            width="50px" 
            height="50px"
          />}
        {isOwner && 
          <>
            <button onClick={onDelete}>Delete</button>
            <button onClick={toggleEdit}>Edit</button>
          </>
        }
      </>
  }
    </div>
  )
}
export default Mweet;