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
            shuffledDeck.push(this.deck.splice(random_pick,1));
        }//end while
        this.deck = shuffledDeck;
    }//end shuffled deck
}//end object

var test_deck = new CreateDeck();

function Player(){
    this.hand = [];
    this.score;


}