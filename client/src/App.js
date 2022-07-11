import {
  BrowserRouter,
  Route,
  Link,
  Routes
} from "react-router-dom";
import RegLoginComp from "./componets/RegLoginComp";
function App() {
  return (
    <BrowserRouter>
      <div id="application">
        <Routes>
          <Route exact path="/regLogin" element={<RegLoginComp />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
