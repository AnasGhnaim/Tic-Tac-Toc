"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Board from "@/components/Board";

type Player = "X" | "O" | null;

interface GameState {
  board: Player[];
  turn: Player;
  winner: Player | "draw" | null;
}

export default function Home() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>("X");
  const [winner, setWinner] = useState<GameState["winner"]>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    try {
      //we do that to connect client with server it happens once and we call it a handshake
      const s = io("http://localhost:3001");

      s.on("state", (state: GameState) => {
        setBoard(state.board);
        setTurn(state.turn);
        setWinner(state.winner);
      });

      setSocket(s);

      return () => {
        s.disconnect();
      };
    } catch (error) {
      console.error("Socket initialization failed:", error);
    }
  }, []);

  const makeMove = (index: number) => {
    if (!socket || board[index] || winner) return;
    socket.emit("move", index);
  };

  const resetGame = () => {
    socket?.emit("reset");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 mt-6 ">
      <h1 className="text-indigo-800 font-bold text-4xl">Tic Tac Toe</h1>

      {winner ? (
        <p className="text-xl font-bold text-green-600">
          {winner === "draw" ? " Draw!" : ` Winner: ${winner}`}
        </p>
      ) : (
        <p className="text-lg font-semibold">Turn: {turn}</p>
      )}

      <Board board={board} winner={winner} onCellClick={makeMove} />

      <button
        onClick={resetGame}
        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-800"
      >
        Reset
      </button>
    </div>
  );
}
