function Buttons() {}

Buttons.register = function() {
	$('#Buttons').children().bind('touchstart', Buttons.touch);
}

Buttons.setup = function(Parameters) {
	console.assert(Parameters.hasOwnProperty('pageClass'), 'Buttons.setup -- pageClass undefined');
	var buttons = $('#Buttons');
	buttons.children().removeClass().addClass('invisible normal');
	switch(Parameters.pageClass) {
		case 'page01':
			buttons.children('#Menu').toggleClass('invisible brown');
		break;
		case 'page02':
		case 'page03':
			buttons.children('#Menu,#Temples').removeClass('invisible');
		break;
		case 'page04':
			buttons.children('#Menu,#Temples,#Location').removeClass('invisible');
		break;
	}
}

Buttons.touch = function(event) {
	var target = event.currentTarget;
	var targetObj = $(target);
	switch (target.id) {
		case 'Menu':
			targetObj.hasClass('normal') ? Menu.show() : Menu.hide();
		break;
	}
	targetObj.toggleClass('normal invert');
	event.stopPropagation();
}
