import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Mweet from "../components/Mweet";
import { db } from "../firebase";
import MweetWrite from "../components/MweetWrite";

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
      <MweetWrite userObj={userObj}/>
      <div style={{ marginTop: 30 }}>
        {mweets.map((mweetObj)=>
          <Mweet
            key={mweetObj.id} 
            mweetObj = {mweetObj}
            isOwner = {mweetObj.uid === userObj.uid}
            profile = {mweetObj.profile}
            // userObj = {userObj}  
          />
        )}
      </div>
    </div>
  )
}
export default Home;