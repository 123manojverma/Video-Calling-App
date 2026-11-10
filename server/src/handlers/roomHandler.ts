import {Socket} from "socket.io";
import {v4 as UUIDv4} from "uuid";
import type IRoomParams from "../interfaces/iRoomParams.js";

const rooms:Record<string,string[]>={};

const roomHandler = (socket: Socket) => {

    // the below map stores for a room what all peers have joined

    const createRoom = () => {
        const roomId = UUIDv4(); // this will be our unique room id in which multiple connection will exchange data
        socket.join(roomId); // we will make the socket connection enter a new room

        rooms[roomId]=[]; // create a new entry for the room

        socket.emit("room-created", {roomId}); // we will emit an event from server side that socket connection has been added to a room
        console.log("Room created with ID",roomId);
    };

    // The below function is executed everytime a user(create or joinee) joins a new room
    const joinedRoom = ({roomId,peerId}:IRoomParams) => {
        if(rooms[roomId]){
            // If the given roomId exist in the memory db
            console.log("New user has joined room",roomId,"with peer id as",peerId);
            // the moment new user joins, add the peerId to the key of roomId
            rooms[roomId].push(peerId);
            socket.join(roomId); // make the user join the socket room

            // below event is for logging purpose
            socket.emit("get-users",{
                roomId,
                participants: rooms[roomId]
            })
        }
    };

    // When to call the above two function ?

    // We will call the above function when the client will emit events to create room and join room
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};

export default roomHandler;
