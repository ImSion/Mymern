import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Authors from "../modules/Authors.js";

// Configuriamo la strategia di autenticazione Google
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5001/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("Profilo Google ricevuto:", profile); // Nuovo log
          const email = profile.emails[0].value.toLowerCase(); // Normalizzazione dell'email
          console.log("Email normalizzata:", email); // Nuovo log

          let author = await Authors.findOne({ 
            $or: [{ googleId: profile.id }, { email: email }]
          });

          if (!author) {
            author = new Authors({
              googleId: profile.id,
              nome: profile.name.givenName,
              cognome: profile.name.familyName,
              email: email,
              dataDiNascita: null,
            });
          } else if (!author.googleId) {
            author.googleId = profile.id;
          }

          await author.save();
          console.log("Autore salvato/trovato:", author); // Nuovo log
          done(null, author);
        } catch (error) {
          console.error("Errore nell'autenticazione Google:", error); // Nuovo log
          done(error, null);
        }
      }
    )
);


  // Serializzazione dell'utente per la sessione
// Questa funzione determina quali dati dell'utente devono essere memorizzati nella sessione
passport.serializeUser((user, done) => {
    // Memorizziamo solo l'ID dell'utente nella sessione
    done(null, user.id);
  });
  
  // Deserializzazione dell'utente dalla sessione
  // Questa funzione viene usata per recuperare l'intero oggetto utente basandosi sull'ID memorizzato
  passport.deserializeUser(async (id, done) => {
    try {
      // Cerchiamo l'utente nel database usando l'ID
      const user = await Authors.findById(id);
      // Passiamo l'utente completo al middleware di Passport
      done(null, user);
    } catch (error) {
      // Se si verifica un errore durante la ricerca, lo passiamo a Passport
      done(error, null);
    }
  });
  
  // Esportiamo la configurazione di Passport
  export default passport;
