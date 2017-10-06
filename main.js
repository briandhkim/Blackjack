$(document).ready(init);
var new_deck = null;
var anthony = null;
var game =null;
function CreateDeck(){
    this.deck=[];
    this.create_cards = function(){
        var suits = ['Spade', 'Hearts', 'Diamond','Club'];
        for(var j = 0; j<suits.length; j++){
            for(var i = 1; i<14; i++){
                var card = {}
                card.suit = suits[j];
                card.value = i;
                this.deck.push(card);
            }//end for
        }//end outer for
    }//end create deck
    this.shuffleDeck = function(){
        var shuffledDeck = []
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
    this.staying = false;
    this.get_card = function(card){
        this.hand.push(card);
        console.log(this.hand);
        this.calculator_score();
    }
    this.calculator_score = function(){
        this.score = 0;
        for(var i = 0; i<this.hand.length; i++){
            this.score += this.hand[i].value;
        }
        console.log(this.score)
    }
    this.stay = function(){
        this.staying  = true;
    }
}

function BlackJack(){
    // this.playerTurn = 0;
    // this.dealer = dealer;
    this.start_game = function(deck){
        deck.create_cards();
        deck.shuffleDeck();
        console.log(deck.deck);
    }
   this.draw_card = function(player,deck){
        var card  = deck.deck.pop();
        player.get_card(card);
   }
}
function addClickHandlers(){
    $('#draw_card').click(game.draw_card(anthony,new_deck.deck))
}
function init(){
    game = new BlackJack();
    new_deck =  new CreateDeck();
    game.start_game(new_deck);
    addClickHandlers();
    anthony = new Player();
}
