import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const authorsSchema = new mongoose.Schema(
    {
      nome: {
        type: String,
        required: true,
        trim: true //rimuove gli spazi all'inizio e alla fine della stringa
      },
      cognome: {
        type: String,
        required: true,
        trim: true 
      },
      email: {
        type: String,
        required: true,
        trim: true 
      },
      data_di_nascita: {
        type: String,
        required: true,
        trim: true,
      },
      avatar: {
        type: String,
        required: true,
        trim: true,
        default: "https://www.shutterstock.com/image-vector/default-avatar-profile-vector-user-260nw-1705357234.jpg"
      },
      password: {
        type: String,
        required: true
      }

    },
    {
       collection: 'authors',
       timestamps: true 
    }
)

// Funzione che confronta la password
authorsSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
};

authorsSchema.pre('save', async function(next) {

  // Eseguo l'hashing solo se la password è stata modificata
  // oppure è una nuova password
  if(!this.isModified('password')) return next()

    try {
      // Genero un valore casuale con 10 round di hashing
      const salt = await bcrypt.genSalt(10);
      // E poi salvo
      this.password = await bcrypt.hash(this.password, salt)
      next();
    } catch(error) {
      // Se si verifica un errore, passo l'errore
      next(err)
    }
})

export default mongoose.model('authors', authorsSchema)
