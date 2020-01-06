export const board = [
    [null, 'B', null, 'B', null, 'B', null, 'B'],
    ['B', null, 'B', null, 'B', null, 'B', null],
    [null, 'B', null, 'B', null, 'B', null, 'B'],
    ['X', null, 'X', null, 'X', null, 'X', null],
    [null, 'X', null, 'X', null, 'X', null, 'X'],
    ['G', null, 'G', null, 'G', null, 'G', null],
    [null, 'G', null, 'G', null, 'G', null, 'G'],
    ['G', null, 'G', null, 'G', null, 'G', null],
];


export function changeTo(row, col, sq) {
    row[col] = sq; //Change the square to empty
    return row;
}

export function checkKing(row, player) {
    for (let index = 0; index < row.length; index++) {
        if (row[index] === player)
            return index;
    }
    return -1;
}

export function checkIfKingCanEatFromBottomRight(firstRow, firstCol, secondRow, board, player) {
    for (let i = 0; i < firstRow - secondRow - 1; i++) {
        const row = board[firstRow - i - 1];
        const square = row[firstCol - i - 1];
        if (square === player) return false;
        else if (square !== 'X') {
            const tempRow = board[firstRow - i - 2];
            if (tempRow[firstCol - i - 2] !== 'X' && i + 1 < firstRow - secondRow - 1)
                return false;
            else {
                row[firstCol - i - 1] = 'X';
                board[firstRow - i - 1] = row;
            }
        }
    }
    return board;
}


export function checkIfKingCanEatFromBottomLeft(firstRow, firstCol, secondRow, board, player) {
    for (let i = 0; i < firstRow - secondRow - 1; i++) {
        const row = board[firstRow - i - 1];
        const square = row[firstCol + i + 1];
        if (square === player) return false;
        else if (square !== 'X') {
            const tempRow = board[firstRow - i - 2];
            if (tempRow[firstCol + i + 2] !== 'X' && i + 1 < firstRow - secondRow - 1)
                return false;
            else {
                row[firstCol + i + 1] = 'X';
                board[firstRow - i - 1] = row;
            }
        }
    }
    return board;
}


export function checkIfKingCanEatFromTopLeft(firstRow, firstCol, secondRow, board, player) {
    for (let i = 0; i < secondRow - firstRow - 1; i++) {
        const row = board[firstRow + i + 1];
        const square = row[firstCol + i + 1];
        if (square === player) return false;
        else if (square !== 'X') {
            const tempRow = board[firstRow + i + 2];
            if (tempRow[firstCol + i + 2] !== 'X' && i + 1 < secondRow - firstRow - 1)
                return false;
            else {
                row[firstCol + i + 1] = 'X';
                board[firstRow + i + 1] = row;
            }
        }
    }
    return board;
}

export function checkIfKingCanEatFromTopRight(firstRow, firstCol, secondRow, board, player) {
    for (let i = 0; i < secondRow - firstRow - 1; i++) {
        const row = board[firstRow + i + 1];
        const square = row[firstCol - i - 1];
        if (square === player) return false;
        else if (square !== 'X') {
            const tempRow = board[firstRow + i + 2];
            if (tempRow[firstCol - i - 2] !== 'X' && i + 1 < secondRow - firstRow - 1)
                return false;
            else {
                row[firstCol - i - 1] = 'X';
                board[firstRow + i + 1] = row;
            }
        }
    }
    return board;
}

export function checkWin(board) {
    var bPlayers = 0;
    var gPlayers = 0;
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            if (row[j] === 'G' || row[j] === 'KG') gPlayers++;
            else if (row[j] === 'B' || row[j] === 'KB') bPlayers++;
        }
    }
    if (bPlayers === 0) return 'G'
    else if (gPlayers === 0) return 'B'

    return false;
}


export function checkEdge(row, col) {
    const check = [
        [0, 1],
        [0, 3],
        [0, 5],
        [1, 0],
        [2, 7],
        [3, 0],
        [4, 7],
        [5, 0],
        [6, 7],
        [7, 0],
        [7, 2],
        [7, 4],
        [7, 6]
    ];
    for (let index = 0; index < check.length; index++) {
        const [r, c] = check[index];
        if (r === row && col === c)
            return false;
    }
    return true;

}