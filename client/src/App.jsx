// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResendVerification from "./pages/ResendVerification";
import VerifyEmail from "./component/VerifyEmail";
import { AuthProvider } from "./context/AuthContext";

// User Route
import Dashboard from "./User/Dashboard";
import UserSetting from "./User/UserSetting";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<Dashboard />} />
          <Route path="/setting" element={<UserSetting />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
