import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

import { GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { auth } from "../firebase";
import AuthForm from "../components/AuthForm";

function Auth(){
  const onSocialClick = async(event)=>{
    const {target: {name}} = event;
    const provider = new GoogleAuthProvider();

    if(name === "google"){
      await signInWithPopup(auth, provider)
      .then((result)=>{
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
      }).catch(e=>{
        console.log(e);
      })
    }
  }

  return (
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm/>
      <div className="authBtns">
        <button name="google" onClick={onSocialClick} className="authBtn">
          Continue with Google
          <FontAwesomeIcon icon={faGoogle} />
        </button>
      </div>
    </div>
  )
}
export default Auth;