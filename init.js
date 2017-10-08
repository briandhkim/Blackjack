$(document).ready(init);
var game =null;
var view = null;
var messageHandler = null;
var audioHandler = null;
function init(){
    game = new BlackJack();
    view = new View();
    audioHandler = new AudioHandler();
    messageHandler = new MessageHandler();
    // gameController = new GameController();
    $('#draw_card').addClass('disabled');
    $('#stay').addClass('disabled');
    addClickHandlers();
}