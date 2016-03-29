var canvas;
var gl;

var cubeVerticesBuffer;
var cubeVerticesTextureCoordBuffer;
var cubeVerticesIndexBuffer;
var cubeVerticesNormalBuffer;
var cubeRotation = 0.0;
var lastCubeUpdateTime = 0;

var coinVerticesBuffer;
var coinVerticesNormalBuffer;
var coinVerticesIndexBuffer;
var coinVerticesTextureCoordBuffer;

var borderImage, boardImage, coinImage, coinWhiteImage, coinRedImage, strikerImage, powerImage;
var borderTexture, boardTexture, coinTexture, coinWhiteTexture, coinRedTexture, strikerTexture, powerTexture ;

var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var vertexNormalAttribute;
var textureCoordAttribute;
var perspectiveMatrix;

var radius = 6.0;
var angle = 0.0;

var blackCoins = [];
var whiteCoins = [];
var redCoin = [];
var striker = [];
var marker = [];

var blackPocketed = [0,0,0,0,0,0,0,0,0];
var whitePocketed = [0,0,0,0,0,0,0,0,0];

var TOP_VIEW = 0;
var PLAYER_VIEW = 1;
var STRIKER_VIEW = 2;
var camera = TOP_VIEW;

var power = 0;
//
// start
//
// Called when the canvas is created to get the ball rolling.
//
function start() {
	canvas = document.getElementById("glcanvas");

	initWebGL(canvas);      // Initialize the GL context

	// Only continue if WebGL is available and working

	if (gl) {
		gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Clear to black, fully opaque
		gl.clearDepth(1.0);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
		// Initialize the shaders; this is where all the lighting for the
		// vertices and so forth is established.

		initShaders();

		// Here's where we call the routine that builds all the objects
		// we'll be drawing.

		initBuffersForCube();
		initBuffersForCoin();

		// Next, load and set up the textures we'll be using.

		initTextures();

		// Set up to draw the scene periodically.

		var i;
		for(i=0;i<6;i++){
			var ang = (360.0/6)*i*Math.PI/180.0;
			blackCoins.push([0.5*Math.sin(ang),0.5*Math.cos(ang)]);
		}
		for(i=0;i<3;i++){
			var ang = ((360.0/3)*i+30)*Math.PI/180.0;
			blackCoins.push([0.3*Math.sin(ang),0.3*Math.cos(ang)]);
		}

		for(i=0;i<6;i++){
			var ang = ((360.0/6)*i+30)*Math.PI/180.0;
			whiteCoins.push([0.5*Math.sin(ang),0.5*Math.cos(ang)]);
		}
		for(i=0;i<3;i++){
			var ang = ((360.0/3)*i+90)*Math.PI/180.0;
			whiteCoins.push([0.25*Math.sin(ang),0.25*Math.cos(ang)]);
		}
		redCoin.push([0,0]);
		striker.push([0,1.52]);
		marker.push([0,0]);
		setInterval(drawScene, 15);
	}
}

//
// initWebGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL() {
	gl = null;

	try {
		//gl = canvas.getContext("experimental-webgl",{premultipliedAlpha:false});
		gl = canvas.getContext("experimental-webgl");
	}
	catch(e) {
	}

	// If we don't have a GL context, give up now

	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
	}
}

function initBuffersForCoin() {

	// Create a buffer for the cube's vertices.

	coinVerticesBuffer = gl.createBuffer();

	// Select the cubeVerticesBuffer as the one to apply vertex
	// operations to from here out.

	gl.bindBuffer(gl.ARRAY_BUFFER, coinVerticesBuffer);

	// Now create an array of vertices for the cube.

	var vertices = [
		//center
		0.0, 0.0, 0.0,
		];
	var i;
	var div = 30;
	var coinradius = 1;
	for(i=0;i<div;i++) {
		var ang = (360.0/30.0)*i*Math.PI/180.0;
		vertices.push(coinradius*Math.sin(ang),0.0, coinradius*Math.cos(ang));
	}
	for(i=0;i<div;i++) {
		var ang = (360.0/30.0)*i*Math.PI/180.0;
		vertices.push(coinradius*Math.sin(ang),-1.0, coinradius*Math.cos(ang));
	}
	for(i=0;i<div;i++) {
		var ang = (360.0/30.0)*i*Math.PI/180.0;
		vertices.push(coinradius*Math.sin(ang),0.0, coinradius*Math.cos(ang));
	}
	// Now pass the list of vertices into WebGL to build the shape. We
	// do this by creating a Float32Array from the JavaScript array,
	// then use it to fill the current vertex buffer.

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	// Set up the normals for the vertices, so that we can compute lighting.

	coinVerticesNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, coinVerticesNormalBuffer);

	var vertexNormals = [
		//center
		0.0, 1.0, 0.0
		];
	for(i=0;i<div;i++) {
		vertexNormals.push(0.0,1.0,0.0);
	}
	for(i=0;i<div;i++) {
		vertexNormals.push(0.0,1.0,0.0);
	}
	for(i=0;i<div;i++) {
		vertexNormals.push(0.0,1.0,0.0);
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
			gl.STATIC_DRAW);

	// Map the texture onto the cube's faces.

	coinVerticesTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, coinVerticesTextureCoordBuffer);

	var textureCoordinates = [
		//center
		0.5, 0.5
			];
	for(i=0;i<div;i++) {
		var ang = (360.0/30.0)*i*Math.PI/180.0;
		textureCoordinates.push(0.5 + 0.5*Math.sin(ang), 0.5 + 0.5*Math.cos(ang));
	}
	for(i=0;i<div;i++) {
		var ang = (360.0/30.0)*i*Math.PI/180.0;
		//textureCoordinates.push(0.5 + 0.5*Math.sin(ang), 0.5 + 0.5*Math.cos(ang));
		textureCoordinates.push(1,1);
	}
	for(i=0;i<div;i++) {
		var ang = (360.0/30.0)*i*Math.PI/180.0;
		//textureCoordinates.push(0.5 + 0.5*Math.sin(ang), 0.5 + 0.5*Math.cos(ang));
		textureCoordinates.push(1,1);
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
			gl.STATIC_DRAW);

	// Build the element array buffer; this specifies the indices
	// into the vertex array for each face's vertices.

	coinVerticesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coinVerticesIndexBuffer);
	// This array defines each face as two triangles, using the
	// indices into the vertex array to specify each triangle's
	// position.

	var coinVertexIndices = [];
	for(i=1;i<div;i++){
		coinVertexIndices.push(0, i , i+1);
	}
	coinVertexIndices.push(0, div, 1);
	for(i=1;i<div;i++){
		coinVertexIndices.push(2*div+i, 2*div+i+1 , div+i);
		coinVertexIndices.push(2*div+i+1, div+i , div+i+1);
	}
	coinVertexIndices.push(3*div, 2*div+1, div+div);
	coinVertexIndices.push(2*div+1, div+div, div + 1);

			// Now send the element array to GL

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(coinVertexIndices), gl.STATIC_DRAW);
}
//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just have
// one object -- a simple two-dimensional cube.
//
function initBuffersForCube() {

	// Create a buffer for the cube's vertices.

	cubeVerticesBuffer = gl.createBuffer();

	// Select the cubeVerticesBuffer as the one to apply vertex
	// operations to from here out.

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);

	// Now create an array of vertices for the cube.

	var vertices = [
		// Front face
		-1.0, -1.0,  1.0,
		1.0, -1.0,  1.0,
		1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,

		// Back face
		-1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		1.0,  1.0, -1.0,
		1.0, -1.0, -1.0,

		// Top face
		-1.0,  1.0, -1.0,
		-1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,
		1.0,  1.0, -1.0,

		// Bottom face
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		1.0, -1.0,  1.0,
		-1.0, -1.0,  1.0,

		// Right face
		1.0, -1.0, -1.0,
		1.0,  1.0, -1.0,
		1.0,  1.0,  1.0,
		1.0, -1.0,  1.0,

		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		-1.0,  1.0, -1.0
			];

	// Now pass the list of vertices into WebGL to build the shape. We
	// do this by creating a Float32Array from the JavaScript array,
	// then use it to fill the current vertex buffer.

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	// Set up the normals for the vertices, so that we can compute lighting.

	cubeVerticesNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);

	var vertexNormals = [
		// Front
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,
		0.0,  0.0,  1.0,

		// Back
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,
		0.0,  0.0, -1.0,

		// Top
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,
		0.0,  1.0,  0.0,

		// Bottom
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,
		0.0, -1.0,  0.0,

		// Right
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,
		1.0,  0.0,  0.0,

		// Left
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0
			];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
			gl.STATIC_DRAW);

	// Map the texture onto the cube's faces.

	cubeVerticesTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);

	var textureCoordinates = [
		// Front
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Back
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Top
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Bottom
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Right
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Left
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0
			];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
			gl.STATIC_DRAW);

	// Build the element array buffer; this specifies the indices
	// into the vertex array for each face's vertices.

	cubeVerticesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

	// This array defines each face as two triangles, using the
	// indices into the vertex array to specify each triangle's
	// position.

	var cubeVertexIndices = [
		0,  1,  2,      0,  2,  3,    // front
		4,  5,  6,      4,  6,  7,    // back
		8,  9,  10,     8,  10, 11,   // top
		12, 13, 14,     12, 14, 15,   // bottom
		16, 17, 18,     16, 18, 19,   // right
		20, 21, 22,     20, 22, 23    // left
			];

			// Now send the element array to GL

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
}

//
// initTextures
//
// Initialize the textures we'll be using, then initiate a load of
// the texture images. The handleTextureLoaded() callback will finish
// the job; it gets called each time a texture finishes loading.
//
function initTextures() {
	borderTexture = gl.createTexture();
	borderImage = new Image();
	borderImage.onload = function() { handleTextureLoaded(borderImage, borderTexture); }
	borderImage.src = "res/images/sidebar-bar.png";
	
	boardTexture = gl.createTexture();
	boardImage = new Image();
	boardImage.onload = function() { handleTextureLoaded(boardImage, boardTexture); }
	boardImage.src = "res/images/boardfinal2.png";
	
	coinTexture = gl.createTexture();
	coinImage = new Image();
	coinImage.onload = function() { handleTextureLoaded(coinImage, coinTexture); }
	coinImage.src = "res/images/coin.png";
	
	coinWhiteTexture = gl.createTexture();
	coinWhiteImage = new Image();
	coinWhiteImage.onload = function() { handleTextureLoaded(coinWhiteImage, coinWhiteTexture); }
	coinWhiteImage.src = "res/images/coin-white.png";
	
	coinRedTexture = gl.createTexture();
	coinRedImage = new Image();
	coinRedImage.onload = function() { handleTextureLoaded(coinRedImage, coinRedTexture); }
	coinRedImage.src = "res/images/coin_red2.png";
	
	strikerTexture = gl.createTexture();
	strikerImage = new Image();
	strikerImage.onload = function() { handleTextureLoaded(strikerImage, strikerTexture); }
	strikerImage.src = "res/images/striker.png";
	
	powerTexture = gl.createTexture();
	powerImage = new Image();
	powerImage.onload = function() { handleTextureLoaded(powerImage, powerTexture); }
	powerImage.src = "res/images/greenBar.png";
}

function handleTextureLoaded(image, texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

//
// drawScene
//
// Draw the scene.
//
function drawScene() {
	// Clear the canvas before we start drawing on it.

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Establish the perspective with which we want to view the
	// scene. Our field of view is 45 degrees, with a width/height
	// ratio of 640:480, and we only want to see objects between 0.1 units
	// and 100 units away from the camera.

	perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

	// Set the drawing position to the "identity" point, which is
	// the center of the scene.

	update();
	loadIdentity();

	//var camPos = [0.1,radius*Math.cos(angle),radius*Math.sin(angle)];
//	angle = 120;
//	console.log(radius * Math.cos(angle*Math.PI/180.0));
	radius = 5;
	//angle = 0;
	switch(camera) {
		case TOP_VIEW:
			var camPos = [0,6,0.01];
			var target = [0,0,0];
			var up = [0,1,0];
			break;
		case PLAYER_VIEW:
			var camPos = [radius*Math.sin(angle*Math.PI/180.0),3,radius*Math.cos(angle*Math.PI/180.0)];
			var target = [0,0,0];
			var up = [0,1,0];
		/*	angle+=1;
			if(angle == 360)
				angle = 0;
			if(angle%90 ==	0)
				angle+=1;
		*/	break;
		case STRIKER_VIEW:
			var camPos = [striker[0][0], 0.2, striker[0][1]];
			var target = [striker[0][0], 0.04, striker[0][1]-0.5];
			var up = [0,1,0];
			break;
	}
	putCamera(camPos, target, up);
	// Now move the drawing position a bit to where we want to start
	// drawing the cube.


	// Save the current matrix, then rotate before we draw.
	mvPushMatrix();
	mvTranslate([0.0, -0.125, 0.0]);
	mvScale([2.25,0.1,2.25]);
	matrixSetup(boardTexture);
	mvPopMatrix();

	mvPushMatrix();
	mvTranslate([0.0, 0.0, 2.3]);
	mvScale([2.39,0.1,0.1]);
	matrixSetup(borderTexture);
	// Restore the original matrix
	mvPopMatrix();

	mvPushMatrix();
	mvTranslate([0.0, 0.0, -2.3]);
	mvScale([2.39,0.1,0.1]);
	matrixSetup(borderTexture);
	mvPopMatrix();

	mvPushMatrix();
	mvTranslate([2.3, 0.0, 0.0]);
	mvScale([0.1,0.1,2.39]);
	matrixSetup(borderTexture);
	mvPopMatrix();
	
	mvPushMatrix();
	mvTranslate([-2.3, 0.0, 0.0]);
	mvScale([0.1,0.1,2.39]);
	matrixSetup(borderTexture);
	mvPopMatrix();

	var i;
	for(i=0;i<9;i++){
		if(!blackPocketed[i]){
			mvPushMatrix();
			mvTranslate([blackCoins[i][0], 0.04, blackCoins[i][1] ]);
			mvScale([0.1,0.04,0.1]);
			matrixSetup2(coinTexture);
			mvPopMatrix();
		}
	}

	for(i=0;i<9;i++){
		if(!whitePocketed[i]){
			mvPushMatrix();
			mvTranslate([whiteCoins[i][0], 0.04, whiteCoins[i][1] ]);
			mvScale([0.1,0.04,0.1]);
			matrixSetup2(coinWhiteTexture);
			mvPopMatrix();
		}
	}

	mvPushMatrix();
	mvTranslate([redCoin[0][0], 0.04, redCoin[0][1]]);
	mvScale([0.1,0.04,0.1]);
	matrixSetup2(coinRedTexture);
	mvPopMatrix();

	mvPushMatrix();
	mvTranslate([striker[0][0], 0.04, striker[0][1]]);
	mvScale([0.135,0.04,0.135]);
	matrixSetup2(strikerTexture);
	mvPopMatrix();

	if(state == AIM_STATE || state == PWR_STATE) { 
		mvPushMatrix();
		mvTranslate([marker[0][0], 0.035, marker[0][1]]);
		mvScale([0.011,0.01,0.15]);
		matrixSetup(borderTexture);
		mvPopMatrix();


		mvPushMatrix();
		mvTranslate([marker[0][0], 0.035, marker[0][1]]);
		mvScale([0.15,0.01,0.011]);
		matrixSetup(borderTexture);
		mvPopMatrix();
	}
	loadIdentity();
	var camPos = [0.00,6,0.01];
	var target = [0,0,0];
	var up = [0,1,0];
	putCamera(camPos, target, up);

	var pos = 0;
	for(i=0;i<power+1;i++){
		mvPushMatrix();
		mvTranslate([2.5, 1, pos]);
		mvScale([0.11,0.1,0.05]);
		matrixSetup(powerTexture);
		mvPopMatrix();
		pos-=0.11;
	}


	var currentTime = (new Date).getTime();
	if (lastCubeUpdateTime) {
		var delta = currentTime - lastCubeUpdateTime;

		cubeRotation += (30 * delta) / 1000.0;
	}

	lastCubeUpdateTime = currentTime;
}

function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v) {
	var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	// make sure we don't divide by 0.
	if (length > 0.00001) {
		return [v[0] / length, v[1] / length, v[2] / length];
	} else {
		return [0, 0, 0];
	}
}

function makeLookAt(cameraPosition, target, up) {
	var zAxis = normalize(
			subtractVectors(cameraPosition, target));
	var xAxis = normalize(cross(up, zAxis));
	var yAxis = normalize(cross(zAxis, xAxis));	
	
	var r = Matrix.I(4);
	r.elements[0][0] = xAxis[0];
	r.elements[1][0] = xAxis[1];
	r.elements[2][0] = xAxis[2];
	r.elements[3][0] = 0;
	r.elements[0][1] = yAxis[0];
	r.elements[1][1] = yAxis[1];
	r.elements[2][1] = yAxis[2];
	r.elements[3][1] = 0;
	r.elements[0][2] = zAxis[0];
	r.elements[1][2] = zAxis[1];
	r.elements[2][2] = zAxis[2];
	r.elements[3][2] = 0;
	r.elements[0][3] = cameraPosition[0];
	r.elements[1][3] = cameraPosition[1];
	r.elements[2][3] = cameraPosition[2];
	r.elements[3][3] = 1;
	return r;
}

function putCamera(camPos, target, up) {

	//var camMatrix = makeLookAt(camPos[0], camPos[1], camPos[2], target[0], target[1], target[2], up[0], up[1], up[2]);
	var camMatrix = makeLookAt(camPos, target, up);
	var viewMatrix = makeInverse(camMatrix);
	multMatrix(viewMatrix);
}

function makeInverse(m) {
	var m00 = m.elements[0][0];
	var m01 = m.elements[0][1];
	var m02 = m.elements[0][2];
	var m03 = m.elements[0][3];
	var m10 = m.elements[1][0];
	var m11 = m.elements[1][1];
	var m12 = m.elements[1][2];
	var m13 = m.elements[1][3];
	var m20 = m.elements[2][0];
	var m21 = m.elements[2][1];
	var m22 = m.elements[2][2];
	var m23 = m.elements[2][3];
	var m30 = m.elements[3][0];
	var m31 = m.elements[3][1];
	var m32 = m.elements[3][2];
	var m33 = m.elements[3][3];
	var tmp_0  = m22 * m33;
	var tmp_1  = m32 * m23;
	var tmp_2  = m12 * m33;
	var tmp_3  = m32 * m13;
	var tmp_4  = m12 * m23;
	var tmp_5  = m22 * m13;
	var tmp_6  = m02 * m33;
	var tmp_7  = m32 * m03;
	var tmp_8  = m02 * m23;
	var tmp_9  = m22 * m03;
	var tmp_10 = m02 * m13;
	var tmp_11 = m12 * m03;
	var tmp_12 = m20 * m31;
	var tmp_13 = m30 * m21;
	var tmp_14 = m10 * m31;
	var tmp_15 = m30 * m11;
	var tmp_16 = m10 * m21;
	var tmp_17 = m20 * m11;
	var tmp_18 = m00 * m31;
	var tmp_19 = m30 * m01;
	var tmp_20 = m00 * m21;
	var tmp_21 = m20 * m01;
	var tmp_22 = m00 * m11;
	var tmp_23 = m10 * m01;

	var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
		(tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
	var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
		(tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
	var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
		(tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
	var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
		(tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

	var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

	var r = Matrix.I(4);
	r.elements[0][0] = d * t0;
	r.elements[0][1] =	  d * t1;
	r.elements[0][2] =	  d * t2;
	r.elements[0][3] =	  d * t3;
	r.elements[1][0] =	  d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
				  (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
	r.elements[1][1] =	  d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
				  (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
	r.elements[1][2] =	  d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
				  (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
	r.elements[1][3] =	  d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
				  (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
	r.elements[2][0] =	  d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
				  (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
	r.elements[2][1] =	  d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
				  (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
	r.elements[2][2] =	  d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
				  (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
	r.elements[2][3] =	  d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
				  (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
	r.elements[3][0] =	  d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
				  (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
	r.elements[3][1] =	  d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
				  (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
	r.elements[3][2] =	  d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
				  (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
	r.elements[3][3] =	  d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
				  (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
	return r;
}
function matrixSetup2(textureToUse){
	// Draw the cube by binding the array buffer to the cube's vertices
	// array, setting attributes, and pushing it to GL.

	gl.bindBuffer(gl.ARRAY_BUFFER, coinVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	// Set the texture coordinates attribute for the vertices.

	gl.bindBuffer(gl.ARRAY_BUFFER, coinVerticesTextureCoordBuffer);
	gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

	// Bind the normals buffer to the shader attribute.

	gl.bindBuffer(gl.ARRAY_BUFFER, coinVerticesNormalBuffer);
	gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

	// Specify the texture to map onto the faces.

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureToUse);
	gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

	// Draw the cube.

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coinVerticesIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, 270, gl.UNSIGNED_SHORT, 0);
}
function matrixSetup(textureToUse){
	// Draw the cube by binding the array buffer to the cube's vertices
	// array, setting attributes, and pushing it to GL.

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	// Set the texture coordinates attribute for the vertices.

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
	gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

	// Bind the normals buffer to the shader attribute.

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
	gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

	// Specify the texture to map onto the faces.

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureToUse);
	gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

	// Draw the cube.

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}
//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	// Create the shader program

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program.");
	}

	gl.useProgram(shaderProgram);

	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);

	textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(textureCoordAttribute);

	vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(vertexNormalAttribute);
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
	var shaderScript = document.getElementById(id);

	// Didn't find an element with the specified ID; abort.

	if (!shaderScript) {
		return null;
	}

	// Walk through the source element's children, building the
	// shader source string.

	var theSource = "";
	var currentChild = shaderScript.firstChild;

	while(currentChild) {
		if (currentChild.nodeType == 3) {
			theSource += currentChild.textContent;
		}

		currentChild = currentChild.nextSibling;
	}

	// Now figure out what type of shader script we have,
	// based on its MIME type.

	var shader;

	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;  // Unknown shader type
	}

	// Send the source to the shader object

	gl.shaderSource(shader, theSource);

	// Compile the shader program

	gl.compileShader(shader);

	// See if it compiled successfully

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

//
// Matrix utility functions
//

function loadIdentity() {
	mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
	mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
	multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function mvScale(v) {
	multMatrix(Matrix.Scale($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));

	var normalMatrix = mvMatrix.inverse();
	normalMatrix = normalMatrix.transpose();
	var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
	gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
}

var mvMatrixStack = [];

function mvPushMatrix(m) {
	if (m) {
		mvMatrixStack.push(m.dup());
		mvMatrix = m.dup();
	} else {
		mvMatrixStack.push(mvMatrix.dup());
	}
}

function mvPopMatrix() {
	if (!mvMatrixStack.length) {
		throw("Can't pop from an empty matrix stack.");
	}
	mvMatrix = mvMatrixStack.pop();
	return mvMatrix;
}

function mvRotate(angle, v) {
	var inRadians = angle * Math.PI / 180.0;
	var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
}
