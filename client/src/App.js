import { BrowserRouter, useNavigate, Route, Link, Routes } from "react-router-dom";
import React, { useState, useMemo } from "react";
import { UserContext } from "./context/UserContext";
import HomePage from "./componets/HomePage";
import RegLogin from "./componets/RegLogin";
import { ThemeProvider } from "./context/ThemeContext";
import { AllChatsProvider } from "./context/AllChatsContext"
import { ActivityProvider } from "./context/ActivityContext"
import {SocketProvider} from "./context/SocketContext"
function App() {
    const [loggedUser, setLoggedUser] = useState(undefined)
    // this will change the value only when the loggesUser, or SetLoggedUser is changed
    const userValue = useMemo(() => ({ loggedUser, setLoggedUser }), [loggedUser, setLoggedUser])
    return (
        <ThemeProvider>
            <UserContext.Provider value={userValue}>
                <AllChatsProvider>
                    <SocketProvider>
                        <ActivityProvider>
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/chatapp/regLogin" element={<RegLogin />}></Route>
                                    <Route path="/chatapp/" element={<HomePage />}></Route>
                                </Routes>
                            </BrowserRouter>
                        </ActivityProvider>
                    </SocketProvider>
                </AllChatsProvider>
            </UserContext.Provider>
        </ThemeProvider>
    );
}

export default App;
