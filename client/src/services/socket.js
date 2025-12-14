import { io } from "socket.io-client";

// Initialize the socket connection to your backend URL
const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false, // We will connect manually when the user logs in
});

export default socket;
