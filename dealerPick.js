var dealer = '';

$(document).ready(function(){
	var randNum = Math.floor((Math.random()*4)+1);
	switch(randNum){
		case 1:
			dealer = 'Harry';
			break;
		case 2:
			dealer = 'Anthony';
			break;
		case 3:
			dealer = 'Collin';
			break;
		case 4: 
			dealer = 'Brian';
			break;
	}
	$('#ourDealer').text(''+dealer);
});