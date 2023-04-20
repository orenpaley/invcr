import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Navigation from "./Components/Nav";
import LobsterRoutes from "./Routes/Routes";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <LobsterRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
