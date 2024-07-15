import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import MyNav from "./components/MyNav";
import CreatePost from "./Pages/CreatePost";
import Home from "./Pages/Home";
import MyFooter from "./components/MyFooter";
import PostDetail from "./Pages/PostDetail";
import AuthorPosts from "./Pages/AuthorPosts";
import Login from "./Pages/Login";
import Register from "./Pages/Register";




function App() {

  return (
    
    <Router>
      <MyNav />
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/Login" element={<Login/>}></Route>
        <Route path="/Register" element={<Register/>}></Route>
        <Route path="/create" element={<CreatePost/>}></Route>
        <Route path="/post/:id" element={<PostDetail/>}></Route>
        <Route path="/AuthorPosts/:authorEmail" element={<AuthorPosts/>}></Route>
      </Routes>
      <MyFooter />
    </Router>
    
  )
}

export default App
