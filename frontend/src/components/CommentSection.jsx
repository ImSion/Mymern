import { useState, useEffect } from 'react';
import { getComments, addComment, updateComment, deleteComment } from '../modules/ApiCrud';

export default function CommentSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);

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
    <div className="comment-section mt-8">
      <h3 className="text-2xl font-bold mb-4">Commenti</h3>
      
      {currentUser && (
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Aggiungi un commento..."
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
            Invia commento
          </button>
        </form>
      )}

      {comments.map(comment => (
        <div key={comment._id} className="bg-gray-100 p-4 rounded mb-4">
          <p className="font-bold">{comment.name}</p>
          {editingComment === comment._id ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditComment(comment._id, e.target.content.value);
            }}>
              <textarea 
                name="content" 
                defaultValue={comment.content} 
                className="w-full p-2 border rounded"
              />
              <div className="mt-2">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                >
                  Salva
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingComment(null)} 
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Annulla
                </button>
              </div>
            </form>
          ) : (
            <p>{comment.content}</p>
          )}
          {currentUser && currentUser.email === comment.email && !editingComment && (
            <div className="mt-2">
              <button 
                onClick={() => setEditingComment(comment._id)} 
                className="mr-2 text-blue-500"
              >
                Modifica
              </button>
              <button 
                onClick={() => handleDeleteComment(comment._id)} 
                className="text-red-500"
              >
                Elimina
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}