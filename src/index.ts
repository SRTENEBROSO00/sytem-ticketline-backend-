import express from 'express';
import user from './routes/user.route';
import tickets from './routes/ticket.route'
import { AppDataSource } from './data-source';

// Variables
const app = express();
const PORT = 3000;

//Middleware
app.use(express.json());

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
.catch((err) => {
    console.log(`Connection error: ${err}`)
});