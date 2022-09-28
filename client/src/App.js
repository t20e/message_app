import {
    BrowserRouter,
    Route,
    Link,
    Routes
} from "react-router-dom";
import { useState, useMemo } from "react";
import { UserContext } from "./context/UserContext";
import { socket, SocketContext } from "./context/SocketContext";
import HomePage from "./componets/HomePage";
import RegLogin from "./componets/RegLogin";


function App() {
    const [loggedUser, setLoggedUser] = useState('hello from context')
    // this will change the value only when the loggesUser, or SetLoggedUser is changed
    const userValue = useMemo(() => ({ loggedUser, setLoggedUser }), [loggedUser, setLoggedUser])
    return (
        <BrowserRouter>
            <div id="application">
                <UserContext.Provider value={userValue}>
                    <SocketContext.Provider value={socket}>
                        <Routes>
                            <Route path="/regLogin" element={<RegLogin />}></Route>
                            <Route path="/" element={<HomePage />}></Route>
                        </Routes>
                    </SocketContext.Provider>
                </UserContext.Provider>
            </div>
        </BrowserRouter>
    );
}

export default App;
