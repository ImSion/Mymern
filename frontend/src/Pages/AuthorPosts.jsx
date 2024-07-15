import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAuthorPosts, getAuthorByEmail, updateAuthorAvatar } from '../modules/ApiCrud';
import { Modal, Button } from 'flowbite-react';
import '../Authorposts.css'; // Importa il file CSS

const AuthorPosts = () => {
    const { authorEmail } = useParams();
    const [posts, setPosts] = useState([]);
    const [author, setAuthor] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getAuthorPosts(authorEmail);
                setPosts(response.data);
            } catch (error) {
                console.error("Errore nel recuperare i post dell'autore", error);
            }
        };

        const fetchAuthorDetails = async () => {
            try {
                const response = await getAuthorByEmail(authorEmail);
                setAuthor(response.data);
            } catch (error) {
                console.error("Errore nel recuperare i dettagli dell'autore", error);
            }
        };

        fetchPosts();
        fetchAuthorDetails();
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
            setAuthor(response.data); // aggiorna l'avatar nell'autore
            closeModal(); // chiudi il modale dopo l'aggiornamento
        } catch (error) {
            console.error("Errore nell'aggiornare l'avatar dell'autore", error);
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setAvatarFile(null); // resetta il file di input quando il modale viene chiuso
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    if (!author) {
        return <div>Caricamento...</div>;
    }

    return (
        <div>
            <h1 className='text-center text-xl font-bold pt-5'>Posts di {author.nome}</h1>

            <div className='flex flex-col items-end pr-5'>
                <div className='flex flex-col items-center'>
                    <h2 onClick={toggleDropdown} className='text-lg font-semibold cursor-pointer border-2 p-3 hover:shadow-md transition-all ease-in-out duration-500 hover:scale-105  rounded-full h-5 text-center flex items-center mb-2'>{author.nome}  {author.cognome}</h2>
                    <div className={`text-center dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
                        <h3 className='email'>{author.email}</h3>
                        <h3 className='birthday'>Nato il {author.data_di_nascita}</h3>                                 
                    </div>
                    <div className='h-32 w-32 rounded-full relative'>
                        <img className='h-32 w-32 rounded-full' src={author.avatar} alt={author.nome} />
                            <button onClick={openModal} className='bg-white text-gray-700 border-2 border-white rounded-full absolute top-[90px] right-3 hover:shadow-[0px_0px_8px_] hover:shadow-sky-400 transition-all ease-in-out duration-500 hover:scale-105'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 p-[2px] text-black">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                            </button>
                    </div>    
                </div>
            </div>

            <Modal show={modalIsOpen} onClose={closeModal}>
                <Modal.Header>
                    Modifica Immagine del Profilo
                </Modal.Header>
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
            
            <div className='flex flex-col xl:flex-wrap xl:flex-row xl:justify-between px-9'>
                 {posts.map(post => (
                    <div className='flex flex-col items-center mb-4 pt-10 transition-all ease-in-out duration-500' key={post._id}>
                       <Link to={`/post/${post._id}`} >
                        <img className='w-[600px] xl:w-[550px] h-full rounded-2xl' src={post.cover} alt={post.titolo} />
                       </Link> 
                        <h2>{post.titolo}</h2>
                        <p>{post.content}</p>
                    </div>
                ))}   
            </div>
            
        </div>
    );
};

export default AuthorPosts;
