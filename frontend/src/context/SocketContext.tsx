import SocketIoClient from "socket.io-client";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import {v4 as UUIDv4} from "uuid";

const WS_Server="http://localhost:5500";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export const SocketContext=createContext<any | null>(null);

const socket=SocketIoClient(WS_Server,{
    withCredentials:false,
    transports:["polling","websocket"]
});

interface Props{
    children:React.ReactNode
}

export const SocketProvider:React.FC<Props>=({children})=>{

    const navigate=useNavigate(); // will help to programatically handle navigation

    // state variable to store the userId
    const [user,setUser]=useState<Peer>(); // new peer user

    useEffect(()=>{
        const userId=UUIDv4();
        const newPeer=new Peer(userId);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(newPeer);

        const enterRoom=({roomId}:{roomId:string})=>{
            navigate(`/room/${roomId}`)
        }

        // we will transfer the user to the room page when we collect an event of room-created from server
        socket.on("room-created",enterRoom)
    },[]);

    return (
        <SocketContext.Provider value={{socket,user}}>
            {children}
        </SocketContext.Provider>
    )
}