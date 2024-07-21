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

export default function MyNav({ isAuthenticated, setIsAuthenticated, isDarkMode, setIsDarkMode }) {
  // Hooks per la navigazione e la localizzazione
  const location = useLocation();
  const navigate = useNavigate();
  // Stati locali
  const [author, setAuthor] = useState(null);
  //Hook personalizzato per la funzionalità ricerca
  const { toggleSearchVisibility } = useSearch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Prima controlla se ci sono dati utente in localStorage
          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            setAuthor(JSON.parse(storedUserData));
          } else {
            const authorData = await getUserData();
            setAuthor(authorData);
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token non valido:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          setIsAuthenticated(false);
          setAuthor(null);
        }
      } else {
        setIsAuthenticated(false);
        setAuthor(null);
      }
    };

    // Controlla lo stato di login all'avvio
    checkLoginStatus();

    // Aggiungi event listeners per controllare lo stato di login
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("loginStateChange", checkLoginStatus);

    // Cleanup: rimuovi gli event listeners
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStateChange", checkLoginStatus);
    };
  }, [setIsAuthenticated]);

  // Funzione per gestire il logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAuthor(null);
    navigate("/login");
    // Dispara un evento personalizzato per notificare il cambio di stato del login
    window.dispatchEvent(new Event("loginStateChange"));
  };

  // Funzione per gestire il click sull'avatar dell'autore
  const handleAuthorClick = () => {
    if (author && author.email) {
      navigate(`/AuthorPosts/${author.email}`);
    }
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Navbar fluid className="dark:shadow-lg dark:shadow-sky-600 fixed w-full z-10">

      <NavbarBrand href="/home" className="mb-2 xs:mb-0 ">
        <Link to='/home'>
          <img 
            src="https://m.media-amazon.com/images/M/MV5BNDQzNDViNDYtNjE2Ny00YmNhLWExZWEtOTIwMDA1YjY5NDBhXkEyXkFqcGdeQXVyODg3NDc1OTE@._V1_QL75_UX190_CR0,2,190,281_.jpg"
            className="xs:ml-0 mr-3 h-6 w-6 sm:h-6 sm:w-6 md:h-9 md:w-9 lg:h-12 lg:w-12 shadow-[0px_0px_10px] shadow-sky-500 rounded-full"
            alt="POVBlogs Logo"
          />
        </Link>
        <span className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">POVBlogs</span>
      </NavbarBrand>
      
      <div className="flex items-center justify-center xs:ml-0 md:order-2 xs:gap-1">
        {isAuthenticated && (
          <Link to='/create' className="flex xs:ml-0 items-center mr-3 transition-all ease-in-out duration-500 hover:scale-110">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="size-6 border-2 text-gray-400 w-6 h-6 sm:h-8 sm:w-8 p-1 rounded-full border-[#64748b] dark:hover:bg-slate-700 hover:bg-gray-100 hover:text-green-400 hover:shadow-[inset_0px_0px_8px_] hover:shadow-green-400 transition-all ease-in-out duration-500 hover:scale-105"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </Link>
        )}
        {location.pathname === '/home' && (
          <button 
            onClick={toggleSearchVisibility} 
            className="mr-3 flex items-center justify-center border-2 border-[#64748b] hover:shadow-[inset_0px_0px_8px] dark:shadow-sky-500 rounded-full w-6 h-6 sm:w-8 sm:h-8 transition-all ease-in-out duration-500 hover:scale-110"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="size-4 sm:size-5 rounded-full p-0 dark:text-sky-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        )}
        <div className="flex items-center transition-all ease-in-out duration-500 hover:scale-110">
          <DarkThemeToggle onClick={handleDarkModeToggle} className="mr-3 hover:shadow-[inset_0px_0px_8px] dark:hover:shadow-amber-300 dark:hover:text-amber-300 hover:shadow-sky-800 hover:text-sky-800 hover:bg-transparent rounded-full border-2 border-slate-500 p-1 w-6 h-6 sm:h-8 sm:w-8 flex items-center transition-all ease-in-out duration-500 hover:scale-105"/>
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
            <Link to="/Login" className="nav-link text-sm sm:text-base">
              Login
            </Link>
            <span className="text-sm sm:text-base"> o </span>
            <Link to="/Register" className="text-sm sm:text-base">
               Registrati
            </Link>
          </div>
        )}
        <NavbarToggle className="rounded-full p-1 ml-1" />
      </div>
      <NavbarCollapse className="text-center">

        <Link to='/home'>
        <NavbarLink active className="rounded-full mb-1">
          Home
        </NavbarLink>
        </Link>

        <Link to='/authors'>
        <NavbarLink active className="rounded-full">
          Autori
        </NavbarLink>
        </Link>

      </NavbarCollapse>
    </Navbar>
  );
}