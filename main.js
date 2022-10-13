const ROW_NUM = 3;
const COL_NUM = 3;
const NUM_TO_WIN = 3;

let freeCells;
let grid;
let turn;
let gamesWon1 = 0;
let gamesWon2 = 0;
let name1;
let name2;
const mainContainer = document.getElementById("main-container");

function init() {
    freeCells = ROW_NUM * COL_NUM;
    grid = [];
    turn = 1;

    const winMsg = document.getElementById("win-msg");
    if (winMsg) {
        winMsg.remove();
    }

    const centerContainer = document.getElementById("center-container");
    renderYourTurn(leftContainer);
    renderBoard(centerContainer, centerContainer);
}

function renderWinMsg(player) {
    const boardContainer = document.getElementById("board-container");
    if (boardContainer) {
        boardContainer.remove();
    }
    const winMsg = document.createElement("h1");
    winMsg.id = "win-msg";
    winMsg.classList.add("text");
    if (player == 1) {
        winMsg.innerText = `${name1} Won!`;
        ++gamesWon1;
        document.getElementById("games-won-num1").innerText = gamesWon1;
    }
    if (player == 2) {
        winMsg.innerText = `${name2} Won!`;
        ++gamesWon2;
        document.getElementById("games-won-num2").innerText = gamesWon2;
    }
    if (player == 3) {
        winMsg.innerText = `Draw!`;
    }

    document.getElementById("center-container").appendChild(winMsg);

    setTimeout(init, 3000);
}


function checkWinCond() {
    let curSeqLen = 0;
    let curPl = 1;
    //check vertical
    for(let x = 0; x < COL_NUM; ++x) {
        for(let y = 0; y < ROW_NUM; ++y) {
            ++curSeqLen;
            if (grid[y][x] != curPl) {
                curSeqLen = 0;
                curPl = grid[y][x];
            }
            if(curSeqLen >= NUM_TO_WIN && curPl !== 0) {
                renderWinMsg(curPl);
                return;
            }
        }
        curSeqLen = 0;
        curPl = 1;
    }
    //check horizontal
    for(let y = 0; y < ROW_NUM; ++y) {
        for(let x = 0; x < COL_NUM; ++x) {
            ++curSeqLen;
            if (grid[y][x] != curPl) {
                curSeqLen = 0;
                curPl = grid[y][x];
            }
            if(curSeqLen >= NUM_TO_WIN && curPl !== 0) {
                renderWinMsg(curPl);
                return;
            }
        }
        curSeqLen = 0;
        curPl = 1;
    }

    let diags1 = [];
    let diags2 = [];
    for (let i = 0; i < COL_NUM + ROW_NUM; ++i) {
        diags1.push([]);
        diags2.push([]);
    }
    for(let x = 0; x < COL_NUM; ++x) {
        for(let y = 0; y < ROW_NUM; ++y) {
            diags1[x + y].push(grid[y][x]);
            diags2[COL_NUM + y - x].push(grid[y][x]);
        }
    }
    
    for(let i = 0; i < diags1.length; ++i) {
        for(let j = 0; j < diags1[i].length; ++j) {
            ++curSeqLen;
            if (diags1[i][j] != curPl) {
                curSeqLen = 0;
                curPl = diags1[i][j];
            }
            if(curSeqLen >= NUM_TO_WIN && curPl !== 0) {
                renderWinMsg(curPl);
                return;
            }
            if (diags2.length <= j) {
                diags2.push([]);
            }
            diags2[j].push(diags1[i][j]);
        }
        curSeqLen = 0;
        curPl = 1;
    }

    for(let i = 0; i < diags2.length; ++i) {
        for(let j = 0; j < diags2[i].length; ++j) {
            ++curSeqLen;
            if (diags2[i][j] != curPl) {
                curSeqLen = 0;
                curPl = diags2[i][j];
            }
            if(curSeqLen >= NUM_TO_WIN && curPl !== 0) {
                renderWinMsg(curPl);
                return;
            }
        }
        curSeqLen = 0;
        curPl = 1;
    }

    if (freeCells == 0) {
        renderWinMsg(3);
        return;
    }
}

function cellClicked(x, y, errorContainer) {
    const errorMsg = document.getElementById("error-msg");
    if (errorMsg) {
        errorMsg.remove();
    }
    if (grid[y][x] == 0) {
        const cell = document.getElementById(`cell-${y}-${x}`);
        if(turn == 1) {
            cell.innerText = 'X';
            grid[y][x] = turn;
            turn = 2;
            --freeCells;
            checkWinCond();
            renderYourTurn(document.getElementById("right-container"));
        }
        else {
            cell.innerText = 'O';
            grid[y][x] = turn;
            turn = 1;
            --freeCells;
            checkWinCond();
            renderYourTurn(document.getElementById("left-container"));
        }
    }
    else{
        const newErrorMsg = document.createElement("h1");
        newErrorMsg.classList.add("text");
        newErrorMsg.id = "error-msg";
        newErrorMsg.innerText = "Try empty cell";
        errorContainer.appendChild(newErrorMsg);
    }
}

function renderMainContainers(element){
    const leftContainer = document.createElement("div");
    leftContainer.id = "left-container";
    element.appendChild(leftContainer);

    const centerContainer = document.createElement("div");
    centerContainer.id = "center-container";
    element.appendChild(centerContainer);

    const rightContainer = document.createElement("div");
    rightContainer.id = "right-container";
    element.appendChild(rightContainer);
}

function renderBoard(element, errorContainer) {
    const boardContainer = document.createElement("div");
    boardContainer.id = "board-container";

    for(let y = 0; y < ROW_NUM; ++y) {
        grid.push([]);
        for(let x = 0; x < COL_NUM; ++x) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `cell-${y}-${x}`;
            cell.addEventListener("click", () => cellClicked(x, y, errorContainer));
            boardContainer.appendChild(cell);
            grid[y].push(0);
        }
    }

    element.appendChild(boardContainer);
}

function renderYourTurn(element) {
    const yourTurn = document.getElementById("your-turn");
    if (yourTurn) {
        yourTurn.remove();
    }
    const yourTurnH = document.createElement("h1");
    yourTurnH.innerText = "Your Turn";
    yourTurnH.classList.add("text");
    yourTurnH.id = "your-turn";
    element.appendChild(yourTurnH);
}

function updateName1() {
    name1 = document.getElementById("name-1").value;
}

function renderPlayer1Fields(element) {
    const name1 = document.createElement("input");
    name1.classList.add("text", "input-field");
    name1.id = "name-1";
    name1.addEventListener("keyup", updateName1);

    const labelname1 = document.createElement("label");
    labelname1.for = "labelname1";
    labelname1.classList.add("text");
    labelname1.innerText = "Enter Player 1's name: ";

    const gamesWon1 = document.createElement("p");
    gamesWon1.classList.add("text");
    gamesWon1.innerText = "Games Won:";
    
    const gamesWonNum1 = document.createElement("p");
    gamesWonNum1.classList.add("text");
    gamesWonNum1.id = "games-won-num1"; 
    gamesWonNum1.innerText = 0;

    element.appendChild(labelname1);
    element.appendChild(name1);
    element.appendChild(gamesWon1);
    element.appendChild(gamesWonNum1);
    
    renderYourTurn(element);
}

function updateName2() {
    name2 = document.getElementById("name-2").value;
}

function renderPlayer2Fields(element) {
    const name2 = document.createElement("input");
    name2.classList.add("text", "input-field");
    name2.id = "name-2";
    name2.addEventListener("keyup", updateName2);

    const labelname2 = document.createElement("label");
    labelname2.for = "labelname2";
    labelname2.classList.add("text");
    labelname2.innerText = "Enter Player 2's name: ";

    const gamesWon2 = document.createElement("p");
    gamesWon2.classList.add("text");
    gamesWon2.innerText = "Games Won:";
    
    const gamesWonNum2 = document.createElement("p");
    gamesWonNum2.classList.add("text");
    gamesWonNum2.id = "games-won-num2"; 
    gamesWonNum2.innerText = 0;

    element.appendChild(labelname2);
    element.appendChild(name2);
    element.appendChild(gamesWon2);
    element.appendChild(gamesWonNum2);
}

renderMainContainers(mainContainer);
const leftContainer = document.getElementById("left-container");
const centerContainer = document.getElementById("center-container");
const rightContainer = document.getElementById("right-container");
renderPlayer1Fields(leftContainer);
renderPlayer2Fields(rightContainer);
init();