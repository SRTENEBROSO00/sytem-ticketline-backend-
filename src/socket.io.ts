import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { Socket } from "dgram";

let io : Server;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });
    
    io.on("connection", (socket) => {
        console.log("Client connected.", socket.id);
    });
    return io;
}

export const getIO = () => {
    if(!io) {
        throw new Error("Socket.io is not working.")
    }
    return io;
}