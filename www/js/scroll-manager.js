function Scroll(options) {	
	console.assert(options.hasOwnProperty('target'), 'Scroll.Constructor -- target undefined');

	this.options = {
		 target: null
		,hide: null
		,scrollPages: []
	};
	
	for (i in options) this.options[i] = options[i];

	var target = options.target;
	var scroller = target.children('#PagesScroller');


	for (i in options.scrollPages) {
		var scrollPage = options.scrollPages[i];
		var wrapperID = scrollPage.children().attr("id");
		this.scroller[i] = new iScroll(wrapperID, {
			 snap: true
			,momentum: false
			,hScroll: false
			,vScroll: true
			,hScrollbar: false
			,vScrollbar: true
			,lockDirection: true
		});
	}
}

Scroll.prototype.refresh = function() {
	setTimeout(function () {
		pagesScroll.targetScroller.refresh();
		for (i in pagesScroll.scroller) {
			pagesScroll.scroller[i].refresh();
		}
	}, 0);
}

Scroll.prototype.gotoPage = function(target) {
	Loader.getContent({
		 target: target
		,loadNext: true});
	this.scroller.scrollToPage(target.index(), 0, 200);
}
/*
Scroll.prototype.resetSingleScroll = function(target) {
	if (this.singleScroll !== null) {
		this.singleScroll.destroy();
	}
}
*/