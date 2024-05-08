import { io } from "socket.io-client";
import { useEffect, useState } from "react";

import Board from "./components/board/Board";
import Console from "./components/console/Console";
import Games from "./components/games/Games";

import "./App.css";

const socket = io("http://localhost:3000");

function App() {
    const [board, setBoard] = useState(Array(9).fill(""));
    const [gameId, setGameId] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [output, setOutput] = useState([""]);
    const [player, setPlayer] = useState("");

    useEffect(() => {
        socket.on("start-game", (player) => {
            setIsPlaying(true);
            setPlayer(player);
            setOutput((prevOutput) => [
                ...prevOutput,
                `Game started! You are player ${player}`,
            ]);
            if (player === "O") {
                setIsPlaying(false);
                setOutput((prevOutput) => [
                    ...prevOutput,
                    "Waiting for the other player to make a move...",
                ]);
            } else if (player === "X") {
                setIsPlaying(true);
                setOutput((prevOutput) => [
                    ...prevOutput,
                    "Your turn! Make a move.",
                ]);
            }
        });

        socket.on("move", (response) => {
            setOutput((prevOutput) => [
                ...prevOutput,
                `Player ${response.player} made a move`,
            ]);
            if (response.player === player) {
                setIsPlaying(false);
                setOutput((prevOutput) => [
                    ...prevOutput,
                    "Waiting for the other player to make a move...",
                ]);
            } else {
                setIsPlaying(true);
                setOutput((prevOutput) => [
                    ...prevOutput,
                    "Your turn! Make a move.",
                ]);
            }
            setBoard((prev) => {
                const copy = [...prev];
                copy[response.index] = response.player;
                return copy;
            });
        });

        socket.on("game-over", (winner) => {
            setIsPlaying(false);
            if (winner === "draw") {
                setOutput((prevOutput) => [
                    ...prevOutput,
                    "Game over! It's a draw!",
                ]);
                return;
            }
            setOutput((prevOutput) => [
                ...prevOutput,
                `Game over! ${winner} wins!`,
            ]);
        });

        socket.on("game-full", () => {
            setOutput((prevOutput) => [...prevOutput, "Game is full!"]);
        });

        // Avoids memory leaks, don't know how, but it does
        return () => {
            socket.off("start-game");
            socket.off("move");
            socket.off("game-over");
            socket.off("game-full");
        };
    }, [output, player]);

    return (
        <main>
            <div className="game-container">
                <Games
                    socket={socket}
                    gameId={gameId}
                    setGameId={setGameId}
                    setOutput={setOutput}
                />
                <Board
                    socket={socket}
                    player={player}
                    board={board}
                    gameId={gameId}
                    isPlaying={isPlaying}
                />
            </div>
            <Console output={output} />
        </main>
    );
}

export default App;
