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

function Player(){
    this.ID = null;
    this.hand = [];
    this.score = 0;
    this.stay = false;
    this.get_card = function(deck){
        var cardDraw = deck.pop();
        this.hand.push(cardDraw);
        console.log('hand',this.hand);
        this.calculator_score();
        console.log('score',this.score);
        console.log("CARD DRAW, " , cardDraw);
        console.log("PLAYER ID, " , this.ID);
        view.createCardDom(cardDraw, this.ID)
    };
    this.calculator_score = function(){
        this.score = 0;
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
    };
    this.stay = function(){
        this.staying  = true;
    }
}
function BlackJack(){
    var self = this;
    this.deck;
    this.deal_cards = function(){
        for(var i = 0; i<this.players_array.length;i++){
            this.players_array[i].get_card(this.deck);
            this.players_array[i].get_card(this.deck);
        }
    };
    this.playerTurn = 0;
    this.dealer = new Player();
    this.players_array = [];
    this.addplayers = function(number){
        for(var i = 0; i<number;i++){
            var player =  new Player();
            player.ID = i;
            this.players_array.push(player);
        }
    };
    this.nextPlayerTurn = function(){
        if(this.playerTurn !== this.players_array.length-1){
            this.playerTurn += 1;
        }
        else{
            this.playerTurn = 0;
        }
    };

    this.draw = function(){
        this.players_array[this.playerTurn].get_card(this.deck);
    };

   this.check_bust = function(player){
       if(player.score>21){
           console.log("player loses");
       }

   };
   this.compare_score =  function(){
       if(this.player_stay){

       }

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
    }
}
function handleDrawClick(){

}
function handleStayClick(){
    var position = game.playerTurn;
    game.players_array[position].get_card();
}
function addClickHandlers(){
    $('#draw_card').click(handleDrawClick);
    $('#stay').click(handleStayClick);
    $('#start_butt').click(handleStartClick);
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
function View(){
    this.createCardDom = function(card, playerSpaceID){
        console.log("CREATE CARD DOM");
        var cardImage = "images/" + card.value + "_" + card.suit + ".png";
        console.log("cardImage = " + cardImage);
        var divID = "#player_" + (playerSpaceID);
        console.log(divID);
        var cardDiv = $("<div>")
            .css("width", "100px")
            .css("height", "140px")
            .css("background-image", 'url(' + cardImage + ')')
            .css("background-size", "100% 100%")
            .css("background-repeat", "no-repeat")
            .css("display", "inline-block")
            .css("margin", "10px");
        $(divID).append(cardDiv);
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
        this.messages.unshift(message)
        if(this.messages.length > 5){
            this.messages.pop();
        }
        for(var i = 0; i < this.messages.length; i++){
            var messageLI = "#message_" + i;
            console.log(messageLI)
            $(messageLI).text(this.messages[i]).css("list-style-type", "square")
        }
    };
    this.convertCardToStringName = function(card){

    }
}


// function GameController(){
//     game.startGame();
// }