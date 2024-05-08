import "./Console.css";

type ConsoleProps = {
    output: string[];
};

const Console: React.FC<ConsoleProps> = ({ output }) => {
    return (
        <div>
            <h2>Log</h2>
            <textarea
                className="console"
                cols={50}
                rows={30}
                value={output.join("\n")}
                readOnly
            ></textarea>
        </div>
    );
};

export default Console;
