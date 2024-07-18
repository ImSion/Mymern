import axiosApi from './axios'

// CRUD per gli autori

export const getAuthors = () => axiosApi.get("/authors"); // riceviamo tutti gli autori
export const getAuthor = (id) => axiosApi.get(`/authors/${id}`); // riceviamo un singolo autore
export const getAuthorByEmail = (email) => axiosApi.get(`/authors/email/${email}`); // riceviamo un autore tramite la mail
export const createAuthor = (authorData) => axiosApi.post("/authors/", authorData); // creiamo un autore
export const updateAuthor = (id, authorData) => axiosApi.patch(`/authors/${id}`, authorData); // modifichiamo un autore
export const updateAuthorAvatar = (id, avatarData) => axiosApi.patch(`/authors/${id}/avatar`, avatarData, { // Modifichiamo l'avatar(img) dell'autore
      headers: {
          "Content-Type": 'multipart/form-data'
      }});
export const deleteAuthor = (id) => axiosApi.delete(`/authors/${id}`); // eliminiamo un autore

// CRUD per i post 

export const getPosts = () => axiosApi.get("/blogPosts");
export const getPost = (id) => axiosApi.get(`/blogPosts/${id}`);
export const getAuthorPosts = (author) => axiosApi.get(`/BlogPosts/blogposts/${author}`);
export const createPost = async (postData) => {
      try {
          const response = await axiosApi.post("/blogPosts", postData, {
              headers: {
                  "Content-Type": 'multipart/form-data'
              }
          });
          return response.data;
      } catch (error) {
          console.error("Errore nella chiamata API createPost:", error.response?.data);
          throw error;
      }
  };
export const updatePost = (id, postData) => axiosApi.patch(`/blogPosts/${id}`, postData);
export const deletePost = (id) => axiosApi.delete(`/blogPosts/${id}`);

// CRUD per i commenti

// Recupera tutti i commenti per un post specifico
export const getComments = (postId) => axiosApi.get(`/blogPosts/${postId}/comments`).then((response) => response.data); 

// Aggiunge un nuovo commento a un post specifico
export const addComment = (postId, commentData) => axiosApi
      .post(`/blogPosts/${postId}/comments`, commentData)
      .then((response) => response.data);

      // Funzione per recuperare un commento specifico
export const getComment = (postId, commentId) => axiosApi
      .get(`/blogPosts/${postId}/comments/${commentId}`)
      .then((response) => response.data);

      // Funzione per aggiornare un commento specifico
export const updateComment = (postId, commentId, commentData) => axiosApi
      .patch(`/blogPosts/${postId}/comments/${commentId}`, commentData)
      .then((response) => response.data);

      // Funzione per eliminare un commento specifico
export const deleteComment = (postId, commentId) => axiosApi
      .delete(`/blogPosts/${postId}/comments/${commentId}`)
      .then((response) => response.data);


  // Funzioni CRUD per autenticazione

// Funzione per registrare un nuovo utente
export const registerUser = (userData) => axiosApi.post("/authors", userData);

// Funzione per effettuare il login di un utente
export const loginUser = async (credentials) => {
      try {
        const response = await axiosApi.post("/auth", credentials);
        console.log("Risposta API login:", response.data);
        return response.data;
      } catch (error) {
        console.error("Errore nella chiamata API di login:", error);
        throw error;
      }
    };

// Funzione per ottenere i dati dell'utente attualmente autenticato
export const getMe = () =>
      axiosApi.get("/auth/me").then((response) => response.data);

// Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
export const getUserData = async () => {
      try {
        const response = await axiosApi.get('/auth/me'); // Effettua la richiesta per ottenere i dati dell'utente
        return response.data; // Restituisce i dati della risposta
      } catch (error) {
        console.error('Errore nel recupero dei dati utente:', error); // Log dell'errore per debugging
        throw error; // Lancia l'errore per essere gestito dal chiamante
      }
    };




