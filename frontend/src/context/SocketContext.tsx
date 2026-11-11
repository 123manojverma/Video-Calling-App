import SocketIoClient from "socket.io-client";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";

const WS_Server = "http://localhost:5500";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server, {
    withCredentials: false,
    transports: ["polling", "websocket"]
});

interface Props {
    children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({ children }) => {

    const navigate = useNavigate(); // will help to programatically handle navigation

    // state variable to store the userId
    const [user, setUser] = useState<Peer>(); // new peer user
    const [stream, setStream] = useState<MediaStream>();

    useEffect(() => {
        const userId = UUIDv4();
        const newPeer = new Peer(userId, {
            host: "localhost",
            port: 9000,
            path: "/myapp"
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(newPeer);

        let isMounted = true;
        let mediaStream: MediaStream | undefined;

        const fetchUserFeed = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (isMounted) {
                    mediaStream = stream;
                    setStream(stream);
                } else {
                    stream.getTracks().forEach((track) => track.stop());
                }
            } catch (error) {
                console.error("Could not access camera and microphone:", error);
            }
        }

        void fetchUserFeed();

        return () => {
            isMounted = false;
            newPeer.destroy();
            mediaStream?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    useEffect(() => {
        const enterRoom = ({ roomId }: { roomId: string }) => {
            navigate(`/room/${roomId}`);
        };
        const fetchParticipants = ({ roomId, participants }: { roomId: string, participants: string[] }) => {
            console.log("Fetched room participants");
            console.log(roomId, participants);
        };

        socket.on("room-created", enterRoom);
        socket.on("get-users", fetchParticipants);

        return () => {
            socket.off("room-created", enterRoom);
            socket.off("get-users", fetchParticipants);
        };
    }, [navigate]);

    return (
        <SocketContext.Provider value={{ socket, user, stream }}>
            {children}
        </SocketContext.Provider>
    )
}