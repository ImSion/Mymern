import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SearchProvider } from "./modules/SearchContext";
import MyNav from "./components/MyNav";
import CreatePost from "./Pages/CreatePost";
import Home from "./Pages/Home";
import MyFooter from "./components/MyFooter";
import PostDetail from "./Pages/PostDetail";
import AuthorPosts from "./Pages/AuthorPosts";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AnimatedBackground from "./components/AnimatedBackground";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <SearchProvider>
      <Router>
       <AnimatedBackground /> 
        <MyNav isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/AuthorPosts/:authorEmail" element={<AuthorPosts />} />
          <Route
            path="/create"
            element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />}
          />
        </Routes>
        <MyFooter />
      </Router>
    </SearchProvider>
  );
}

export default App;