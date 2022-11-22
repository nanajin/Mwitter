import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Mweet from "../components/Mweet";
import { db } from "../firebase";
import MweetFactory from "../components/MweetFactory";

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
      <MweetFactory userObj={userObj}/>
      <div style={{ marginTop: 30 }}>
        {mweets.map((mweet)=>
          <Mweet
            key={mweet.id} 
            mweetObj = {mweet}
            isOwner = {mweet.uid === userObj.uid}  
          />
        )}
      </div>
    </div>
  )
}
export default Home;