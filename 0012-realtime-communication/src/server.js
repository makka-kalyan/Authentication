import app from "./app/app.js";
import { createServer } from "node:http";
import initialiazeSocket from "./sockets/socket.server.js";

const httpServer = createServer(app);

initialiazeSocket(httpServer);

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
