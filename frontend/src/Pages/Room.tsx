import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext';
import UserFeedPlayer from '../Components/UserFeedPlayer';

const Room: React.FC = () => {
    const {id} =useParams();
    const {socket,user,stream}=useContext(SocketContext);
    
    useEffect(()=>{
        // emitting this event so that either creater of room or joinee in the room anyone is added the server knows that new people have been added to this room
        if(user){
            console.log("New user with id",user._id,"has joined room",id);
            socket.emit("joined-room", {roomId:id, peerId:user._id});            
        }
    },[id, socket, user]);

    return (
        <div>
            room: {id}
            <UserFeedPlayer stream={stream} />
        </div>
    )
}

export default Room