$(document).ready(init);
var new_deck = null;
var anthony = null;
var game =null;
var view = null;

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
}//end object

function Player(){
    this.hand = [];
    this.score = 0;
    this.stay = false;
    this.get_card = function(card){
        this.hand.push(card);
        console.log(this.hand);
        this.calculator_score();
    };
    this.calculator_score = function(){
        this.score = 0;
        for(var i = 0; i<this.hand.length; i++){
            this.score += this.hand[i].value;
        }
        console.log(this.score)
    };
    this.stay = function(){
        this.staying  = true;
    }
}

function BlackJack(dealer){
    this.playerTurn = 0;
    this.dealer = dealer;
    this.start_game = function(deck){
        deck.create_cards();
        deck.shuffleDeck();
        console.log(deck.deck);
    };
   this.draw_card = function(player,game){
        var card  = game.deck.pop();
        player.get_card(card);
        this.check_bust(player);
        this.playerTurn ++;

   };
   this.check_bust = function(player){
       if(player.score>21){
           console.log("player loses");
           $('#draw_card').hide();
       }
   };
   this.compare_score =  function(){
       if(this.player_stay){

       }
    }
}
function handleDrawClick(){
    game.draw_card(anthony,new_deck)
}
function handleStayClick(){
    anthony.stay = true;
}
function addClickHandlers(){
    $('#draw_card').click(handleDrawClick);
    $('#stay').click(handleStayClick);
}
function init(){
    game = new BlackJack();
    new_deck =  new CreateDeck();
    view = new View();
    game.start_game(new_deck);
    anthony = new Player();
    addClickHandlers();

    //FOR TESTING
    testCard = {};
    testCard.value = 1;
    testCard.suit = "Spades"
    $(testCard).css("background-image", "images/")
}

function View(){
    this.createCardDom = function(card, playerSpaceID){
        var cardImage = "images/" + card.value + "_" + card.suit + ".png";
        console.log('url(' + cardImage + ')');
        var cardDiv = $("<div>")
            .css("width", "50px")
            .css("height", "70px")
            .css("background-image", 'url(' + cardImage + ')')
            .css("background-size", "100% 100%")
            .css("background-repeat", "no-repeat")
            .css("display", "inline-block");
        $(playerSpaceID).append(cardDiv);
    }
}

function AudioHandler(){
    this.cardFlip = function(){
        var audio = new Audio("audio/flip.wav");
        audio.play();
    };
}