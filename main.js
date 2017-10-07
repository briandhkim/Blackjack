$(document).ready(init);
var game =null;
var view = null;
var messageHandler = null;
var audioHandler = null;
// var gameController = null;

function CreateDeck(){
    this.deck=[];
    this.create_cards = function(){
        var suits = ['Spades', 'Hearts', 'Diamonds','Clubs'];
        for(var j = 0; j<suits.length; j++){
            for(var i = 1; i<14; i++){
                var card = {};
                card.suit = suits[j];
                card.value = i;
                this.deck.push(card);
            }//end for
        }//end outer for
    }//end create deck
    this.shuffleDeck = function(){
        var shuffledDeck = [];
        while(this.deck.length>0){
            var random_pick = Math.floor(Math.random()*this.deck.length);
            shuffledDeck.push(this.deck.splice(random_pick,1)[0]);
        }//end while
        this.deck = shuffledDeck;
    }//end shuffled deck
    this.make_deck = function(){
        this.create_cards();
        this.shuffleDeck();
        return this.deck;
    }
}//end object
function make_modals_disappear(){
    $('#modal').css('display','none');
    // $('#recorderMeme').remove();
    $('#modal_overlay').css('display','none');
    $('#modal').text('');
}

function Player(){
    var self = this;
    this.ID = null;
    this.chips = 500;
    this.bet =function(){
        self.chips-=50;
    };
    this.bust = false;
    this.hand = [];
    this.score = 0;
    this.staying = false;
    this.get_card = function(){
        var cardDraw = game.deck.pop();
        this.hand.push(cardDraw);
        if(self.hand.length > 2 && self.score !== 21) {
            messageHandler.logMessage(messageHandler.currentPlayerString() + "Hit me!");
        }
        if(this.hand.length > 2) {
            self.calculator_score();
            console.log('score',self.score)
        }
        view.createCardDom(cardDraw, self.ID);
        console.log('hand',self.hand);
    };
    // var recorderVid = $('<iframe>',{
    //     class:'embed-responsive-item',
    //     src : 'https://www.youtube.com/embed/X2WH8mHJnhM?start=17?autoplay=1'
    // });
    // var recorderMeme = $('<div>',{
    //     class:"embed-responsive embed-responsive-4by3",
    //     id: 'recorderMeme'
    // }).append(recorderVid);
    this.check_bust = function(){
        if(self.score>21){
            self.bust = true;
            if(game.playerTurn !== 0){
                messageHandler.logMessage(messageHandler.currentPlayerString() + "BUSTED!");
                console.log("player has busted");
                $('#modal').css('display','block').text('BUSTED!').css("color", "red")/*.append(recorderMeme)*/;

                $('#modal_overlay').css('display','block');
                setTimeout(make_modals_disappear,1000);
                self.stay();
                return;
            }
            else{
                messageHandler.logMessage(messageHandler.currentPlayerString() + "BUSTED!")
                view.revealDealerCard();
                self.stay();
                return;
           }
        }
    };
    this.calculator_score = function(){
        self.score = 0;
        for(var i = 0; i<self.hand.length; i++){
            if(self.hand[i].value>10){
                self.score += 10;
            }
            else{
                self.score += this.hand[i].value;
            }
        }
        for(var i = 0; i<self.hand.length; i++){//convert Ace to 11 or 1
            if(self.hand[i].value === 1 && self.score<=11){
                self.score += 10;
            }
        }
        if(self.score === 21){
            self.stay();
            if (self.ID !== 0) {
                $('#modal').css('display', 'block').text('21!').css("color", "green");
                $('#modal_overlay').css('display', 'block');
                setTimeout(make_modals_disappear, 1000);
            }
        }
        if(this.hand.length>2 && this.score !== 21){
            if(this.ID !== 0 || this.score > 21) {//keep dealer score hidden until the end
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Has " + this.score);
            }
        }
        this.check_bust();
        if(self.bust){
            self.score = 0;
        }
    };
    this.stay = function(){
        this.staying = true;
        if(this.score <= 21) {
            if(this.ID === 0){
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Turn over.")
                view.revealDealerCard();
                game.compare_score();
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Has " + this.score +".")
            }
            else{
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Stay with " + this.score +".")
            }
        }
        game.changePlayerTurn();
    }
}
function BlackJack(){
    var self = this;
    this.payout = function(player){
        player.chips += 100;
    };
    this.deck = null;
    this.deck = null;
    this.deal_cards = function(){
        for(var i = 0; i<this.players_array.length;i++){
            self.players_array[i].get_card(this.deck);
            self.players_array[i].get_card(this.deck);
        }
    };
    this.playerTurn = 1;
    this.dealer = new Player();
    this.players_array = [];
    this.addplayers = function(number){
        for(var i = 0; i<number;i++){
            var player =  new Player();
            player.ID = i;
            self.players_array.push(player);
        }
    };
    this.changePlayerTurn = function(){
        var oldPlayerDiv = "#player_" + (this.playerTurn);
        $(oldPlayerDiv).css("border", "1px dashed blue").addClass("overlay");
        if(this.playerTurn !== this.players_array.length-1){
            this.playerTurn+=1;
        }
        else{
            self.playerTurn = 0;
        }
        var newPlayerDiv = "#player_" + (this.playerTurn);
        $(newPlayerDiv).css("border", "5px solid gold").removeClass("overlay");
        messageHandler.logMessage(messageHandler.currentPlayerString() + "It's your turn.")
        $('#player_number').text(this.playerTurn);
        if(self.playerTurn ==0){
            $('#player_number').text('Dealer'); 
            $('.cpuText').addClass('dealerTurnText');
        }else if(self.playerTurn >0){
            $('#player_number').text(self.playerTurn);
            $('.cpuText').removeClass('dealerTurnText');
        }
    };
   this.compare_score =  function(){
       var dealer_win = true;
       $('#modal').text('');
        for(var i = 1; i<self.players_array.length;i++){
            if(self.players_array[i].score>self.players_array[0].score){
                self.payout(self.players_array[i]);
                console.log(self.players_array[i]," has won!");
                var player_that_won = $('<p>').text('Player '+i +' has won!')
                $('#modal').css('display','block').append(player_that_won);
                dealer_win = false;
            }
        }
        if(dealer_win){
            $('#modal').css('display','block').text('Dealer Wins!');
        }
        for(var i =0; i<self.players_array.length; i++){
            self.players_array[i].hand = [];
            self.players_array[i].bust = false;
        }
       clearCard();
       self.deal_cards();
       setTimeout(make_modals_disappear,3000);

   };
   // this.reset_hand(){
   //
   //  }
    this.start_game = function(){
        $('#draw_card').removeClass('disabled');
        $('#stay').removeClass('disabled');
        self.players_array = [];
        self.dealer.hand = 0;
        self.dealer.score = 0;
        self.playerTurn = 1;
        $('#player_number').text(self.playerTurn);
        var number_of_players = $('input[name=playerNum]:checked').val();
        self.addplayers(1 + parseInt(number_of_players));
        var new_deck =  new CreateDeck();
        self.deck = new_deck.make_deck();
        self.deal_cards();
        console.log('players',this.players_array);
        console.log(this.deck);
        messageHandler.logMessage("Game started.  Good luck!");
        $('#start_butt').addClass('disabled');
        messageHandler.logMessage(messageHandler.currentPlayerString() + "It's your turn.");
        $("#player_" + (this.playerTurn)).css("border", "5px solid gold").removeClass("overlay");
        this.players_array[this.playerTurn].calculator_score();
    }
}
function clearCard(){
    $('.hiddenCard').remove();
    $('.displayedCard').remove();
}
function handleDrawClick(){
    if($('#draw_card').hasClass('disabled')){
        return;
    }
    else{
        var position = game.playerTurn;
        game.players_array[position].get_card();
        audioHandler.cardFlip();
    }
}
function handleReset(){
   reset();
}
function handleStayClick(){
    if($('#stay').hasClass('disabled')){
        return;
    }
    else{
        var position = game.playerTurn;
        game.players_array[position].stay();
    }
}
function addClickHandlers(){
    $('#draw_card').click(handleDrawClick);
    $('#stay').click(handleStayClick);
    $('#start_butt').click(handleStartClick);
    $('#reset_butt').click(handleReset);
}
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
function handleStartClick(){
    if($('#start_butt').hasClass('disabled')){
        return;
    }
    else{
        game.start_game();
    }
}
function reset(){
    clearCard();
    $('.cpuText').removeClass('dealerTurnText');
    game.start_game();
}
function View(){
    this.createCardDom = function(card, playerSpaceID){
        var cardImage = null;
        var className = "displayedCard";
        if(playerSpaceID === 0 && game.players_array[0].hand.length === 1){
            cardImage = "images/cardBack.png";
            className = "hiddenCard"
        }
        else {
            cardImage = "images/" + card.value + "_" + card.suit + ".png";
        }
        var divID = "#player_" + (playerSpaceID);
        var cardDiv = $("<div>")
            .css("width", "75px")
            .css("height", "105px")
            .css("background-image", 'url(' + cardImage + ')')
            .css("background-size", "100% 100%")
            .css("background-repeat", "no-repeat")
            .css("display", "inline-block")
            .css("margin", "10px")
            .addClass(className);
        $(divID).append(cardDiv);
    };
    this.revealDealerCard = function(){
        var dealersFirstCard = game.players_array[0].hand[0];
        var cardImage = "images/" + dealersFirstCard.value + "_" + dealersFirstCard.suit + ".png";
        $(".hiddenCard").css("background-image", 'url(' + cardImage + ')')
    }
}
function AudioHandler(){
    this.cardFlip = function(){
        var audio = new Audio("audio/flip.wav");
        audio.play();
    };
}
function MessageHandler(){
    this.messages = [];
    this.logMessage = function(message){
        this.messages.unshift(message);
        if(this.messages.length > 5){
            this.messages.pop();
        }
        for(var i = 0; i < this.messages.length; i++){
            var messageLI = "#message_" + i;
            $(messageLI).text(this.messages[i]).css("list-style-type", "square")
        }
    };
    this.currentPlayerString = function(){
        var result = null;
        if(parseInt(game.playerTurn) === 0){
            result = "Dealer : "
        }
        else{
            var playerTurn = parseInt(game.playerTurn);
            result = "Player "+ playerTurn + ": "
        }
        return result
    }
}
