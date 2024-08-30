import { useEffect, useState } from "react";
import { backendUrl } from "../Globals";
import AddFriendComponent from "./AddFriendComponent";

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

    let deleteFriend = async(email)=>{
        let response = await fetch(backendUrl+"/friends?emailFriend="+email+"&apiKey="+localStorage.getItem("apiKey"),{
            method: "DELETE"
        })
        if(response.ok){
            getMyFriends()
            createNotification("Friend is deleted","success")
        }else{
            let jsonData = await response.json()
            createNotification(jsonData.error)
        }
    }
    return (
        <div>
            <div className="friends-container">
                {message!=""&&<p>{message}</p>}
                <h2>My Friends</h2>
                {friends.length>0 &&
                    <ul className="friends-list">
                        {friends.map(f=>(
                            <div  className="friend-item">
                                <li>{f.emailFriend}</li>
                                <button onClick={()=>deleteFriend(f.emailFriend)}>Delete</button>
                            </div>
                        ))}
                    </ul>
                }
            </div>
        <AddFriendComponent getMyFriends={getMyFriends} createNotification={createNotification}/>
        </div>

    )
}

export default FriendsComponent;