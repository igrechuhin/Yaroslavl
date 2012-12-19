function Temples() {}

Temples.register = function() {
	setTimeout(function () {
		$('#Temples').children().bind('touchstart', Temples.touch);
	}, 0);
}

Temples.setup = function(Parameters) {
	console.assert(Parameters.hasOwnProperty('pageID'), 'Temples.setup -- pageID undefined');
	var temples = $('#Temples');
	temples.children().removeClass();
	temples.children('[data-page='+Parameters.pageID+']').addClass('invert');
	Temples.hide();
}

Temples.show = function() {
	$('#Temples').removeClass('invisible');
}

Temples.hide = function() {
	$('#Temples').addClass('invisible');
}

Temples.touch = function(event) {
	Menu.gotoPage($("#"+$(event.currentTarget).data("page")));
	event.stopPropagation();
}
