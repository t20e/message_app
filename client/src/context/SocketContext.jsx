import React, { useState, useEffect, createContext, useContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const socket = io.connect('http://localhost:8000')

export const SocketProvider = (props) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [lastPong, setLastPong] = useState(null);

    useEffect(() => {
        socket.on('connection', () => {
            console.log("socket_id: ", socket.id);
            setIsConnected(true);
        });
        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('pong');
        }
    }, [isConnected]);

    return (
        <SocketContext.Provider value={{}}>
            {props.children}
        </SocketContext.Provider>
    )
}