import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  DarkThemeToggle,
} from "flowbite-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserData } from "../modules/ApiCrud";
import { useSearch } from '../modules/SearchContext';

export default function MyNav({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const [author, setAuthor] = useState(null);
  const navigate = useNavigate();
  const { toggleSearchVisibility } = useSearch();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const authorData = await getUserData();
          setAuthor(authorData);
        } catch (error) {
          console.error("Errore nel recupero dei dati dell'autore:", error);
        }
      };
      fetchUserData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAuthor(null);
    navigate("/login");
  };

  const handleAuthorClick = () => {
    if (author && author.email) {
      navigate(`/AuthorPosts/${author.email}`);
    }
  };

  return (
    <Navbar fluid>
      <NavbarBrand href="/home">
        <Link to='/home'>
          <img 
            src="https://m.media-amazon.com/images/M/MV5BNDQzNDViNDYtNjE2Ny00YmNhLWExZWEtOTIwMDA1YjY5NDBhXkEyXkFqcGdeQXVyODg3NDc1OTE@._V1_QL75_UX190_CR0,2,190,281_.jpg"
            className="mr-3 h-6 w-6 sm:h-6 sm:w-6 md:h-9 md:w-9 lg:h-12 lg:w-12 shadow-[0px_0px_10px] shadow-sky-500 rounded-full"
            alt="POVBlogs Logo"
          />
        </Link>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">POVBlogs</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        {isAuthenticated && (
          <Link to='/create' className="flex items-center mr-3 transition-all ease-in-out duration-500 hover:scale-110">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="size-6 border-2 text-gray-400 h-8 w-8 p-1 rounded-full border-[#64748b] dark:hover:bg-slate-700 hover:bg-gray-100 hover:text-green-400 hover:shadow-[inset_0px_0px_8px_] hover:shadow-green-400 transition-all ease-in-out duration-500 hover:scale-105"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </Link>
        )}
        {location.pathname === '/home' && (
          <button 
            onClick={toggleSearchVisibility} 
            className="mr-3 transition-all ease-in-out duration-500 hover:scale-110"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="size-6 dark:text-sky-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        )}
        <div className="flex items-center transition-all ease-in-out duration-500 hover:scale-110">
          <DarkThemeToggle className="mr-3 hover:shadow-[inset_0px_0px_8px] dark:hover:shadow-amber-300 hover:shadow-sky-800 hover:bg-transparent rounded-full border-2 border-slate-500 p-1 h-8 w-8 transition-all ease-in-out duration-500 hover:scale-105"/>
        </div>
        {isAuthenticated ? (
          author && (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="User settings" img={author.avatar} rounded className="mr-2 transition-all ease-in-out duration-500 hover:scale-105 rounded-full hover:shadow-md hover:shadow-sky-600"/>
              }
            >
              <div onClick={handleAuthorClick} className="cursor-pointer">
                <DropdownHeader>
                  <span className="block text-sm">{author.nome}</span>
                  <span className="block truncate text-sm font-medium">{author.email}</span>
                </DropdownHeader>
              </div>
              <DropdownItem>Dashboard</DropdownItem>
              <DropdownItem>Settings</DropdownItem>
              <DropdownItem>Earnings</DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
            </Dropdown>
          )
        ) : (
          <div>
            <Link to="/Login" className="nav-link">
              Login
            </Link>
            <span> o </span>
            <Link to="/Register">
               Registrati
            </Link>
          </div>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink className="hover:animate-pulse" active>
          <Link to='/home' >Home</Link>
        </NavbarLink>
        <NavbarLink href="#">Services</NavbarLink>
        <NavbarLink href="#">Pricing</NavbarLink>
        <NavbarLink href="#">Contact</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}