import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import ExtractPdf from "./component/extractPdf";
import CreateFolder from "./component/createFolder";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CreateFolder" element={<CreateFolder />} />
          <Route path="/ExtractPdf" element={<ExtractPdf />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
