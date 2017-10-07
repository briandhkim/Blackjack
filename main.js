$(document).ready(init);
var game =null;

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
    this.hand = [];
    this.score = 0;
    this.stay = false;
    this.get_card = function(deck){
        this.hand.push(deck.pop());
        console.log('hand',this.hand);
        this.calculator_score();
        console.log('score',this.score)
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


function BlackJack(){
    this.players_array = []
        //['dealer':Dealer];
    this.addplayers = function(number){
        for(var i = 0; i<number;i++){
            var player_to_add =  new Player();
            var key =  "player" +i;
            this.players_array.push({key:player_to_add});
        }
    }
    this.playerTurn = 0;
    this.dealer = new Player();
   this.check_bust = function(player){
       if(player.score>21){
           console.log("player loses");
       }
   }
   // this.compare_score =  function(player){
   //     if(player.stay&&this.dealer.stay){
   //          if(player.score>this.dealer.score){
   //              console.log('player wins');
   //          }
   //          else{
   //              console.log('player loses');
   //          }
   //     }
   //  }//end compare sore
    this.start_game = function(){
        this.dealer.hand = 0;
        this.dealer.score = 0;
        this.addplayers(4);
        console.log('players',this.players_array);
        var new_deck =  new CreateDeck();
        var deck = new_deck.make_deck();
        console.log(deck);
        addClickHandlers();
    }
}
function handleDrawClick(){

}
function handleStayClick(){
    player.get_card();
}
function addClickHandlers(){
    $('#draw_card').click(handleDrawClick);
    $('#stay').click(handleStayClick);
}
function init(){
    game = new BlackJack();
    game.start_game();
}
