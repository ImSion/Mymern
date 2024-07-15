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

// MIDDLEWARE Importazione dei middleware per la gestione degli errori
import {
    badRequestHandler,
    unauthorizedHandler,
    notFoundHandler,
    genericErrorHandler,
  } from "./middlewares/errorHandlers.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

mongoose
.connect(process.env.MONGO_URI)
.then(()=> console.log('MongoDB connesso correttamente'))
.catch((err) => console.error('Errore', err))

app.use('/api/auth', authRoutes)
app.use('/api/authors', authorsRoutes)
app.use('/api/BlogPosts', blogRoutes)

const PORT = process.env.PORT || 5000

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