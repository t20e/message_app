import React,{ useState, useEffect, createContext } from "react";
import { socket } from './SocketContext';

export const ActivityContext = createContext();

export const ActivityProvider = (props) => {
    const [activeUsers, setActiveUsers] = useState([])
    return (
        <ActivityContext.Provider value={{ activeUsers, setActiveUsers }}>
            {props.children}
        </ActivityContext.Provider>
    )
}