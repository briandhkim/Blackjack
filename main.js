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
    $('#modal_overlay').css('display','none');
}
function Player(){
    this.ID = null;
    this.chips = 500;
    this.bet =function(){
        this.bet = $('#get_bet').val()
    };
    this.push_bet = function(bet){
        this.chips-bet;
    };
    this.bust = false;
    this.hand = [];
    this.score = 0;
    this.staying = false;
    this.get_card = function(){
        var cardDraw = game.deck.pop();
        this.hand.push(cardDraw);
        if(this.hand.length > 2 && this.score !== 21) {
            messageHandler.logMessage(messageHandler.currentPlayerString() + "Hit me!");
        }
        this.calculator_score();
        view.createCardDom(cardDraw, this.ID)
        console.log('hand',this.hand);
        console.log('score',this.score)
    };
    this.check_bust = function(){
        if(this.score>21){
            this.bust = true;
            if(game.playerTurn !== 0){
                messageHandler.logMessage(messageHandler.currentPlayerString() + "BUSTED!");
                console.log("player has busted");
                $('#modal').css('display','block').text('BUSTED!');
                $('#modal_overlay').css('display','block');
                setTimeout(make_modals_disappear,1000);
            }
            else{
                messageHandler.logMessage(messageHandler.currentPlayerString() + "BUSTED!")
                view.revealDealerCard();
           }
            this.stay();
        }
    };
    this.calculator_score = function(){
        this.score = 0;
        if(this.bust){
            this.score = 0;
        }
        else{
            for(var i = 0; i<this.hand.length; i++){
                if(this.hand[i].value>10){
                    this.score += 10;
                }
                else{
                    this.score += this.hand[i].value;
                }
            }
            for(var i = 0; i<this.hand.length; i++){//convert Ace to 11 or 1
                if(this.hand[i].value === 1 && this.score<=11){
                    this.score += 10;
                }
            }
            if(this.score === 21){
                this.stay();
            }
            if(this.hand.length>2 && this.score !== 21){
                if(this.ID !== 0 || this.score > 21) {//keep dealer score hidden until the end
                    messageHandler.logMessage(messageHandler.currentPlayerString() + "Has " + this.score);
                }
            }

            this.check_bust();
        }

    };
    this.stay = function(){
        this.staying = true;
        if(this.score <= 21) {
            if(this.ID === 0){
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Turn over.")
                view.revealDealerCard();
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
        player.chips += (player.bet)*2;
    };
    this.deck = null;
    this.pool = 0;
    this.deck = null;
    this.deal_cards = function(){
        for(var i = 0; i<this.players_array.length;i++){
            this.players_array[i].get_card(this.deck);
            this.players_array[i].get_card(this.deck);
        }
    };
    this.playerTurn = 1;
    this.dealer = new Player();
    this.players_array = [];
    this.addplayers = function(number){
        for(var i = 0; i<number;i++){
            var player =  new Player();
            player.ID = i;
            this.players_array.push(player);
        }
    };
    this.changePlayerTurn = function(){
        if(this.playerTurn !== this.players_array.length-1){
            this.playerTurn+=1;
        }
        else{
            this.playerTurn = 0;
        }
        messageHandler.logMessage(messageHandler.currentPlayerString() + "It's your turn.")
    };
   this.compare_score =  function(){

   };
    this.start_game = function(){
        self.players_array = [];
        self.dealer.hand = 0;
        self.dealer.score = 0;
        var number_of_players = $('input[name=playerNum]:checked').val();
        self.addplayers(1 + parseInt(number_of_players));
        var new_deck =  new CreateDeck();
        self.deck = new_deck.make_deck();
        self.deal_cards();
        console.log('players',this.players_array);
        console.log(this.deck);
        messageHandler.logMessage("Game started.  Good luck!");
        $('#start_butt').addClass('disabled');
        messageHandler.logMessage(messageHandler.currentPlayerString() + "It's your turn.")
    }
}
function handleDrawClick(){
    var position = game.playerTurn;
    game.players_array[position].get_card();
    audioHandler.cardFlip();
}
function handleReset(){
   reset();
}
function handleStayClick(){
    var position = game.playerTurn;
    game.players_array[position].stay();
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
    addClickHandlers();
}
function handleStartClick(){
    game.start_game();
}
function reset(){
    $('.hiddenCard').remove();
    $('.displayedCard').remove();
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
