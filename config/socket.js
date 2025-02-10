const socketIO = require("socket.io");
const { updateSocketId } = require("../controllers/messages.js");
let io; // This will store the Socket.IO instance

function init(server) {
    io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        },
        maxHttpBufferSize: 1e8, // Set to a buffer value
    });
    io.listen(4000);

    const userSocketMap = {}; // Maps user_id to socket.id

    // socket connection
    io.on("connection", (socket) => {
        socket.on("userLoggedIn", async (data) => {
            await updateSocketId(data);
            // userSocketMap[data.user_id] = socket.id;
            // let updateSocket = await notificationsModel.updateSocket({ data });
            // io.to(data.socket_id).emit("notificationData", updateSocket);
        });

        socket.on("disconnect", (reason) => {
            // console.log(`User disconnected: ${reason} ${socket.id}`);
            return;
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
}

module.exports = {
    init,
    getIO,
};