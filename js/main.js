/*to do:
light animation to clean things up.
*/


$(document).ready(function() {
    $("#play").on("click", function() {
        var comp = {};
        var playerElement = $('input[name=choice]:checked').attr("id");
        comp.element = $('input[name=choice]:not(:checked)').attr("id");
        var difficulty = $("input[name=diff]:checked").attr("id");
        $("#menu").hide();
        $("#board-view").show();
        comp["diff"] = difficulty;
        game = startGame(playerElement, comp);
    });

});

$("#play").text("test");

function startGame(playerElement, comp) {
    $("#reset-container").hide();
    var updateTime = 500;
    var board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var playerTurn = true;
    var game;

    function gameLoop() {

        if (isWin(playerElement, board)) {
            clearInterval(game);
            showWin(playerElement, board);
            $("#dispText").text("You Win!");
            $("#dispText").css('visibility', 'visible');
            setTimeout(resetGame, 2000);
            return;
        }

        if (isTie(board)) {
            clearInterval(game);
            $("#dispText").text("You tied, maybe next time");
            $("#dispText").css('visibility', 'visible');
            setTimeout(resetGame, 2000);
            return;
        }

        if (isWin(comp.element, board)) {
            clearInterval(game);
            showWin(comp.element, board);
            $("#dispText").text("Nice try, you lost!");
            $("#dispText").css('visibility', 'visible');
            setTimeout(resetGame, 2000);
            return;
        }
        if (isOver(board)){
          return;
        }
        if (!playerTurn) {
            compMove(comp, board);
            updateFromModel(board);
            playerTurn = true;
            return;
        }
        $("#board").click(function(event) {
            var id = $(event.target).attr("name");

            if (id !== undefined && playerTurn && board[id] == 0) {
                board[id] = playerElement;
                updateFromModel(board);
                playerTurn = false;
                return;
            }
        });
    }

    game = setInterval(gameLoop, updateTime);

}

function isTie(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i] == 0) {
            return false;
        }
    }
    return true;
}

function isWin(element, board) {
    var combinations = [
        [0, 1, 2],
        [0, 4, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8]
    ];
    for (var i = 0; i < combinations.length; i++) {
        var combo = combinations[i];
        var a = combo[0];
        var b = combo[1];
        var c = combo[2];
        if (board[a] == element && board[b] == element && board[c] == element) {
            return true;
        }
    }
    return false;
}

function blink(id) {
    $('#' + id)
        .fadeOut(300)
        .fadeIn(300)
        .fadeOut(300)
        .fadeIn(300)
        .fadeOut(300)
        .fadeIn(300)
        .fadeOut(300)
        .fadeIn(300)
        .fadeOut(300)
        .fadeIn(300);
}

function colorElements(elements) {
    for (var i = 0; i < elements.length; i++) {
        var id = elements[i];
        var element = document.getElementById(id);
        element.style.color = "#c23434";
        blink(id);
    }
}

function compMove(comp, board) {
    if (comp.diff == "easy") {
        randMove(comp.element, board);
    } else if (comp.diff == "med") {
        smartMove(comp.element, board);
    } else {
        minimax(board, comp.element, comp.element);
    }
}

function randMove(element, board) {
    var id = Math.floor(Math.random() * 8);
    while (board[id] != 0) {
        id = Math.floor(Math.random() * 8);
    }
    board[id] = element;
}

function smartMove(element, board) {
    var moves = getMoves(board);
    var opponent = getOpponent(element);
    var moveScores = [];

    for (var i = 0; i < moves.length; i++) {
        var copyBoard = board.slice();
        var move = moves[i];
        moveScores.push(smartScore(copyBoard, move, element, opponent));
    }

    var max_score_index = moveScores.indexOf(Math.max.apply(null, moveScores));
    board[moves[max_score_index]] = element;
}

function smartScore(board, move, element, opponent) {
    board[move] = element;
    if (isWin(element, board)) {
        return 4;
    }
    board[move] = opponent;
    if (isWin(opponent, board)) {
        return 3;
    }
    if (move == 4) {
        return 2;
    } else if (move == 0 || move == 2 || move == 6 || move == 8) {
        return 1;
    } else {
        return 0;
    }
}

function minimax(board, player, turn) {
    var scores = [];
    var moves = [];
    var boardCopy = [];
    if (isOver(board)) {
        return score(board, player);
    }

    var currMoves = getMoves(board);
    for (var i = 0; i < currMoves.length; i++) {
        boardCopy = board.slice();
        boardCopy[currMoves[i]] = turn;
        scores.push(minimax(boardCopy, player, getOpponent(turn)));
        moves.push(currMoves[i]);
    }
    if (player == turn) {
        var max_score_index = scores.indexOf(Math.max.apply(null, scores));
        var move = moves[max_score_index];
        board[move] = player;
        return scores[max_score_index];
    } else {
        var min_score_index = scores.indexOf(Math.min.apply(null, scores));
        var move = moves[min_score_index];
        board[move] = player;
        return scores[min_score_index];
    }

}

function getMoves(board) {
    var moves = [];
    for (var i = 0; i < board.length; i++) {
        if (board[i] == 0) {
            moves.push(i);
        }
    }
    return moves;
}

function isOver(board) {
    if (isWin('X', board) || isWin('O', board) || isTie(board)) {
        return true;
    }
    return false;
}

function getOpponent(player) {
    if (player == "X") {
        return 'O';
    }
    return 'X'
}

function score(board, player) {
    if (isWin(player, board)) {
        return 10;
    } else if (isWin(getOpponent(player), board)) {
        return -10;
    } else {
        return 0;
    }
}

function updateFromModel(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i] == 'X') {
            $("#" + i).text('X')
        } else if (board[i] == 'O') {
            $("#" + i).text('O')
        }
    }
}

function resetGame() {
    $("#replayModal").modal('show');
    $("#Yes").on("click", function() {
        $("#dispText").css("visibility", 'hidden');
        $("#menu").show();
        $("#board-view").hide();
        for (var i = 0; i < 9; i++) {
            var $element = $("#" + i);
            $element.text("");
            $element.css('color', '#0fd570');
        }
    });
    $("#reset-container").show();
    $("#reset").on("click", function() {
        $("#replayModal").modal('show');
    });
}

function showWin(element, board) {
    var combinations = [
        [0, 1, 2],
        [0, 4, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8]
    ];
    for (var i = 0; i < combinations.length; i++) {
        var combo = combinations[i];
        var a = combo[0];
        var b = combo[1];
        var c = combo[2];
        if (board[a] == element && board[b] == element && board[c] == element) {
            colorElements([a, b, c]);
            return true;
        }
    }
    return false;
}
