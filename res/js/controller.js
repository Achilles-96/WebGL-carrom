/*
 * controller.js
 * Copyright (C) 2016 raghuram <raghuram@raghuram-HP-Pavilion-g6-Notebook-PC>
 *
 * Distributed under terms of the MIT license.
 */
var leftKey = 37;
var rightKey = 39;
var upKey = 38;
var downKey = 40;
var enter = 13;
var wKey = 87;
var aKey = 65;
var sKey = 83;

var STR_STATE = 0;
var AIM_STATE = 1;
var PWR_STATE = 2;
var LAUNCH_STATE = 3;
var state = STR_STATE;

var speedx=0, speedy=0, rcoinspeedx=0, rcoinspeedy=0;
var bcoinspeedx = [0,0,0,0,0,0,0,0,0], bcoinspeedy = [0,0,0,0,0,0,0,0,0];
var wcoinspeedx = [0,0,0,0,0,0,0,0,0], wcoinspeedy = [0,0,0,0,0,0,0,0,0];

var rInTurn = 0;
window.onkeydown = function(e) {
	if(e.keyCode == enter) {
		if(state == STR_STATE)
			state = AIM_STATE;
		else if(state == AIM_STATE)
			state = PWR_STATE;
		else if(state == PWR_STATE){
			state = LAUNCH_STATE;
			speedx = power*0.004*(marker[0][0] - striker[0][0]);
			speedy = power*0.004*(marker[0][1] - striker[0][1]);
		}
		return;
	}
	if(e.keyCode == wKey) 
		camera = TOP_VIEW;
	if(e.keyCode == aKey)
		camera = PLAYER_VIEW;
	if(e.keyCode == sKey)
		camera = STRIKER_VIEW;
	if(state == STR_STATE){
		if(e.keyCode == leftKey){
			striker[0][0]-=0.05;
			striker[0][0] = Math.max(striker[0][0],-1.3);
		}
		if(e.keyCode == rightKey){
			striker[0][0]+=0.05;
			striker[0][0] = Math.min(striker[0][0],1.3);
		}
	}
	if(state == AIM_STATE) {
		if(e.keyCode == leftKey){
			marker[0][0]-=0.05;
			marker[0][0] = Math.max(marker[0][0],-2.18);
		}
		if(e.keyCode == rightKey){
			marker[0][0]+=0.05;
			marker[0][0] = Math.min(marker[0][0],2.18);
		}
		if(e.keyCode == upKey){
			marker[0][1]-=0.05;
			marker[0][1] = Math.max(marker[0][1],-2.18);
		}
		if(e.keyCode == downKey){
			marker[0][1]+=0.05;
			marker[0][1] = Math.min(marker[0][1],2.18);
		}
	}
	if(state == PWR_STATE) {
		if(e.keyCode == upKey){
			power++;
			power = Math.min(power,17);
		}
		if(e.keyCode == downKey){
			power--;
			power = Math.max(power,0);
		}
	}
}

function update() {
	if(state == LAUNCH_STATE) {
		if(striker[0][0] + speedx >= 2.05 || striker[0][0] + speedx<= -2.05)
			speedx = -speedx;
		if(striker[0][1] + speedy >= 2.05 || striker[0][1] + speedy<= -2.05)
			speedy = -speedy;
		var i,j;
		if(redCoin[0][0] + rcoinspeedx >= 2.05 || redCoin[0][0] + rcoinspeedx <= -2.05)
			rcoinspeedx = -rcoinspeedx;
		if(redCoin[0][1] + rcoinspeedy >= 2.05 || redCoin[0][1] + rcoinspeedy <= -2.05)
			rcoinspeedy = -rcoinspeedy;
		for(i=0;i<9;i++){
			if(blackCoins[i][0] + bcoinspeedx[i] >= 2.05 || blackCoins[i][0] + bcoinspeedx[i] <= -2.05)
				bcoinspeedx[i] = -bcoinspeedx[i];
			if(blackCoins[i][1] + bcoinspeedy[i] >= 2.05 || blackCoins[i][1] + bcoinspeedy[i] <= -2.05)
				bcoinspeedy[i] = -bcoinspeedy[i];
			if(whiteCoins[i][0] + wcoinspeedx[i] >= 2.05 || whiteCoins[i][0] + wcoinspeedx[i] <= -2.05)
				wcoinspeedx[i] = -wcoinspeedx[i];
			if(whiteCoins[i][1] + wcoinspeedy[i] >= 2.05 || whiteCoins[i][1] + wcoinspeedy[i] <= -2.05)
				wcoinspeedy[i] = -wcoinspeedy[i];
			var x1 = striker[0][0]+speedx;
			var y1 = striker[0][1]+speedy;
			var x2 = blackCoins[i][0] + bcoinspeedx[i];
			var y2 = blackCoins[i][1] + bcoinspeedy[i];
			var dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
			if(dist<0.23 && !blackPocketed[i]){
				var a = new Audio('res/sounds/coinhit.mp3');
				a.volume = a.volume/12;
				a.play();
				var speed_array = getNewSpeeds(x1,y1,x2,y2,speedx,speedy,bcoinspeedx[i],bcoinspeedy[i], 1.4, 1);
				speedx = speed_array[0];
				speedy = speed_array[1];
				bcoinspeedx[i] = speed_array[2];
				bcoinspeedy[i] = speed_array[3];
			}
			x2 = whiteCoins[i][0] + wcoinspeedx[i];
			y2 = whiteCoins[i][1] + wcoinspeedy[i];
			var dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
			if(dist<0.23 && !whitePocketed[i]){
				var a = new Audio('res/sounds/coinhit.mp3');
				a.volume = a.volume/12;
				a.play();
				var speed_array = getNewSpeeds(x1,y1,x2,y2,speedx,speedy,wcoinspeedx[i],wcoinspeedy[i], 1.4, 1);
				speedx = speed_array[0];
				speedy = speed_array[1];
				wcoinspeedx[i] = speed_array[2];
				wcoinspeedy[i] = speed_array[3];
			}
			for(j=i+1;j<9;j++){
				x1 = blackCoins[i][0] + bcoinspeedx[i];
				y1 = blackCoins[i][1] + bcoinspeedy[i];
				x2 = blackCoins[j][0] + bcoinspeedx[j];
				y2 = blackCoins[j][1] + bcoinspeedy[j];
				dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
				if(dist<0.2 && !blackPocketed[i] && !blackPocketed[j]){
					var a = new Audio('res/sounds/coinhit.mp3');
					a.volume = a.volume/12;
					a.play();
					var speed_array = getNewSpeeds(x1,y1,x2,y2,bcoinspeedx[i],bcoinspeedy[i],bcoinspeedx[j],bcoinspeedy[j], 1, 1);
					bcoinspeedx[i] = speed_array[0];
					bcoinspeedy[i] = speed_array[1];
					bcoinspeedx[j] = speed_array[2];
					bcoinspeedy[j] = speed_array[3];
				}
			}
			for(j=0;j<9;j++){
				x1 = blackCoins[i][0] + bcoinspeedx[i];
				y1 = blackCoins[i][1] + bcoinspeedy[i];
				x2 = whiteCoins[j][0] + wcoinspeedx[j];
				y2 = whiteCoins[j][1] + wcoinspeedy[j];
				dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
				if(dist<0.2 && !blackPocketed[i] && !whitePocketed[i]){
					var a = new Audio('res/sounds/coinhit.mp3');
					a.volume = a.volume/12;
					a.play();
					var speed_array = getNewSpeeds(x1,y1,x2,y2,bcoinspeedx[i],bcoinspeedy[i],wcoinspeedx[j],wcoinspeedy[j], 1, 1);
					bcoinspeedx[i] = speed_array[0];
					bcoinspeedy[i] = speed_array[1];
					wcoinspeedx[j] = speed_array[2];
					wcoinspeedy[j] = speed_array[3];
					//whiteCoins[j][0] = blackCoins[i][0] + 0.2;
					//whiteCoins[j][1] = blackCoins[i][1] + 0.2;
				}
			}
			for(j=i+1;j<9;j++){
				x1 = whiteCoins[i][0] + wcoinspeedx[i];
				y1 = whiteCoins[i][1] + wcoinspeedy[i];
				x2 = whiteCoins[j][0] + wcoinspeedx[j];
				y2 = whiteCoins[j][1] + wcoinspeedy[j];
				dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
				if(dist<0.2 && !whitePocketed[i] && !whitePocketed[i]){
					var a = new Audio('res/sounds/coinhit.mp3');
					a.volume = a.volume/12;
					a.play();
					var speed_array = getNewSpeeds(x1,y1,x2,y2,wcoinspeedx[i],wcoinspeedy[i],wcoinspeedx[j],wcoinspeedy[j], 1, 1);
					wcoinspeedx[i] = speed_array[0];
					wcoinspeedy[i] = speed_array[1];
					wcoinspeedx[j] = speed_array[2];
					wcoinspeedy[j] = speed_array[3];
					//whiteCoins[j][0] = whiteCoins[i][0] + 0.2;
					//whiteCoins[j][1] = whiteCoins[i][1] + 0.2;
				}
			}
			x1 = redCoin[0][0] + rcoinspeedx;
			y1 = redCoin[0][1] + rcoinspeedy;
			x2 = blackCoins[i][0] + bcoinspeedx[i];
			y2 = blackCoins[i][1] + bcoinspeedy[i];
			dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
			if(dist<0.2 && !blackPocketed[i]){
				var a = new Audio('res/sounds/coinhit.mp3');
				a.volume = a.volume/12;
				a.play();
				var speed_array = getNewSpeeds(x1,y1,x2,y2,rcoinspeedx,rcoinspeedy,bcoinspeedx[i],bcoinspeedy[i], 1, 1);
				rcoinspeedx = speed_array[0];
				rcoinspeedy = speed_array[1];
				bcoinspeedx[i] = speed_array[2];
				bcoinspeedy[i] = speed_array[3];
			}
			x2 = whiteCoins[i][0] + wcoinspeedx[i];
			y2 = whiteCoins[i][1] + wcoinspeedy[i];
			dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
			if(dist<0.2 && !whitePocketed[i]){
				var a = new Audio('res/sounds/coinhit.mp3');
				a.volume = a.volume/12;
				a.play();
				var speed_array = getNewSpeeds(x1,y1,x2,y2,rcoinspeedx,rcoinspeedy,wcoinspeedx[i],wcoinspeedy[i], 1, 1);
				rcoinspeedx = speed_array[0];
				rcoinspeedy = speed_array[1];
				wcoinspeedx[i] = speed_array[2];
				wcoinspeedy[i] = speed_array[3];
			}
			if( i == 0){
				x1 = redCoin[0][0] + rcoinspeedx;
				y1 = redCoin[0][1] + rcoinspeedy;
				x2 = striker[0][0] + speedx;
				y2 = striker[0][1] + speedy;
				dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
				if(dist<0.23 ){
					var a = new Audio('res/sounds/coinhit.mp3');
					a.volume = a.volume/12;
					a.play();
					var speed_array = getNewSpeeds(x1,y1,x2,y2,rcoinspeedx,rcoinspeedy,speedx,speedy, 1, 1);
					rcoinspeedx = speed_array[0];
					rcoinspeedy = speed_array[1];
					speedx = speed_array[2];
					speedy = speed_array[3];
				}
			}
		}

		var stopped = 0;
		var eps = 0.0008;
		var friction = 0.98;
		var wInTurn = 0;

		for(i=0;i<9;i++){
			bcoinspeedx[i]*=friction;
			bcoinspeedy[i]*=friction;
			wcoinspeedx[i]*=friction;
			wcoinspeedy[i]*=friction;
			blackCoins[i][0] += bcoinspeedx[i];
			blackCoins[i][1] += bcoinspeedy[i];
			whiteCoins[i][0] += wcoinspeedx[i];
			whiteCoins[i][1] += wcoinspeedy[i];

			if(blackCoins[i][0] > 2.0 && blackCoins[i][1] > 2.0 && !blackPocketed[i]){
				blackPocketed[i] = 1;
				score -= 20;
				var a = new Audio('res/sounds/pocket.mp3');
				a.volume = a.volume/8;
				a.play();
			}
			if(blackCoins[i][0] > 2.0 && blackCoins[i][1] < -2.0 && !blackPocketed[i]){
				blackPocketed[i] = 1;
				score -= 20;
				var a = new Audio('res/sounds/pocket.mp3');
				a.volume = a.volume/8;
				a.play();
			}
			if(blackCoins[i][0] < -2.0 && blackCoins[i][1] > 2.0 && !blackPocketed[i]){
				blackPocketed[i] = 1;
				score -= 20;
				var a = new Audio('res/sounds/pocket.mp3');
				a.volume = a.volume/8;
				a.play();
			}
			if(blackCoins[i][0] < -2.0 && blackCoins[i][1] < -2.0 && !blackPocketed[i]){
				blackPocketed[i] = 1;
				score -= 20;
				var a = new Audio('res/sounds/pocket.mp3');
				a.volume = a.volume/8;
				a.play();
			}
			if(whiteCoins[i][0] > 2.0 && whiteCoins[i][1] > 2.0 && !whitePocketed[i]){
				whitePocketed[i] = 1;
				score += 5;
				wInTurn = 1;
				if(redPocketed == 1)
					score += 15;
				var a = new Audio('res/sounds/pocket.mp3');
				a.volume = a.volume/8;
				a.play();
			}
			if(whiteCoins[i][0] > 2.0 && whiteCoins[i][1] < -2.0 && !whitePocketed[i]){
				whitePocketed[i] = 1;
				score += 5;
				wInTurn = 1;
				if(redPocketed == 1)
					score += 15;
				var a = new Audio('res/sounds/pocket.mp3');
				a.volume = a.volume/8;
				a.play();
			}
			if(whiteCoins[i][0] < -2.0 && whiteCoins[i][1] > 2.0 && !whitePocketed[i]){
				whitePocketed[i] = 1;
				score += 5;
				wInTurn = 1;
				if(redPocketed == 1)
					score += 15;
				var a = new Audio('res/sounds/pocket.mp3');
				a.volume = a.volume/8;
				a.play();
			}
			if(whiteCoins[i][0] < -2.0 && whiteCoins[i][1] < -2.0 && !whitePocketed[i]){
				whitePocketed[i] = 1;
				score += 5;
				wInTurn = 1;
				if(redPocketed == 1)
					score += 15;
				var a = new Audio('res/sounds/pocket.mp3');
				a.volume = a.volume/8;
				a.play();
			}

			if(Math.abs(bcoinspeedx[i]) > eps) 
				stopped = 1;
			else
				bcoinspeedx[i] = 0;
			if(Math.abs(bcoinspeedy[i]) > eps)
				stopped = 1;
			else
				bcoinspeedy[i] = 0;
			if( Math.abs(wcoinspeedx[i]) > eps)
				stopped = 0;
			else
				wcoinspeedx[i] = 0;
			if( Math.abs(wcoinspeedy[i]) > eps)
				stopped = 1;
			else
				wcoinspeedy[i] = 0;
		}
		speedx = friction*speedx;
		speedy = friction*speedy;
		striker[0][0] += speedx;
		striker[0][1] += speedy;
		if(Math.abs(speedx) > eps)
			stopped = 1;
		else
			speedx = 0;
		if(Math.abs(speedy) > eps)
			stopped = 1;
		else
			speedy = 0;

		rcoinspeedx*=friction;
		rcoinspeedy*=friction;
		redCoin[0][0] += rcoinspeedx;
		redCoin[0][1] += rcoinspeedy;
		if(redCoin[0][0] > 2.0 && redCoin[0][1] > 2.0 && !redPocketed){
			redPocketed = 1;
			rInTurn = 1;
		}
		if(redCoin[0][0] < -2.0 && redCoin[0][1] > 2.0 && !redPocketed){
			redPocketed = 1;
			rInTurn = 1;
		}
		if(redCoin[0][0] > 2.0 && redCoin[0][1] < -2.0 && !redPocketed){
			redPocketed = 1;
			rInTurn = 1;
		}
		if(redCoin[0][0] < -2.0 && redCoin[0][1] < -2.0 && !redPocketed){
			redPocketed = 1;
			rInTurn = 1;
		}
		if(Math.abs(rcoinspeedx) > eps)
			stopped = 1;
		else
			rcoinspeedx = 0;
		if(Math.abs(rcoinspeedy) > eps)
			stopped = 1;
		else
			rcoinspeedy = 0;

		if (stopped == 0){
			state = STR_STATE;
			striker[0][0] = 0;
			striker[0][1] = 1.52;
			power = 0;
			marker[0][0] = 0;
			marker[0][1] = 0;
			speedx = speedy = 0;
			rcoinspeedx = rcoinspeedy = 0;
			for(i=0;i<9;i++)
				bcoinspeedx[i] = bcoinspeedy[i] = wcoinspeedx[i] = wcoinspeedy[i] = 0;
			if(redPocketed && !wInTurn && !rInTurn){
				redPocketed = 0;
				redCoin[0][0] = redCoin[0][1] = 0;
			}
			rInTurn=0;
		}
	}
}

function getNewSpeeds(x1, y1, x2, y2, spx1, spy1, spx2, spy2, m1, m2){
	var collisionision_angle = Math.atan2(y2 - y1, x2 - x1);

	var speed1 = Math.sqrt(spx1*spx1 + spy1*spy1);
	var speed2 = Math.sqrt(spx2*spx2 + spy2*spy2);

	var direction_1 = Math.atan2(spy1, spx1);
	var direction_2 = Math.atan2(spy2, spx2);
	var new_xspeed_1 = speed1 * Math.cos(direction_1 - collisionision_angle);
	var new_yspeed_1 = speed1 * Math.sin(direction_1 - collisionision_angle);
	var new_xspeed_2 = speed2 * Math.cos(direction_2 - collisionision_angle);
	var new_yspeed_2 = speed2 * Math.sin(direction_2 - collisionision_angle);

	var final_xspeed_1 = ((m1 - m2) * new_xspeed_1 + (m2 + m2) * new_xspeed_2) / (m1 + m2);
	var final_xspeed_2 = ((m1 + m1) * new_xspeed_1 + (m2 - m1) * new_xspeed_2) / (m1 + m2);
	var final_yspeed_1 = new_yspeed_1;
	var final_yspeed_2 = new_yspeed_2;

	var cosAngle = Math.cos(collisionision_angle);
	var sinAngle = Math.sin(collisionision_angle);
	var vx1 = cosAngle * final_xspeed_1 - sinAngle * final_yspeed_1;
	var vy1 = sinAngle * final_xspeed_1 + cosAngle * final_yspeed_1;
	var vx2 = cosAngle * final_xspeed_2 - sinAngle * final_yspeed_2;
	var vy2 = sinAngle * final_xspeed_2 + cosAngle * final_yspeed_2;
	return [vx1, vy1, vx2, vy2];
}
