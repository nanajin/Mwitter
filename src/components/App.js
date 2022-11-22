import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import AppRouter from "./Router";

function App() {
  const [init, setInit] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
      if(user){
        // setIsLoggedIn(true);
        setUserObj(user);
      // }else{
      //   setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? 
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj}/> : 
        "Initializing..."}
    </>
  );
}

export default App;
