import { useState, useEffect } from 'react';
import { getComments, addComment, updateComment, deleteComment } from '../modules/ApiCrud';

export default function CommentSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Errore nel recupero dei commenti:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const addedComment = await addComment(postId, {
        content: newComment,
        name: currentUser.nome,
        email: currentUser.email
      });
      setComments([...comments, addedComment]);
      setNewComment('');
    } catch (error) {
      console.error("Errore nell'aggiunta del commento:", error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      const updatedComment = await updateComment(postId, commentId, { content: newContent });
      setComments(comments.map(c => c._id === commentId ? updatedComment : c));
      setEditingComment(null);
    } catch (error) {
      console.error("Errore nella modifica del commento:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(postId, commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error("Errore nell'eliminazione del commento:", error);
    }
  };

  return (
    <div className="comment-section mt-8 w-[97%]">
      <h3 className="text-xl font-bold mb-4 dark:text-white">Commenti</h3>
      
      {currentUser && (
        <form onSubmit={handleAddComment} className="mb-6 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Aggiungi un commento..."
            className="w-full p-2 pr-24 border dark:text-white dark:border-sky-500 rounded bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-50"
            rows="4"
          />
          <button 
            type="submit" 
            className="absolute bottom-2 right-2 px-2 py-1 bg-transparent text-black dark:text-white rounded-full hover:bg-sky-500 transition-colors"
          >
            Invia
          </button>
        </form>
      )}

      {comments.map(comment => (
        <div key={comment._id} className="bg-white border bg-opacity-50 p-1 rounded mb-4 dark:bg-black dark:bg-opacity-50 relative">
          <p className="font-bold dark:text-sky-500">{comment.name}</p>
          {editingComment === comment._id ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditComment(comment._id, editContent);
            }}>
              <textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded resize-none sm:resize-vertical"
                rows="3"
              />
              <div className="mt-2">
                <button 
                  type="submit" 
                  className="px-4 mr-2 py-2 text-emerald-500 hover:text-emerald-300 transition-colors border rounded-lg shadow-md shadow-emerald-500 bg-emerald-700 bg-opacity-30"
                >
                  Salva
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingComment(null)} 
                  className="px-4 mr-2 py-2 text-gray-400 hover:text-gray-300 transition-colors border rounded-lg shadow-md shadow-gray-500 bg-gray-700 bg-opacity-30"
                >
                  Annulla
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className='dark:text-white mb-12'>{comment.content}</p>
              {currentUser && currentUser.email === comment.email && !editingComment && (
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  <button 
                    onClick={() => {
                      setEditingComment(comment._id);
                      setEditContent(comment.content);
                    }} 
                    className="text-emerald-500 hover:text-emerald-300 transition-colors border rounded-lg shadow-md shadow-emerald-500 bg-white bg-opacity-30 dark:bg-emerald-700 dark:bg-opacity-30 p-1"
                  >
                    Modifica
                  </button>
                  <button 
                    onClick={() => handleDeleteComment(comment._id)} 
                    className="text-red-500 hover:text-red-300 transition-colors border rounded-lg shadow-md shadow-red-500 bg-white bg-opacity-30 dark:bg-red-700 dark:bg-opacity-30 p-1"
                  >
                    Elimina
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}