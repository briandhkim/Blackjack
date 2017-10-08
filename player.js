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
    this.check_bust = function(){
        if(self.score>21){
            self.bust = true;
            if(game.playerTurn !== 0){
                messageHandler.logMessage(messageHandler.currentPlayerString() + "BUSTED!");
                console.log("player has busted");
                $('#modal').css('display','block').text('BUSTED!').css("color", "red")/*.append(recorderMeme)*/;

                $('#modal_overlay').css('display','block');
                setTimeout(make_modals_disappear,1000);
            }
            else{
                messageHandler.logMessage(messageHandler.currentPlayerString() + "BUSTED!")
                view.revealDealerCard();
            }
            self.stay();
        }
    };
    // this.calculator_score_start = function(){
    //     self.score = 0;
    //     for(var i = 0; i<self.hand.length; i++){
    //         if(self.hand[i].value>10){
    //             self.score += 10;
    //         }
    //         else{
    //             self.score += this.hand[i].value;
    //         }
    //     }
    //     for(var i = 0; i<self.hand.length; i++){//convert Ace to 11 or 1
    //         if(self.hand[i].value === 1 && self.score<=11){
    //             self.score += 10;
    //         }
    //     }
    //     if(self.score === 21){
    //         self.stay();
    //         if (self.ID !== 0) {
    //             $('#modal').css('display', 'block').text('21!').css("color", "green");
    //             $('#modal_overlay').css('display', 'block');
    //             setTimeout(make_modals_disappear, 1000);
    //         }
    //     }
        if(this.hand.length>2 && this.score !== 21){
            if(this.ID !== 0 || this.score > 21) {//keep dealer score hidden until the end
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Has " + this.score);
            }
        }
    }
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
                // game.compare_score();
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Has " + this.score +".")
            }
            else{
                messageHandler.logMessage(messageHandler.currentPlayerString() + "Stay with " + this.score +".")
            }
        }
        game.changePlayerTurn();
    };
    this.dealerAI = function(){
        console.log("Dealer AI");
        if(this.ID === 0){
            this.calculator_score();
            var highestScore = 0;
            for(var i = 1; i <game.players_array.length; i++){
                if(game.players_array[i].score > 16){
                    highestScore = game.players_array[i].score;
                }
            }
            while(this.score < highestScore && this.score !== 0){
                console.log(this.score);
                this.get_card();
            }
            view.revealDealerCard();
            if(this.score >= highestScore){
                console.log("DEALER WINS");
                console.log(highestScore)
                game.changePlayerTurn();
            }
            else{
                console.log("non busted people win!");
                console.log(highestScore)
            }
            game.compare_score();
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