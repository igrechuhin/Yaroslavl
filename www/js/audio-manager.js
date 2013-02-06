var audio = {
	MyMedia: null,
	MediaTimer: null,
	
	Controls: null,
	PlayPauseBtn: null,
	PositionSlider: null,

	OnPositionUpdate: null,
	OnRelease: null,

	Duration: -1,
	
	IsTouching: false,
	IsPlaying: false,

	Status: 0,

	initialize: function(guiElements) {
		console.assert(guiElements.hasOwnProperty("controls"), "Audio manager: controls undefined");
		audio.Controls = guiElements.controls;	
		audio.PlayPauseBtn = audio.Controls.children("#PlayPause");
		audio.PositionSlider = audio.Controls.find("#SliderSingle");
		audio.OnPositionUpdate = audio.OnPositionUpdate || guiElements.onPositionUpdate;
		audio.OnRelease = audio.OnRelease || guiElements.onRelease;
	},
	
	setSource: function(source) {
		console.assert(source.hasOwnProperty("url") && source.url !== null, "Audio manager: url undefined");
		console.assert(source.url !== "", "Audio manager: url is empty");
		console.assert(typeof Media !== "undefined", "Audio manager: Media undefined");
		if (typeof Media === "undefined") return;
		audio.release();
		audio.MyMedia = new Media(source.url,
			function() { //mediaSuccess
				audio.MyMedia.seekTo(1);
				audio.MyMedia.pause();
			},
			function() { //mediaError
			},
			function( value ) { //mediaStatus
				audio.Status = value;
				if (value == 4) { //Media.MEDIA_STOPPED = 4;
					audio.PositionSlider.slider("value", 0);
					audio.MyMedia.seekTo(0);
					audio.PlayPauseBtn.removeClass("invert");
				};
			}
		);
		if (audio.MediaTimer !== null) {
			clearInterval(audio.MediaTimer);
			audio.MediaTimer = null;
		};
		audio.togglePlay();
		if (source.hasOwnProperty("startPlay") && source.startPlay === false) {
			audio.togglePlay();
		};
		var timerDur = setInterval(function() {
			var dur = audio.MyMedia.getDuration();
			if (dur > 0) {
				clearInterval(timerDur);
				audio.Duration = dur;
				audio.PositionSlider.slider({
					from: 0,
					to: dur,
					step: 1,
					calculate: function( value ) {
						var mins = Math.floor( value / 60 );
						var secs = Math.floor( value - mins*60 );
						return mins + ":" + (secs < 10 ? "0"+secs : secs);
					},
					onstatechange: function ( value ) {
						if (audio.IsTouching) {
							audio.MyMedia.pause();
						}
						if (audio.OnPositionUpdate) {
							audio.OnPositionUpdate.call(this, value);
						}
					},
					mouseDownCallback: function ( value ) {
						audio.IsTouching = true;
					},
					mouseUpCallback: function ( value ) {
						audio.MyMedia.seekTo(value * 1000);
						if (audio.IsPlaying) {
							audio.MyMedia.play();
						}
						audio.IsTouching = false;
					}
				});
				audio.PositionSlider.slider("limits", {
					from: 0,
					to: dur});
				audio.PositionSlider.slider("value", 0);
				setTimeout(function () {
					audio.Controls.removeClass("invisible2");
				}, 0);
			}
		}, 50);
		
		audio.PlayPauseBtn.unbind("touchstart").bind("touchstart", audio.togglePlay);
	},

	release: function() {
		if (audio.MyMedia !== null) {
			if (audio.OnRelease) {
				audio.OnRelease.call(this);
			}

			audio.MyMedia.release();
			audio.MyMedia = null;

			clearInterval(audio.MediaTimer);
			audio.MediaTimer = null;

			audio.OnPositionUpdate = null;
			audio.OnRelease = null;
			audio.Duration = -1;
			audio.IsPlaying = false;
			audio.IsTouching = false;
			audio.Status = 0;
		}
	},

	togglePlay: function() {
		if (audio.MyMedia) {
			var doPlay = !audio.PlayPauseBtn.hasClass("invert");
			if (doPlay) {
				audio.MyMedia.play();
				audio.IsPlaying = true;
				if (audio.MediaTimer === null) {
					audio.MediaTimer = setInterval( function() {
						audio.MyMedia.getCurrentPosition(function(position) {
							if (position > -1 && audio.Duration > -1) {
								audio.PositionSlider.slider("value", position);
							}
						});
					}, 1000);
				}
			} else {
				audio.MyMedia.pause();
				audio.IsPlaying = false;
				clearInterval(audio.MediaTimer);
				audio.MediaTimer = null;
			}
			audio.PlayPauseBtn.toggleClass("invert");
		};
	}
}
