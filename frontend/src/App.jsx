import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

import Home from "./pages/Home";
import Freelancers from "./pages/Freelancers";
import Tasks from "./pages/Tasks";
import PostTask from "./pages/PostTask";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import NotAuthorized from "./pages/NotAuthorized";
import RecruiterTasks from "./pages/RecruiterTasks";
import Chat from "./pages/Chat";
import FreelancerChats from "./pages/FreelancerChat";
import RecruiterChats from "./pages/RecruiterChat";
import AppliedTasks from "./pages/AppliedTasks";

import { useState, useEffect } from "react";

function App() {
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="app-layout">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/freelancers" element={<Freelancers />} />
          <Route path="/tasks" element={<Tasks user={user} />} />
          <Route
            path="/post-task"
            element={
              <ProtectedRoute user={user} allowedRole="recruiter">
                <PostTask />
              </ProtectedRoute>
            }
          />
          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route
            path="/recruiter/tasks"
            element={<RecruiterTasks user={user} />}
          />

          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/chat/:id" element={<Chat user={user} />} />
          <Route path="/freelancer/chats" element={<FreelancerChats />} />
          <Route path="/recruiter/chats" element={<RecruiterChats />} />
          <Route path="/freelancer/applied-tasks" element={<AppliedTasks />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
