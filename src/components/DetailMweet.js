import { deleteDoc, doc, getDocFromCache } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

function DetailMweet(){
    const docId = useParams().id;
    const owner = useParams().owner;
    let isOwner = true;
    if(owner === "false"){
        isOwner = false;
    }
    // const isOwner = false;
    console.log(isOwner)
    const mweetTextRef = doc(db, "mweets", `${docId}`);
    const [mweetObj, setMweetObj] = useState({});

    const getMweet = async()=>{
        const docRef = doc(db, "mweets", `${docId}`);
        try{
            const mweet = await getDocFromCache(docRef);
            setMweetObj(mweet.data());
        }catch(e){
            console.log(e);
        }
    }
    useEffect(()=>{
        getMweet();
    },[]);

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

    return(
        <div className="detail_container">
            <div className="detail_profile">
                <img 
                src={mweetObj.profile} 
                alt="이미지 없음"
                className="profile_picture"
                />           
                <p>{mweetObj.writer}</p>
                {/* <p>{`${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}.`}</p> */}
                {isOwner && 
                    <div className="nweet__actions">
                        <button onClick={onDelete}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <Link to={`/edit/${docId}`}
                            state={{
                                mweetObj:{mweetObj},
                                docId: {docId}
                            }}
                        >
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </Link>
                    </div>
                }
            </div>
            <div className="detail_contents">
                <h4>{mweetObj.text}</h4>
                {mweetObj.attachmentUrl && 
                    <img 
                        src={mweetObj.attachmentUrl} 
                        className="detail_attachment"/>
                }
            </div>

        </div>
    )
}
export default DetailMweet;