import React, { useEffect, useState, useCallback } from 'react';
import { getPosts } from '../modules/ApiCrud';
import { Link } from 'react-router-dom';
import { useSearch } from '../modules/SearchContext'
import '../Style/Animations.css';
import AnimatedBackground from '../components/AnimatedBackground';


export default function Home() {
    const [allPosts, setAllPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [searchOption, setSearchOption] = useState('titolo');
    const { isSearchVisible } = useSearch();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(15);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await getPosts();
            setAllPosts(response.data);
            setFilteredPosts(response.data);
        } catch (err) {
            console.error('Errore nella richiesta dei Post', err);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredPosts(allPosts);
        } else {
            const filtered = allPosts.filter(post => {
                if (searchOption === 'titolo') {
                    return post.titolo.toLowerCase().startsWith(search.toLowerCase());
                } else if (searchOption === 'author') {
                    return post.author.toLowerCase().startsWith(search.toLowerCase());
                }
                return false;
            });
            setFilteredPosts(filtered);
        }
        setCurrentPage(1);
    }, [search, searchOption, allPosts]);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleOptionChange = (event) => {
        setSearchOption(event.target.value);
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

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

    return (
        <>
            <div className='text-center relative'>
                <AnimatedBackground />
                <h1 className='dark:bg-gray-800 dark:text-white dark:shadow-[0px_0px_25px] dark:shadow-sky-600 text-5xl py-3 font-sans font-semibold'>
                    Welcome to POVBlogs!
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

                <div className=' from-slate-500 from-10% via-slate-700 via-30% to-slate-900 flex items-center justify-center lg:justify-between text-center p-3 flex-wrap min-h-screen relative'>
                    {currentPosts.map((post) => (
                        <Link to={`/post/${post._id}`} key={post._id} className='post-card border-2 flex flex-col gap-2 rounded-lg w-[350px] h-[280px] sm:w-[550px] sm:h-full lg:w-[480px] mx-3 mb-8 mt-10 md:mx-1'>
                            <img className='w-full h-[280px] rounded-lg' src={post.cover} alt={post.titolo} />
                            <h2 className='dark:text-white'>{post.titolo}</h2>
                            <Link to={`/AuthorPosts/${post.author}`}>
                                <p className='hover:scale-105 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500 rounded-full hover:shadow-md hover:shadow-sky-700 transition-transform duration-500 '>
                                    Autore: {post.author}
                                </p>
                            </Link>
                            
                            
                        </Link>
                    ))}
                </div>

                {filteredPosts.length > postsPerPage && (
                    <div className="pagination flex justify-center items-center mt-4 mb-4">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="mx-1 px-1 shadow-md shadow-gray-700 rounded-full py-1 border bg-sky-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>

                        </button>
                        <span className="mx-2 text-xl">
                            {currentPage}/{Math.ceil(filteredPosts.length / postsPerPage)}
                        </span>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
                            className="mx-1 px-1 shadow-md shadow-gray-700 rounded-full py-1 border bg-sky-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>

                        </button>
                    </div>
                )}
            </div>
        </>
    );
}