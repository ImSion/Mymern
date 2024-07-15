import express from 'express';
import BlogPosts from '../modules/BlogPosts.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { sendEmail } from '../services/emailServices.js';

const router = express.Router();

// route per ricevere tutti i post
router.get('/', async (req,res) => {
    try {
        let query = { };
        if(req.query.title) {
            // query.title = req.query.title
            query.title = {$regex: req.query.title, $options: 'i'} // i = insensitive
        }
        const posts = await BlogPosts.find(query);
        res.json(posts)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
});

// route per cercare un post specifico
router.get('/:id', async (req,res) => {
    try {
        const post = await BlogPosts.findById(req.params.id);
        if(!post) {
            return res.status(404).json({message: 'Post non trovato'})
        } else {
            res.json(post);
        }
    } catch(err){
        res.status(500).json({message: err.message})
    }
});


// Routes per i commenti nei post

// GET /blogPosts/:id/comments => ritorna tutti i commenti di uno specifico post
router.get("/:id/comments", async (req, res) => {
    try {
      // Cerca il post nel database usando l'ID fornito
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        // Se il post non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Post non trovato" });
      }
      // Invia i commenti del post come risposta JSON
      res.json(post.comments);
    } catch (error) {
      // In caso di errore, invia una risposta di errore
      res.status(500).json({ message: error.message });
    }
  });

  // GET /blogPosts/:id/comments/:commentId => ritorna un commento specifico di un post specifico
router.get("/:id/comments/:commentId", async (req, res) => {
    try {
      // Cerca il post nel database usando l'ID fornito
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        // Se il post non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Post non trovato" });
      }
      // Cerca il commento specifico all'interno del post
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        // Se il commento non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Commento non trovato" });
      }
      // Invia il commento trovato come risposta JSON
      res.json(comment);
    } catch (error) {
      // In caso di errore, invia una risposta di errore
      res.status(500).json({ message: error.message });
    }
  });

  // POST /blogPosts/:id/comments => aggiungi un nuovo commento ad un post specifico
router.post("/:id/comments", async (req, res) => {
    try {
      // Cerca il post nel database usando l'ID fornito
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        // Se il post non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Post non trovato" });
      }
      // Crea un nuovo oggetto commento con i dati forniti
      const newComment = {
        name: req.body.name,
        email: req.body.email,
        content: req.body.content,
      };
      // Aggiungi il nuovo commento all'array dei commenti del post
      post.comments.push(newComment);
      // Salva le modifiche nel database
      await post.save();
      // Invia il nuovo commento come risposta JSON con status 201 (Created)
      res.status(201).json(newComment);
    } catch (error) {
      // In caso di errore, invia una risposta di errore
      res.status(400).json({ message: error.message });
    }
  });

  // PUT /blogPosts/:id/comments/:commentId => cambia un commento di un post specifico
router.patch("/:id/comments/:commentId", async (req, res) => {
    try {
      // Cerca il post nel database usando l'ID fornito
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        // Se il post non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Post non trovato" });
      }
      // Cerca il commento specifico all'interno del post
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        // Se il commento non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Commento non trovato" });
      }
      // Aggiorna il contenuto del commento
      comment.content = req.body.content;
      // Salva le modifiche nel database
      await post.save();
      // Invia il commento aggiornato come risposta JSON
      res.json(comment);
    } catch (error) {
      // In caso di errore, invia una risposta di errore
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE /blogPosts/:id/comments/:commentId => elimina un commento specifico da un post specifico
router.delete("/:id/comments/:commentId", async (req, res) => {
    try {
      // Cerca il post nel database usando l'ID fornito
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        // Se il post non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Post non trovato" });
      }
      // Cerca il commento specifico all'interno del post
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        // Se il commento non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Commento non trovato" });
      }
      // Rimuovi il commento dal post
      post.comments.pull(req.params.commentId);
      // Salva le modifiche nel database
      await post.save();
      // Invia un messaggio di conferma come risposta JSON
      res.json({ message: "Commento eliminato con successo" });
    } catch (error) {
      // In caso di errore, invia una risposta di errore
      res.status(500).json({ message: error.message });
    }
  });


router.use(authMiddleware)

// route per trovare tutti i post di un autore specifico
router.get('/blogposts/:authorEmail', async (req, res) => {
    try {
        const authorEmail = req.params.authorEmail;
        const blogPosts = await BlogPosts.find({ author: authorEmail });
        if (blogPosts.length === 0) {
            return res.status(404).json({ message: 'Nessun post trovato per questo autore' });
        }
        res.json(blogPosts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// route per creare un post
// router.post('/', async (req,res) => {
//     const post = new BlogPosts(req.body)
//     try {
//         const newPost = await post.save()
//         res.status(201).json(newPost)
//     } catch(err) {
//         res.status(400).json({message: err.message})
//     }
// });

// Post con Upload
router.post('/', cloudinaryUploader.single('cover'), async (req,res) => {
  try {
      console.log("Dati ricevuti dal client:", req.body);
      console.log("File ricevuto:", req.file);

      const postData = req.body;
      if(req.file) {
          postData.cover = req.file.path; // cloudinary
      }

      // Assicurati che tutti i campi richiesti siano presenti
      const requiredFields = ['categoria', 'titolo', 'content', 'author'];
      for (let field of requiredFields) {
          if (!postData[field]) {
              throw new Error(`Campo mancante: ${field}`);
          }
      }

      // Assicurati che readTime sia un oggetto con value e unit
      if (!postData.readTime || !postData.readTime.value || !postData.readTime.unit) {
          throw new Error('readTime non valido');
      }

      const newPost = new BlogPosts(postData)
      await newPost.save()
      console.log("Post salvato nel database");

      // Codice per invio mail con Mailgun
      const htmlContent = `
      <h1>Il tuo post è stato pubblicato!</h1>
      <p>ciao ${newPost.author},</p>
      <p>Il tuo post "${newPost.titolo}" è stato pubblicato con successo</p>
      <p>Categoria : ${newPost.categoria}</p>
      <p>Grazie per il tuo contributo al blog!</p>
      `;
      try {
          await sendEmail(newPost.author, 'il tuo post è stato pubblicato', htmlContent)
          console.log("Email inviata con successo");
      } catch (emailError) {
          console.error('Errore nell\'invio dell\'email:', emailError);
          // Non interrompiamo il flusso se l'email non viene inviata
      }

      res.status(201).json(newPost)
  } catch(err) {
      console.error('Errore nella creazione del post:', err);
      res.status(400).json({message: err.message, details: err.toString()})
  }
})


// Route per aggiornare un post
router.patch('/:id', async (req, res) => {
    try {
        const updatePost = await BlogPosts.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true });
        if (!updatePost) {
            return res.status(404).json({ message: 'Post non trovato' });
        } else {
           res.json(updatePost);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH /blogPosts/:blogPostId/cover: carica un'immagine di copertina per il post specificato
router.patch("/:blogPostId/cover", cloudinaryUploader.single("cover"), async (req, res) => {
    try {
      // Verifica se è stato caricato un file o meno
      if (!req.file) {
        return res.status(400).json({ message: "Ops, nessun file caricato" });
      }
  
      // Cerca il blog post nel db
      const blogPost = await BlogPosts.findById(req.params.blogPostId);
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post non trovato" });
      }
  
      // Aggiorna l'URL della copertina del post con l'URL fornito da Cloudinary
      blogPost.cover = req.file.path;
  
      // Salva le modifiche nel db
      await blogPost.save();
  
      // Invia la risposta con il blog post aggiornato
      res.json(blogPost);
    } catch (error) {
      console.error("Errore durante l'aggiornamento della copertina:", error);
      res.status(500).json({ message: "Errore interno del server" });
    }
});


// Route per eliminare un post
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await BlogPosts.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post non trovato' });
        }
        res.json({ message: 'Post eliminato' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




export default router

