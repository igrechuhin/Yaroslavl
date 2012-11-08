var menu = {
	d1: 200,
	d2: 1000,
	i:$("#MenuIcon"),
	div:$("#Menu"),
	pb01:$("#Page01Button"),
	pb02:$("#Page02Button"),
	pb03:$("#Page03Button"),
	pb04:$("#Page04Button"),
	pb05:$("#Page05Button"),
	pb06:$("#Page06Button"),
	pb07:$("#Page07Button"),
	pb08:$("#Page08Button"),
	pb09:$("#Page09Button"),
	pb10:$("#Page10Button"),
	pb11:$("#Page11Button"),
	pb12:$("#Page12Button"),
	pb13:$("#Page13Button"),
	c01:$("#MenuCircle01"),
	c02:$("#MenuCircle02"),
	c03:$("#MenuCircle03"),
	c04:$("#MenuCircle04"),
	r01:$("#MenuRect01"),
	r02:$("#MenuRect02"),
	r03:$("#MenuRect03"),
	r04:$("#MenuRect04"),
	r05:$("#MenuRect05"),
	r06:$("#MenuRect06"),
	r07:$("#MenuRect07"),
	r08:$("#MenuRect08"),
	r09:$("#MenuRect09"),
	r10:$("#MenuRect10"),
	r11:$("#MenuRect11"),
	r12:$("#MenuRect12"),
	r13:$("#MenuRect13"),
	r14:$("#MenuRect14"),
	cg: '#93C357',
	cp: '#745AA3',
	cb: '#165FAA',
	cc: '#00A7BD',
	fd:true,
	icon_click: function(id)
	{
		if (menu.fd)
		{
			menu.invert_current_button(id);
			menu.div.css("display", "block");
			menu.i.css("background-image", 'url(img/contents_invert_126x126.png)');
			$(".video").css("display","none");
			menu.start_forward_animation();
			menu.fd = false;
		}
		else
		{
			menu.div.css("display", "none");
			menu.i.css("background-image", 'url(img/contents_126x126.png)');
			$(".video").css("display","block");
			menu.restore_init_state();
			menu.fd = true;
		}
	},
	invert_current_button: function(id)
	{
		var color = menu.cg;
		if (id == "Page04Button" || id == "Page08Button" || id == "Page11Button")
		{
			color = menu.cb;
		}
		else if (id == "Page05Button" || id == "Page06Button" || id == "Page07Button")
		{
			color = menu.cc;
		}
		else if (id == "Page03Button" || id == "Page12Button" || id == "Page13Button")
		{
			color = menu.cp;
		}
		$('#'+id).css('background-color', 'white').css('border-color', color).css('border-width', '2px').css('border-style', 'solid').css('color', color);
	},
	start_forward_animation: function()
	{
		menu.pb01.animate({left: '318px', top: '580px', width: '138px', height: '138px'});
		menu.pb02.animate({left: '129px', top: '596px', width: '105px', height: '105px'});
		menu.pb03.animate({left: '318px', top: '376px', width: '138px', height: '138px'});
		menu.pb04.animate({left: '421px', top: '478px', width: '138px', height: '138px'});
		menu.pb05.animate({left: '215px', top: '478px', width: '138px', height: '138px'});
		menu.pb06.animate({left: '40px', top: '509px', width: '78px', height: '78px'});
		menu.pb07.animate({left: '40px', top: '713px', width: '78px', height: '78px'});
		menu.pb08.animate({left: '656px', top: '508px', width: '78px', height: '78px'});
		menu.pb09.animate({left: '142px', top: '816px', width: '78px', height: '78px'});
		menu.pb10.animate({left: '348px', top: '816px', width: '78px', height: '78px'});
		menu.pb11.animate({left: '438px', top: '700px', width: '105px', height: '105px'});
		menu.pb12.animate({left: '232px', top: '290px', width: '105px', height: '105px'});
		menu.pb13.animate({left: '348px', top: '200px', width: '78px', height: '78px'});

		menu.c01.animate({left: '440px', top: '290px', width: '105px', height: '105px'});
		menu.c02.animate({left: '656px', top: '713px', width: '78px', height: '78px'});
		menu.c03.animate({left: '142px', top: '200px', width: '78px', height: '78px'});
		menu.c04.animate({left: '129px', top: '392px', width: '105px', height: '105px'});
	
		setTimeout(menu.show_lines, menu.d1);
		setTimeout(menu.end_forward_animation, menu.d2);
	},
	show_lines: function()
	{
		menu.r01.css('display', 'block');
		menu.r02.css('display', 'block');
		menu.r03.css('display', 'block');
		menu.r04.css('display', 'block');
		menu.r05.css('display', 'block');
		menu.r06.css('display', 'block');
		menu.r07.css('display', 'block');
		menu.r08.css('display', 'block');
		menu.r09.css('display', 'block');
		menu.r10.css('display', 'block');
		menu.r11.css('display', 'block');
		menu.r12.css('display', 'block');
		menu.r13.css('display', 'block');
		menu.r14.css('display', 'block');
	},
	end_forward_animation: function()
	{
		menu.c01.animate({left: '490px', top: '341px', width: '0px', height: '0px'});
		menu.c02.animate({left: '695px', top: '768px', width: '0px', height: '0px'});
		menu.c03.animate({left: '181px', top: '258px', width: '0px', height: '0px'});
		menu.c04.animate({left: '181px', top: '445px', width: '0px', height: '0px'});

		menu.r01.animate({top: '450px', height: '0px', avoidTransforms:true});
		menu.r04.animate({left: '599px', width: '0px'});
		menu.r05.animate({top: '650px', height: '0px'});
		menu.r13.animate({top: '285px', height: '0px', avoidTransforms:true});
		menu.r14.animate({top: '336px', height: '0px'});
	},
	restore_init_state: function()
	{
		menu.pb01.css('left', '387px').css('top', '648px').css('width', '0px').css('height', '0px').css('background-color', menu.cg).css('border-style', 'none').css('color', 'white');
		menu.pb02.css('left', '179px').css('top', '645px').css('width', '0px').css('height', '0px').css('background-color', menu.cg).css('border-style', 'none').css('color', 'white');
		menu.pb03.css('left', '387px').css('top', '445px').css('width', '0px').css('height', '0px').css('background-color', menu.cp).css('border-style', 'none').css('color', 'white');
		menu.pb04.css('left', '490px').css('top', '548px').css('width', '0px').css('height', '0px').css('background-color', menu.cb).css('border-style', 'none').css('color', 'white');
		menu.pb05.css('left', '284px').css('top', '548px').css('width', '0px').css('height', '0px').css('background-color', menu.cc).css('border-style', 'none').css('color', 'white');
		menu.pb06.css('left', '78px').css('top', '548px').css('width', '0px').css('height', '0px').css('background-color', menu.cc).css('border-style', 'none').css('color', 'white');
		menu.pb07.css('left', '78px').css('top', '752px').css('width', '0px').css('height', '0px').css('background-color', menu.cc).css('border-style', 'none').css('color', 'white');
		menu.pb08.css('left', '695px').css('top', '547px').css('width', '0px').css('height', '0px').css('background-color', menu.cb).css('border-style', 'none').css('color', 'white');
		menu.pb09.css('left', '181px').css('top', '855px').css('width', '0px').css('height', '0px').css('background-color', menu.cg).css('border-style', 'none').css('color', 'white');
		menu.pb10.css('left', '387px').css('top', '855px').css('width', '0px').css('height', '0px').css('background-color', menu.cg).css('border-style', 'none').css('color', 'white');
		menu.pb11.css('left', '490px').css('top', '752px').css('width', '0px').css('height', '0px').css('background-color', menu.cb).css('border-style', 'none').css('color', 'white');
		menu.pb12.css('left', '284px').css('top', '342px').css('width', '0px').css('height', '0px').css('background-color', menu.cp).css('border-style', 'none').css('color', 'white');
		menu.pb13.css('left', '387px').css('top', '238px').css('width', '0px').css('height', '0px').css('background-color', menu.cp).css('border-style', 'none').css('color', 'white');

		menu.r01.css('display', 'none').css('left', '595px').css('top', '356px').css('height', '185px');
		menu.r02.css('display', 'none');
		menu.r03.css('display', 'none');
		menu.r04.css('display', 'none').css('left', '550px').css('top', '748px').css('width', '100px');
		menu.r05.css('display', 'none').css('left', '690px').css('top', '595px').css('height', '110px');
		menu.r06.css('display', 'none');
		menu.r07.css('display', 'none');
		menu.r08.css('display', 'none');
		menu.r09.css('display', 'none');
		menu.r10.css('display', 'none');
		menu.r11.css('display', 'none');
		menu.r12.css('display', 'none');
		menu.r13.css('display', 'none').css('left', '224px').css('top', '266px').css('height', '35px');
		menu.r14.css('display', 'none').css('left', '177px').css('top', '285px').css('height', '100px');
	}
}
