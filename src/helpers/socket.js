const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../model/chat");
const User = require("../model/user");
const onlineUsers = require("./onlineUsers");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  // Attach Socket.IO to that HTTP server
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  // Listen for new socket connections

  io.on("connection", (socket) => {
    //Handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log(firstName + "Joined the Room: " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);
          const user = await User.findById(userId);
          //save messages to data base

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", {
            firstName: user.firstName,
            lastName: user.lastName,
            photoUrl: user.photoUrl,
            text,
          });
        } catch (err) {
          console.log(err);
        }
      },
    );
    socket.on("userOnline", ({ userId }) => {
      socket.userId = userId;

      onlineUsers.set(userId, socket.id);

      console.log("Online Users");

      console.log(onlineUsers);
    });

    // socket.on("disconnect", () => {});
    socket.on("disconnect", async () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);

        await User.findByIdAndUpdate(socket.userId, {
          lastSeen: new Date(),
        });

        console.log(socket.userId + " disconnected");
      }
    });
  });
};

module.exports = { initializeSocket, onlineUsers };
