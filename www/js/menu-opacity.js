var menu = {
	c01: null,
	c02: null,
	c03: null,
	c04: null,
	r01: null,
	r02: null,
	r03: null,
	r04: null,
	r05: null,
	r06: null,
	r07: null,
	r08: null,
	r09: null,
	r10: null,
	r11: null,
	r12: null,
	r13: null,
	r14: null,
	pg01: null,
	pg02: null,
	pg03: null,
	pg04: null,
	pg05: null,
	pg06: null,
	pg07: null,
	pg08: null,
	pg09: null,
	pg10: null,
	pg11: null,
	pg12: null,
	pg13: null,
	cg: '#93C357',
	cp: '#745AA3',
	cb: '#165FAA',
	cc: '#00A7BD',
	color: null,
	current: null,
	fd:true,
	icon_click: function(id) {
		menu.pg01 = $('#Page01Button');
		menu.pg02 = $('#Page02Button');
		menu.pg03 = $('#Page03Button');
		menu.pg04 = $('#Page04Button');
		menu.pg05 = $('#Page05Button');
		menu.pg06 = $('#Page06Button');
		menu.pg07 = $('#Page07Button');
		menu.pg08 = $('#Page08Button');
		menu.pg09 = $('#Page09Button');
		menu.pg10 = $('#Page10Button');
		menu.pg11 = $('#Page11Button');
		menu.pg12 = $('#Page12Button');
		menu.pg13 = $('#Page13Button');
		menu.c01 = $('#MenuCircle01');
		menu.c02 = $('#MenuCircle02');
		menu.c03 = $('#MenuCircle03');
		menu.c04 = $('#MenuCircle04');
		menu.r01 = $('#MenuRect01');
		menu.r02 = $('#MenuRect02');
		menu.r03 = $('#MenuRect03');
		menu.r04 = $('#MenuRect04');
		menu.r05 = $('#MenuRect05');
		menu.r06 = $('#MenuRect06');
		menu.r07 = $('#MenuRect07');
		menu.r08 = $('#MenuRect08');
		menu.r09 = $('#MenuRect09');
		menu.r10 = $('#MenuRect10');
		menu.r11 = $('#MenuRect11');
		menu.r12 = $('#MenuRect12');
		menu.r13 = $('#MenuRect13');
		menu.r14 = $('#MenuRect14');
		if (menu.fd) {
			menu.invert_current_button(id);
			menu.set_menu_state();
			menu.start_forward_animation();
			menu.fd = false;
		}
		else {
			menu.restore_init_state();
			menu.fd = true;
		}
	},
	invert_current_button: function(id)
	{
		var color = menu.cg;
		if (id == 'Page04Button' || id == 'Page08Button' || id == 'Page11Button') {
			color = menu.cb;
		}
		else if (id == 'Page05Button' || id == 'Page06Button' || id == 'Page07Button') {
			color = menu.cc;
		}
		else if (id == 'Page03Button' || id == 'Page12Button' || id == 'Page13Button') {
			color = menu.cp;
		}
		menu.current = $('#'+id);
		menu.current.css('background-color', 'white').css('border-color', color).css('border-width', '2px').css('border-style', 'solid').css('color', color);
		menu.color = color;
	},
	start_forward_animation: function() {
		menu.pg01.animate({opacity: 1});
		menu.pg02.animate({opacity: 1});
		menu.pg03.animate({opacity: 1});
		menu.pg04.animate({opacity: 1});
		menu.pg05.animate({opacity: 1});
		menu.pg06.animate({opacity: 1});
		menu.pg07.animate({opacity: 1});
		menu.pg08.animate({opacity: 1});
		menu.pg09.animate({opacity: 1});
		menu.pg10.animate({opacity: 1});
		menu.pg11.animate({opacity: 1});
		menu.pg12.animate({opacity: 1});
		menu.pg13.animate({opacity: 1});
		menu.c01.animate({opacity: 1});
		menu.c02.animate({opacity: 1});
		menu.c03.animate({opacity: 1});
		menu.c04.animate({opacity: 1});
		menu.r01.animate({opacity: 1});
		menu.r02.animate({opacity: 1});
		menu.r03.animate({opacity: 1});
		menu.r04.animate({opacity: 1});
		menu.r05.animate({opacity: 1});
		menu.r06.animate({opacity: 1});
		menu.r07.animate({opacity: 1});
		menu.r08.animate({opacity: 1});
		menu.r09.animate({opacity: 1});
		menu.r10.animate({opacity: 1});
		menu.r11.animate({opacity: 1});
		menu.r12.animate({opacity: 1});
		menu.r13.animate({opacity: 1});
		menu.r14.animate({opacity: 1});

		setTimeout(menu.end_forward_animation, menu.d2);
	},
	end_forward_animation: function() {
		menu.c01.animate({left: '490px', top: '341px', width: '0px', height: '0px'});
		menu.c02.animate({left: '695px', top: '768px', width: '0px', height: '0px'});
		menu.c03.animate({left: '181px', top: '258px', width: '0px', height: '0px'});
		menu.c04.animate({left: '181px', top: '445px', width: '0px', height: '0px'});

		menu.r01.animate({top: '450px', height: '0px'});
		menu.r04.animate({left: '599px', width: '0px'});
		menu.r05.animate({top: '650px', height: '0px'});
		menu.r13.animate({top: '285px', height: '0px'});
		menu.r14.animate({top: '336px', height: '0px'});
	},
	set_menu_state: function() {
		$('#Menu').css('display', 'block');
		$('#MenuIcon').css('background-image', 'url(img/contents_invert_126x126.png)');
		$('#MenuIconBrown').css('background-image', 'url(img/contents_invert_brown_126x126.png)');
		$('.video').css('display','none');
		$('.map').css('display','none');
		$('.control_buttons').css('opacity', '0.3');
		$('#PageContent').css('opacity', '0.3');
},
	restore_init_state: function() {
		$('#Menu').css('display', 'none');
		$('#MenuIcon').css('background-image', 'url(img/contents_126x126.png)');
		$('#MenuIconBrown').css('background-image', 'url(img/contents_brown_126x126.png)');
		$('.video').css('display','block');
		$('.map').css('display','block');
		$('.control_buttons').css('opacity', '1');
		$('#PageContent').css('opacity', '1');

		menu.pg01.css('opacity', '0');
		menu.pg02.css('opacity', '0');
		menu.pg03.css('opacity', '0');
		menu.pg04.css('opacity', '0');
		menu.pg05.css('opacity', '0');
		menu.pg06.css('opacity', '0');
		menu.pg07.css('opacity', '0');
		menu.pg08.css('opacity', '0');
		menu.pg09.css('opacity', '0');
		menu.pg10.css('opacity', '0');
		menu.pg11.css('opacity', '0');
		menu.pg12.css('opacity', '0');
		menu.pg13.css('opacity', '0');
		menu.c01.css('opacity', '0').css('left', '440px').css('top', '290px').css('width', '105px').css('height', '105px');
		menu.c02.css('opacity', '0').css('left', '656px').css('top', '713px').css('width', '78px').css('height', '78px');
		menu.c03.css('opacity', '0').css('left', '142px').css('top', '200px').css('width', '78px').css('height', '78px')
		menu.c04.css('opacity', '0').css('left', '129px').css('top', '392px').css('width', '105px').css('height', '105px');
		menu.r01.css('opacity', '0').css('left', '595px').css('top', '356px').css('height', '185px');
		menu.r02.css('opacity', '0');
		menu.r03.css('opacity', '0');
		menu.r04.css('opacity', '0').css('left', '550px').css('top', '748px').css('width', '100px');
		menu.r05.css('opacity', '0').css('left', '690px').css('top', '595px').css('height', '110px');
		menu.r06.css('opacity', '0');
		menu.r07.css('opacity', '0');
		menu.r08.css('opacity', '0');
		menu.r09.css('opacity', '0');
		menu.r10.css('opacity', '0');
		menu.r11.css('opacity', '0');
		menu.r12.css('opacity', '0');
		menu.r13.css('opacity', '0').css('left', '224px').css('top', '266px').css('height', '35px');
		menu.r14.css('opacity', '0').css('left', '177px').css('top', '285px').css('height', '100px');
		
		menu.current.css('background-color', menu.color).css('border-color', 'white').css('border-width', '0px').css('border-style', 'none').css('color', 'white');
	}
}
