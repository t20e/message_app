import {
    BrowserRouter,
    useNavigate,
    Route,
    Link,
    Routes
} from "react-router-dom";
import { useState, useMemo } from "react";
import { UserContext } from "./context/UserContext";
import { socket, SocketContext } from "./context/SocketContext";
import HomePage from "./componets/HomePage";
import RegLogin from "./componets/RegLogin";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
    // the new obj doesnt have the adress if it wasnt added by user
    let emptyObj = {
        firstName: "",
        lastName: "",
        age: "",
        profilePic: "",
        email: "",
        password: "",
        isActive: "",
        address:
        {
            addressOne: "",
            addressTwo: "",
            postalCode: "",
            city: "",
            state: "",
            country: "",
        },

    }
    const [loggedUser, setLoggedUser] = useState(emptyObj)
    // this will change the value only when the loggesUser, or SetLoggedUser is changed
    const userValue = useMemo(() => ({ loggedUser, setLoggedUser }), [loggedUser, setLoggedUser])
    return (
        <ThemeProvider>
            <UserContext.Provider value={userValue}>
                <SocketContext.Provider value={socket}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/regLogin" element={<RegLogin />}></Route>
                            <Route path="/" element={<HomePage />}></Route>
                        </Routes>
                    </BrowserRouter>
                </SocketContext.Provider>
            </UserContext.Provider>
        </ThemeProvider>
    );
}

export default App;
