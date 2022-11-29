import { doc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";
import {useNavigate} from "react-router-dom";

function Mweet({mweetObj, isOwner, profile}){
  const [detail, setDetail] = useState(false);
  const date = new Date(mweetObj.createdAt);
  const navigate = useNavigate();

  const onMweetClick = ()=>{
    setDetail(true);  
    navigate(`/detail/${mweetObj.id}/${isOwner}`);
  }
  return(
    <div className="nweet">
        <div onClick={onMweetClick}>
          <div className="profile__attachment one_mweet">
            <img 
              src={profile} 
              alt="이미지 없음"
              // className="profile__attachment"
            />           
            <h2>{mweetObj.writer}</h2>
            <p>{`${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}.`}</p>
          </div>
          <div>
            <h4>{mweetObj.text}</h4>
          </div>
          {mweetObj.attachmentUrl && 
            <img src={mweetObj.attachmentUrl} className="mweet__attachment"/>
          }
        </div>
    </div>
  )
}
export default Mweet;