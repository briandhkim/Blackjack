function Player(){
    var self = this;
    this.ID = null;     //used for tracking player; dealer is 0
    this.chips = 500;   //all players start with default 500 chips; at this time, dealer also starts with 500
    this.bet =function(){   
        self.chips-=50;
        //this.chips -=50; //self should not be necessary in this case
    };
    this.bust = false;  //set to true when player score goes over 21
    this.hand = [];     //array for holding current card objects in hand
    this.score = 0;     //tracks card values; e.g. 9 of hearts and 2 of spades = 11
    this.staying = false;   //used for checking player turn change(?); check this.stay function
    this.get_card = function(){
        if(game.deck.length === 0){
            var new_deck =  new CreateDeck();
            game.deck = new_deck.make_deck();
        }
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
    this.check_bust = function(){
        if(self.score>21){
            self.bust = true;
            if(game.playerTurn !== 0){
                messageHandler.logMessage(messageHandler.currentPlayerString() + "BUSTED!");
                console.log("player has busted");
                $('#modal').css({
                    'display' : 'block',
                    'color' : 'red'
                }).text('BUSTED!')/*.append(recorderMeme)*/;
                $('#modal_overlay').css('display','block');
                setTimeout(make_modals_disappear,1000);
            }
            else{
                messageHandler.logMessage(messageHandler.currentPlayerString() + "BUSTED!");
                view.revealDealerCard();
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
        if(self.score === 21 && game.playerTurn!==0 && game.gameStarted===false){
            self.stay();
            if (self.ID !== 0) {
                $('#modal').css({
                    'display' : 'block',
                    'color' : 'white',
                    'font-size' : '5em'
                }).text('21!');
                $('#modal_overlay').css('display', 'block');
                setTimeout(make_modals_disappear, 1000);
            }
        }
        if(self.hand.length>2 && self.score !== 21){
            if(self.ID !== 0 || self.score > 21) {//keep dealer score hidden until the end
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Has " + self.score + ".");
            }
        }
        self.check_bust();
        if(self.bust){
            self.score = 0;
            if(!game.players_array[0].bust){
                this.stay();
            }
        }
    };
    this.stay = function(){
        this.staying = true;
        if(this.score <= 21) {
            if(this.ID === 0){
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Turn over.");
                view.revealDealerCard();
                // game.compare_score();
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Has " + this.score +".")
            }
            else if(this.score !== 0){
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Stays with " + this.score +".")
            }
        }
        game.changePlayerTurn();
    };
    this.dealerAI = function(){
        if(this.ID === 0){
            game.players_array[0].calculator_score();
            while(this.score < 17 && this.score !== 0){
                this.get_card();
            }
            view.revealDealerCard();
            game.compare_score();
            view.updatePlayerChips();
        }
    }
    // var recorderVid = $('<iframe>',{
    //     class:'embed-responsive-item',
    //     src : 'https://www.youtube.com/embed/X2WH8mHJnhM?start=17?autoplay=1'
    // });
    // var recorderMeme = $('<div>',{
    //     class:"embed-responsive embed-responsive-4by3",
    //     id: 'recorderMeme'
    // }).append(recorderVid);
}
