function initVideo(video, url) {
	if (Hls.isSupported()) {
		var hls = new Hls();
		hls.loadSource(url);
		hls.attachMedia(video);
		hls.on(Hls.Events.MANIFEST_PARSED, function() {
			video.play();
		});
	} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
		video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
		video.addEventListener('loadedmetadata', function() {
			video.play();
		});
	}
}

function init() {
	initVideo(
		document.getElementById('video-1'),
		'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
	);

	initVideo(
		document.getElementById('video-2'),
		'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8'
	);

	initVideo(
		document.getElementById('video-3'),
		'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8'
	);

	initVideo(
		document.getElementById('video-4'),
		'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
	);

}

window.onload = function() {


	init();


	var modal = document.getElementById('myModal');
	var modalVideo = document.getElementById("modal-video");
	var header = document.getElementsByClassName("modal-header")[0];
	var close = document.getElementsByClassName("close-modal")[0];

	var video1 = document.getElementById('video-1');
	var video2 = document.getElementById('video-2');
	var video3 = document.getElementById('video-3');
	var video4 = document.getElementById('video-4');

	var brightness = document.getElementById('brightness');
	var contrast = document.getElementById('contrast');

	var canvas = document.getElementById("canvas");
	var canvasCtx = canvas.getContext("2d");

	var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
	var analyser = audioCtx.createAnalyser();

	var array = new Uint8Array(analyser.frequencyBinCount);
	var mediaElements = new WeakMap();

	video1.addEventListener('click', videoClickHandler);
	video2.addEventListener('click', videoClickHandler);
	video3.addEventListener('click', videoClickHandler);
	video4.addEventListener('click', videoClickHandler);


	function videoClickHandler(e) {

		if (document.getElementsByClassName('modal')[0].style.display === 'block') return;
		var videoParent = e.target.parentElement;
		e.preventDefault();
		modalVideo.appendChild(e.target);
		e.target.play();
		e.target.muted = false;
		modal.style.display = "block";

		audioCtx.resume();

		var source;
		if (mediaElements.has(e.target)) {
			source = mediaElements.get(e.target);
		} else {
			source = audioCtx.createMediaElementSource(e.target);
			mediaElements.set(e.target, source);
		}

		source.connect(analyser);
		analyser.connect(audioCtx.destination);

		redrawCanvas();

		var currentStyle = e.target.style.filter.match(/\w+-?[\d+\.]*/g);
		resetInputs(currentStyle, brightness, contrast);

		brightness.oninput = function(ev) {
			filterVideo(ev.target.value, 'brightness', e.target);
		};

		contrast.oninput = function(ev) {
			filterVideo(ev.target.value, 'contrast', e.target);
		};

		close.onclick = function() {
			modal.style.display = "none";
			source.disconnect();
			source = null;
			videoParent.appendChild(e.target);
			e.target.muted = true;
			e.target.play();
		}
	}

	function resetInputs(currentStyle, brightness, contrast) {
		if (currentStyle) {
			if (currentStyle.indexOf('brightness') > -1)
				brightness.value = currentStyle[currentStyle.indexOf('brightness') + 1];
			if (currentStyle.indexOf('contrast') > -1)
				contrast.value = currentStyle[currentStyle.indexOf('contrast') + 1];
		} else {
			brightness.value = 1;
			contrast.value = 1;
		}
	}

	function filterVideo(value, type, element) {
		var currentStyle = element.style.filter.match(/\w+-?[\d+\.]*/g);
		if (currentStyle && currentStyle.indexOf(type) > -1) {
			index = currentStyle.indexOf(type);
			prev = currentStyle[index + 1];
			element.style.filter = element.style.filter.replace(`${type}(${prev})`, `${type}(${value})`);
		} else element.style.filter += `${type}(${value})`;
	}

	function getAverageVolume(array) {
		var sum = 0;
		for (var i = 0; i < array.length; i++) {
			sum += array[i];
		}
		var averageVolume = sum / array.length;
		return averageVolume;
	}

	function redrawCanvas() {
		requestAnimationFrame(redrawCanvas);
		analyser.getByteFrequencyData(array);
		var average = getAverageVolume(array)
		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
		canvasCtx.fillStyle = "rgba(255,217,62,0.9)";
		canvasCtx.fillRect(0, 130 - average, 30, 130);
	}

}