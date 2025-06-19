import express from 'express';
import user from './routes/user.route';
import tickets from './routes/ticket.route'
import { AppDataSource } from './data-source';
import cors from 'cors';

// Variables
const app = express();
const PORT = 3000;

//Middleware
app.use(express.json());

//Cors config
app.use(cors({
    origin: "*", // Front URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Para session/cookie
}))

// Rutas
app.use(user);
app.use('/api/', tickets);

// Inicliaziamos la database
AppDataSource.initialize()
.then(() => {
    console.log("✔ 📦 Database initialized...")
    app.listen(PORT, () => {
        console.log(`🚀 Server runnin on => http://localhost:${PORT}`)
    })
})
.catch((err: unknown) => {
    console.log(`Connection error: ${err}`)
});