import React, { useState, useEffect, createContext, useContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const socket = io.connect("http://54.157.45.38/socket.io")
// my server and front end is on the same domain so i can use below
// TODO for deployment
// export const socket = io( {
    // WARNING: in that case, there is no fallback to long-polling
    // transports: [ 'websocket', 'polling' ]// or [ "websocket", "polling" ] (the order matters)
//   })
export const SocketProvider = (props) => {
    // const [isConnected, setIsConnected] = useState(socket.connected);
    // const [lastPong, setLastPong] = useState(null);

    // useEffect(() => {
    //     socket.on('connection', () => {
    //         console.log("socket_id: ", socket.id);
    //         setIsConnected(true);
    //     });
    //     socket.on('disconnect', () => {
    //         setIsConnected(false);
    //     });

    //     return () => {
    //         socket.off('connect');
    //         socket.off('disconnect');
    //         // socket.off('pong');
    //     }
    // }, [isConnected]);

    return (
        <SocketContext.Provider value={{}}>
            {props.children}
        </SocketContext.Provider>
    )
}