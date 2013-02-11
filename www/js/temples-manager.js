/*global $, App, setTimeout*/

App.TemplesManager = {

	register: function () {
		setTimeout(function () {
			App.DOM.Temples.children().bind('touchstart', App.TemplesManager.touch);
		}, 0);
	},

	setup: function (Parameters) {
		App.DOM.Temples.children().removeClass();
		App.DOM.Temples.children('[data-page='+Parameters.pageID+']').addClass('invert');
		App.TemplesManager.hide();
	},

	show: function () {
		App.DOM.Temples.removeClass('invisible');
	},

	hide: function () {
		App.DOM.Temples.addClass('invisible');
	},

	touch: function (event) {
		App.MenuManager.gotoPage($("#"+$(event.currentTarget).data("page")));
		event.stopPropagation();
	}
};
