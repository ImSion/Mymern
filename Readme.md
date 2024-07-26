POVBlogs/
│
├── backend/
│   ├── config/
│   │   ├── cloudinaryConfig.js
│   │   └── passportConfig.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── errorHandlers.js
│   ├── modules/
│   │   ├── Authors.js
│   │   └── BlogPosts.js
│   ├── routes/
│   │   ├── authorsRoutes.js
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   ├── services/
│   │   └── emailServices.js
│   ├── utils/
│   │   └── jwt.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── ...
    ├── src/
    │   ├── components/
    │   │   ├── AnimatedBackground.jsx
    │   │   ├── CardSkeleton.jsx
    │   │   ├── CommentSection.jsx
    │   │   ├── Loader.jsx
    │   │   ├── MyFooter.jsx
    │   │   ├── MyNav.jsx
    │   │   └── NightSkyBackground.jsx
    │   ├── modules/
    │   │   ├── ApiCrud.js
    │   │   ├── axios.js
    │   │   └── SearchContext.jsx
    │   ├── Pages/
    │   │   ├── AuthorPosts.jsx
    │   │   ├── AuthorsList.jsx
    │   │   ├── CreatePost.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── PostDetail.jsx
    │   │   ├── Register.jsx
    │   │   └── UserPage.jsx
    │   ├── Style/
    │   │   ├── AnimatedBackground.css
    │   │   ├── Animations.css
    │   │   └── Form.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vercel.json
    └── vite.config.js

# POVBlogs

POVBlogs è una piattaforma di blogging che permette agli utenti di creare, leggere e interagire con post di blog.

## Backend

### Tecnologie utilizzate:
- Node.js
- Express.js
- MongoDB con Mongoose
- JWT per l'autenticazione
- Passport.js per l'autenticazione OAuth (Google)
- Multer e Cloudinary per la gestione dei file
- Bcrypt per l'hashing delle password
- Mailgun per l'invio di email

### Principali funzionalità:
1. **Gestione degli autori**:
   - Registrazione e login degli utenti
   - Autenticazione con Google OAuth
   - CRUD operations per i profili degli autori

2. **Gestione dei post**:
   - Creazione, lettura, aggiornamento ed eliminazione dei post
   - Upload di immagini di copertina
   - Paginazione dei risultati

3. **Sistema di commenti**:
   - Aggiunta, modifica ed eliminazione dei commenti per i post

4. **Autenticazione e Autorizzazione**:
   - Generazione e verifica di JWT
   - Middleware per proteggere le rotte

5. **Integrazione con servizi esterni**:
   - Upload di immagini su Cloudinary
   - Invio di email con Mailgun

6. **Gestione degli errori**:
   - Middleware personalizzati per la gestione degli errori

### Struttura del progetto:
- `routes/`: Definizione delle rotte API
- `modules/`: Modelli Mongoose per Authors e BlogPosts
- `middlewares/`: Middleware per autenticazione e gestione errori
- `config/`: Configurazioni per servizi esterni (Cloudinary, Passport)
- `utils/`: Utility functions (es. JWT)

## Frontend

### Tecnologie utilizzate:
- React
- React Router per la navigazione
- Axios per le chiamate API
- Tailwind CSS e Flowbite per lo styling
- Context API per la gestione dello stato globale

### Principali funzionalità:
1. **Interfaccia utente responsive**:
   - Design adattivo per dispositivi mobile e desktop

2. **Gestione dell'autenticazione**:
   - Pagine di login e registrazione
   - Integrazione con Google OAuth

3. **Visualizzazione dei post**:
   - Home page con lista dei post
   - Pagina di dettaglio del post
   - Sezione commenti interattiva

4. **Creazione e modifica dei post**:
   - Form per la creazione di nuovi post
   - Funzionalità di modifica per i propri post

5. **Profilo utente**:
   - Visualizzazione e modifica del profilo
   - Lista dei post dell'autore

6. **Ricerca e filtri**:
   - Funzionalità di ricerca per titolo o autore
   - Filtro per categoria

7. **Tema chiaro/scuro**:
   - Toggle per cambiare il tema dell'applicazione

8. **Animazioni e effetti visivi**:
   - Animazioni per il caricamento dei contenuti
   - Sfondi animati per migliorare l'esperienza utente

### Struttura del progetto:
- `components/`: Componenti React riutilizzabili
- `pages/`: Componenti per le pagine principali
- `modules/`: Logica di business e chiamate API
- `styles/`: File CSS per animazioni e stili personalizzati

## Funzionalità e logiche chiave del progetto:

1. **Autenticazione multi-provider**: Gli utenti possono registrarsi e accedere sia con credenziali locali che tramite Google OAuth.

2. **Gestione dei post con ricche funzionalità**: Gli utenti possono creare post con titolo, contenuto, categoria, tempo di lettura e immagine di copertina.

3. **Sistema di commenti in tempo reale**: Gli utenti possono commentare i post e vedere i commenti aggiornati in tempo reale.

4. **Gestione del profilo utente**: Gli utenti possono visualizzare e modificare il proprio profilo, incluso il caricamento di un avatar.

5. **Ricerca e filtri avanzati**: Funzionalità di ricerca per titolo o autore, con filtri per categoria.

6. **Responsive design**: L'interfaccia si adatta a diversi dispositivi e dimensioni dello schermo.

7. **Tema chiaro/scuro**: Gli utenti possono scegliere tra un tema chiaro e uno scuro per l'intera applicazione.

8. **Animazioni e transizioni**: Utilizzo di animazioni per migliorare l'esperienza utente durante la navigazione e il caricamento dei contenuti.

9. **Gestione dello stato globale**: Utilizzo del Context API di React per gestire lo stato dell'autenticazione e altre informazioni globali.

10. **Integrazione con servizi cloud**: Utilizzo di Cloudinary per la gestione delle immagini e Mailgun per l'invio di email.

11. **Sicurezza**: Implementazione di best practices di sicurezza, inclusi l'hashing delle password e l'uso di token JWT per l'autenticazione.