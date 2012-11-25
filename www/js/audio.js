var audio = {
	MyMedia: null,
	MediaTimer: null,
	
	PlayPauseBtn: null,
	PositionSlider: null,
	Label: null,

	Duration: -1,
	
	IsPlaying: false,
	
	SliderLength: 1000,

	initialize: function(guiElements) {
		audio.PlayPauseBtn = guiElements.hasOwnProperty('playPause') ? guiElements.playPause : null;
		audio.PositionSlider = guiElements.hasOwnProperty('position') ? guiElements.position : null;
		audio.Label = guiElements.hasOwnProperty('label') ? guiElements.label : null;
		
		audio.PositionSlider.attr('min', 0).attr('max', audio.SliderLength).attr('value', 0).slider('refresh');	
	},
	
	setSource: function(source) {
        if (!source.hasOwnProperty('url') || source.url == null || source.url == '')
            return;
        if (typeof Media === 'undefined') {
            console.log('Media undefined');
            return;
        }
		audio.MyMedia = new Media(source.url, function() {
			audio.MyMedia.seekTo(1);
			audio.PositionSlider.attr('value', 0).slider('refresh');
			audio.MyMedia.pause();
		});
		if (audio.MediaTimer != null) {
			clearInterval(audio.MediaTimer);
			audio.MediaTimer = null;
		}
        if (audio.Label != null && source.hasOwnProperty('label'))
            audio.Label.text(source.label);
		
		audio.MyMedia.play();
		audio.MyMedia.pause();
		var timerDur = setInterval(function() {
			var dur = audio.MyMedia.getDuration();
			if (dur > 0) {
				clearInterval(timerDur);
				audio.Duration = dur;
			}
		}, 100);
		
		audio.PlayPauseBtn.unbind('click');
		audio.PlayPauseBtn.bind('click', function() {
			var doPlay = audio.PlayPauseBtn.hasClass('normal_icon');
			if (doPlay && audio.MyMedia) {
				audio.MyMedia.play();
				audio.IsPlaying = true;
				if (audio.MediaTimer == null) {
					audio.MediaTimer  = setInterval(	function() {
						audio.MyMedia.getCurrentPosition(function(position) {
							if (position > -1 && audio.Duration > -1) {
								var sliderPos = audio.SliderLength * position / audio.Duration;
								audio.PositionSlider.attr('value', sliderPos).slider('refresh');
							}
						});
					}, 1000);
				}
			} else {
				audio.PlayPauseBtn.removeClass('invert_icon').addClass('normal_icon');
				audio.MyMedia.pause();
				audio.IsPlaying = false;
			}
		});

		audio.PositionSlider.unbind('slidestart');
		audio.PositionSlider.bind('slidestart',  function(event) {
			audio.MyMedia.pause();
		});
		
		audio.PositionSlider.unbind('slidestop');
		audio.PositionSlider.bind('slidestop', function(event) {
			if (audio.Duration > -1) {
				var msPos = audio.Duration * event.target.value * 1000 / audio.SliderLength;
				audio.MyMedia.seekTo(Math.max(msPos, 1));
			}
			if (audio.IsPlaying) {
				audio.MyMedia.play();
			}
		});
	}
}