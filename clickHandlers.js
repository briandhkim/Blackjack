function handleStartClick(){
    game.start_game();
}
function reset(){
    if($('#reset_butt').hasClass('disabled')){
        return;
    }
    clearCard();
    $('.cpuText').removeClass('dealerTurnText');
    game.start_game();
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
    $('#reset_butt').addClass('disabled');
}
function reEnableButtons(){
    $('#draw_card').removeClass('disabled');
    $('#stay').removeClass('disabled');
    $('#reset_butt').removeClass('disabled');
}