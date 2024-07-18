// Importazione delle dipendenze necessarie
import React, { useEffect, useState, useCallback } from 'react';
import { getPosts } from '../modules/ApiCrud';
import { Link } from 'react-router-dom';
import { useSearch } from '../modules/SearchContext'
import '../Style/Animations.css';
import AnimatedBackground from '../components/AnimatedBackground';

// Definizione del componente principale Home
export default function Home() {
    // Stato per tutti i post
    const [allPosts, setAllPosts] = useState([]);
    // Stato per i post filtrati
    const [filteredPosts, setFilteredPosts] = useState([]);
    // Stato per il termine di ricerca
    const [search, setSearch] = useState('');
    // Stato per l'opzione di ricerca (titolo o autore)
    const [searchOption, setSearchOption] = useState('titolo');
    // Utilizzo del contesto di ricerca per la visibilità della barra di ricerca
    const { isSearchVisible } = useSearch();
    
    // Stati per la paginazione
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(12);

    // Nuovo stato per il testo del titolo
    const [titleText, setTitleText] = useState('');
    const fullTitle = 'Welcome to POVBlogs!';

    // Funzione per recuperare i post dal server
    const fetchPosts = useCallback(async () => {
        try {
            const response = await getPosts();
            setAllPosts(response.data);
            setFilteredPosts(response.data);
        } catch (err) {
            console.error('Errore nella richiesta dei Post', err);
        }
    }, []);

    // Effetto per caricare i post al montaggio del componente
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Effetto per l'animazione del titolo
    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            setTitleText((prev) => {
                if (index < fullTitle.length) {
                    index++;
                    return fullTitle.slice(0, index);
                }
                clearInterval(intervalId);
                return prev;
            });
        }, 200); // qui si regola la velocità dell'animazione

        return () => clearInterval(intervalId);
    }, []);

    // Effetto per filtrare i post in base alla ricerca
    useEffect(() => {
        if (search.trim() === '') {
            setFilteredPosts(allPosts);
        } else {
            const filtered = allPosts.filter(post => {
                if (searchOption === 'titolo') {
                    return post.titolo.toLowerCase().includes(search.toLowerCase());
                } else if (searchOption === 'author') {
                    return post.author.toLowerCase().includes(search.toLowerCase());
                }
                return false;
            });
            setFilteredPosts(filtered);
        }
        setCurrentPage(1);
    }, [search, searchOption, allPosts]);

    // Gestore per il cambiamento del testo di ricerca
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    // Gestore per il cambiamento dell'opzione di ricerca
    const handleOptionChange = (event) => {
        setSearchOption(event.target.value);
    };

    // Calcolo dei post da visualizzare nella pagina corrente
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Funzione per cambiare pagina
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    // Effetto per animare l'apparizione dei post
    useEffect(() => {
        const timer = setTimeout(() => {
            const postElements = document.querySelectorAll('.post-card');
            postElements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * 100);
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [currentPosts]);

    // Rendering del componente
    return (
        <>
            <div className='text-center relative'>
                <AnimatedBackground />
                
                <h1 className='dark:bg-transparent dark:text-white dark:shadow-[0px_-10px_10px] dark:shadow-sky-600 text-3xl sm:text-5xl py-3 font-sans font-semibold h-12 flex items-center justify-center'>
                    {titleText}
                    <span className="animate-blink">|</span>
                </h1>
                
                <div className={`dark:bg-transparent mt-3 rounded-full flex justify-center items-center transition-transform duration-300 ease-in-out transform ${isSearchVisible ? 'scale-100' : 'scale-0'} origin-top`}>
                    {isSearchVisible && (
                        <div className='p-3 rounded-full bg-white h-12 flex border-2 justify-between items-center mt-2'>
                            <input
                                type='text'
                                placeholder={`Cerca per ${searchOption === 'titolo' ? 'titolo' : 'autore'}...`}
                                value={search}
                                onChange={handleSearch}
                                className='border-none focus:outline-none focus:ring-0 rounded-full p-2 mr-2 h-10'
                            />
                            <select value={searchOption} onChange={handleOptionChange} className='border-none focus:outline-none focus:ring-0 rounded-lg p-2 h-10'>
                                <option value='titolo'>Titolo</option>
                                <option value='author'>Autore</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className=' flex flex-wrap transition-all ease-in-out duration-300  justify-center p-3 min-h-screen relative'>
                    {currentPosts.map((post) => (
                        <div key={post._id} className='post-card relative overflow-hidden rounded-lg w-[300px] xl:w-[550px] h-[400px] dark:shadow-md dark:hover:shadow-lg dark:hover:shadow-sky-500 dark:shadow-sky-500 transition-all ease-in-out duration-300 mx-3 mb-8 mt-10 group'>
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-in-out group-hover:scale-110"
                                style={{
                                    backgroundImage: `url(${post.cover})`
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                            <Link to={`/post/${post._id}`} className="absolute inset-0 z-10">
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                                    <h2 className='text-white text-xl font-bold mb-2 line-clamp-2'>{post.titolo}</h2>
                                    <Link to={`/AuthorPosts/${post.author}`} className="block">
                                        <p className='hover:scale-105 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500 rounded-full hover:shadow-md hover:shadow-sky-700 transition-transform duration-500 inline-block'>
                                            Autore: {post.author}
                                        </p>
                                    </Link>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {filteredPosts.length > postsPerPage && (
                    <div className="pagination flex justify-center items-center mt-4 mb-4">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="mx-1 px-1 shadow-md shadow-gray-700 rounded-full py-1 border bg-sky-700 text-white disabled:bg-gray-500 disabled:text-gray-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <span className="mx-2 text-xl dark:text-white">
                            {currentPage}/{Math.ceil(filteredPosts.length / postsPerPage)}
                        </span>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
                            className="mx-1 px-1 shadow-md shadow-gray-700 rounded-full py-1 border bg-sky-700 text-white disabled:bg-gray-500 disabled:text-gray-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}