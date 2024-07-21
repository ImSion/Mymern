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

    // Per caricare i post al montaggio del componente
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Per l'animazione del titolo
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

    // Per filtrare i post in base alla ricerca
    useEffect(() => {
        if (search.trim() === '') {
            setFilteredPosts(allPosts);
        } else {
            const searchLower = search.toLowerCase().trim();
            const filtered = allPosts.filter(post => {
                if (searchOption === 'titolo') {
                    // Controlla se il titolo inizia con la stringa di ricerca
                    return post.titolo.toLowerCase().startsWith(searchLower);
                } else if (searchOption === 'author') {
                    // Controlla se l'autore inizia con la stringa di ricerca
                    return post.author.toLowerCase().startsWith(searchLower);
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

    // Per animare l'apparizione dei post
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
                
                <h1 className='dark:bg-transparent mt-3 dark:text-white text-3xl sm:text-5xl py-3 font-sans font-semibold h-12 flex items-center justify-center'>
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
                            <select value={searchOption} onChange={handleOptionChange} className='border-none focus:outline-none focus:ring-0 rounded-lg p-2 h-10 text-gray-800'>
                                <option value='titolo'>Titolo</option>
                                <option value='author'>Autore</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className=' flex flex-wrap transition-all ease-in-out duration-300  justify-center p-3 min-h-screen relative'>
                {currentPosts.map((post) => (
                    <div key={post._id} className='post-card relative overflow-hidden rounded-lg w-[300px] xl:w-[550px] h-[400px] shadow-[_7px_7px_10px] shadow-gray-600 dark:shadow-md dark:hover:shadow-lg dark:hover:shadow-sky-500 dark:shadow-sky-500 transition-all ease-in-out duration-300 mx-3 mb-8 mt-10 group'>
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-in-out group-hover:scale-110"
                            style={{
                                backgroundImage: `url(${post.cover})`
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                        
                        {/* Badge per il numero di commenti */}
                        <div className="flex rounded-l-full absolute top-2 right-0 bg-white dark:bg-gray-800 text-black dark:text-white px-2 py-1 text-xs font-bold z-20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            {post.comments ? post.comments.length : 0}

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1 ml-2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                           {post.readTime.value}
                        </div>
                
                        <Link to={`/post/${post._id}`} className="absolute inset-0 z-10">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                                <h2 className='text-white text-xl font-bold mb-2 line-clamp-2'>{post.titolo}</h2>
                                <Link to={`/AuthorPosts/${post.author}`} className="flex flex-col items-center">
                                    <h1 className='text-white'>Autore</h1>
                                    <p className='hover:scale-105 text-white items-center justify-center rounded-lg px-1 hover:shadow-md hover:shadow-sky-700 transition-transform duration-500 inline-block'>
                                         {post.author}
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
                            className="mx-1 px-1 shadow-md shadow-gray-700 rounded-full py-1 border bg-transparent transition-all ease-in-out duration-300 hover:bg-sky-700 text-sky-900 hover:text-black disabled:bg-transparent disabled:text-gray-800 disabled:shadow-none disabled:border-none"
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
                            className="mx-1 px-1 shadow-md shadow-gray-700 rounded-full py-1 border bg-transparent transition-all ease-in-out duration-300 hover:bg-sky-700 text-sky-900 hover:text-black disabled:bg-transparent disabled:text-gray-800 disabled:shadow-none disabled:border-none"
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