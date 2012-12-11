function Loader() {}

Loader.getContent = function(Parameters) {
	console.assert(Parameters.hasOwnProperty('url'), 'Loader.getContent -- url undefined');
	console.assert(Parameters.url != '', 'Loader.getContent -- url is empty');

	$.ajax({url: Parameters.url}).done(function(data) {
		Parameters.data = data;
		Loader.setContent(Parameters);
	});
}

Loader.setContent = function(Parameters) {
	console.assert(Parameters.hasOwnProperty('target'), 'Loader.setContent -- target undefined');
	console.assert(Parameters.hasOwnProperty('url'), 'Loader.setContent -- url undefined');
	console.assert(Parameters.hasOwnProperty('data'), 'Loader.setContent -- data undefined');
	
	var url = Parameters.url;
	var target = Parameters.target;
	var pageClass = url.substring(0, url.indexOf('.'));
	
	var targetData = target.html();
	if (targetData.length != Parameters.data.length || targetData != Parameters.data) {
		target.html(Parameters.data);
	}
	switch (target.attr('id')) {
		case 'CurrentPage':
			target.removeClass().addClass(pageClass);
			
			function getSidePage(href, target) {
				if (href.length != 0) {
					Loader.getContent({url: href.attr('href'), target: target});
				} else {
					Loader.setContent({url: '', target: target, data: ''});
				}
			}
			
			var parent = target.parent();
			
			getSidePage(target.children('#NextPageURL'), parent.children('#NextPage'));
			getSidePage(target.children('#PrevPageURL'), parent.children('#PreviousPage'));
						
			var setupObj = {pageClass: pageClass};
			Buttons.setup(setupObj);
			Menu.setup(setupObj);
			switch (pageClass) {
				case 'page04':
					Map.register({target: target.children('#Map')});
				break;
			}
		break;
		case 'PreviousPage':
		case 'NextPage':		
			target.removeClass().addClass(pageClass).addClass('invisible_page');
		break;
		case 'Buttons':
			Buttons.register();
		break;
		case 'Menu':
			Menu.register();
		break;
	}
}
