import express from 'express';
import Authors from '../modules/Authors.js';
import BlogPosts from '../modules/BlogPosts.js';
import cloudinaryUploader from '../config/cloudinaryConfig.js';


const router = express.Router();

// recupero tutti gli authors presenti nel DB/API
router.get('/', async (req,res) => {
    try {
        const { page=1, limit=10 } = req.query;
        const authors = await Authors.find()
        .limit(limit)
        .skip((page - 1) * limit)

        const count = await Authors.countDocuments();

        res.json({
            authors,
            currentPage: page,
            totalPages: Math.ceil(count / limit)
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// recupero l'autore tramite l'ID generato da mongoDB, che incollerò nell'url /api/authors/<id>
router.get('/:id', async (req, res) => {
    try {
        const author = await Authors.findById(req.params.id);
        if (author == null) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        res.json(author);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// rotta per recuperare l'autore tramite email
router.get('/email/:email', async (req, res) => {
    try {
        const author = await Authors.findOne({ email: req.params.email });
        if (!author) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        res.json(author);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /authors/:id/blogPosts: ricevi tutti i blog post di uno specifico autore
router.get("/:id/blogPosts", async (req, res) => {
    try {
      // Cerca l'autore specifico per ID
      const author = await Authors.findById(req.params.id);
      if (!author) {
        // Se l'autore non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Autore non trovato" });
      }
      // Cerca tutti i blog post dell'autore usando la sua email
      const blogPosts = await BlogPosts.find({ author: author.email });
      // Invia la lista dei blog post come risposta JSON
      res.json(blogPosts);
    } catch (err) {
      // In caso di errore, invia una risposta di errore
      res.status(500).json({ message: err.message });
    }
  });

// Creo un nuovo author nel DB/API
router.post('/', async (req, res) => {
    const author = new Authors(req.body)

    try {
        const newAuthors = await author.save();
        res.status(201).json(newAuthors)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// POST /authors: crea un nuovo autore
router.post("/", async (req, res) => {
    try {
      // Crea una nuova istanza di Author con i dati dalla richiesta
      const author = new Author(req.body);
  
      // La password verrà automaticamente hashata grazie al middleware pre-save
      // che abbiamo aggiunto nello schema Author
  
      // Salva il nuovo autore nel database
      const newAuthor = await author.save();
  
      // Rimuovi la password dalla risposta per sicurezza
      const authorResponse = newAuthor.toObject();
      delete authorResponse.password;
  
      // Invia il nuovo autore creato come risposta JSON con status 201 (Created)
      res.status(201).json(authorResponse);
    } catch (err) {
      // In caso di errore (es. validazione fallita), invia una risposta di errore
      res.status(400).json({ message: err.message });
    }
  });

// Route per aggiornare parzialmente un autore esistente
router.patch('/:id', async (req, res) => {
    try {
        const updateAuthor = await Authors.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true });
        if (!updateAuthor) {
            return res.status(404).json({ message: 'Autore non trovato' });
        } else {
           res.json(updateAuthor);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH /authors/:authorId/avatar: carica un'immagine avatar per l'autore specificato
router.patch("/:authorId/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {
    try {
      // Verifica se è stato caricato un file, se non l'ho caricato rispondo con un 400
      if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato" });
      }
  
      // Cerca l'autore nel database, se non esiste rispondo con una 404
      const author = await Authors.findById(req.params.authorId);
      if (!author) {
        return res.status(404).json({ message: "Autore non trovato" });
      }
  
      // Aggiorna l'URL dell'avatar dell'autore con l'URL fornito da Cloudinary
      author.avatar = req.file.path;
  
      // Salva le modifiche nel db
      await author.save();
  
      // Invia la risposta con l'autore aggiornato
      res.json(author);
    } catch (error) {
      console.error("Errore durante l'aggiornamento dell'avatar:", error);
      res.status(500).json({ message: "Errore interno del server" });
    }
  });

// Route per eliminare un autore
router.delete('/:id', async (req, res) => {
    try {
        const deletedAuthor = await Authors.findByIdAndDelete(req.params.id);
        if (!deletedAuthor) {
            return res.status(404).json({ message: 'Autore non trovato' });
        }
        res.json({ message: 'Autore eliminato' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router
