import "./Square.css";

type SquareProps = {
    id: number;
    value: string;
    onClick: (id: number) => void;
    isPlaying: boolean;
};

const Square: React.FC<SquareProps> = ({ id, value, onClick, isPlaying }) => {
    return (
        <button
            disabled={!isPlaying || value != ""}
            className="square"
            onClick={() => onClick(id)}
        >
            {value}
        </button>
    );
};

export default Square;
