document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const message = document.getElementById("message");
    const resetButton = document.getElementById("reset"); // Get the reset button
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;
    let gameMode = "vs-player"; // Default game mode

    // Function to create and display the game board
    function createBoard() {
        board.innerHTML = ""; // Clear the board
        gameState.forEach((cell, index) => {
            const div = document.createElement("div");
            div.className = `cell ${cell ? "taken" : ""}`; // Assign 'taken' class if there's a move
            div.innerText = cell;
            if (gameActive && !cell) {
                div.addEventListener("click", () => handleCellClick(index)); // Add click event if empty
            }
            board.appendChild(div);
        });
    }

    // Handle cell click event
    function handleCellClick(index) {
        if (!gameActive || gameState[index]) return;

        gameState[index] = currentPlayer;
        createBoard(); // Update the board

        // Check if a player wins
        if (checkWin()) {
            message.innerText = `Player ${currentPlayer} wins! 🎉`;
            endGame();
            return;
        }

        // Check if the game is a draw
        if (gameState.every(cell => cell)) {
            message.innerText = "It's a draw! 🤝";
            endGame();
            return;
        }

        // Switch players
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        message.innerText = gameMode === "vs-ai" && currentPlayer === "O" ? "AI is thinking..." : `Player ${currentPlayer}'s turn`;

        // If playing against AI and it's AI's turn
        if (gameMode === "vs-ai" && currentPlayer === "O") {
            setTimeout(aiMove, 700); // Delay AI move
        }
    }

    // AI Move logic (Random AI move)
    function aiMove() {
        if (!gameActive) return;

        const emptyCells = gameState.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gameState[randomIndex] = "O";
        createBoard(); // Update the board

        // Check if AI wins
        if (checkWin()) {
            message.innerText = "AI wins! 🤖";
            endGame();
            return;
        }

        // Check if it's a draw
        if (gameState.every(cell => cell)) {
            message.innerText = "It's a draw! 🤝";
            endGame();
            return;
        }

        // Switch back to Player X's turn
        currentPlayer = "X";
        message.innerText = "Player X's turn";
    }

    // Check for winning conditions
    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        return winPatterns.some(pattern => pattern.every(index => gameState[index] === currentPlayer));
    }

    // End the game (disable further moves)
    function endGame() {
        gameActive = false;
        board.querySelectorAll(".cell").forEach(cell => cell.classList.add("taken"));
    }

    // Reset the game
    function resetGame() {
        gameState = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        message.innerText = `Player ${currentPlayer}'s turn`;
        createBoard(); // Recreate the board after reset
    }

    // Set game mode (vs-player or vs-ai)
    window.setGameMode = mode => {
        gameMode = mode;
        resetGame(); // Reset game when mode is set
    };

    // Attach event listener to the reset button
    resetButton.addEventListener("click", resetGame);

    // Initialize the game
    resetGame(); // Create the initial board
});
