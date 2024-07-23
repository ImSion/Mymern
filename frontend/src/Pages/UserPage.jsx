import React, { useState, useEffect } from 'react';
import { getUserData, updateAuthor, updateAuthorAvatar } from '../modules/ApiCrud';
import { Modal, Button } from 'flowbite-react'; // Importiamo i componenti Modal e Button da flowbite-react

const UserPage = () => {
  // Stato per i dati dell'utente
  const [user, setUser] = useState(null);
  // Stato per i dati del form
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    data_di_nascita: '',
  });
  // Stato per il file dell'avatar
  const [avatarFile, setAvatarFile] = useState(null);
  // Stato per controllare l'apertura/chiusura del modale
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Effetto per recuperare i dati dell'utente al caricamento del componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
        setFormData({
          nome: userData.nome,
          cognome: userData.cognome,
          data_di_nascita: userData.data_di_nascita,
        });
      } catch (error) {
        console.error('Errore nel recupero dei dati utente:', error);
      }
    };
    fetchUserData();
  }, []);

  // Gestore per i cambiamenti nei campi del form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestore per il cambiamento del file dell'avatar
  const handleAvatarChange = (event) => {
    setAvatarFile(event.target.files[0]);
  };

  // Gestore per l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAuthor(user._id, formData);
      alert('Profilo aggiornato con successo!');
    } catch (error) {
      console.error('Errore nell\'aggiornamento del profilo:', error);
      alert('Si è verificato un errore durante l\'aggiornamento del profilo.');
    }
  };

  // Gestore per l'upload dell'avatar
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const response = await updateAuthorAvatar(user._id, formData);
      setUser(response.data);
      closeModal();
      alert('Avatar aggiornato con successo!');
    } catch (error) {
      console.error("Errore nell'aggiornare l'avatar dell'utente", error);
      alert("Si è verificato un errore durante l'aggiornamento dell'avatar.");
    }
  };

  // Funzione per aprire il modale
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Funzione per chiudere il modale
  const closeModal = () => {
    setModalIsOpen(false);
    setAvatarFile(null);
  };

  if (!user) return <div>Caricamento...</div>;

  return (
    <div className="container mx-auto min-h-screen p-4 flex flex-col items-center ">
      <h1 className="text-2xl font-bold mb-4 dark:text-white pt-20">Il tuo profilo</h1>
      
      {/* Sezione dell'avatar */}
      <div className="mb-6 w-32 h-32 relative">
        <img 
          src={user.avatar} 
          alt="Avatar" 
          className="w-32 h-32 rounded-full object-cover transition-all ease-in-out duration-300 shadow-[_5px_3px_7px] shadow-gray-600 dark:shadow-[_-5px_3px_7px] dark:shadow-sky-500"
        />
        <button 
          onClick={openModal} 
          className="bg-white text-gray-700 border-2 border-white rounded-full absolute top-[90px] right-3 hover:shadow-[0px_0px_8px_] hover:shadow-sky-400 transition-all ease-in-out duration-500 hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 p-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      {/* Form per l'aggiornamento del profilo */}
      <form onSubmit={handleSubmit} className="space-y-4 dark:text-white">
        <div>
          <label className="block mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-2 bg-white bg-opacity-50 border rounded text-black transition-all ease-in-out duration-300 shadow-[_5px_3px_7px] shadow-gray-600 dark:shadow-[_-5px_3px_7px] dark:shadow-sky-500"
          />
        </div>
        <div>
          <label className="block mb-1">Cognome</label>
          <input
            type="text"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
            className="w-full p-2 bg-white bg-opacity-50 border rounded text-black transition-all ease-in-out duration-300 shadow-[_5px_3px_7px] shadow-gray-600 dark:shadow-[_-5px_3px_7px] dark:shadow-sky-500"
          />
        </div>
        <div>
          <label className="block mb-1">Data di nascita</label>
          <input
            type="date"
            name="data_di_nascita"
            value={formData.data_di_nascita}
            onChange={handleChange}
            className="w-full p-2 bg-white bg-opacity-50   border rounded text-black transition-all ease-in-out duration-300 shadow-[_5px_3px_7px] shadow-gray-600 dark:shadow-[_-5px_3px_7px] dark:shadow-sky-500"
          />
        </div>
        <button type="submit" className="bg-sky-500 rounded-full text-white px-4 py-2">
          Aggiorna profilo
        </button>
      </form>

      {/* Modale per il cambio dell'avatar */}
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
    </div>
  );
};

export default UserPage;