import { Socket } from "socket.io-client";

import Square from "./Square";

import "./Board.css";

type BoardProps = {
    socket: Socket;
    player: string;
    board: string[];
    gameId: string;
    isPlaying: boolean;
};

const Board: React.FC<BoardProps> = ({
    socket,
    player,
    board,
    gameId,
    isPlaying,
}) => {
    function onClick(idx: number) {
        socket.emit("move", { gameId: gameId, index: idx, player: player });
    }

    return (
        <div className="board">
            <div className="board-row">
                <Square
                    id={0}
                    value={board[0]}
                    onClick={onClick}
                    isPlaying={isPlaying}
                />
                <Square
                    id={3}
                    value={board[3]}
                    onClick={onClick}
                    isPlaying={isPlaying}
                />
                <Square
                    id={6}
                    value={board[6]}
                    onClick={onClick}
                    isPlaying={isPlaying}
                />
            </div>
            <div className="board-row">
                <Square
                    id={1}
                    value={board[1]}
                    onClick={onClick}
                    isPlaying={isPlaying}
                />
                <Square
                    id={4}
                    value={board[4]}
                    onClick={onClick}
                    isPlaying={isPlaying}
                />
                <Square
                    id={7}
                    value={board[7]}
                    onClick={onClick}
                    isPlaying={isPlaying}
                />
            </div>
            <div className="board-row">
                <Square
                    id={2}
                    value={board[2]}
                    onClick={onClick}
                    isPlaying={isPlaying}
                />
                <Square
                    id={5}
                    value={board[5]}
                    onClick={onClick}
                    isPlaying={isPlaying}
                />
                <Square
                    id={8}
                    value={board[8]}
                    onClick={onClick}
                    isPlaying={isPlaying}
                />
            </div>
        </div>
    );
};

export default Board;
