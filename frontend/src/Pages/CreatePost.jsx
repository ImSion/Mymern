// Importazione delle dipendenze necessarie
import React, { useState, useEffect } from 'react'
import { Button } from "flowbite-react";
import { createPost, getMe } from '../modules/ApiCrud';
import { useNavigate } from 'react-router-dom'

// Definizione del componente principale CreatePost
export default function CreatePost() {
    // Stato per memorizzare il file dell'immagine di copertina
    const [coverFile, setCoverFile] = useState(null);
    
    // Stato per memorizzare tutti i dati del post
    const [post, setPost] = useState({
        titolo: '',
        categoria: '', 
        content: '',
        cover: '',
        readTime: {
            value: 0,
            unit: 'minuti'
        },
        author: ''
    })
    
    // Array di categorie predefinite
    const categorie = [
        "Tecnologia",
        "Viaggi",
        "Cucina",
        "Sport",
        "Musica",
        "Cinema",
        "Letteratura",
        "Scienza",
        "Arte",
        "Moda"
    ];

    // Hook per la navigazione programmatica
    const navigate = useNavigate();

    // Effetto per recuperare l'email dell'utente al montaggio del componente
    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const userData = await getMe();
                setPost((prevPost) => ({ ...prevPost, author: userData.email }));
            } catch (error) {
                console.error("Errore nel recupero dei dati utente:", error);
                navigate("/home");
            }
        };
        fetchUserEmail();
    }, [navigate]);

    // Gestore per i cambiamenti negli input
    const handleChange =(e) => {
        const {name, value} = e.target;
        if(name === 'readTimeValue') {
            setPost({...post, readTime: {...post.readTime, value: parseInt(value) } } )
        } else {
            setPost({...post, [name]: value })
        }
    }

    // Gestore per i cambiamenti nell'input del file
    const handleFileChange = (e) => {
        setCoverFile(e.target.files[0]);
    }

    // Gestore per l'invio del form
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            Object.keys(post).forEach((key) => {
                if(key === 'readTime') {
                    formData.append('readTime[value]', post.readTime.value)
                    formData.append('readTime[unit]', post.readTime.unit)
                } else {
                    formData.append(key, post[key])
                }
            })           
            if(coverFile) {
                formData.append('cover', coverFile)
            }
            console.log("Dati del form:", Object.fromEntries(formData));
            const response = await createPost(formData);
            console.log("Risposta del server:", response);
            navigate('/home');
        } catch(err) {
            console.error('Errore nella creazione del Post:', err);
            console.error('Dettagli dell\'errore:', err.response?.data);
            alert("Si è verificato un errore durante la creazione del post. Riprova.");
        }
    }

    // Rendering del componente
    return (
        <div className='flex text-center items-center justify-center flex-col p-1 min-h-screen'>
            <h1 className='dark:text-white text-3xl mb-6 pt-20'>Crea un nuovo post</h1>
            <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center text-center gap-5'>
                {/* Campo per il titolo */}
                <div className='w-72 sm:w-72 md:w-96 lg:w-[450px] flex flex-col'>
                    <label className='dark:text-white text-xl'>Titolo</label>
                    <input 
                        type="text"
                        id='titolo'
                        name='titolo'
                        value={post.titolo}
                        onChange={handleChange}
                        className='border-2 rounded-xl'
                        required 
                    />
                </div>
                {/* Menu a discesa per la categoria */}
                <div className='w-72 sm:w-72 md:w-96 lg:w-[450px] flex flex-col'>
                    <label className='dark:text-white text-xl'>Categoria</label>
                    <select
                        id='categoria'
                        name='categoria'
                        value={post.categoria}
                        onChange={handleChange}
                        className='border-2 rounded-xl p-2'
                        required
                    >
                        <option value="">Seleziona una categoria</option>
                        {categorie.map((categoria, index) => (
                            <option key={index} value={categoria}>{categoria}</option>
                        ))}
                    </select>
                </div>
                {/* Campo per il contenuto */}
                <div className='w-80 flex flex-col items-center'>
                    <label className='dark:text-white text-xl'>Contenuto</label>
                    <textarea
                        id='content'
                        name='content'
                        value={post.content}
                        onChange={handleChange}
                        className='w-[99%] sm:w-[500px] h-52 border-2 rounded-xl'
                        required
                    ></textarea>
                </div>
                {/* Campo per l'immagine di copertina */}
                <div className='form-group w-72 sm:w-72 md:w-96 lg:w-[450px] flex flex-col'>
                    <label className='dark:text-white text-xl'>Immagine di copertina</label>
                    <input
                        type="file"
                        id="cover"
                        name="cover"
                        onChange={handleFileChange}
                        className='border-2 rounded-xl dark:text-white'
                        required
                    />
                </div>
                {/* Campi per il tempo di lettura e l'autore */}
                <div className='flex flex-col items-center sm:flex-row gap-3'>
                    <div className='form-group w-48 flex flex-col items-center'>
                        <label className='dark:text-white text-xl'>Tempo di lettura <span className='hidden'>(minuti)</span></label>
                        <input
                            type="number"
                            id="readTimeValue"
                            name="readTimeValue"
                            value={post.readTime.value}
                            onChange={handleChange}
                            className='text-center border-2 w-[100px] rounded-xl'
                            required
                        />
                    </div>
                    <div className='form-group w-80 flex flex-col'>
                        <label className='dark:text-white text-xl'>Email autore</label>
                        <input
                            type="email"
                            id="author"
                            name="author"
                            value={post.author}
                            readOnly
                            className='border-2 rounded-xl bg-gray-100'
                        />
                    </div>
                </div>    
                {/* Pulsante di invio */}
                <Button type="submit" className="submit-button bg-yellow-400 w-22 h-8 flex items-center">
                    Crea il post
                </Button>
            </form>
        </div>
    )
}