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

var STR_STATE = 0;
var AIM_STATE = 1;
var PWR_STATE = 2;
var LAUNCH_STATE = 3;
var state = STR_STATE;

var speedx, speedy;
var bcoinspeedx = [0,0,0,0,0,0,0,0,0], bcoinspeedy = [0,0,0,0,0,0,0,0,0];
var wcoinspeedx = [0,0,0,0,0,0,0,0,0], wcoinspeedy = [0,0,0,0,0,0,0,0,0];

window.onkeydown = function(e) {
	if(e.keyCode == enter) {
		if(state == STR_STATE)
			state = AIM_STATE;
		else if(state == AIM_STATE)
			state = PWR_STATE;
		else if(state == PWR_STATE){
			state = LAUNCH_STATE;
			speedx = power*0.01*(marker[0][0] - striker[0][0]);
			speedy = power*0.01*(marker[0][1] - striker[0][1]);
		}
		return;
	}
	if(e.keyCode == wKey) 
		camera = TOP_VIEW;
	if(e.keyCode == aKey)
		camera = PLAYER_VIEW;
	if(state == STR_STATE){
		if(e.keyCode == leftKey){
			striker[0][0]-=0.08;
			striker[0][0] = Math.max(striker[0][0],-1.3);
		}
		if(e.keyCode == rightKey){
			striker[0][0]+=0.08;
			striker[0][0] = Math.min(striker[0][0],1.3);
		}
	}
	if(state == AIM_STATE) {
		if(e.keyCode == leftKey){
			marker[0][0]-=0.08;
			marker[0][0] = Math.max(marker[0][0],-2.18);
		}
		if(e.keyCode == rightKey){
			marker[0][0]+=0.08;
			marker[0][0] = Math.min(marker[0][0],2.18);
		}
		if(e.keyCode == upKey){
			marker[0][1]-=0.08;
			marker[0][1] = Math.max(marker[0][1],-2.18);
		}
		if(e.keyCode == downKey){
			marker[0][1]+=0.08;
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
		striker[0][0] += speedx;
		striker[0][1] += speedy;
		var i,j;
		for(i=0;i<9;i++){
			if(blackCoins[i][0] + bcoinspeedx[i] >= 2.05 || blackCoins[i][0] + bcoinspeedx[i] <= -2.05)
				bcoinspeedx[i] = -bcoinspeedx[i];
			if(blackCoins[i][1] + bcoinspeedy[i] >= 2.05 || blackCoins[i][1] + bcoinspeedy[i] <= -2.05)
				bcoinspeedy[i] = -bcoinspeedy[i];
			blackCoins[i][0] += bcoinspeedx[i];
			blackCoins[i][1] += bcoinspeedy[i];
			if(whiteCoins[i][0] + wcoinspeedx[i] >= 2.05 || whiteCoins[i][0] + wcoinspeedx[i] <= -2.05)
				wcoinspeedx[i] = -wcoinspeedx[i];
			if(whiteCoins[i][1] + wcoinspeedy[i] >= 2.05 || whiteCoins[i][1] + wcoinspeedy[i] <= -2.05)
				wcoinspeedy[i] = -wcoinspeedy[i];
			whiteCoins[i][0] += wcoinspeedx[i];
			whiteCoins[i][1] += wcoinspeedy[i];
		}
		for(i=0;i<9;i++){
			var x1 = striker[0][0];
			var y1 = striker[0][1];
			var x2 = blackCoins[i][0];
			var y2 = blackCoins[i][1];
			var dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
			if(dist<0.25){
				var angy = Math.PI/2.0 - Math.atan2(y2-y1,x2-x1);
				var angx = Math.atan2(y2-y1,x2-x1);
				bcoinspeedx[i]=Math.cos(angy)*Math.sin(angy)*speedy + Math.cos(angx)*Math.cos(angx)*speedx;
				bcoinspeedy[i]=Math.cos(angy)*Math.cos(angy)*speedy + Math.cos(angx)*Math.sin(angx)*speedx;
				speedx = -Math.cos(angy)*Math.sin(angy)*speedy - Math.cos(angx)*Math.cos(angx)*speedx;
				speedy = -Math.cos(angy)*Math.cos(angy)*speedy - Math.cos(angx)*Math.sin(angx)*speedx;
			}
			for(j=i+1;j<9;j++){
				x1 = blackCoins[j][0];
				y1 = blackCoins[j][1];
				dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
				if(dist<0.2){
					var angy = Math.PI/2.0 - Math.atan2(y2-y1,x2-x1);
					var angx = Math.atan2(y2-y1,x2-x1);
					bcoinspeedx[j] = Math.cos(angy)*Math.sin(angy)*bcoinspeedy[i] + Math.cos(angx)*Math.cos(angx)*bcoinspeedx[i];
					bcoinspeedy[j] = Math.cos(angy)*Math.cos(angy)*bcoinspeedy[i] + Math.cos(angx)*Math.sin(angx)*bcoinspeedx[i];
					bcoinspeedx[i] = -Math.cos(angy)*Math.sin(angy)*bcoinspeedy[i] - Math.cos(angx)*Math.cos(angx)*bcoinspeedx[i];
					bcoinspeedy[i] = -Math.cos(angy)*Math.cos(angy)*bcoinspeedy[i] - Math.cos(angx)*Math.sin(angx)*bcoinspeedx[i];
				}
			}
			for(j=0;j<9;j++){
				x1 = whiteCoins[j][0];
				y1 = whiteCoins[j][1];
				dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
				if(dist<0.23){
					var angy = Math.PI/2.0 - Math.atan2(y2-y1,x2-x1);
					var angx = Math.atan2(y2-y1,x2-x1);
					wcoinspeedx[j] = Math.cos(angy)*Math.sin(angy)*bcoinspeedy[i] + Math.cos(angx)*Math.cos(angx)*bcoinspeedx[i];
					wcoinspeedy[j] = Math.cos(angy)*Math.cos(angy)*bcoinspeedy[i] + Math.cos(angx)*Math.sin(angx)*bcoinspeedx[i];
					bcoinspeedx[i] = -Math.cos(angy)*Math.sin(angy)*bcoinspeedy[i] - Math.cos(angx)*Math.cos(angx)*bcoinspeedx[i];
					bcoinspeedy[i] = -Math.cos(angy)*Math.cos(angy)*bcoinspeedy[i] - Math.cos(angx)*Math.sin(angx)*bcoinspeedx[i];
				}
			}
		}
		for(i=0;i<9;i++){
			var x1 = striker[0][0];
			var y1 = striker[0][1];
			var x2 = whiteCoins[i][0];
			var y2 = whiteCoins[i][1];
			var dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
			if(dist<0.25){
				var angy = Math.PI/2.0 - Math.atan2(y2-y1,x2-x1);
				var angx = Math.atan2(y2-y1,x2-x1);
				wcoinspeedx[i]=Math.cos(angy)*Math.sin(angy)*speedy + Math.cos(angx)*Math.cos(angx)*speedx;
				wcoinspeedy[i]=Math.cos(angy)*Math.cos(angy)*speedy + Math.cos(angx)*Math.sin(angx)*speedx;
				speedx = -Math.cos(angy)*Math.sin(angy)*speedy - Math.cos(angx)*Math.cos(angx)*speedx;
				speedy = -Math.cos(angy)*Math.cos(angy)*speedy - Math.cos(angx)*Math.sin(angx)*speedx;
			}
			for(j=i+1;j<9;j++){
				x1 = whiteCoins[j][0];
				y1 = whiteCoins[j][1];
				dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
				if(dist<0.23){
					var angy = Math.PI/2.0 - Math.atan2(y2-y1,x2-x1);
					var angx = Math.atan2(y2-y1,x2-x1);
					wcoinspeedx[j] = Math.cos(angy)*Math.sin(angy)*wcoinspeedy[i] + Math.cos(angx)*Math.cos(angx)*wcoinspeedx[i];
					wcoinspeedy[j] = Math.cos(angy)*Math.cos(angy)*wcoinspeedy[i] + Math.cos(angx)*Math.sin(angx)*wcoinspeedx[i];
					wcoinspeedx[i] = -Math.cos(angy)*Math.sin(angy)*wcoinspeedy[i] - Math.cos(angx)*Math.cos(angx)*wcoinspeedx[i];
					wcoinspeedy[i] = -Math.cos(angy)*Math.cos(angy)*wcoinspeedy[i] - Math.cos(angx)*Math.sin(angx)*wcoinspeedx[i];
				}
			}/*
			for(j=0;j<9;j++){
				x1 = blackCoins[j][0];
				y1 = blackCoins[j][1];
				dist = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
				if(dist<0.23){
					var angy = Math.PI/2.0 - Math.atan2(y2-y1,x2-x1);
					var angx = Math.atan2(y2-y1,x2-x1);
					wcoinspeedx[j] = Math.cos(angy)*Math.sin(angy)*bcoinspeedy[i] + Math.cos(angx)*Math.cos(angx)*bcoinspeedx[i];
					wcoinspeedy[j] = Math.cos(angy)*Math.cos(angy)*bcoinspeedy[i] + Math.cos(angx)*Math.sin(angx)*bcoinspeedx[i];
					bcoinspeedx[i] = -Math.cos(angy)*Math.sin(angy)*bcoinspeedy[i] - Math.cos(angx)*Math.cos(angx)*bcoinspeedx[i];
					bcoinspeedy[i] = -Math.cos(angy)*Math.cos(angy)*bcoinspeedy[i] - Math.cos(angx)*Math.sin(angx)*bcoinspeedx[i];
				}
			}*/
		}
		speedx = 0.99*speedx;
		speedy = 0.99*speedy;
	}
}
