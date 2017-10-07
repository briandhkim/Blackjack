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
    }
    this.push_bet = function(bet){
        this.chips-bet;
    }
    this.bust = false;
    this.hand = [];
    this.score = 0;
    this.staying = false;
    this.get_card = function(){
        var cardDraw = game.deck.pop();
        this.hand.push(cardDraw);
        this.calculator_score();
        view.createCardDom(cardDraw, this.ID)
        console.log('hand',this.hand);
        console.log('score',this.score)
    };
    this.check_bust = function(){
        if(this.score>21){
            this.bust = true;
            this.stay();
            $('#modal').css('display','block').text('busted');
            $('#modal_overlay').css('display','block');
            setTimeout(make_modals_disappear,2000);
            console.log("player has busted");
        }
    };
    this.calculator_score = function(){
        this.score = 0;
        if(this.bust){
            score = 0;
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
            this.check_bust();
        }
    };
    this.stay = function(){
        this.staying = true;
        game.playerTurn++;
    }
}
function BlackJack(){
    var self = this;
    this.payout = function(player){
        player.chips += (player.bet)*2;
    }
    this.deck;
    this.pool = 0;
    this.deck = null;
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
    }
}
function handleDrawClick(){
    var position = game.playerTurn;
    game.players_array[position].get_card();
}
function handleStayClick(){
    console.log('handleStayClick works')
    var position = game.playerTurn;
    game.players_array[position].stay;
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