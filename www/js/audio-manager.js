/*global setTimeout, setInterval, clearInterval, Media, App */

App.AudioManager = {
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
	IsPaused: true,

	Status: 0,

	initialize: function(guiElements) {
		var audioMgr = App.AudioManager;
		audioMgr.Controls = guiElements.controls;	
		audioMgr.PlayPauseBtn = audioMgr.Controls.children("#PlayPause");
		audioMgr.PositionSlider = audioMgr.Controls.find("#SliderSingle");
		audioMgr.OnPositionUpdate = audioMgr.OnPositionUpdate || guiElements.onPositionUpdate;
		audioMgr.OnRelease = audioMgr.OnRelease || guiElements.onRelease;
	},
	
	setSource: function(source) {
		if (typeof Media === "undefined") { return; }
		var audioMgr = App.AudioManager;
		audioMgr.release();
		audioMgr.MyMedia = new Media(source.url,
			function() { //mediaSuccess
				audioMgr.MyMedia.seekTo(1);
				audioMgr.MyMedia.pause();
				audioMgr.IsPaused = true;
			},
			function() { //mediaError
			},
			function( value ) { //mediaStatus
				audioMgr.Status = value;
				if (value == 4) { //Media.MEDIA_STOPPED = 4;
					audioMgr.PositionSlider.slider("value", 0);
					audioMgr.MyMedia.seekTo(0);
					audioMgr.PlayPauseBtn.removeClass("invert");
				}
			}
		);
		if (audioMgr.MediaTimer !== null) {
			clearInterval(audioMgr.MediaTimer);
			audioMgr.MediaTimer = null;
		}
		audioMgr.togglePlay();
		if (source.hasOwnProperty("startPlay") && source.startPlay === false) {
			audioMgr.togglePlay();
		}
		var timerDur = setInterval(function() {
			var dur = audioMgr.MyMedia.getDuration();
			if (dur > 0) {
				clearInterval(timerDur);
				audioMgr.Duration = dur;
				audioMgr.PositionSlider.slider({
					from: 0,
					to: dur,
					step: 1,
					calculate: function( value ) {
						var mins = Math.floor( value / 60 );
						var secs = Math.floor( value - mins*60 );
						return mins + ":" + (secs < 10 ? "0"+secs : secs);
					},
					onstatechange: function ( value ) {
						if (audioMgr.IsTouching && !audioMgr.IsPaused) {
							audioMgr.MyMedia.pause();
							audioMgr.IsPaused = true;
						}
						if (audioMgr.OnPositionUpdate) {
							audioMgr.OnPositionUpdate.call(this, value);
						}
					},
					mouseDownCallback: function () {
						audioMgr.IsTouching = true;
					},
					mouseUpCallback: function ( value ) {
						audioMgr.MyMedia.seekTo(value * 1000);
						if (audioMgr.IsPlaying) {
							audioMgr.MyMedia.play();
							audioMgr.IsPaused = false;
						}
						audioMgr.IsTouching = false;
					}
				});
				audioMgr.PositionSlider.slider("limits", {
					from: 0,
					to: dur});
				audioMgr.PositionSlider.slider("value", 0);
				setTimeout(function () {
					audioMgr.Controls.removeClass("invisible2");
				}, 0);
			}
		}, 50);
		
		audioMgr.PlayPauseBtn.unbind("touchstart").bind("touchstart", audioMgr.togglePlay);
	},

	release: function() {
		var audioMgr = App.AudioManager;
		if (audioMgr.MyMedia !== null) {
			if (audioMgr.OnRelease) {
				audioMgr.OnRelease.call(this);
			}

			audioMgr.MyMedia.release();
			audioMgr.MyMedia = null;

			clearInterval(audioMgr.MediaTimer);
			audioMgr.MediaTimer = null;

			audioMgr.OnPositionUpdate = null;
			audioMgr.OnRelease = null;
			audioMgr.Duration = -1;
			audioMgr.IsPlaying = false;
			audioMgr.IsTouching = false;
			audioMgr.Status = 0;
		}
	},

	togglePlay: function() {
		var audioMgr = App.AudioManager;
		if (audioMgr.MyMedia) {
			var doPlay = !audioMgr.PlayPauseBtn.hasClass("invert");
			if (doPlay) {
				audioMgr.MyMedia.play();
				audioMgr.IsPaused = false;
				audioMgr.IsPlaying = true;
				if (audioMgr.MediaTimer === null) {
					audioMgr.MediaTimer = setInterval( function() {
						audioMgr.MyMedia.getCurrentPosition(function(position) {
							if (position > -1 && audioMgr.Duration > -1) {
								audioMgr.PositionSlider.slider("value", position);
							}
						});
					}, 1000);
				}
			} else {
				audioMgr.MyMedia.pause();
				audioMgr.IsPlaying = false;
				audioMgr.IsPaused = true;
				clearInterval(audioMgr.MediaTimer);
				audioMgr.MediaTimer = null;
			}
			audioMgr.PlayPauseBtn.toggleClass("invert");
		}
	}
};
