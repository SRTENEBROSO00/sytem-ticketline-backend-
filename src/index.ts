import cors from 'cors';
import express from 'express';
import http, { METHODS } from "http";
import user from './routes/user.route';
import { initSocket } from './socket.io';
import cookieParser from 'cookie-parser';
import tickets from './routes/ticket.route'
import { AppDataSource } from './data-source';


// Variables
const app = express();
const PORT = 3000;

//Middleware
app.use(express.json());
app.use(cookieParser()); //Parsear cookies en peticiones

//Cors config
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Front URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, // Para session/cookie. Activa el Acess-Control-Allow-Crendetial
}))

// Rutas
app.use(user);
app.use('/ticket/', tickets);
const server = http.createServer(app);


//Init socket
initSocket(server)

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