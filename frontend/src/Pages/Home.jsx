import React, { useEffect, useState } from 'react'; // Importa React e gli hook useEffect e useState
import { getPosts } from '../modules/ApiCrud'; // Importa la funzione getPosts per ottenere i post dal server
import { Link } from 'react-router-dom'; // Importa Link per la navigazione

export default function Home() {
    const [posts, setPosts] = useState([]); // Stato per memorizzare i post
    const [search, setSearch] = useState(''); // Stato per memorizzare la query di ricerca
    const [searchOption, setSearchOption] = useState('titolo'); // Stato per memorizzare l'opzione di ricerca ('titolo' o 'author')
    const [isSearchVisible, setIsSearchVisible] = useState(false); // Stato per gestire la visibilità del form di ricerca

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getPosts(); // Ottiene i post dal server
                setPosts(response.data); // Imposta i post nello stato
            } catch (err) {
                console.error('Errore nella richiesta dei Post', err); // Stampa un errore se la richiesta fallisce
            }
        };
        fetchPosts(); // Chiama la funzione fetchPosts al montaggio del componente
    }, []);

    const handleSearch = (event) => {
        setSearch(event.target.value); // Aggiorna lo stato search con il valore dell'input
    };

    const handleOptionChange = (event) => {
        setSearchOption(event.target.value); // Aggiorna lo stato searchOption con l'opzione selezionata
    };

    const toggleSearchVisibility = () => {
        setIsSearchVisible(!isSearchVisible); // Alterna lo stato isSearchVisible tra true e false
    };

    // Filtra i post in base alla query di ricerca e all'opzione di ricerca selezionata
    const filteredPosts = posts.filter(post => {
        if (searchOption === 'titolo') {
            return post.titolo.toLowerCase().startsWith(search.toLowerCase()); // Filtra per titolo
        } else if (searchOption === 'author') {
            return post.author.toLowerCase().startsWith(search.toLowerCase()); // Filtra per autore
        }
        return false;
    });

    return (
        <>
            <div className='text-center'>
                <h1 className='dark:bg-gray-800 dark:text-white dark:shadow-[0px_0px_25px] dark:shadow-sky-600 text-xl font-sans font-semibold'>Welcome to POVBlogs!</h1>
                <div className='flex items-center justify-center bg-white dark:bg-[#1f2937] pt-2'>
                    <button onClick={toggleSearchVisibility} className='border-2 dark:border-sky-500 rounded-full p-1 w-16 flex items-center justify-center dark:hover:shadow-[inset_0px_0px_8px_] dark:hover:shadow-sky-400 dark:hover:bg-transparent hover:bg-gray-100 transition-all ease-in-out duration-500 hover:scale-105 mb-3'>
                        {isSearchVisible ? 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 dark:text-sky-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                                : 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 dark:text-sky-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>} {/* Testo del bottone cambia in base alla visibilità del form */}
                    </button>
                </div>
                {/* Form di ricerca con transizione */}
                <div className={`dark:bg-[#1f2937] flex justify-center items-center transition-transform duration-300 ease-in-out transform ${isSearchVisible ? 'scale-100' : 'scale-0'} origin-top`}>
                    {isSearchVisible && (
                        <div className='p-3 rounded-full h-12 flex border-2 justify-between items-center mt-2 dark:bg-white'>
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
                {/* Mappa i post filtrati e li visualizza */}
                <div className='dark:bg-gradient-to-tr from-slate-500 from-10% via-slate-700 via-30% to-slate-900 flex items-center justify-center sm:justify-between text-center p-3 flex-wrap min-h-screen'>


                    {filteredPosts.map((post) => (
                        <Link to={`/post/${post._id}`} key={post._id} className=' border-2 flex flex-col gap-2 rounded-lg w-[450px] h-[full] mx-3 mb-5 md:mx-1'>
                            <img className='w-full h-[280px] rounded-lg' src={post.cover} alt={post.titolo} />
                            <h2>{post.titolo}</h2>
                            <Link to={`/AuthorPosts/${post.author}`}>
                                <p className='hover:scale-105 hover:bg-slate-200 rounded-full hover:shadow-md hover:shadow-sky-700 transition-transform duration-500 '>Autore: {post.author}</p>
                            </Link>
                        </Link>
                    ))}

                    
                </div>
            </div>
        </>
    );
}
