import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Mweet from "../components/Mweet";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Home({userObj}){
  const [mweets, setMweets] = useState([]);
  
  useEffect(()=>{
    const q = query(
      collection(db, "mweets"),
      orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot)=>{
      const mweetArr = snapshot.docs.map((document)=>(
        {id: document.id,
        ...document.data(),}
      ))
      setMweets(mweetArr);
    })
  }, []);
  return (
    <div className="container">
      <div className="write_icon_box">
        <Link to="/mweetwrite" className="write_icon">
            <FontAwesomeIcon icon={faPencilAlt}/>
        </Link>
      </div>
      <div style={{ marginTop: 30 }}>
        {mweets.map((mweetObj)=>
          <Mweet
            key={mweetObj.id} 
            mweetObj = {mweetObj}
            isOwner = {mweetObj.uid === userObj.uid}
            profile = {mweetObj.profile}
          />
        )}
      </div>
    </div>
  )
}
export default Home;