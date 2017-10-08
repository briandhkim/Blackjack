function make_modals_disappear(){
    $('#modal').css('display','none');
    $('#modal_overlay').css('display','none');
    $('#modal').text('');
}
function BlackJack(){
    var self = this;
    this.payout = function(player){
        player.chips += 100;
    };
    this.gameStarted = false;
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
            self.playerTurn+=1;
        }
        else{
            self.playerTurn = 0;
        }
        var newPlayerDiv = "#player_" + (this.playerTurn);
        $(newPlayerDiv).css("border", "5px solid gold").removeClass("overlay");
        messageHandler.logMessage(messageHandler.currentPlayerString() + "It's your turn.")
        $('#player_number').text(this.playerTurn);
        if(self.playerTurn ===0){
            $('#player_number').text('Dealer'); 
            $('.cpuText').addClass('dealerTurnText');
            this.players_array[0].dealerAI();
        }else if(self.playerTurn >0){
            $('#player_number').text(self.playerTurn);
            $('.cpuText').removeClass('dealerTurnText');
        }
    };
    this.end_round = function(){
        clearCard();
        self.deal_cards();
        make_modals_disappear();
        reEnableButtons();
        self.all_players_bet();
        $('#reset_butt').addClass('disabled');
    }
   this.compare_score =  function(){
       var dealer_win = true;
       $('#modal').text('');
        for(var i = 1; i<self.players_array.length;i++) {
            if (self.players_array[i].score > self.players_array[0].score) {     // && !self.players_array[i].bust
                self.payout(self.players_array[i]);
                console.log(self.players_array[i], " has won!");
                var player_that_won = $('<p>').text('Player ' + i + ' has won!')
                $('#modal').css('display', 'block').append(player_that_won);
                dealer_win = false;
            }
            else {
                if (self.players_array[i].chips <= 0) {
                    self.players_array.splice(i, 1);
                    i--;
                }
            }
        }
        if(dealer_win){
            $('#modal').css('display','block').text('Dealer Wins!');
        }
        for(var i =0; i<self.players_array.length; i++){
            self.players_array[i].hand = [];
            self.players_array[i].bust = false;
            }
       game.changePlayerTurn();
        disableAllbuttons();
       $('#reset_butt').removeClass('disabled');
   };
    this.all_players_bet = function(){
        for(var i = 1; i<self.players_array.length;i++){
            self.players_array[i].bet();
        }
    };
    this.calculator_score_start = function(){
        for(var i = 1; i<self.players_array.length;i++){
            self.players_array[i].calculator_score();
        }
    }
    this.start_game = function(){
        self.gameStarted = true;
        $('#draw_card').removeClass('disabled');
        $('#stay').removeClass('disabled');
        $('#reset_butt').addClass('disabled');
        self.players_array = [];
        self.dealer.hand = 0;
        self.dealer.score = 0;
        self.playerTurn = 1;
        $('#player_number').text(self.playerTurn);
        var number_of_players = $('input[name=playerNum]:checked').val();
        self.addplayers(1 + parseInt(number_of_players));
        var new_deck =  new CreateDeck();
        self.deck = new_deck.make_deck();
        self.end_round();
        console.log('players',this.players_array);
        console.log(this.deck);
        messageHandler.logMessage("Game started.  Good luck!");
        messageHandler.logMessage(messageHandler.currentPlayerString() + "It's your turn.");
        $("#player_" + (this.playerTurn)).css("border", "5px solid gold").removeClass("overlay");
        self.calculator_score_start();
        self.gameStarted = false;
    }
}
function clearCard(){
    $('.hiddenCard').remove();
    $('.displayedCard').remove();
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
