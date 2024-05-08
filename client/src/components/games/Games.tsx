import { Socket } from "socket.io-client";

import "./Games.css";
import { useState } from "react";

type GamesProps = {
    socket: Socket;
    gameId: string;
    setGameId: React.Dispatch<React.SetStateAction<string>>;
    setOutput: React.Dispatch<React.SetStateAction<string[]>>;
};

const Games: React.FC<GamesProps> = ({
    socket,
    gameId,
    setGameId,
    setOutput,
}) => {
    const [inGame, setInGame] = useState(false);

    function createGame() {
        setInGame(true);
        const randomString = Math.random()
            .toString(36)
            .replace(/[0-9]/g, "")
            .substring(2, 7);
        setGameId(randomString);

        setOutput((prevOutput) => [
            ...prevOutput,
            `Creating game ${randomString}...`,
        ]);

        socket.emit("create-game", randomString);

        setOutput((prevOutput) => [
            ...prevOutput,
            "Waiting for opponent to join...",
        ]);
    }

    function joinGame() {
        setInGame(true);
        setOutput((prevOutput) => [...prevOutput, `Joining game ${gameId}...`]);
        socket.emit("join-game", gameId);
    }

    return (
        <div>
            <div className="create">
                <button disabled={inGame} onClick={() => createGame()}>
                    Create Game
                </button>
            </div>
            <div className="join">
                <input
                    type="text"
                    placeholder="Enter Game ID"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                />
                <button disabled={inGame} onClick={() => joinGame()}>
                    Join Game
                </button>
            </div>
        </div>
    );
};

export default Games;
