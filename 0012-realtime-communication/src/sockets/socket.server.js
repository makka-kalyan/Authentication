import { Server } from "socket.io";

export default function initialiazeSocket(httpServer) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("disconnect ", () => {
      console.log("A user disconnected", socket.id);
    });

    socket.on("elon", (msg) => {
      console.log("Elon event received", msg);
      socket.emit("musk", "hello from server via socket");
    });
  });
}
