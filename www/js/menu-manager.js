function Menu() {}

Menu.register = function() {
	$('#Menu').addClass('invisible').children('.button').bind('touchstart', Menu.touch);
}

Menu.setup = function(Parameters) {
	console.assert(Parameters.hasOwnProperty('pageClass'), 'Menu.setup -- pageClass undefined');
	var currentButtonID = ['#Page', 'Button'].join(Parameters.pageClass.substring(4, 6));
	
	var menu = $('#Menu');
	menu.children().removeClass('invert').addClass('normal');
	menu.children(currentButtonID).toggleClass('normal invert');
	Menu.hide();
}

Menu.show = function() {
	$('video').addClass('invisible');
	var menu = $('#Menu');
	menu.removeClass('invisible');
	setTimeout(function() {
		menu.children().addClass('show');
		setTimeout(function() {
			menu.children('.hide').removeClass('show');
		}, 1000);
	}, 50);
}

Menu.hide = function() {
	var menu = $('#Menu');
	menu.children().removeClass('show');
	$('video').removeClass('invisible');
	setTimeout(function() {
		menu.addClass('invisible');
	}, 500);
}

Menu.touch = function(event) {
	var target = event.currentTarget;
	var targetObj = $(target);
	switch (target.id) {
		case 'Menu':
			targetObj.hasClass('normal') ? Menu.show() : Menu.hide();
		break;
	}
	targetObj.toggleClass('normal invert');
	Loader.getContent({url: Parameters.url, target: this.currentPage });
	event.stopPropagation();
}
