import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<Dashboard />} />
      <Route path="/agent" element={<Dashboard />} />
      <Route path="/user" element={<Dashboard />} />
    </Routes>
  );
}

export default App;