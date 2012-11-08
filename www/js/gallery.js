var gallery = {
	
	psInstance: null,
	
	listID: null,
	list: null,
	
	opts: {
			autoStartSlideshow: false,
			slideshowDelay: 3000,
			cacheMode: Code.PhotoSwipe.Cache.Mode.normal,
			slideTimingFunction: "ease-in-out",
			loop: true,
			enableMouseWheel: false,
			enableKeyboard: false,
			captionAndToolbarAutoHideDelay: 0
	},
	allImages: [	{url: "photos/Wilderness_1024.jpeg", tags: ["sky"]},
						{url: "photos/Waves_1024.jpeg", tags: ["sea"]},
						{url: "photos/Toronto_256.jpeg", tags: ["sea", "sky"]},
						{url: "photos/Sakura_Tree_1024.jpeg", tags: ["tree"]},
						{url: "photos/Forest_1024.jpeg", tags: ["tree"]},
	],
	tags: ["sky", "sea", "tree"],
	
	init: function(listID) {
		if (!listID)
			return;
		
		gallery.listID = listID;
		gallery.list = $('ul' + gallery.listID);
	
		gallery.reinit();
	},
	
	addImage: function(imageURL) {
		gallery.list
			.append($('<li/>')
							.append($('<a/>')
											.attr('href', imageURL)
											.attr('rel', 'external')
											.append($('<img />')
															.attr('src', imageURL)
															.attr('alt', '')
														 )
										 )
						  );
	},
	
	reinit: function() {
		gallery.detach();
		gallery.makeShowArray();
		gallery.attach();
	},
	
	attach: function() {
			gallery.psInstance = $(gallery.listID + ' a').photoSwipe(gallery.opts);
	},
	
	detach: function() {
		if (gallery.psInstance) {
			Code.PhotoSwipe.detatch(gallery.psInstance);
			gallery.psInstance = null;
		}
	},
	
	makeShowArray: function() {
		gallery.list.empty();
		for (imgIndex = 0, imgEnd = gallery.allImages.length; imgIndex < imgEnd; imgIndex++) {
			img = gallery.allImages[imgIndex];
			for (tagIndex = 0, tagEnd = gallery.tags.length; tagIndex < tagEnd; tagIndex++) {
				tag = gallery.tags[tagIndex];
				if (jQuery.inArray(tag, img.tags) != -1) {
					gallery.addImage(img.url);
					break;
				}
			}
		}
	},
	
	changeSelection: function(caller) {
		setTimeout( function() {
				var tag = caller.name;
				var state = caller.value;
				
				var tagIndex = jQuery.inArray(tag, gallery.tags);
				if (state == "yep") {
					if (tagIndex == -1) {
						gallery.tags.push(tag);
					}
				}
				else {
					if (tagIndex != -1) {
						gallery.tags.splice(tagIndex,1);
					}			
				}
				gallery.reinit();
			} , 200);
	}
}