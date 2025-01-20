let timers = [];
// Clears the canvas and draws UFO picture
function drawUFOPicture() {
    // clears canvas first
    gl.clear(gl.COLOR_BUFFER_BIT);
    g_shapesList = [];
    clearAllTimeouts();

    for (let i = 0; i < 138; i++) {
        travelTimeLapse(i);
    }
}

function travelTimeLapse(i) {
    const timerID = setTimeout(function() {
        drawStarlessSky();
        drawNewStars();
        drawUFO();
    }, 50 * i);

    timers.push(timerID);
}

function drawAnimatedUFOPicture() {
    // clears canvas first
    gl.clear(gl.COLOR_BUFFER_BIT);
    g_shapesList = [];
    clearAllTimeouts();

    setStars();
    for (let i = 0; i < 138; i++) {
        timeLapse(i);
    }

    drawSky();
    drawUFO();
    drawLight([0, 0.5], size, 1);
    drawGround();
}

function timeLapse(i) {
    const timerID = setTimeout(function() {
        drawSky();
        if (i % 20 == 0) {
            var y = Math.random();
        }
        if (i % 20 == 0 || i % 21 == 0 || i % 22 == 0 || i % 23 == 0 || i % 24 == 0) {
            drawShootingStar(y, 0.5 * (i % 20));
        }
        drawUFO();
        drawLight([0, 0.5], size, 1 - (0.0025 * i));
        drawGround();
        let bottom = 0.45 - (0.5 * 60.0 / 200.0);
        if (-0.35 + (0.005 * i) < bottom) {
            drawHuman([0, -0.35 + (0.005 * i)]);
        }
    }, 50 * i);

    timers.push(timerID);
}

function clearAllTimeouts() {
    timers.forEach(timeoutId => clearTimeout(timeoutId));
    timers = [];
}

function drawShootingStar(y, xMove) {
    var rgba = [176/255, 251/255, 254/255, 1.0];
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    var x = 1.0 - xMove;
    var x2 = x - 0.25;
    var vertices = [x, y, x2, y];
    var size = 2;

    // Pass the size of a point to u_Size variable
    gl.uniform1f(u_Size, size);
    
    var n = 2; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Draw a line
    gl.drawArrays(gl.LINES, 0, 2);
}

function drawStarlessSky() {
    // set color of base
    var rgba = [8/255, 21/255, 63/255, 1.0];
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // draw triangle sky
    drawTriangle( [-1.0, -1.0, -1.0, 1.0, 1.0, 1.0 ] );
    drawTriangle( [1.0, -1.0, -1.0, -1.0, 1.0, 1.0 ] );
}

function drawSky() {
    // set color of base
    var rgba = [8/255, 21/255, 63/255, 1.0];
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // draw triangle sky
    drawTriangle( [-1.0, -1.0, -1.0, 1.0, 1.0, 1.0 ] );
    drawTriangle( [1.0, -1.0, -1.0, -1.0, 1.0, 1.0 ] );

    drawStars();
}

var starPositions = [];
var starSizes = [];

function drawNewStars() {
    var rgba = [176/255, 251/255, 254/255, 1.0];
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Quit using the buffer to send the attribute
    gl.disableVertexAttribArray(a_Position);

    for (var starCount = 0; starCount < 100; starCount++) {
        var x = Math.random();
        var y = Math.random();
        if (starCount % 4 == 0) {
            x = -x;
            y = -y;
        } else if (starCount % 3 == 0) {
            y = -y;
        } else if (starCount % 2 == 0) {
            x = -x;
        }
        var xy = [x, y];
        var size = Math.random() * 1;
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

        // Pass the size of a point to u_Size variable
        gl.uniform1f(u_Size, size);

        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

function setStars() {
    for (var starCount = 0; starCount < 100; starCount++) {
        var x = Math.random();
        var y = Math.random();
        if (starCount % 4 == 0) {
            x = -x;
            y = -y;
        } else if (starCount % 3 == 0) {
            y = -y;
        } else if (starCount % 2 == 0) {
            x = -x;
        }
        starPositions.push([x, y]); // Store position
        starSizes.push(Math.random() * 1); // Store size
    }
}

function drawStars() {
    var rgba = [176/255, 251/255, 254/255, 1.0];
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Quit using the buffer to send the attribute
    gl.disableVertexAttribArray(a_Position);

    for (var i = 0; i < starPositions.length; i++) {
        var xy = starPositions[i];
        var size = starSizes[i];

        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

        // Pass the size of a point to u_Size variable
        gl.uniform1f(u_Size, size);

        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

function drawUFO() {
    // centering and sizing the UFO
    size = 60.0/200.0; // sizes the UFO, also the radius
    center = [0, 0.5];

    // drawing each part of the UFO
    drawHalfCircle(center, size);
    drawUFObase(center, size);
    drawUnderSide(center, size);
}

function drawHalfCircle(xy, size) {
    // Pass the position of a point to a_Position variable
    var rgba = [31/255, 146/255, 190/255, 1.0];
    var segments = 20;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Draw a point
    //gl.drawArrays(gl.POINTS, 0, 1);
    let angleStep=180/segments;
    for (var angle = 0; angle < 180; angle=angle+angleStep) {
        let centerPt= [xy[0], xy[1]];
        let angle1=angle;
        let angle2=angle+angleStep;
        let vec1=[Math.cos(angle1*Math.PI/180)*size, Math.sin(angle1*Math.PI/180)*size/1.6];
        let vec2=[Math.cos(angle2*Math.PI/180)*size, Math.sin(angle2*Math.PI/180)*size/1.6];
        let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
        let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
        drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
    }
}

function drawUFObase(xy, size) {
    // set color of base
    var rgba = [93/255, 68/255, 152/255, 1.0];
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    var edgeHeight = 0.33 * size;

    // draw triangle base
    drawTriangle( [xy[0] - size, xy[1], xy[0] - size, xy[1] - edgeHeight, xy[0] + size, xy[1]] );
    drawTriangle( [xy[0] + size, xy[1] - edgeHeight, xy[0] - size, xy[1] - edgeHeight, xy[0] + size, xy[1]] );
    drawTriangle( [xy[0] + size, xy[1] - edgeHeight, xy[0] + size + edgeHeight, xy[1] - edgeHeight, xy[0] + size, xy[1]] );
    drawTriangle( [xy[0] - size, xy[1], xy[0] - size, xy[1] - edgeHeight, xy[0] - size - edgeHeight, xy[1] - edgeHeight] );
}

function drawUnderSide(xy, size) {
    // set color of base
    var rgba = [48/255, 46/255, 88/255, 1.0];
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    var edgeHeight = 0.33 * size;
    var undersideHeight = 0.17 * size;

    // draw triangle underside
    drawTriangle( [xy[0] + size / 2, xy[1] - edgeHeight, xy[0] + size / 2, xy[1] - edgeHeight - undersideHeight, xy[0] - size / 2, xy[1] - edgeHeight - undersideHeight ] );
    drawTriangle( [xy[0] + size / 2, xy[1] - edgeHeight, xy[0] - size / 2, xy[1] - edgeHeight, xy[0] - size / 2, xy[1] - edgeHeight - undersideHeight ] );
    drawTriangle( [xy[0] - size - edgeHeight, xy[1] - edgeHeight, xy[0] - size / 2, xy[1] - edgeHeight, xy[0] - size / 2, xy[1] - edgeHeight - undersideHeight ] );
    drawTriangle( [xy[0] + size + edgeHeight, xy[1] - edgeHeight, xy[0] + size / 2, xy[1] - edgeHeight, xy[0] + size / 2, xy[1] - edgeHeight - undersideHeight ] );
}

function drawLight(xy, size, scalar) {
    // set color of base
    var rgba = [15/255, 249/255, 178/255, 1.0];
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    var edgeHeight = 0.33 * size;
    var undersideHeight = 0.17 * size
    var UFOheight = edgeHeight + undersideHeight;
    var airHeight = UFOheight + 4 * size;

    // draw triangle underside
    drawTriangle( [xy[0] + size / 2, xy[1] - airHeight, xy[0] + size / 2, xy[1] - UFOheight, xy[0] - size / 2, xy[1] - UFOheight ] );
    drawTriangle( [xy[0] + size / 2, xy[1] - airHeight, xy[0] + size / 2, xy[1] - UFOheight, xy[0] + size * 1.2 * scalar, xy[1] - airHeight ] );
    drawTriangle( [xy[0] - size / 2, xy[1] - airHeight, xy[0] + size / 2, xy[1] - airHeight, xy[0] - size / 2, xy[1] - UFOheight ] );
    drawTriangle( [xy[0] - size / 2, xy[1] - airHeight, xy[0] - size / 2, xy[1] - UFOheight, xy[0] - size * 1.2 * scalar, xy[1] - airHeight ] );
}

function drawHuman(center) {
    drawHumanBody(center);

    var headX = center[0] - 0.08;
    var headY = center[1];
    var headSize = 5.0 / 200.0;
    drawHumanHead([headX, headY], headSize);
}

function drawHumanBody(xy) {
    // set color of base
    var rgba = [0.0, 0.0, 0.0, 1.0];
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // draw triangle body
    drawTriangle( [xy[0] - 0.05, xy[1] + 0.025, xy[0] - 0.05, xy[1] - 0.025, xy[0] + 0.05, xy[1] + 0.025 ] );
    drawTriangle( [xy[0] + 0.05, xy[1] - 0.025, xy[0] - 0.05, xy[1] - 0.025, xy[0] + 0.05, xy[1] + 0.025 ] );

    // draw triangle arms
    var scale = 0.02;
    drawArms(xy, scale, 0.045, -0.04, 0); // right leg
    drawArms(xy, scale, 0.105, 0.06, 1); // left leg
    drawArms(xy, scale, -0.045, -0.045, 1); // right arm
    drawArms(xy, scale, -0.105, 0.06, 0); // left arm

}

function drawArms(xy, scale, x_translateValue, y_translateValue, reflectBool) {
    var rgba = [0.0, 0.0, 0.0, 1.0];
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // set points
    var triangle1 = [0.0, 0.0, 2.0, -2.0, 3.0, -1.0];
    var triangle2 = [0.0, 0.0, 1.0, 1.0, 3.0, -1.0]

    if (reflectBool == 1) {
        reflectX(triangle1);
        reflectX(triangle2);
    }

    for (var i = 0; i < 6; i++) {
        // resize
        triangle1[i] = triangle1[i] * scale;
        triangle2[i] = triangle2[i] * scale;
    }

    var x_translate = xy[0] + x_translateValue;
    var y_translate = xy[1] + y_translateValue;
    for (var i = 0; i < 6; i++) {
        // translate
        if (i % 2 == 0) { // if x
            triangle1[i] = triangle1[i] + x_translate;
            triangle2[i] = triangle2[i] + x_translate;
        } else { // if y
            triangle1[i] = triangle1[i] + y_translate;
            triangle2[i] = triangle2[i] + y_translate;
        }      
    }
    drawTriangle(triangle1);
    drawTriangle(triangle2);
}

function reflectX(xy) {
    for (var i = 0; i < 6; i++) {
        if (i % 2 == 0) { // if x
            xy[i] = xy[i] * -1; // reflect
        } else { // if y
        }      
    }
}

function drawHumanHead(xy, size) {
    var rgba = [0.0, 0.0, 0.0, 1.0];
    var segments = 20;
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    let angleStep=360/segments;
    for (var angle = 0; angle < 360; angle=angle+angleStep) {
        let centerPt= [xy[0], xy[1]];
        let angle1=angle;
        let angle2=angle+angleStep;
        let vec1=[Math.cos(angle1*Math.PI/180)*size, Math.sin(angle1*Math.PI/180)*size];
        let vec2=[Math.cos(angle2*Math.PI/180)*size, Math.sin(angle2*Math.PI/180)*size];
        let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
        let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
        drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
    }
}

function drawGround() {
    // set color of base
    var rgba = [0.0, 0.0, 0.0, 1.0];
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // draw triangle ground
    drawTriangle( [1.0, -0.6, 1.0, -1.0, -1.0, -1.0 ] );
    drawTriangle( [-1.0, -0.6, 1.0, -0.6, -1.0, -1.0 ] );

    // drawTree([0, -1.0], 0.25);
}

function drawTree(center, size) { // center is bottom middle of tree trunk, unfinished
    // set color of tree
    var rgba = [0/255, 0/255, 0/255, 1.0]; // change colors, or leave as black?
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // draw triangle trees
    drawTriangle( [center[0] - 0.25 * size, center[1], center[0] - 0.25 * size, center[1] + 0.5 * size, center[0] + 0.25 * size, center[1] + 0.5 * size ] ); // draw trunk
    drawTriangle( [center[0] + 0.25 * size, center[1], center[0] - 0.25 * size, center[1], center[0] + 0.25 * size, center[1] + 0.5 * size ] ); // draw trunk
    drawTriangle( [center[0] - 1.1 * size, center[1] + 0.5 * size, center[0] - 1.1 * size, center[1] + 0.5 * size, center[0], center[1] + 1.5 * size ] ); // draw bottom triangle
    // drawTriangle( [center[0], center[1], center[0], center[1], center[0], center[1] ] ); // draw middle triangle
    // drawTriangle( [center[0], center[1], center[0], center[1], center[0], center[1] ] ); // draw top triangle
    console.log([center[0] - 1.1 * size, center[1] + 0.5 * size, center[0] - 1.1 * size, center[1] + 0.5 * size, center[0], center[1] + 1.5 * size ]);
}