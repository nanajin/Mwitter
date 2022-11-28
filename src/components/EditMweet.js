import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";
import {useLocation, useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function EditMweet(){
  const location = useLocation();
  const mweetObj = location.state.mweetObj.mweetObj;
  const docId = location.state.docId.docId;
  const [newMweet, setNewMweet] = useState(mweetObj.text);
  const [newAttachment, setNewAttachment] = useState(mweetObj.attachmentUrl);
  const [selectFile, setSelectFile] = useState(false);
  const mweetTextRef = doc(db, "mweets", `${docId}`);
  const navigate = useNavigate();
  
  const onCancelEdit = () =>{
    const ok = window.confirm("글 수정을 취소하시겠습니까?");
    if(ok){
      navigate(-1);
    }
  }
  const onFileChange = (event)=>{
    const {target: {files}} = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent)=>{
      const {currentTarget: {result}} = finishedEvent;
      setNewAttachment(result);
    }
    reader.readAsDataURL(file);
  }
  const onEditSubmit = async(event)=>{
    event.preventDefault();
    await updateDoc(mweetTextRef, {text: newMweet, attachmentUrl: newAttachment});
    navigate("/");
  }
  const onChange = (event)=>{
    const {target: {value}} = event;
    setNewMweet(value);
  }
  const onRemoveAttachment = async(event)=>{
    event.preventDefault();
    if(window.confirm("첨부파일을 삭제하시겠습니까?")){
      setNewAttachment("");
      setSelectFile(true);
    }
  }

  return(
    <div className="nweet">
       <>
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
        {newAttachment && 
          <div className="edit__attachment">
            <img 
              src={newAttachment} 
              style={{
                backgroundImage: newAttachment,
              }}
            />
            <div className="factoryForm__clear" onClick={onRemoveAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
            </div>
        }
        {selectFile && 
          <input
            id="attach-file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            />}
          <input type="submit" value="Update" className="formBtn"/>
        </form>
        <button onClick={onCancelEdit} className="formBtn cancelBtn">Cancel</button>
      </>
      
  
    </div>
  )
}
export default EditMweet;