import { io } from "socket.io-client";

const URL = process.env.REACT_APP_EVENT_HANDLER;

export const socket = io(URL, {
  autoConnect: false,
});