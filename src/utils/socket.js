import { io } from "socket.io-client";

let socket;

export const initSocket = (url) => {
  if (!socket) {
    socket = io(url, {
      transports: ["websocket"], // force WebSocket transport
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket first.");
  }
  return socket;
};
