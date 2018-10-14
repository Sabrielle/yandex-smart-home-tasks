function init() {

	var eventArray = new Array();
	var historyState = new Array();
	var historyArray = new Array();
	var prevDiff = -1;
	var currentGesture = '';
	var isMultitouch = false;
	var da = 5;
	var ds = 10;
	var currentScale = 1;
	var lastPositionX = 0;
	var lastPositionY = 0;
	var currentStyleX, currentStyleY;
	var zoom = document.getElementById('zoom');
	var brightness = document.getElementById('brightness');

	function pointerDownHandler(ev) {
		eventArray.push(ev);
		historyArray.push(ev);
	}

	function pointerMoveHandler(ev) {

		for (var i = 0; i < eventArray.length; i++) {
			if (ev.pointerId == eventArray[i].pointerId) {
				eventArray[i] = ev;
				break;
			}
		}

		if (eventArray.length == 2) {

			isMultitouch = true;

			var dx = Math.abs(eventArray[0].clientX - eventArray[1].clientX);
       		var dy = Math.abs(eventArray[0].clientY - eventArray[1].clientY);
        	var distance = Math.sqrt(dx * dx * 2 + dy * dy * 2);
        	var angle = calcAngleDegrees(dx, dy);
        	var object = {
        		angle: angle, 
        		distance: distance
        	};
        	historyState.push(object);

        	if(historyState.length >= 2 && !currentGesture.length) {
        		if (Math.abs(historyState[historyState.length - 1].angle - historyState[0].angle) > da && 
        			Math.abs(historyState[historyState.length - 1].distance - historyState[historyState.length - 2].distance) < ds) 
        			currentGesture = 'rotate';
        		else 
        			if (Math.abs(historyState[historyState.length - 1].distance - historyState[historyState.length - 2].distance) > ds) { 
        				currentGesture = 'pinch';
					}
        	}

			switch(currentGesture) {
				case 'pinch':
					var curDiff = dx;
					if (prevDiff > 0) {
						ev.target.style.transition = "all 0.5s ease-out";
						if (curDiff > prevDiff) {
							ev.target.style.webkitTransform = "scale("+curDiff/100+")";
							ev.target.style.transform = "scale("+curDiff/100+")";
							zoom.innerText = "Приближение: "+Math.round(curDiff)+"%";
							currentScale = curDiff/100;
						}
						if (curDiff < prevDiff) {
							ev.target.style.webkitTransform = "scale(1)";
							ev.target.style.transform = "scale(1)";
							zoom.innerText = "Приближение: 100%";
							currentScale = 1;
						}
					}
					prevDiff = curDiff;
					break;
				case 'rotate': 
						ev.target.style.transition = "all 0.5s ease-out";
						var value = angle/36;
						ev.target.style.filter = "brightness("+value+")";
						ev.target.style.webkitFilter = "brightness("+value+")";
						brightness.innerText = "Яркость: "+Math.round(value*100)+"%";
					break;
			}
		}
		else {
			ev.target.style.transition = "all 1s ease-out";
			var dx = ev.clientX - historyArray[0].clientX;
			var currentStyle = ev.target.style.transform.match(/-?[\d+\.]*px+/g);
			if(currentStyle) {
				currentStyleX = currentStyle[0].split('px');
			}
        	lastPositionX = (typeof(currentStyleX) !== 'undefined' ) ? currentStyleX[0] : ev.clientX;
        	var indentX = Number(lastPositionX)+Number(dx);
        	if (Math.abs(indentX) > (currentScale * ((ev.target.offsetWidth * currentScale) - ev.target.offsetWidth)/(currentScale * 2))) return;
        	else {
				ev.target.style.transform = "translateX("+indentX+"px) scale("+currentScale+")";
				ev.target.style.webkitTransform = "translateX("+indentX+"px) scale("+currentScale+")";
				lastPositionX = indentX;
				console.log("dx", dx, "indentX", indentX, "lastPositionX", lastPositionX);
			}
		}
	}

	function pointerUpHandler(ev) {
		removeEvent(ev);
		if (eventArray.length < 2) prevDiff = -1;
		if(isMultitouch) {
			isMultitouch = false;
			currentGesture = '';
			historyState.length = 0;
		}
		else {
			historyArray.length = 0;
			eventArray.length = 0;
		}
		eventArray.length = 0;
	}

	function removeEvent(ev) {
		for (var i = 0; i < eventArray.length; i++) {
			if (eventArray[i].pointerId == ev.pointerId) {
				eventArray.splice(i, 1);
				break;
			}
		}
	}

	function calcAngleDegrees(x, y) {
		return Math.atan2(y, x) * 180 / Math.PI;
	}

	d = document.getElementById('image')
	d.addEventListener('pointerdown', pointerDownHandler);
	d.addEventListener('pointerup', pointerUpHandler);
	d.addEventListener('pointermove', pointerMoveHandler);
	d.addEventListener('pointercancel', pointerUpHandler);

}

window.onload = init;