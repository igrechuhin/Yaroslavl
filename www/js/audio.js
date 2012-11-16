var audio = {
	MyMedia: null,
	MediaTimer: null,
	
	PlayPauseBtn: null,
	PositionSlider: null,
	Label: null,

	Duration: -1,
	
	IsPlaying: false,
	
	SliderLength: 1000,

	initialize: function(playPauseButton, position, label) {
		audio.PlayPauseBtn = playPauseButton;
		audio.PositionSlider = position;
		audio.Label = label;
		
		audio.PositionSlider.attr('min', 0).attr('max', audio.SliderLength).attr('value', 0).slider('refresh');	
	},
	
	setSource: function(src, label) {
		audio.MyMedia = new Media(src, function() {
			audio.PlayPauseBtn.removeClass('invert_icon').addClass('normal_icon');
			audio.MyMedia.seekTo(1);
			audio.PositionSlider.attr('value', 0).slider('refresh');
			audio.MyMedia.pause();
		});
		if (audio.MediaTimer != null) {
			clearInterval(audio.MediaTimer);
			audio.MediaTimer = null;
		}
		audio.Label.text(label);
		
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
				audio.PlayPauseBtn.removeClass('normal_icon').addClass('invert_icon');
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