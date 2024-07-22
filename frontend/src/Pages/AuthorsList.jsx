import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAuthors, getAuthorPosts } from '../modules/ApiCrud';
import AnimatedBackground from '../components/AnimatedBackground';
import '../Style/Animations.css';
import CardSkeleton from '../components/CardSkeleton';

export default function AuthorsList() {
    const [allAuthors, setAllAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCards, setVisibleCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAuthors = useCallback(async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await getAuthors(page);
            console.log("Risposta API getAuthors:", response);

            let authorsData = response.data.authors || response.data;
            let totalPagesCount = response.data.totalPages || 1;

            if (!Array.isArray(authorsData)) {
                throw new Error('I dati degli autori non sono in un formato valido');
            }

            const authorsWithPostCount = await Promise.all(
                authorsData.map(async (author) => {
                    try {
                        const postsResponse = await getAuthorPosts(author.email);
                        return { ...author, postCount: Array.isArray(postsResponse.data) ? postsResponse.data.length : 0 };
                    } catch (error) {
                        console.log(`Nessun post trovato per ${author.email}`);
                        return { ...author, postCount: 0 };
                    }
                })
            );

            // Aggiorna gli autori solo se è la prima pagina, altrimenti aggiungi i nuovi
            setAllAuthors(prevAuthors => 
                page === 1 ? authorsWithPostCount : [...prevAuthors, ...authorsWithPostCount]
            );
            setTotalPages(totalPagesCount);
            setCurrentPage(page);
                } catch (err) {
                    console.error('Errore nella richiesta degli Autori', err);
                    setError(`Si è verificato un errore nel caricamento degli autori: ${err.message}`);
                } finally {
                    setIsLoading(false);
                }
            }, []);

    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredAuthors(allAuthors);
        } else {
            const searchLower = search.toLowerCase().trim();
            const filtered = allAuthors.filter(author => 
                author.nome.toLowerCase().startsWith(searchLower) ||
                author.cognome.toLowerCase().startsWith(searchLower) ||
                author.email.toLowerCase().startsWith(searchLower)
            );
            setFilteredAuthors(filtered);
        }
    }, [search, allAuthors]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const cardElements = document.querySelectorAll('.post-card');
            cardElements.forEach((element, index) => {
                setTimeout(() => {
                    setVisibleCards(prev => [...prev, index]);
                }, index * 100);
            });
        }, 100);

        return () => clearTimeout(timer);
    }, [filteredAuthors]);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const loadMoreAuthors = () => {
        if (currentPage < totalPages) {
            fetchAuthors(currentPage + 1);
        }
    };

    if (isLoading && currentPage === 1) {
        return (
          <>
            <AnimatedBackground />
            <div className='text-center relative'>
              <h1 className='dark:bg-transparent pt-28 pb-10 dark:text-white dark:shadow-[0px_-10px_10px] dark:shadow-sky-600 text-3xl sm:text-5xl py-3 font-sans font-semibold h-12 flex items-center justify-center'>
                Lista degli Autori
              </h1>
              {[...Array(10)].map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </>
        );
      }

    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <>
            <AnimatedBackground />
            <div className='text-center relative'>
                <h1 className='dark:bg-transparent pt-28 pb-10 dark:text-white dark:shadow-[0px_-10px_10px] dark:shadow-sky-600 text-3xl sm:text-5xl py-3 font-sans font-semibold h-12 flex items-center justify-center'>
                    Lista degli Autori
                </h1>
                
                <div className='mt-3 rounded-full flex justify-center items-center'>
                    <div className='p-3 rounded-full bg-white h-12 flex border-2 justify-between items-center mt-2'>
                        <input
                            type='text'
                            placeholder='Cerca autore...'
                            value={search}
                            onChange={handleSearch}
                            className='border-none focus:outline-none focus:ring-0 rounded-full p-2 mr-2 h-10'
                        />
                    </div>
                </div>

                <div className='flex flex-wrap transition-all ease-in-out duration-300 justify-center p-3 min-h-screen relative'>
                    {filteredAuthors.map((author, index) => (
                        <Link to={`/AuthorPosts/${author.email}`} key={`${author._id}-${index}`} className="m-2 w-full flex flex-col items-center hover:scale-105 transition-transform duration-300">
                            <div className={`post-card bg-white dark:bg-gray-800 rounded-xl w-full justify-between shadow-lg shadow-gray-600 overflow-hidden transition-transform duration-300 sm:w-[95%] h-16 sm:h-full flex ${visibleCards.includes(index) ? 'visible' : ''}`}>
                                <img src={author.avatar} alt={`${author.nome} ${author.cognome}`} className="object-cover w-20 sm:w-40 sm:h-32 rounded-r-full" />
                                <div className="flex flex-col items-center justify-center p-1 sm:p-4">
                                    <h2 className="text-sm  sm:text-xl font-semibold mb-2 dark:text-white">{author.nome} {author.cognome}</h2>
                                    <p className="text-gray-600 text-xs sm:text-xl dark:text-gray-300 mb-2">{author.email}</p>
                                </div>

                                <div className='flex flex-col sm:flex-row items-center justify-center pr-2'>
                                    <p className="text-sm sm:text-xl text-gray-500 dark:text-gray-400">Post: </p>
                                    <p className="text-sm sm:text-xl ml-1 text-gray-500 dark:text-gray-400">{author.postCount}</p>

                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {currentPage < totalPages && (
                    <button 
                        onClick={loadMoreAuthors}
                        className="mt-2 mb-4 px-4 py-2 bg-white bg-opacity-50 text-black rounded hover:bg-blue-600 transition-colors"
                    >
                        Carica altri autori
                    </button>
                )}

                {isLoading && currentPage > 1 && (
                    <div className="mt-4 text-center">
                      <Loader />
                    </div>
                )}
            </div>
        </>
    );
}