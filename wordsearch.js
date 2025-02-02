// Word search game logic
function createWordSearch() {
    const grid = document.querySelector('.word-search-grid');
    const size = 10;
    const word = "ABHI";
    const confirmBtn = document.getElementById('confirm-btn');

    let cells = [];
    let selectedCells = [];
    let direction = null;
    
    // Create the grid
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            grid.appendChild(cell);
            cells.push(cell);
        }
    }

    // Place word randomly
    function placeWordRandomly(word) {
        const directions = [
            { dx: 0, dy: 1 },    // horizontal
            { dx: 1, dy: 0 },    // vertical
            { dx: 1, dy: 1 },    // diagonal right
            { dx: 1, dy: -1 },   // diagonal left
            { dx: 0, dy: -1 },   // horizontal reverse
            { dx: -1, dy: 0 },   // vertical reverse
            { dx: -1, dy: -1 },  // diagonal right reverse
            { dx: -1, dy: 1 }    // diagonal left reverse
        ];

        const direction = directions[Math.floor(Math.random() * directions.length)];
        const wordLength = word.length;
        
        let startRow, startCol;
        let attempts = 0;
        const maxAttempts = 50;

        do {
            if (direction.dx >= 0) {
                startRow = Math.floor(Math.random() * (size - (wordLength * Math.abs(direction.dx))));
            } else {
                startRow = Math.floor(Math.random() * (size - wordLength)) + wordLength;
            }

            if (direction.dy >= 0) {
                startCol = Math.floor(Math.random() * (size - (wordLength * Math.abs(direction.dy))));
            } else {
                startCol = Math.floor(Math.random() * (size - wordLength)) + wordLength;
            }

            attempts++;
        } while (attempts < maxAttempts && !isPositionValid(startRow, startCol, direction, word));

        if (attempts === maxAttempts) return null;

        // Place the word
        const placedCells = [];
        for (let i = 0; i < word.length; i++) {
            const row = startRow + (i * direction.dx);
            const col = startCol + (i * direction.dy);
            const cell = grid.children[row * size + col];
            cell.textContent = word[i];
            cell.dataset.target = 'true';
            placedCells.push(cell);
        }
        return placedCells;
    }

    function isPositionValid(row, col, direction, word) {
        for (let i = 0; i < word.length; i++) {
            const newRow = row + (i * direction.dx);
            const newCol = col + (i * direction.dy);
            
            if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
                return false;
            }
            
            const cell = grid.children[newRow * size + newCol];
            if (cell.textContent && cell.textContent !== word[i]) {
                return false;
            }
        }
        return true;
    }

    // Place the word
    const placedCells = placeWordRandomly(word);
    if (!placedCells) {
        console.error("Could not place word!");
        return;
    }

    // Fill remaining cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    cells.forEach(cell => {
        if (!cell.textContent) {
            cell.textContent = letters[Math.floor(Math.random() * letters.length)];
        }
    });
    
    // Get direction between two cells
    function getDirection(cell1, cell2) {
        const row1 = parseInt(cell1.dataset.row);
        const col1 = parseInt(cell1.dataset.col);
        const row2 = parseInt(cell2.dataset.row);
        const col2 = parseInt(cell2.dataset.col);
        
        return {
            dx: Math.sign(row2 - row1),
            dy: Math.sign(col2 - col1)
        };
    }

    function followsDirection(lastCell, newCell, dir) {
        const newDir = getDirection(lastCell, newCell);
        return newDir.dx === dir.dx && newDir.dy === dir.dy;
    }

    function isAdjacent(cell1, cell2) {
        const row1 = parseInt(cell1.dataset.row);
        const col1 = parseInt(cell1.dataset.col);
        const row2 = parseInt(cell2.dataset.row);
        const col2 = parseInt(cell2.dataset.col);
        
        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);
        
        return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
    }

    function clearSelection() {
        selectedCells.forEach(cell => {
            cell.classList.remove('selected');
        });
        selectedCells = [];
        direction = null;
        confirmBtn.classList.remove('active');
        confirmBtn.classList.add('inactive');
    }

    // Handle cell clicks
    function handleCellClick(e) {
        const cell = e.target;
        
        // If cell is already selected, do nothing
        if (selectedCells.includes(cell)) {
            return;
        }
        
        // First selection
        if (selectedCells.length === 0) {
            cell.classList.add('selected');
            selectedCells.push(cell);
            confirmBtn.classList.remove('inactive');
            confirmBtn.classList.add('active');
            return;
        }

        // Second selection - establish direction
        if (selectedCells.length === 1) {
            if (isAdjacent(cell, selectedCells[0])) {
                cell.classList.add('selected');
                selectedCells.push(cell);
                direction = getDirection(selectedCells[0], cell);
            } else {
                clearSelection();
            }
            return;
        }

        // Third or later selection - must follow direction
        const lastCell = selectedCells[selectedCells.length - 1];
        if (isAdjacent(cell, lastCell) && followsDirection(lastCell, cell, direction)) {
            cell.classList.add('selected');
            selectedCells.push(cell);
        } else {
            clearSelection();
        }
    }
    
    // Function to check selection when confirm button is clicked
    function checkSelection() {
        
        // If button is inactive, do nothing
        if (confirmBtn.classList.contains('inactive')) {
            return;
        }
        
        const selectedWord = selectedCells.map(cell => cell.textContent).join('');
        
        if (selectedWord === "ABHI") {
            // Correct word found
            selectedCells.forEach(cell => {
                cell.classList.remove('selected');
                cell.classList.add('correct');
            });
            setTimeout(() => {
                window.location.href = "finalpage.html";
            }, 1000);
        } else {
            // Wrong word, clear selection
            clearSelection();
        }
    }

    // Add click events to all cells
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    confirmBtn.addEventListener('click', () => {
        if (confirmBtn.classList.contains('active')) {
            checkSelection();
        }
    });
}

// Hint functionality
function showHint() {
    const modal = document.getElementById('hint-modal');
    modal.classList.add('show');
    setTimeout(() => {
        modal.classList.remove('show');
    }, 2000);
}

// Initialize the word search grid
document.addEventListener('DOMContentLoaded', () => {
    // Initialize word search grid
    createWordSearch();
});