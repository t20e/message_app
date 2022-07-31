import {
  BrowserRouter,
  Route,
  Link,
  Routes
} from "react-router-dom";
import HomePage from "./componets/HomePage";
import RegLogin from "./componets/RegLogin";
function App() {
  return (
    <BrowserRouter>
      <div id="application">
        <Routes>
          <Route path="/regLogin" element={<RegLogin />}></Route>
          <Route path="/" element={<HomePage />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
