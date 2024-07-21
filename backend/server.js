import express from 'express'; // Framework web per Node.js
import mongoose from 'mongoose'; // ODM per MongoDB
import dotenv from 'dotenv'; // Per caricare variabili d'ambiente da file .env
import cors from 'cors'; // Middleware per gestire CORS (Cross-Origin Resource Sharing)
import listEndpoints from 'express-list-endpoints' // Utility per elencare gli endpoints dell'app
import authorsRoutes from './routes/authorsRoutes.js' // Rotte per gli autori
import blogRoutes from './routes/blogRoutes.js' // Rotte per i blog post
import authRoutes from './routes/authRoutes.js' // Rotte per l'autenticazione 
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import session from "express-session"; // Importiamo session
import passport from "./config/passportConfig.js"; // importiamo passport

// MIDDLEWARE Importazione dei middleware per la gestione degli errori
import {
    badRequestHandler,
    unauthorizedHandler,
    notFoundHandler,
    genericErrorHandler,
  } from "./middlewares/errorHandlers.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const corsOptions = {
  origin: function (origin, callback) {
    // Definiamo una whitelist di origini consentite. 
    // Queste sono gli URL da cui il nostro frontend farà richieste al backend.
    const whitelist = [
      'http://localhost:5173', // Frontend in sviluppo
      'https://povblogs.vercel.app', // Frontend in produzione (prendere da vercel!)
      'https://mymern-k1d7.onrender.com' // URL del backend (prendere da render!)
    ];
    
    if (process.env.NODE_ENV === 'development') {
      // In sviluppo, permettiamo anche richieste senza origine (es. Postman)
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1 || !origin) {
      // In produzione, controlliamo se l'origine è nella whitelist
      callback(null, true);
    } else {
      callback(new Error('PERMESSO NEGATO - CORS'));
    }
  },
  credentials: true // Permette l'invio di credenziali, come nel caso di autenticazione
  // basata su sessioni.
};


dotenv.config();

const app = express();

app.use(cors(corsOptions))
app.use(express.json());

// Configurazione della sessione
app.use(
    session({
      // Il 'secret' è usato per firmare il cookie di sessione
      // È importante che sia una stringa lunga, unica e segreta
      secret: process.env.SESSION_SECRET,
  
      // 'resave: false' dice al gestore delle sessioni di non
      // salvare la sessione se non è stata modificata
      resave: false,
  
      // 'saveUninitialized: false' dice al gestore delle sessioni di non
      // creare una sessione finché non memorizziamo qualcosa
      // Aiuta a implementare le "login sessions" e riduce l'uso del server di memorizzazione
      saveUninitialized: false,
    })
  );

  // Inizializzazione di Passport
app.use(passport.initialize());
app.use(passport.session());


mongoose
.connect(process.env.MONGO_URI)
.then(()=> console.log('MongoDB connesso correttamente'))
.catch((err) => console.error('Errore', err))

app.use('/api/auth', authRoutes)
app.use('/api/authors', authorsRoutes)
app.use('/api/BlogPosts', blogRoutes)

const PORT = process.env.PORT || 5001

// Applicazione dei middleware per la gestione degli errori
app.use(badRequestHandler); // Gestisce errori 400 Bad Request
app.use(unauthorizedHandler); // Gestisce errori 401 Unauthorized
app.use(notFoundHandler); // Gestisce errori 404 Not Found
app.use(genericErrorHandler); // Gestisce tutti gli altri errori

app.listen(PORT,() => {
    console.log('Siamo in ascolto sulla porta' + PORT);
    console.table(
        listEndpoints(app)
    )
})