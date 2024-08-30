
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
import {Layout, Menu, notification} from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import IndexComponent from './Components/IndexComponent';

function App() {
  let [api,contextHolder]=notification.useNotification()
  
  let [login,setLogin]=useState(false)
  let navigate = useNavigate()

  let createNotification = (msg,type="info",placement="top") =>{
    api[type]({
      message:msg,
      description:msg,
      placement:placement
    })

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
    <>
      {contextHolder}
      <Layout style={{minHeight: "100vh"}}>
        <Header>
          {!login && (
            <Menu theme='dark' mode='horizontal' items={
              [{key: "menuRegister", label: <Link to="/register">Register</Link>},
                {key: "menuLogin", label: <Link to="/login">Log In</Link>}
              ]
            }></Menu>
          )}
          {login && (<Menu theme='dark' mode='horizontal'  items={
            [{key: "menuAddPresent", label: <Link to="/addPresent">Add Present</Link>},
              {key: "menuMyPresents", label: <Link to="/myPresents">My Presents</Link>},
              {key: "menuFindPresents", label: <Link to="/findPresents">Find Presents</Link>},
              {key: "menuFriends", label: <Link to="/friends">Friends</Link>},
              {key: "menuDisconnect", label: <Link to="#" onClick={disconnect}>Disconnect</Link>}
            ]
          }></Menu>)}
        </Header>
        <Content>
          <Routes>
            <Route path="/" element={<IndexComponent/>}></Route>
            <Route path="/register" element={<RegisterUserComponent/>}></Route>
            <Route path="/login" element={<LoginUserComponent setLogin={setLogin}/>}></Route>
            <Route path="/addPresent" element={<AddPresentComponent createNotification={createNotification}/>}></Route>
            <Route path="/myPresents" element={<MyPresentsComponent/>}></Route>
            <Route path="/present/:id" element={<PresentComponent createNotification={createNotification}/>}></Route>
            <Route path="/findPresents" element={<PresentsOfUserComponent createNotification={createNotification}/>}></Route>
            <Route path="/edit/:id" element={<EditPresentComponent createNotification={createNotification}/>}></Route>
            <Route path="/friends" element={<FriendsComponent createNotification={createNotification}/>}></Route>
          </Routes>
        </Content>
        <Footer style={{textAlign: "center"}}>
          Website for gifting.
        </Footer>
      </Layout>
    
    </>
  );
}

export default App;
