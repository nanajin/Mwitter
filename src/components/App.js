import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import AppRouter from "./Router";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
      if(user){
        if(user.displayName === null){
          const name = user.email.split("@")[0];
          user.displayName = name;
        }
        setUserObj(user);
        // setUserObj({
        //   displayName: user.displayName,
        //   uid: user.uid,
        //   updateProfile: (args)=>updateProfile(user, {displayName: user.displayName})
        // });
      }else{
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = ()=>{
    const user = auth.currentUser;
    setNewName(user.displayName);
    // setUserObj({
    //   displayName: user.displayName,
    //   uid: user.uid,
    //   updateProfile: (args)=>updateProfile(user, {displayName: user.displayName})
    // });
  }
  return (
    <>
      {init ? 
        <AppRouter 
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)} 
          userObj={userObj}
        /> : 
        "Initializing..."}
    </>
  );
}

export default App;
