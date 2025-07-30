"use client";
import { useRef, useState, useEffect, useCallback } from "react";

import styles from "./minesweeper.module.css";
import Image from "next/image";
import { useZIndex } from "@/contexts/ZIndexContext";

interface Cell {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborCount: number;
}

type GameStatus = 'Playing' | 'Won' | 'Lost';

export default function Minesweeper() {
    const boxRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { getNextZIndex } = useZIndex();

    // Minesweeper game state
    const ROWS = 10;
    const COLS = 10;
    const MINES = 15;

    const [board, setBoard] = useState<Cell[][]>([]);
    const [gameStatus, setGameStatus] = useState<GameStatus>('Playing');
    const [flagCount, setFlagCount] = useState(MINES);
    const [timer, setTimer] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    // Initialize the game board
    const initializeBoard = useCallback(() => {
        const newBoard: Cell[][] = Array(ROWS).fill(null).map(() =>
            Array(COLS).fill(null).map(() => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborCount: 0
            }))
        );

        // Place mines randomly
        const minePositions = new Set<string>();
        while (minePositions.size < MINES) {
            const row = Math.floor(Math.random() * ROWS);
            const col = Math.floor(Math.random() * COLS);
            minePositions.add(`${row}-${col}`);
        }

        // Set mines on board
        minePositions.forEach(pos => {
            const [row, col] = pos.split('-').map(Number);
            newBoard[row][col].isMine = true;
        });

        // Calculate neighbor counts
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (!newBoard[row][col].isMine) {
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            const newRow = row + dr;
                            const newCol = col + dc;
                            if (
                                newRow >= 0 && newRow < ROWS &&
                                newCol >= 0 && newCol < COLS &&
                                newBoard[newRow][newCol].isMine
                            ) {
                                count++;
                            }
                        }
                    }
                    newBoard[row][col].neighborCount = count;
                }
            }
        }

        setBoard(newBoard);
        setGameStatus('Playing');
        setFlagCount(MINES);
        setTimer(0);
        setGameStarted(false);
    }, [ROWS, COLS, MINES]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (gameStarted && gameStatus === 'Playing') {
            interval = setInterval(() => {
                setTimer(prev => Math.min(prev + 1, 999)); // Cap at 999 seconds
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [gameStarted, gameStatus]);

    // Initialize board when component mounts or becomes visible
    useEffect(() => {
        if (visible && board.length === 0) {
            initializeBoard();
        }
    }, [visible, board.length]);

    useEffect(() => {
        if (visible && boxRef.current) {
            const newZIndex = getNextZIndex();
            boxRef.current.style.zIndex = newZIndex.toString();
        }
    }, [visible]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setVisible(false);
            setIsClosing(false);
        }, 200); // Match the animation duration
    };

    // Reveal cell and adjacent empty cells
    const revealCell = useCallback((row: number, col: number) => {
        if (gameStatus !== 'Playing') return;

        // Start timer on first click
        if (!gameStarted) {
            setGameStarted(true);
        }

        setBoard(prevBoard => {
            const newBoard = prevBoard.map(row => [...row]);

            const reveal = (r: number, c: number) => {
                if (
                    r < 0 || r >= ROWS ||
                    c < 0 || c >= COLS ||
                    newBoard[r][c].isRevealed ||
                    newBoard[r][c].isFlagged
                ) return;

                newBoard[r][c].isRevealed = true;

                // If it's a mine, game over
                if (newBoard[r][c].isMine) {
                    setGameStatus('Lost');
                    // Reveal all mines
                    for (let i = 0; i < ROWS; i++) {
                        for (let j = 0; j < COLS; j++) {
                            if (newBoard[i][j].isMine) {
                                newBoard[i][j].isRevealed = true;
                            }
                        }
                    }
                    return;
                }

                // If it's empty (no neighboring mines), reveal adjacent cells
                if (newBoard[r][c].neighborCount === 0) {
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            reveal(r + dr, c + dc);
                        }
                    }
                }
            };

            reveal(row, col);
            return newBoard;
        });
    }, [gameStatus, gameStarted, ROWS, COLS]);

    // Toggle flag on cell
    const toggleFlag = useCallback((row: number, col: number, e: React.MouseEvent) => {
        e.preventDefault();
        if (gameStatus !== 'Playing') return;

        // Start timer on first flag (like classic Minesweeper)
        if (!gameStarted) {
            setGameStarted(true);
        }

        setBoard(prevBoard => {
            const newBoard = prevBoard.map(row => [...row]);
            const cell = newBoard[row][col];

            if (!cell.isRevealed) {
                if (cell.isFlagged) {
                    cell.isFlagged = false;
                    setFlagCount(prev => prev + 1);
                } else if (flagCount > 0) {
                    cell.isFlagged = true;
                    setFlagCount(prev => prev - 1);
                }
            }

            return newBoard;
        });
    }, [gameStatus, gameStarted]);

    // Check for win condition
    useEffect(() => {
        if (board.length === 0 || gameStatus !== 'Playing') return;

        let revealedCount = 0;

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = board[row][col];
                if (cell.isRevealed && !cell.isMine) {
                    revealedCount++;
                }
            }
        }

        if (revealedCount === ROWS * COLS - MINES) {
            setGameStatus('Won');
        }
    }, [board, gameStatus, ROWS, COLS, MINES]);

    const resetGame = () => {
        setBoard([]);
        setTimer(0);
        setGameStarted(false);
        initializeBoard();
    };

    useEffect(() => {
        const handleMouseMove = (e: { clientX: number; clientY: number }) => {
            if (isDragging && boxRef.current) {
                boxRef.current.style.left = `${e.clientX - offset.x}px`;
                boxRef.current.style.top = `${e.clientY - offset.y}px`;
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, offset]);

    const handleMouseDown = (e: { clientX: number; clientY: number }) => {
        const box = boxRef.current;
        if (!box) return;

        const rect = box.getBoundingClientRect();
        setOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        setIsDragging(true);
    };

    return (
        <div>
            <div className={styles.icon} onClick={() => setVisible(true)}>
                <Image src={"/minesweeper.webp"} alt="Logo" width={45} height={45} />
                <h2>Minesweeper</h2>
            </div>
            {visible && (
                <div ref={boxRef} onMouseDown={() => {
                    // Bring this component to front
                    const newZIndex = getNextZIndex();
                    boxRef.current && (boxRef.current.style.zIndex = newZIndex.toString());
                }} className={`${styles.container} ${isClosing ? styles.closing : ''}`}>
                    <div
                        onMouseDown={handleMouseDown}
                        className={`${styles.nav} ${isDragging ? styles.grabbing : ""}`}
                    >
                        <Image src={"/minesweeper.webp"} alt="Logo" width={20} height={20} />
                        <h2 className={styles.title}>Minesweeper</h2>
                        <div className={styles.close}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClose();
                            }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <Image src={"/exit.webp"} alt="Close" width={25} height={25} />
                        </div>
                    </div>
                    <div className={styles.canvas}>
                        <div className={styles.gameHeader}>
                            <div className={styles.analogDisplay}>
                                {flagCount.toString().padStart(3, '0')}
                            </div>
                            <div className={styles.resetCell} onClick={resetGame}>
                                <Image src={"/smiley.png"} alt="Reset" width={25} height={25} />
                            </div>
                            <div className={styles.analogDisplay}>
                                {timer.toString().padStart(3, '0')}
                            </div>
                        </div>
                        <div className={styles.gameBoard}>
                            {board.map((row, rowIndex) => (
                                <div key={rowIndex} className={styles.boardRow}>
                                    {row.map((cell, colIndex) => (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            className={`${styles.cell} ${cell.isRevealed
                                                ? cell.isMine
                                                    ? styles.mine
                                                    : styles.revealed
                                                : cell.isFlagged
                                                    ? styles.flagged
                                                    : styles.hidden
                                                }`}
                                            data-value={cell.isRevealed && !cell.isMine ? cell.neighborCount : undefined}
                                            onClick={() => revealCell(rowIndex, colIndex)}
                                            onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
                                        >
                                            {cell.isRevealed ? (
                                                cell.isMine ? (
                                                    <img src={"/bomb.png"} alt="Mine" />
                                                ) : cell.neighborCount > 0 ? (
                                                    cell.neighborCount
                                                ) : ''
                                            ) : cell.isFlagged ? (
                                                <img src={"/flag.png"} alt="Flag" />
                                            ) : ''}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* {gameStatus === 'Won' && (
                        <div className={styles.winOverlay}>
                            <div className={styles.winMessage}>
                                <h1 className={styles.winTitle}>🎉 Congratulations! 🎉</h1>
                                <p>You won!</p>
                                <div className={styles.winStats}>
                                    <p>⏱️ Time: {timer} seconds</p>
                                    <p>🚩 Flags used: {MINES - flagCount} / {MINES}</p>
                                </div>
                                <div className={styles.winButtons}>
                                    <button 
                                        className={`${styles.winButton} ${styles.playAgainButton}`}
                                        onClick={resetGame}
                                    >
                                        Play Again
                                    </button>
                                    <button 
                                        className={`${styles.winButton} ${styles.closeButton}`}
                                        onClick={handleClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )} */}
                </div>
            )}
        </div>
    );
}
