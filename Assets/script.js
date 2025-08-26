// menu and game section
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const gridElement = document.getElementById("grid");
const colorsElement = document.getElementById("colors");

// buttons
const toggleBtn = document.getElementById("toggle-numbers");
const resetBtn = document.getElementById("reset");
const winMessage = document.getElementById("win-message");

let currentPuzzle = null;
let currentColor = null;
let numbersVisible = true;

const puzzles = {
    easy: {
        palette: {
            1: "#ffd633",
            2: "#000000",
            3: "#ff3333",
            4: "#ffffff"
        },
        grid: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,2,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0],
            [0,2,1,2,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0],
            [2,1,1,1,2,0,0,0,0,0,0,0,2,1,2,0,0,0,0],
            [2,1,1,1,1,2,2,2,0,0,0,0,2,1,1,2,0,0,0],
            [0,2,1,1,1,2,2,2,2,2,0,0,2,1,1,2,0,0,0],
            [0,0,2,1,1,1,2,2,1,1,2,2,1,1,1,1,2,0,0],
            [0,0,0,2,1,1,2,2,1,1,1,1,1,1,1,1,1,2,0],
            [0,0,2,1,1,2,0,2,1,1,1,1,1,1,1,1,1,4,2],
            [0,0,2,1,2,0,0,2,1,1,1,1,1,1,1,1,1,2,2],
            [0,0,0,2,1,2,2,1,1,1,1,1,2,4,1,1,1,1,2],
            [0,0,0,0,2,2,2,1,1,1,3,3,2,2,1,1,1,2,0],
            [0,0,0,0,0,2,2,2,1,1,1,3,1,1,1,1,2,0,0],
            [0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0],
            [0,0,0,0,0,2,2,1,1,2,1,1,1,1,1,2,2,0,0],
            [0,0,0,0,0,2,1,1,1,1,2,1,1,1,1,2,0,0,0],
            [0,0,0,0,0,2,1,1,1,2,1,1,1,1,2,1,2,0,0],
            [0,0,0,0,0,0,2,1,1,1,1,1,2,2,2,2,2,0,0],
            [0,0,0,0,0,0,2,2,1,2,2,2,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,1,1,1,2,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
    },
    medium: {
        palette: {
            1: "#c9a6d9",
            2: "#b07dc9",
            3: "#8c5fae",
            4: "#5b3b74",
            5: "#1d0019ff",
            6: "#ffffff",
            7: "#d62828",
            8: "#8b1a1a",
            9: "#1e3a8a",
            10: "#ebdbf3ff"
        },
        grid: [
            // ... your medium grid here ...
        ]
    }
    // Add your "hard" puzzle here if needed
};

// Difficulty select menu
document.querySelectorAll("#menu button").forEach(button => {
    button.addEventListener("click", () => {
        const puzzleName = button.dataset.puzzle;
        currentPuzzle = puzzleName;
        winMessage.classList.add("hidden");
        renderPalette(puzzles[puzzleName].palette);
        renderGrid(puzzles[puzzleName]);
        menu.classList.add("hidden");
        game.classList.remove("hidden");
    });
});

function renderPalette(palette) {
    colorsElement.innerHTML = "";
    Object.entries(palette).forEach(([num, color]) => {
        const swatch = document.createElement("div");
        swatch.className = "color-swatch";
        swatch.style.backgroundColor = color;
        swatch.dataset.num = num;
        swatch.addEventListener("click", () => {
            currentColor = num;
            document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("selected"));
            swatch.classList.add("selected");
        });
        colorsElement.appendChild(swatch);
    });
}

function renderGrid(puzzle) {
    gridElement.innerHTML = "";
    gridElement.style.display = "grid";
    gridElement.style.gridTemplateColumns = `repeat(${puzzle.grid[0].length}, 20px)`;

    puzzle.grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.dataset.correct = cell;
            cellDiv.dataset.y = y;
            cellDiv.dataset.x = x;
            cellDiv.dataset.filled = "false";
            cellDiv.style.backgroundColor = ""; // reset color

            if (cell !== 0 && numbersVisible) {
                cellDiv.textContent = cell;
            }
            gridElement.appendChild(cellDiv);
        });
    });
}

gridElement.addEventListener("click", e => {
    const cell = e.target;
    if (!cell.classList.contains("cell")) return;
    const correctNum = cell.dataset.correct;
    if (correctNum === "0" || !currentColor) return;

    cell.style.backgroundColor = puzzles[currentPuzzle].palette[currentColor];
    cell.textContent = "";

    if (currentColor === correctNum) {
        cell.dataset.filled = "true";
        checkWin();
    } else {
        cell.dataset.filled = "false";
    }
});

resetBtn.addEventListener("click", () => {
    renderGrid(puzzles[currentPuzzle]);
});

toggleBtn.addEventListener("click", () => {
    numbersVisible = !numbersVisible;
    renderGrid(puzzles[currentPuzzle]);
});

function checkWin() {
    // All non-zero cells must be filled correctly
    const cells = gridElement.querySelectorAll(".cell");
    let allCorrect = true;
    cells.forEach(cell => {
        if (cell.dataset.correct !== "0" && cell.dataset.filled !== "true") {
            allCorrect = false;
        }
    });
    if (allCorrect) {
        winMessage.classList.remove("hidden");
    }
}