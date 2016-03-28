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
var state = STR_STATE;
window.onkeydown = function(e) {
	if(e.keyCode == enter) {
		if(state == STR_STATE)
			state = AIM_STATE;
		else if(state == AIM_STATE)
			state = PWR_STATE;
		else if(state == PWR_STATE){
			//Launch striker
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
}
