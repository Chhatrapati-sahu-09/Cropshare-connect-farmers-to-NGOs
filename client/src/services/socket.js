import { io } from "socket.io-client";

// Initialize the socket connection to your backend URL
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // We will connect manually when the user logs in
});

export default socket;
