// ColoredPoints.js (c) 2012 Matsuda
// Vertex Shader Program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
    }`

var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`

// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL () {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL() {
    // Initialize Shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    // Get the storage location of u_FragColor variable
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }
    // Get the storage location of u_Size variable
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const DRAGOFF = 0;
const DRAGON = 1;

// Globals related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10.0;
let g_selectedType=POINT;
let g_drag = DRAGOFF;

// Set up actions for the HTML UI elements
function addActionsForHTMLUI() {

    // Button Events (Shape Type)
    document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
    document.getElementById('clearButton').onclick = function() { g_shapesList = []; clearAllTimeouts(); renderAllShapes(); };

    document.getElementById('pointButton').onclick = function() { g_selectedType=POINT; };
    document.getElementById('triButton').onclick = function() { g_selectedType=TRIANGLE; };
    document.getElementById('circleButton').onclick = function() { g_selectedType=CIRCLE; };

    //document.getElementById('brushButton').onclick = function() { g_drag=DRAGON; g_selectedType=CIRCLE };

    // Slider Events
    //document.getElementById('opacitySlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });

    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
}

function main() {

    // Set up canvas and gl variables
    setupWebGL();
    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();
    // Set up actions for the HTML UI elements
    addActionsForHTMLUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

    // Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

let lastPosition;
var g_shapesList = [];

function click(ev) {

    // Extract the event click and return it to WebGL coordinates
    [x,y] = convertCoordinatesEventToGL(ev);

    let point;
    if (g_selectedType==POINT) {
        point = new Point();
    } else if (g_selectedType==TRIANGLE) {
        point = new Triangle();
    } else if (g_selectedType==CIRCLE) {
        point = new Circle();
    }
    point.position=[x,y];
    point.color=g_selectedColor.slice();
    point.size=g_selectedSize;

    // // connect circles for brush, gave up on this method
    // if (g_drag == DRAGON) {
    //     if (lastPosition) {
    //         let xdiff = x - lastPosition[0];
    //         let ydiff = y - lastPosition[1];
    //         let distance = Math.sqrt(xdiff ** 2 + ydiff ** 2);
    //         if (distance > 0.10) {
    //             let fillFrequency = Math.floor(distance / 0.01Z);
    //             let interpolatedX = x;
    //             let interpolatedY = y;
    //             console.log("xdiff: " + xdiff);
    //             console.log("ydiff: " + ydiff);
    //             console.log("fill: " + fillFrequency);
    //             for (var i = 1; i <= fillFrequency; i++) {
    //                 let interpolatedPoint = new Circle();
    //                 // set the xy of the circle between the two circles
    //                 interpolatedX = interpolatedX + (xdiff / fillFrequency);
    //                 interpolatedY = interpolatedY + (ydiff / fillFrequency);

    //                 // add the new circle to g_shapesList
    //                 interpolatedPoint.position = [interpolatedX, interpolatedY];
    //                 interpolatedPoint.color=g_selectedColor.slice();
    //                 interpolatedPoint.size = g_selectedSize;
    //                 g_shapesList.push(interpolatedPoint);
    //             }
    //         }
    //     }
    // }

    g_shapesList.push(point);

    // lastPosition = point.position;

    // Draw every shape that is supposed to be in the canvas
    renderAllShapes();
}

// Extract the event click and return it to WebGL coordinates
function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // the x coordinate of a mouse pointer
    var y = ev.clientY; // the y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x,y]);
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {

    // Check the time at the start of this function
    var startTime = performance.now();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // var len = g_points.length;
    var len = g_shapesList.length;

    // Draw each shape in the list
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }

    // Check the time at the end of the function, and show on web page
    var duration = performance.now() - startTime;
    sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}

// Send the text of a HTML element
function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlID) {
        console.log('Failed to get ' + htmlID + ' from HTML');
        return;
    }
    htmlElm.innerHTML = text;
}