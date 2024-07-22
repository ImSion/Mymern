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
  // Stato per il testo animato
  const [animatedText, setAnimatedText] = useState('');
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

  // Effetto per l'animazione del testo
  useEffect(() => {
    if (post && post.content) {
      let index = 0;
      const intervalId = setInterval(() => {
        setAnimatedText((prev) => {
          if (index < post.content.length) {
            index++;
            return post.content.slice(0, index);
          }
          clearInterval(intervalId);
          return prev;
        });
      }, 50); // Regola la velocità dell'animazione qui

      return () => clearInterval(intervalId);
    }
  }, [post]);

  // Se il post non è ancora stato caricato, mostra un messaggio di caricamento
  if (!post) return <div>Caricamento...</div>;

  // Rendering del componente
  return (
    <div className="min-h-screen">
      <article className="post-detail flex flex-col items-center justify-center pt-24">
        {/* Immagine di copertina del post e titolo del post */}
        <div className="relative flex flex-col items-center w-[99%] lg:w-[850px] 2xl:w-[1000px] ">
          <img src={post.cover} alt={post.title} className="w-[98%] h-[200px] sm:h-[420px] md:h-[520px] object-cover lg:w-[850px] 2xl:w-[1000px] rounded-lg shadow-[_1px_2px_10px] shadow-gray-700 dark:shadow-sky-500" />         
          <h1 className="absolute text-white top-0 text-xl font-bold line-clamp-2 mt-1 title-text rounded-full p-2">{post.titolo}</h1>
                
          {/* Dati del post */}
          <div className="xs:h-6 sm:h-8 w-[98%] lg:w-[850px] 2xl:w-[1000px] bg-slate-100 bg-opacity-60 dark:bg-gray-800 dark:bg-opacity-60 dark:text-white px-1 sm:px-4 mb-2 flex justify-between items-center absolute bottom-0 font-bold line-clamp-2 text-black">
            <span className="text-mbl text-center md:text-base lg:text-lg transition-all ease-in-out duration-300">Categoria: {post.categoria}</span>
            <span className="text-mbl text-center md:text-base lg:text-lg transition-all ease-in-out duration-300 hover:scale-105 hover:mb-1 hover:shadow-md hover:shadow-sky-500 rounded-full p-1">Autore: <Link to={`/AuthorPosts/${post.author}`} key={post._id}>{post.author}</Link></span>      
            <span className="text-mbl text-center md:text-base lg:text-lg transition-all ease-in-out duration-300">
              Tempo di lettura: {post.readTime.value} {post.readTime.unit}
            </span>
          </div>
        </div>
        
        {/* Contenuto del post */}
        <div className="border dark:border-sky-500 rounded-lg p-2 mt-3 w-[97%] lg:w-[850px] 2xl:w-[1000px] text-black bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-60 dark:text-white">
          <div
            className="post-content text-xs sm:text-base"
            dangerouslySetInnerHTML={{ __html: animatedText }}
          /> 
        </div>
        
        {/* Aggiunge la sezione commenti, passando l'id del post e i dati dell'utente corrente */}
        <CommentSection 
          postId={post._id} 
          currentUser={currentUser}
        />
      </article>
    </div>
  );
}