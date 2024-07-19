import { useState, useEffect } from "react"; // Importa gli hook di React necessari
import { useParams } from "react-router-dom"; // Importa useParams per accedere ai parametri dell'URL
import { getPost, getUserData } from "../modules/ApiCrud"; // Importa le funzioni API necessarie
import { Link } from "react-router-dom"; // Importa Link per la navigazione
import CommentSection from "../components/CommentSection"; // Importa il nuovo componente CommentSection

export default function PostDetail() {
  // Stato per memorizzare i dati del post
  const [post, setPost] = useState(null);
  // Nuovo stato per memorizzare i dati dell'utente corrente
  const [currentUser, setCurrentUser] = useState(null);
  // Estrae l'id del post dai parametri dell'URL
  const { id } = useParams();

  useEffect(() => {
    // Funzione asincrona per recuperare i dati del post e dell'utente
    const fetchPostAndUser = async () => {
      try {
        // Recupera i dati del post
        const postResponse = await getPost(id);
        setPost(postResponse.data);
        
        // Recupera i dati dell'utente corrente
        const userResponse = await getUserData();
        setCurrentUser(userResponse);
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    };
    // Chiama la funzione fetchPostAndUser
    fetchPostAndUser();
  }, [id]); // L'effetto si attiva quando l'id cambia

  // Se il post non è ancora stato caricato, mostra un messaggio di caricamento
  if (!post) return <div>Caricamento...</div>;

  // Rendering del componente
  return (
    <div className="min-h-screen">
      <article className="post-detail flex flex-col items-center justify-center mt-10">
        {/* Immagine di copertina del post */}
        <img src={post.cover} alt={post.title} className="post-cover w-[98%] sm:w-[800px] rounded-md" />
        {/* Titolo del post */}
        <h1>{post.title}</h1>
        {/* Dati del post */}
        <div className="post-meta flex flex-col items-center">
          <span>Categoria: {post.category}</span>
          <span>Autore: <Link to={`/AuthorPosts/${post.author}`} key={post._id}>{post.author}</Link></span>
              
          <span>
            Tempo di lettura: {post.readTime.value} {post.readTime.unit}
          </span>
        </div>
        {/* Contenuto del post */}
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Aggiunge la sezione commenti, passando l'id del post e i dati dell'utente corrente */}
        <CommentSection 
          postId={post._id} 
          currentUser={currentUser}
        />
      </article>
    </div>
  );
}