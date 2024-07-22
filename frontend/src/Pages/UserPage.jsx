import React, { useState, useEffect } from 'react';
import { getUserData, updateAuthor, updateAuthorAvatar } from '../modules/ApiCrud';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    data_di_nascita: '',
  });
  const [avatar, setAvatar] = useState(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAuthor(user._id, formData);
      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);
        await updateAuthorAvatar(user._id, formData);
      }
      alert('Profilo aggiornato con successo!');
    } catch (error) {
      console.error('Errore nell\'aggiornamento del profilo:', error);
      alert('Si è verificato un errore durante l\'aggiornamento del profilo.');
    }
  };

  if (!user) return <div>Caricamento...</div>;

  return (
    <div className="container mx-auto min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white pt-20">Il tuo profilo</h1>
      <form onSubmit={handleSubmit} className="space-y-4 dark:text-white">
        <div>
          <label className="block mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div>
          <label className="block mb-1">Cognome</label>
          <input
            type="text"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div>
          <label className="block mb-1">Data di nascita</label>
          <input
            type="date"
            name="data_di_nascita"
            value={formData.data_di_nascita}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black"
          />
        </div>
        <div>
          <label className="block mb-1">Avatar</label>
          <input
            type="file"
            onChange={handleAvatarChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Aggiorna profilo
        </button>
      </form>
    </div>
  );
};

export default UserPage;