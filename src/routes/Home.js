import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useEffect, useState } from "react";
import Mweet from "../components/Mweet";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from 'uuid';

function Home({userObj}){
  const [mweet, setMweet] = useState("");
  const [mweets, setMweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  const getMweets = async()=>{
    const dbMweets = await getDocs(collection(db, "mweets"));
    dbMweets.forEach(doc=>{
      const mweetObject = {
        ...doc.data(),
        id: doc.id,
      };
      setMweets(prev=>[mweetObject, ...prev]);
    });
  }
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
  const onSubmit = async(event)=>{
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
      attachmentUrl
    }
    try{
      const docRef = await addDoc(collection(db, "mweets"), mweetObj);
    }
    catch(e){
      console.log(e);
    }
    setMweet("");
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
    setAttachment(null);
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input 
          value={mweet}
          onChange={onChange}
          type="text" 
          placeholder="What's on your mind?" 
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange}/>
        <input type="submit" value="Mweet"/>
        {attachment && 
          <div>
            <img src={attachment} width="50px" height="50px"/>
            <button onClick={onClearAttachment}>Clear</button>
          </div>}
      </form>
      <div>
        {mweets.map((mweet)=>
          <Mweet
            key={mweet.id} 
            mweetObj = {mweet}
            isOwner = {mweet.uid === userObj.uid}  
          />
        )}
      </div>
    </>
  )
}
export default Home;