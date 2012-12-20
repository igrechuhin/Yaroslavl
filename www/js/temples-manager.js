function Temples() {}

Temples.register = function() {
	setTimeout(function () {
		_Temples.children().bind('touchstart', Temples.touch);
	}, 0);
}

Temples.setup = function(Parameters) {
	console.assert(Parameters.hasOwnProperty('pageID'), 'Temples.setup -- pageID undefined');
	_Temples.children().removeClass();
	_Temples.children('[data-page='+Parameters.pageID+']').addClass('invert');
	Temples.hide();
}

Temples.show = function() {
	_Temples.removeClass('invisible');
}

Temples.hide = function() {
	_Temples.addClass('invisible');
}

Temples.touch = function(event) {
	Menu.gotoPage($("#"+$(event.currentTarget).data("page")));
	event.stopPropagation();
}
