import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAuthors, getAuthorPosts } from '../modules/ApiCrud';
import AnimatedBackground from '../components/AnimatedBackground';
import '../Style/Animations.css';

export default function AuthorsList() {
    // Stati per gestire i dati e lo stato dell'applicazione
    const [allAuthors, setAllAuthors] = useState([]); // Tutti gli autori
    const [filteredAuthors, setFilteredAuthors] = useState([]); // Autori filtrati per la ricerca
    const [search, setSearch] = useState(''); // Testo di ricerca
    const [isLoading, setIsLoading] = useState(true); // Stato di caricamento
    const [error, setError] = useState(null); // Gestione degli errori
    const [visibleCards, setVisibleCards] = useState([]); // Per l'animazione delle card

    // Funzione per recuperare gli autori dal server
    const fetchAuthors = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getAuthors();
            console.log("Risposta API getAuthors:", response); // Log per debug

            // Gestione flessibile della struttura dei dati
            let authorsData = response.data;
            if (response.data && response.data.authors) {
                authorsData = response.data.authors;
            }

            if (!Array.isArray(authorsData)) {
                throw new Error('I dati degli autori non sono in un formato valido');
            }

            // Aggiunta del conteggio dei post per ogni autore
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
            console.log("Autori elaborati:", authorsWithPostCount); // Log per debug
            setAllAuthors(authorsWithPostCount);
            setFilteredAuthors(authorsWithPostCount);
        } catch (err) {
            console.error('Errore nella richiesta degli Autori', err);
            setError('Si è verificato un errore nel caricamento degli autori.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effetto per caricare gli autori al montaggio del componente
    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]);

    // Effetto per filtrare gli autori in base alla ricerca
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

    // Effetto per animare l'apparizione delle card
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

    // Gestore per il cambiamento del testo di ricerca
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    // Rendering condizionale per lo stato di caricamento
    if (isLoading) return <div className="text-center mt-10">Caricamento...</div>;

    // Rendering condizionale per lo stato di errore
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    // Rendering principale del componente
    return (
        <>
            <AnimatedBackground />
            <div className='text-center relative'>
                <h1 className='dark:bg-transparent dark:text-white dark:shadow-[0px_-10px_10px] dark:shadow-sky-600 text-3xl sm:text-5xl py-3 font-sans font-semibold h-12 flex items-center justify-center'>
                    Lista degli Autori
                </h1>
                
                {/* Barra di ricerca */}
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

                {/* Griglia degli autori */}
                <div className='flex flex-wrap transition-all ease-in-out duration-300 justify-center p-3 min-h-screen relative'>
                    {filteredAuthors.map((author, index) => (
                        <Link to={`/AuthorPosts/${author.email}`} key={author._id} className="block m-4 hover:scale-105 transition-transform duration-300">
                            <div className={`post-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 w-64 ${visibleCards.includes(index) ? 'visible' : ''}`}>
                                <img src={author.avatar} alt={`${author.nome} ${author.cognome}`} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2 dark:text-white">{author.nome} {author.cognome}</h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">{author.email}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Post pubblicati: {author.postCount}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}