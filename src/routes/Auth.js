import React, { useState } from "react";
import {createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import { auth } from "../firebase";

function Auth(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, setSignUp] = useState(true);

  const onChange = (event)=>{
    const {target: {name, value}} = event;
    if(name === "email"){
      setEmail(value);
    }
    else if(name === "password"){
      setPassword(value);
    }
  }

  const onSubmit = async(event)=>{
    event.preventDefault();
    if(signUp){
      await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential)=>{
        const user = userCredential.user;
        console.log(user);
      })
      .catch(e=>{
        console.log(e);
      })
    }
    else{
      await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential)=>{
        const user = userCredential.user;
        console.log(user);
      })
      .catch(e=>{
        console.log(e);
      })
    }
  }

  const toggleAccount = ()=>{
    setSignUp((prev)=> !prev);
  }
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
    <div>
      <form onSubmit={onSubmit}>
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          required
          value={email}
          onChange={onChange}
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          required
          value={password}
          onChange={onChange}
        />
        <input 
          type="submit" 
          value={signUp ? "Create Account": "Sign In"}/>
      </form>
      <span onClick={toggleAccount}>
        {signUp? "Sign In": "Create Account"}
      </span>
      <div>
        <button name="google" onClick={onSocialClick}>Continue with Google</button>
      </div>
    </div>
  )
}
export default Auth;