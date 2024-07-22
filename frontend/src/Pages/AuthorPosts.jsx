import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAuthorPosts, getAuthorByEmail, getMe, updateAuthorAvatar, deletePost, updatePost } from '../modules/ApiCrud';
import { Modal, Button } from 'flowbite-react';
import '../Style/Animations.css';

const EditPostModal = ({ isOpen, onClose, post, onSave }) => {
    const [editedPost, setEditedPost] = useState(post);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'readTimeValue') {
            // Aggiorna il valore di readTime mantenendo l'unità esistente
            setEditedPost(prev => ({
                ...prev,
                readTime: { ...prev.readTime, value: parseInt(value) }
            }));
        } else if (name === 'readTimeUnit') {
            // Aggiorna l'unità di readTime mantenendo il valore esistente
            setEditedPost(prev => ({
                ...prev,
                readTime: { ...prev.readTime, unit: value }
            }));
        } else {
            setEditedPost(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedPost);
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <Modal.Header>Modifica Post</Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">Titolo</label>
                        <input
                            type="text"
                            name="titolo"
                            value={editedPost.titolo}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Contenuto</label>
                        <textarea
                            name="content"
                            value={editedPost.content}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows="4"
                        />
                    </div>
                    <div className="mb-4 flex items-center">
                        <label className="mr-2">Tempo di lettura:</label>
                        <input
                            type="number"
                            name="readTimeValue"
                            value={editedPost.readTime.value}
                            onChange={handleChange}
                            className="w-20 p-2 border rounded mr-2"
                            min="1"
                        />
                        <select
                            name="readTimeUnit"
                            value={editedPost.readTime.unit}
                            onChange={handleChange}
                            className="p-2 border rounded"
                        >
                            <option value="minuti">minuti</option>
                            <option value="ore">ore</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button onClick={onClose} color="gray">Annulla</Button>
                        <Button type="submit" color="blue">Salva Modifiche</Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

const AuthorPosts = () => {
    const { authorEmail } = useParams();
    const [posts, setPosts] = useState([]);
    const [author, setAuthor] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showButtons, setShowButtons] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                console.log("Fetching data for author:", authorEmail);
                const [postsResponse, authorResponse, currentUserResponse] = await Promise.all([
                    getAuthorPosts(authorEmail),
                    getAuthorByEmail(authorEmail),
                    getMe()
                ]);
                console.log("Dati ricevuti:", { 
                    posts: postsResponse.data, 
                    author: authorResponse.data, 
                    currentUser: currentUserResponse 
                });
                setPosts(postsResponse.data);
                setAuthor(authorResponse.data);
                setCurrentUser(currentUserResponse);
                
                setTimeout(() => setShowButtons(true), 100);
            } catch (error) {
                console.error("Errore nel recupero dei dati:", error);
                setError("Si è verificato un errore nel caricamento dei dati.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [authorEmail]);

    const handleAvatarChange = (event) => {
        setAvatarFile(event.target.files[0]);
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;

        const formData = new FormData();
        formData.append('avatar', avatarFile);

        try {
            const response = await updateAuthorAvatar(author._id, formData);
            setAuthor(response.data);
            closeModal();
        } catch (error) {
            console.error("Errore nell'aggiornare l'avatar dell'autore", error);
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setAvatarFile(null);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Sei sicuro di voler eliminare questo post?')) {
            try {
                await deletePost(postId);
                setPosts(posts.filter(post => post._id !== postId));
            } catch (error) {
                console.error("Errore nell'eliminazione del post", error);
            }
        }
    };

    const handleEditClick = (post) => {
        setEditingPost(post);
    };

    const truncateText = (text, wordCount) => {
        const words = text.split(' ');
        if (words.length > wordCount) {
            return words.slice(0, wordCount).join(' ') + '...';
        }
        return text;
    };

    const handleSaveEdit = async (editedPost) => {
        try {
            await updatePost(editedPost._id, editedPost);
            setPosts(posts.map(p => p._id === editedPost._id ? editedPost : p));
            setEditingPost(null);
        } catch (error) {
            console.error("Errore nell'aggiornamento del post:", error);
        }
    };

    if (isLoading) {
        return <div>Caricamento in corso...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!author) {
        return <div>Autore non trovato.</div>;
    }

    return (
        <div className='min-h-screen'>
            <h1 className='text-center text-xl font-bold pt-20 dark:text-white'>Profilo di {author.nome}</h1>

            <div className='flex flex-col items-center mt-3 sm:items-end pr-5'>
                <div className='flex flex-col items-center'>
                    <h2 onClick={toggleDropdown} className='text-lg font-semibold cursor-pointer border-2 p-3 hover:shadow-md transition-all ease-in-out duration-500 hover:scale-105 rounded-full h-5 text-center flex items-center mb-2 dark:text-white shadow-md shadow-sky-500'>{author.nome} {author.cognome}</h2>
                    <div className={`text-center dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
                        <h3 className='email dark:text-white'>{author.email}</h3>
                        <h3 className='birthday dark:text-white'>Nato il {author.data_di_nascita}</h3>                                 
                    </div>
                    <div className='h-32 w-32 rounded-full relative'>
                        <img className='h-32 w-32 rounded-full object-cover' src={author.avatar} alt={author.nome} />

                        {/* la modifica dell'avatar sarà possibile solo per l'utente loggato */}
                        {currentUser && currentUser.email === authorEmail && (
                        <button onClick={openModal} className='bg-white text-gray-700 border-2 border-white rounded-full absolute top-[90px] right-3 hover:shadow-[0px_0px_8px_] hover:shadow-sky-400 transition-all ease-in-out duration-500 hover:scale-105'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-[2px] text-black">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </button>
                        )}
                    </div>    
                </div>
            </div>

            {currentUser && currentUser.email === authorEmail && (
            <Modal show={modalIsOpen} onClose={closeModal}>
                <Modal.Header>Modifica Immagine del Profilo</Modal.Header>
                <Modal.Body>
                    <div className='space-y-6'>
                        <input type="file" onChange={handleAvatarChange} className='mb-2' />
                        <Button onClick={handleAvatarUpload} className='bg-blue-500 text-white px-4 py-2 rounded'>
                            Aggiorna Immagine del Profilo
                        </Button>
                        <Button onClick={closeModal} color="gray" className='ml-2'>
                            Chiudi
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            )}
            
            <div className='flex flex-col xl:flex-wrap xl:flex-row xl:justify-between px-6 sm:px-9'>
            {posts.length === 0 ? (
                <p className="text-center w-full">Questo autore non ha ancora pubblicato post.</p>
            ) : (
                posts.map((post) => (
                    <div className='flex flex-col items-center mb-4 pt-10 transition-all ease-in-out duration-500' key={post._id}>
                        <div className="relative flex flex-col items-center w-[99,9%] lg:w-[850px] 2xl:w-[1000px]">
                            <Link to={`/post/${post._id}`}>
                                <img 
                                    src={post.cover} 
                                    alt={post.titolo} 
                                    className=" lg:w-[850px] 2xl:w-[1000px] rounded-lg shadow-[_1px_2px_10px] shadow-gray-700 dark:shadow-sky-500" 
                                />
                            </Link>
                            <h2 className="absolute text-xs text-white top-0 sm:text-xl font-bold line-clamp-2 mt-1 title-text rounded-full p-2">{post.titolo}</h2>
                            
                            <div className="xs:h-4 sm:h-6 w-[100%] lg:w-[850px] 2xl:w-[1000px] bg-slate-100 bg-opacity-60 dark:bg-gray-800 dark:bg-opacity-60 dark:text-white px-2 sm:px-4 mb-2 flex justify-between items-center absolute bottom-0 font-bold line-clamp-2 text-black">
                                <span className="text-mbl md:text-base lg:text-lg transition-all ease-in-out duration-300">Categoria: {post.categoria}</span>
                                <span className="text-mbl md:text-base lg:text-lg transition-all ease-in-out duration-300">
                                    Tempo di lettura: {post.readTime.value} {post.readTime.unit}
                                </span>
                            </div>
                            
                            {currentUser && currentUser.email === authorEmail && (
                                <div className={`absolute top-4 right-0 flex flex-col space-y-2 transition-all duration-1000 ease-in-out ${showButtons ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                                    <button 
                                        onClick={() => handleEditClick(post)}
                                        className="bg-gray-500 h-6 sm:h-9 border border-green-500 hover:shadow-[_0px_0px_8px_] hover:shadow-green-500 bg-opacity-70 text-white p-2 rounded-l-md text-xs flex items-center justify-center transition-all ease-in-out duration-500 hover:text-green-500 group overflow-hidden"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 sm:size-5 flex-shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-500 group-hover:max-w-xs group-hover:ml-2">
                                            Modifica
                                        </span>
                                    </button>
                                    <button 
                                        onClick={() => handleDeletePost(post._id)} 
                                        className="bg-gray-500 h-6 sm:h-9 border border-red-500 hover:shadow-[_0px_0px_8px_] hover:shadow-red-500 bg-opacity-70 text-white p-2 rounded-l-md text-xs flex items-center justify-center transition-all ease-in-out duration-500 hover:text-red-500 group overflow-hidden"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 sm:size-5 flex-shrink-0">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-500 group-hover:max-w-xs group-hover:ml-2">
                                            Elimina
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="border dark:border-sky-500 rounded-lg p-2 mt-3 w-[97%] lg:w-[850px] 2xl:w-[1000px] text-black bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-60 dark:text-white">
                            <p className="post-content text-xs sm:text-base">{truncateText(post.content, 30)}</p>
                        </div>
                    </div>
                ))
            )}   
        </div>

            {editingPost && (
                <EditPostModal 
                    isOpen={!!editingPost}
                    onClose={() => setEditingPost(null)}
                    post={editingPost}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default AuthorPosts;