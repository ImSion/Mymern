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
import NightSkyBackground from './components/NightSkyBackground';
import './Style/AnimatedBackground.css';
import AuthorsList from "./Pages/AuthorsList";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <SearchProvider>
      <Router>
        <div className="app-container">
          {isDarkMode ? (
            <NightSkyBackground className="background-layer" isVisible={true} />
          ) : (
            <AnimatedBackground className="background-layer" isVisible={true} />
          )}
          <div className="content-wrapper">
            <MyNav 
              isAuthenticated={isAuthenticated} 
              setIsAuthenticated={setIsAuthenticated} 
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<UserPage />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/AuthorPosts/:authorEmail" element={<AuthorPosts />} />
              <Route path="/Authors" element={<AuthorsList />} />
              <Route
                path="/create"
                element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />}
              />
            </Routes>
            <MyFooter />
          </div>
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;