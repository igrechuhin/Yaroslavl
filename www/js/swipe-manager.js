function Swipe(Parameters) {	
	console.assert(Parameters.hasOwnProperty('target'), 'Swipe.Constructor -- target undefined');
	console.assert(Parameters.hasOwnProperty('url'), 'Swipe.Constructor -- url undefined');
	console.assert(Parameters.url != '', 'Swipe.Constructor -- url is empty');

	this.shiftThreshold = 70;
	this.swipeThreshold = 50;
	this.swipeTimeThreshold = 300;

	this.CURRENT = 0;
	this.LEFT = 1;
	this.RIGHT = 2;

	this.target = Parameters.target;
	this.previousPage = $("<div id='PreviousPage'></div>");
	this.currentPage = $("<div id='CurrentPage'></div>");
	this.nextPage = $("<div id='NextPage'></div>");
	
	this.target.append(this.previousPage, [this.currentPage, this.nextPage]);
	
	this.hideElements = Parameters.hasOwnProperty('hide') ? Parameters.hide : $();

	this.resetVars();

	Loader.getContent({url: Parameters.url, target: this.currentPage });

	$(document).bind('touchstart touchmove touchend', {this: this}, function(event) { event.data.this.touchHandler(event); });
	this.target.bind('webkitTransitionEnd', {this: this}, function(event) { event.data.this.touchHandler(event); });
}

Swipe.prototype.resetVars = function() {
	this.isTouching = false;
	this.touchStartX = 0;
	this.currentStartX = 0;
	this.previousLength = 0;
	this.nextLength = 0;
	this.direction = 0;
	this.startTime = 0;
	this.isHidden = false;
}

Swipe.prototype.hide = function() {
	if (!this.isHidden) {
		this.hideElements.addClass('invisible');
		this.isHidden = true;
	}
}

Swipe.prototype.touchHandler = function(event) {
	switch (event.type) {
		case 'touchstart':
//			this.nextPage.removeClass('invisible_page');
//			this.previousPage.removeClass('invisible_page');
			
			var pageX = event.originalEvent.touches[0].pageX;
			this.isTouching = true;
			this.previousLength = this.previousPage.html().length;
			this.nextLength = this.nextPage.html().length;
			this.currentStartX = this.target.offset().left;
			this.touchStartX = pageX; 
			this.startTime = new Date().getTime();
		break;
		case 'touchmove':
			var pageX = event.originalEvent.touches[0].pageX;
			var shift = pageX - this.touchStartX;
			if (this.isTouching && Math.abs(shift) > this.shiftThreshold) {
				var currentX = this.currentStartX+shift;
				var canSwipe = false;
				if (currentX < 0 && this.nextLength > 0) { // Swipe left -- show next page
					if (this.direction != this.LEFT) {
						this.nextPage.removeClass('invisible_page');
						this.previousPage.addClass('invisible_page');
						this.direction = this.LEFT;
						this.hide();
					}
					canSwipe = true;
				} else if (currentX > 0 && this.previousLength > 0) { // Swipe right -- show prev page
					if (this.direction != this.RIGHT) {
						this.nextPage.addClass('invisible_page');
						this.previousPage.removeClass('invisible_page');
						this.direction = this.RIGHT;
						this.hide();
					}
					canSwipe = true;
				}
				if (canSwipe) {
					this.target.css('-webkit-transform', 'translate3d('+currentX+'px,0px,0px)');
				}
			}
		break;
		case 'touchend':
			if (this.isTouching) {
				var pageX = event.originalEvent.changedTouches[0].pageX;
				var elapsedSwipe = pageX - this.touchStartX;
				var elapsedTime = new Date().getTime() - this.startTime;
				var currentX = this.target.offset().left;
				var currentWidth_2 = $(window).width() / 2;
				var swipeShow = 0; // 0 - Leave as is
				if (elapsedTime < this.swipeTimeThreshold) {
					swipeShow = (elapsedSwipe < -this.swipeThreshold) ? this.LEFT : swipeShow;
					swipeShow = (elapsedSwipe > this.swipeThreshold) ? this.RIGHT : swipeShow;
				}
				this.target.addClass('swipe');
				var shift = 0;
				if ((currentX < -currentWidth_2 || swipeShow === this.LEFT) && this.nextLength > 0) { // Swipe left -- show next page
					shift = -$(window).width();
				} else if ((currentX > currentWidth_2 || swipeShow === this.RIGHT) && this.previousLength > 0) { // Swipe right -- show prev page
					shift = $(window).width();
				} else {
					this.direction = this.CURRENT;
				}
				this.target.css('-webkit-transform', 'translate3d('+shift+'px,0px,0px)');
			}
		break;
		case 'webkitTransitionEnd':
			this.target.removeClass('swipe');
			this.changePage();
			this.hideElements.removeClass('invisible');
			this.resetVars();
		break;
	}
	event.preventDefault();
}

Swipe.prototype.changePage = function() {
	if (this.direction != this.CURRENT) {
		var newPage = null, oldPage = null;
		if (this.direction === this.LEFT) {
			newPage = this.nextPage;
			oldPage = this.previousPage;
		} else {
			newPage = this.previousPage;
			oldPage = this.nextPage;
		}
		function getClass(page) {
			var className = page[0].className;
			var classStart = className.indexOf('page');
			var classEnd = className.indexOf(' ', classStart + 1);
			return ((classEnd === -1) ? className.substring(classStart) : className.substring(classStart, classEnd));
		}
		var newClass = getClass(newPage);
		var oldClass = getClass(newPage);
		oldPage.html(this.currentPage.html()).removeClass().addClass(oldClass);
		this.currentPage.html(newPage.html()).removeClass().addClass(newClass);
		this.target.css('-webkit-transform', 'translate3d(0px,0px,0px)');
		Loader.setContent({url: newClass+'.html', target: this.currentPage, data: newPage.html()});
	}
}
