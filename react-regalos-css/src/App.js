import './App.css'
import {Routes,Route,Link, useNavigate} from 'react-router-dom'
import RegisterUserComponent from './Components/RegisterUserComponent';
import LoginUserComponent from './Components/LoginUserComponent';
import AddPresentComponent from './Components/AddPresentComponent';
import MyPresentsComponent from './Components/MyPresentsComponent';
import PresentComponent from './Components/PresentComponent';
import PresentsOfUserComponent from './Components/PresentsOfUserComponent';
import EditPresentComponent from './Components/EditPresentComponent';
import { useEffect, useState } from 'react';
import FriendsComponent from './Components/FriendsComponent';
import IndexComponent from './Components/IndexComponent';

function App() {
  let [notification,setNotification]=useState("")
  
  let [login,setLogin]=useState(false)
  let navigate = useNavigate()

  let createNotification = (msg) =>{
    setNotification(msg)
    setTimeout(()=>{
      setNotification("")
    },3000)

  }

  useEffect(()=>{
    checkIfLogin()
  },
  [])

  

  let checkIfLogin = () =>{
    if(localStorage.getItem("apiKey")!=null){
      setLogin(true)
    }else{
      setLogin(false)
    }
  }

  let disconnect = () =>{
    
    localStorage.removeItem("apiKey")
    setLogin(false)
    setTimeout(() => {
      navigate("/login");
  }, 0);
  }

  return (
    <div className="main-container">
      <nav className='navbar'>
        <ul>
          {!login && <li><Link to="/register">Register</Link></li>}
          {!login &&<li><Link to="/login" >Log In</Link></li>}
          {login && <li><Link to="/addPresent">Add Present</Link></li>}
          {login &&<li><Link to="/myPresents">My Presents</Link></li>}
          {login &&<li><Link to="/findPresents">Find Presents</Link></li>}
          {login &&<li><Link to="/friends">Friends</Link></li>}
          {login &&<li><Link to="#" onClick={disconnect}>Disconnect</Link></li>}
        </ul>
      </nav>
      {notification!="" && (
        <div className='notification'>      {notification}
          <span className='close-btn' onClick={()=>{setNotification("")}}>X</span>
        </div>
      )}
      <Routes>
        <Route path="/register" element={<RegisterUserComponent/>}></Route>
        <Route path="/login" element={<LoginUserComponent setLogin={setLogin}/>}></Route>
        <Route path="/addPresent" element={<AddPresentComponent createNotification={createNotification}/>}></Route>
        <Route path="/myPresents" element={<MyPresentsComponent/>}></Route>
        <Route path="/present/:id" element={<PresentComponent createNotification={createNotification}/>}></Route>
        <Route path="/findPresents" element={<PresentsOfUserComponent createNotification={createNotification}/>}></Route>
        <Route path="/edit/:id" element={<EditPresentComponent createNotification={createNotification}/>}></Route>
        <Route path="/friends" element={<FriendsComponent createNotification={createNotification}/>}></Route>
        <Route path="/" element={<IndexComponent/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
