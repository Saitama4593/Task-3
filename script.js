document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const message = document.getElementById("message");
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;
    let gameMode = "vs-player"; // Default game mode

    function createBoard() {
        board.innerHTML = "";
        gameState.forEach((cell, index) => {
            const div = document.createElement("div");
            div.className = `cell ${cell ? "taken" : ""}`;
            div.innerText = cell;
            if (gameActive && !cell) {
                div.addEventListener("click", () => handleCellClick(index));
            }
            board.appendChild(div);
        });
    }

    function handleCellClick(index) {
        if (!gameActive || gameState[index]) return;

        gameState[index] = currentPlayer;
        createBoard();

        if (checkWin()) {
            message.innerText = `Player ${currentPlayer} wins! 🎉`;
            endGame();
            return;
        }

        if (gameState.every(cell => cell)) {
            message.innerText = "It's a draw! 🤝";
            endGame();
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        message.innerText = gameMode === "vs-ai" && currentPlayer === "O" ? "AI is thinking..." : `Player ${currentPlayer}'s turn`;

        if (gameMode === "vs-ai" && currentPlayer === "O") {
            setTimeout(aiMove, 700);
        }
    }

    function aiMove() {
        if (!gameActive) return;

        const emptyCells = gameState.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameState[randomIndex] = "O";
        createBoard();

        if (checkWin()) {
            message.innerText = "AI wins! 🤖";
            endGame();
            return;
        }

        if (gameState.every(cell => cell)) {
            message.innerText = "It's a draw! 🤝";
            endGame();
            return;
        }

        currentPlayer = "X";
        message.innerText = "Player X's turn";
    }

    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern => pattern.every(index => gameState[index] === currentPlayer));
    }

    function endGame() {
        gameActive = false;
        board.querySelectorAll(".cell").forEach(cell => cell.classList.add("taken"));
    }

    function resetGame() {
        gameState = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        message.innerText = `Player ${currentPlayer}'s turn`;
        createBoard();
    }

    window.setGameMode = mode => {
        gameMode = mode;
        resetGame();
    };

    resetGame();
});
