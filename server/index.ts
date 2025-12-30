import { createServer } from "http";
import { Server } from "socket.io";

type Player = "X" | "O" | null;

interface GameState {
  board: Player[];
  turn: Player;
  winner: Player | "draw" | null;
}

let board: Player[] = Array(9).fill(null);
let turn: Player = "X";
let winner: GameState["winner"] = null;

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

function checkWinner(board: Player[]): GameState["winner"] {
  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every((cell) => cell !== null)) {
    return "draw";
  }

  return null;
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.emit("state", { board, turn, winner });

  //Socket moves
  socket.on("move", (index: number) => {
    if (winner) return; // game already finished
    if (board[index]) return; // cell  filled

    board[index] = turn;
    winner = checkWinner(board);

    if (!winner) {
      turn = turn === "X" ? "O" : "X";
    }

    io.emit("state", { board, turn, winner });
  });

  socket.on("reset", () => {
    board = Array(9).fill(null);
    turn = "X";
    winner = null;
    io.emit("state", { board, turn, winner });
  });
});

httpServer.listen(3001, () => {
  console.log("Server is connected on port 3001!");
});
