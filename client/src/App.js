import {
    BrowserRouter,
    useNavigate,
    Route,
    Link,
    Routes
} from "react-router-dom";
import { useState, useMemo, createContext } from "react";
import { UserContext } from "./context/UserContext";
import { socket, SocketContext } from "./context/SocketContext";
import HomePage from "./componets/HomePage";
import RegLogin from "./componets/RegLogin";
function App() {
    const [loggedUser, setLoggedUser] = useState(null)
    // this will change the value only when the loggesUser, or SetLoggedUser is changed
    const userValue = useMemo(() => ({ loggedUser, setLoggedUser }), [loggedUser, setLoggedUser])

    return (
        <BrowserRouter>
                    <UserContext.Provider value={userValue}>
                        <SocketContext.Provider value={socket}>
                            <Routes>
                                <Route path="/regLogin" element={<RegLogin />}></Route>
                                <Route path="/" element={<HomePage />}></Route>
                            </Routes>
                        </SocketContext.Provider>
                    </UserContext.Provider>
        </BrowserRouter>
    );
}

export default App;
