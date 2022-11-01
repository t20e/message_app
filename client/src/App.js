import {
    BrowserRouter,
    useNavigate,
    Route,
    Link,
    Routes
} from "react-router-dom";
import { useState, useMemo } from "react";
import { UserContext } from "./context/UserContext";
import HomePage from "./componets/HomePage";
import RegLogin from "./componets/RegLogin";
import { ThemeProvider } from "./context/ThemeContext";
import { AllChatsProvider } from "./context/AllChatsContext"
// import { SocketProvider } from "./context/SocketContext"

function App() {
    const [loggedUser, setLoggedUser] = useState()
    // this will change the value only when the loggesUser, or SetLoggedUser is changed
    const userValue = useMemo(() => ({ loggedUser, setLoggedUser }), [loggedUser, setLoggedUser])
    return (
        // <SocketProvider>
            <ThemeProvider>
                <UserContext.Provider value={userValue}>
                    <AllChatsProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/regLogin" element={<RegLogin />}></Route>
                                <Route path="/" element={<HomePage />}></Route>
                            </Routes>
                        </BrowserRouter>
                    </AllChatsProvider>
                </UserContext.Provider>
            </ThemeProvider>
        // </SocketProvider>
    );
}

export default App;
