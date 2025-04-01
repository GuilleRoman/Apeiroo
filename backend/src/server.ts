import express from 'express';
import dutiesRouter from './controller';  // ✅ Import the router
import cors from 'cors'

const app = express();
app.use(express.json());  // ✅ Allows JSON parsing
app.use(cors()); // Usa el middleware cors para permitir todas las solicitudes de origen cruzado.
console.log("✅ Registering API routes...");  // Debug log
app.use('/api', dutiesRouter);  // ✅ Mounts the router with '/api' prefix

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
