import { io, Socket } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const socket: Socket = io(API_BASE_URL, {
  autoConnect: false,          // Très important
  withCredentials: true,       // Si ton backend utilise des cookies
});
