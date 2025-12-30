type Player = "X" | "O" | null;

interface BoardProps {
  board: Player[];
  winner: Player | "draw" | null;
  onCellClick: (index: number) => void;
}

export default function Board({ board, winner, onCellClick }: BoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {board.map((cell, i) => (
        <button
          key={i}
          onClick={() => onCellClick(i)}
          disabled={cell !== null || winner !== null}
          className={`w-24 h-24 text-4xl font-bold flex items-center justify-center
            ${
              cell
                ? "bg-indigo-800 text-white"
                : "bg-indigo-500 hover:bg-indigo-600"
            }
            disabled:cursor-not-allowed`}
        >
          {cell ?? ""}
        </button>
      ))}
    </div>
  );
}
