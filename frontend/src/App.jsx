import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Freelancers from "./pages/Freelancers";
import Tasks from "./pages/Tasks";
import PostTask from "./pages/PostTask";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import NotAuthorized from "./pages/NotAuthorized";

import { useState, useEffect } from "react";

function App() {
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const [user, setUser] = useState(null);
  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route
          path="/post-task"
          element={
            <ProtectedRoute user={user} allowedRole="recruiter">
              <PostTask />
            </ProtectedRoute>
          }
        />
        <Route path="/not-authorized" element={<NotAuthorized />} />


        <Route path="/signup" element={<Signup setUser={setUser}/>} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </>
  );
}

export default App;
