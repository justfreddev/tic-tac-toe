const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
app.use(cors);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    }
});

let games = {};

function checkWin(board) {
    for (let i = 0; i < 3; i++) {
        if (board[i] !== "" && board[i] === board[i + 3] && board[i] === board[i + 6]) {
            return board[i];
        }
    }

    for (let i = 0; i < 9; i += 3) {
        if (board[i] !== "" && board[i] === board[i + 1] && board[i] === board[i + 2]) {
            return board[i];
        }
    }

    if (board[0] !== "" && board[0] === board[4] && board[0] === board[8]) {
        return board[0];
    }
    if (board[2] !== "" && board[2] === board[4] && board[2] === board[6]) {
        return board[2];
    }
    return null;
}

io.on("connection", (socket) => {

    // Occurs when a user creates a new game with a new ID
    socket.on("create-game", (gameId) => {
        console.log("User created game: ", gameId);
        games[gameId] = { board: Array(9).fill(""), players: [socket.id]};
        socket.join(gameId);
    });

    // Occurs when a user joins an existing game with a given ID
    socket.on("join-game", (gameId) => {
        if (games[gameId]) {
            games[gameId].players.push(socket.id);
            socket.join(gameId);

            if (games[gameId].players.length === 2) {
                let player1 = Math.floor(Math.random() * 2) === 0 ? "X" : "O";
                let player2 = player1 === "X" ? "O" : "X";
                io.to(games[gameId].players[0]).emit("start-game", player1);
                io.to(games[gameId].players[1]).emit("start-game", player2);
            } else if (games[gameId].players.length > 2) {
                console.error(`Game ${gameId} has too many players`);
                io.to(socket.id).emit("game-full");
            } else {
                io.to(gameId).emit("waiting-for-player");
            }
        } else {
            console.error(`Game ${gameId} does not exist`);
        }
    });

    // Occurs when a user makes a move in a game
    socket.on("move", ({ gameId, index, player }) => {
        if (games[gameId]) {
            console.log(player);
            games[gameId].board[index] = player;
            console.log(`${player} moved to ${index}`);
            io.to(gameId).emit("move", { index: index, player: player });
            let winner = checkWin(games[gameId].board);
            if (winner) {
                io.to(gameId).emit("game-over", winner);
            } else if (games[gameId].board.every((cell) => cell !== "")) {
                io.to(gameId).emit("game-over", "draw");
            }
        }
    });
})

server.listen(3000, () => {
    console.log("Server running on port 3000");
})