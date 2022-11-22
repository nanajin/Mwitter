import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";

function AuthForm(){
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

  return (
    <div>
      <form onSubmit={onSubmit} className="container">
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          required
          value={email}
          onChange={onChange}
          className="authInput"
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          required
          value={password}
          onChange={onChange}
          className="authInput"
        />
        <input 
          type="submit" 
          className="authInput authSubmit"
          value={signUp ? "Create Account": "Sign In"}/>
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {signUp? "Sign In": "Create Account"}
      </span>
    </div>
  )
}
export default AuthForm;