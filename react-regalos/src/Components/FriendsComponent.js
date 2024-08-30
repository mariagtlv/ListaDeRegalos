import { useEffect, useState } from "react";
import { backendUrl } from "../Globals";
import AddFriendComponent from "./AddFriendComponent";
import {List} from 'antd'

let FriendsComponent = (props) => {

    let {createNotification}=props
    let [friends,setFriends] = useState([])
    let [message,setMessage]=useState("")
    useEffect(()=>{
        getMyFriends()
    },[])
    

    let getMyFriends = async () => {
        let response = await fetch(backendUrl+"/friends?apiKey="+localStorage.getItem("apiKey"))
        if(response.ok){
            let jsonData = await response.json()
            setFriends(jsonData.friends)
        }else{
            let jsonData = await response.json()
            setMessage(jsonData.error)
        }
    }
    return (
        <>
            <List size="large" header={<h2>My Friends</h2>} bordered dataSource={friends} renderItem={(f)=>(
                <List.Item>
                        
                        <p>{f.emailFriend}</p>
                </List.Item>
            )}>
            </List>
            <AddFriendComponent getMyFriends={getMyFriends} createNotification={createNotification}/>
        </>

    )
}

export default FriendsComponent;