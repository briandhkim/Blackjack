function handleStartClick(){
    $("#player_0").css("border", "1px dashed blue").addClass("overlay");
    $("#player_1, #player_2, #player_3, #player_4").css("border", "1px dashed blue").addClass("overlay");
    // $("#player_2").css("border", "1px dashed blue").addClass("overlay");
    // $("#player_3").css("border", "1px dashed blue").addClass("overlay");
    game.start_game();
}
function reset(){
    if($('#reset_butt').hasClass('disabled')){
        return;
    }
    clearCard();
    $('.cpuText').removeClass('dealerTurnText');
    $("#player_0").css("border", "1px dashed blue").addClass("overlay");
    $("#player_1, #player_2, #player_3, #player_4").css("border", "1px dashed blue").addClass("overlay");
    // $("#player_2").css("border", "1px dashed blue").addClass("overlay");
    // $("#player_3").css("border", "1px dashed blue").addClass("overlay");
    game.end_round();
}
function handleDrawClick(){
    if($('#draw_card').hasClass('disabled')){
        return;
    }
    var position = game.playerTurn;
    game.players_array[position].get_card();
    audioHandler.cardFlip();
}
function handleReset(){
    reset();
}
function handleStayClick(){
    if($('#stay').hasClass('disabled')){
        return;
    }
    var position = game.playerTurn;
    game.players_array[position].stay();
}
function addClickHandlers(){
    $('#draw_card').click(handleDrawClick);
    $('#stay').click(handleStayClick);
    $('#start_butt').click(handleStartClick);
    $('#reset_butt').click(handleReset);
}
function disableAllbuttons(){
    $('#draw_card').addClass('disabled');
    $('#stay').addClass('disabled');
}
function reEnableButtons(){
    $('#draw_card').removeClass('disabled');
    $('#stay').removeClass('disabled');
    $('#start_butt').removeClass('disabled');
}