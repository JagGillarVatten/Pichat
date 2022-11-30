const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
function playNotificationSound() {
  const notificationSound = new Audio("/notification-sound.wav");
  notificationSound
    .play()
    .then(() => console.log("Playing notification sound"))
    .catch((error) => console.error(error));
}

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

var chatHistory = [];

const badWords = [
  "anal",
  "anus",
  "arse",
  "ass",
  "ass fuck",
  "ass hole",
  "assfucker",
  "asshole",
  "assshole",
  "bastard",
  "bitch",
  "black cock",
  "bloody hell",
  "boong",
  "cock",
  "cockfucker",
  "cocksuck",
  "cocksucker",
  "coon",
  "coonnass",
  "crap",
  "cunt",
  "cyberfuck",
  "damn",
  "darn",
  "dick",
  "dirty",
  "douche",
  "dummy",
  "erect",
  "erection",
  "erotic",
  "escort",
  "fag",
  "faggot",
  "fuck",
  "Fuck off",
  "fuck you",
  "fuckass",
  "fuckhole",
  "god damn",
  "gook",
  "hard core",
  "hardcore",
  "homoerotic",
  "hore",
  "lesbian",
  "lesbians",
  "mother fucker",
  "motherfuck",
  "motherfucker",
  "negro",
  "nigger",
  "orgasim",
  "orgasm",
  "penis",
  "penisfucker",
  "piss",
  "piss off",
  "porn",
  "porno",
  "pornography",
  "pussy",
  "retard",
  "sadist",
  "sex",
  "sexy",
  "shit",
  "slut",
  "son of a bitch",
  "suck",
  "tits",
  "viagra",
  "whore",
  "xxx",
  //add more bad words if you want
];

const badUserNames = [
  "anal",
  "anus",
  "arse",
  "ass",
  "ass fuck",
  "ass hole",
  "assfucker",
  "asshole",
  "assshole",
  "bastard",
  "bitch",
  "black cock",
  "bloody hell",
  "boong",
  "cock",
  "cockfucker",
  "cocksuck",
  "cocksucker",
  "coon",
  "coonnass",
  "crap",
  "cunt",
  "cyberfuck",
  "damn",
  "darn",
  "dick",
  "dirty",
  "douche",
  "dummy",
  "erect",
  "erection",
  "erotic",
  "escort",
  "fag",
  "faggot",
  "fuck",
  "Fuck off",
  "fuck you",
  "fuckass",
  "fuckhole",
  "god damn",
  "gook",
  "hard core",
  "hardcore",
  "homoerotic",
  "hore",
  "lesbian",
  "lesbians",
  "mother fucker",
  "motherfuck",
  "motherfucker",
  "negro",
  "nigger",
  "orgasim",
  "orgasm",
  "penis",
  "penisfucker",
  "piss",
  "piss off",
  "porn",
  "porno",
  "pornography",
  "pussy",
  "retard",
  "sadist",
  "sex",
  "sexy",
  "shit",
  "slut",
  "son of a bitch",
  "suck",
  "tits",
  "viagra",
  "whore",
  "xxx",
  //add more bad usernames if you want
];

io.on("connection", function (socket) {
  console.log("a user connected");
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
  socket.on("chat message", function (msg) {
    console.log("message: " + msg);
    const message = msg.message;
    const username = msg.user;
    const isBadMessage = badWords.some((word) =>
      message.toLowerCase().includes(word.toLowerCase())
    );
    const isBadUsername = badUserNames.some(
      (badName) => badName.toLowerCase() === username.toLowerCase()
    );
    if (isBadMessage || isBadUsername) {
      //bad message or username found, do not emit the message
      return;
    }
    chatHistory.push(msg);
    io.emit("chat message", msg); //emit the message to all the connected clients
  });
  socket.on("get chat history", function () {
    for (var i = 0; i < chatHistory.length; i++) {
      socket.emit("chat message", chatHistory[i]);
    }
  });
});

http.listen(3000, function () {
  console.log("listening on *:3000");
});
