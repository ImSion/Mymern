import { verifyJWT } from "../utils/jwt.js";
import authors from '../modules/Authors.js'


export const authMiddleware = async (req, res, next) => {
  try {
    console.log("Headers ricevuti:", req.headers);
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log("Token estratto:", token);

    if (!token) {
      console.log("Nessun token fornito");
      return res.status(401).send('Token di autorizzazione mancante');
    }

    const decoded = await verifyJWT(token);
    console.log("Token decodificato:", decoded);

    const author = await authors.findById(decoded.id).select('-password');
    console.log("Autore trovato:", author);

    if (!author) {
      console.log("Autore non trovato nel DB");
      return res.status(401).send('Autore non presente nel DB');
    }

    req.author = author;
    next();
  } catch (error) {
    console.error("Errore nel middleware di autenticazione:", error);
    res.status(401).send('Token non valido');
  }
};