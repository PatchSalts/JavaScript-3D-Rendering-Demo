'use strict';

// Global variables that are set and used
// across the application
let gl;

// The programs
let progTexPhong;

// the textures
let texDemo;
let texKnight;
let texBench;
let texRain;
let texBuilding;

// VAOs for the objects
var objDemo = null;
var objKnight = null;
var objBench = null;
var objRain = null;
var objBuilding = null;

// variables for timing
var then = 0;
var deltaTime;

// Entry point to our application
function init() {
  // Retrieve the canvas
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) {
    console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
    return null;
  }

  // deal with keypresses
  window.addEventListener('keydown', gotKey, false);

  // Retrieve a WebGL context
  gl = canvas.getContext('webgl2', {alpha: false});
  if (!gl) {
    console.error(`There is no WebGL 2.0 context`);
    return null;
  }

  // Set the clear color to be black
  gl.clearColor(0.025, 0.05, 0.15, 1);

  // some GL initialization
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
  gl.depthFunc(gl.LEQUAL)
  gl.clearDepth(1.0)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // deal with keypress
  //window.addEventListener('keydown', gotKey ,false);

  // Read, compile, and link your shaders
  // TODO: Rename this.
  progTexPhong = initProgram('shaderVertTexPhong', 'shaderFragTexPhong');

  // create and bind your objects
  createShapes();

  // set up your textures
  setUpTextures();

  // set up your camera
  setUpCamera();

  // set up Phong parameters
  setUpPhong();

  // do a draw
  requestAnimationFrame(draw);
}

// Create a program with the appropriate vertex and fragment shaders
function initProgram(vertexid, fragmentid) {

  // set up the per-vertex program
  const vertexShader = getShader(vertexid);
  const fragmentShader = getShader(fragmentid);

  // Create a program
  let program = gl.createProgram();

  // Attach the shaders to this program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Could not initialize shaders');
  }

  // Use this program instance
  // TODO: Delete this?
  gl.useProgram(program);
  // We attach the location of these shader values to the program instance
  // for easy access later in the code
  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  program.aNormal = gl.getAttribLocation(program, 'aNormal');
  program.aUV = gl.getAttribLocation(program, 'aUV');

  // uniforms - you will need to add references for any additional
  // uniforms that you add to your shaders
  program.modelT = gl.getUniformLocation(program, 'modelT');
  program.viewT = gl.getUniformLocation(program, 'viewT');
  program.projT = gl.getUniformLocation(program, 'projT');
  program.lightPosition = gl.getUniformLocation(program, 'lightPosition');
  program.uTheTexture = gl.getUniformLocation(program, 'theTexture');
  program.ka = gl.getUniformLocation(program, 'ka');
  program.kd = gl.getUniformLocation(program, 'kd');
  program.ks = gl.getUniformLocation(program, 'ks');
  program.ke = gl.getUniformLocation(program, 'ke');
  program.ambientLight = gl.getUniformLocation(program, 'ambientLight');
  program.lightColor = gl.getUniformLocation(program, 'lightColor');
  program.specHighlightColor = gl.getUniformLocation(program, 'specHighlightColor');

  return program;
}

// Given an id, extract the content's of a shader script
// from the DOM and return the compiled shader
function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  // Assign shader depending on the type of shader
  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else {
    return null;
  }

  // Compile the shader using the supplied shader code
  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  // Ensure the shader is valid
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Compiling shader " + id + " " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

// general call to make and bind a new object based on current
// settings..Basically a call to shape specfic calls in cgIshape.js
function createShapes() {
  // the demo object
  objDemo = new OBJ(demo_verts, demo_norms, demo_uvs);
  objDemo.VAO = bindVAO(objDemo, progTexPhong);
  objDemo.translate = [0, 0, 0];
  objDemo.rotate = [0, 0, 0];
  objDemo.scale = [0.25, 0.25, 0.25];

  // Knight
  objKnight = new OBJ(knight_verts, knight_norms, knight_uvs);
  objKnight.VAO = bindVAO(objKnight, progTexPhong);
  objKnight.translate = [-2.5, 2.35, 0.15];
  objKnight.rotate = [0, 0, 0];
  objKnight.scale = [0.25, 0.25, 0.25];

  // Bench
  objBench = new OBJ(bench_verts, bench_norms, bench_uvs);
  objBench.VAO = bindVAO(objBench, progTexPhong);
  objBench.translate = [-2.5, 1.75, 0]
  objBench.rotate = [0, 0, 0]
  objBench.scale = [0.25, 0.25, 0.25]

  // Rain
  objRain = new OBJ(rain_verts, rain_norms, rain_uvs);
  objRain.VAO = bindVAO(objRain, progTexPhong);
  objRain.translate = [-100, 0, 2];
  objRain.rotate = [0, 0, 0];
  objRain.scale = [1, 1, 1];

  // Building
  objBuilding = new OBJ(building_verts, building_norms, building_uvs);
  objBuilding.VAO = bindVAO(objBuilding, progTexPhong);
  objBuilding.translate = [-2.5, 4, 0];
  objBuilding.rotate = [0, 0, 0];
  objBuilding.scale = [0.5, 0.333333333, 0.1];
}

//
// Creates a VAO for a given object and return it.
//
// shape is the object to be bound
// program is the program (vertex/fragment shaders) to use in this VAO
//
//
// Note that the program object has member variables that store the
// location of attributes and uniforms in the shaders.  See the function
// initProgram for details.
//
// You can see the definition of the shaders themselves in the
// HTML file assn6-shading.html.   Though there are 2 sets of shaders
// defined (one for per-vertex shading and one for per-fragment shading,
// each set does have the same list of attributes and uniforms that
// need to be set
//
function bindVAO(shape, program) {

  //create and bind VAO
  let theVAO = gl.createVertexArray();
  gl.bindVertexArray(theVAO);

  // create, bind, and fill buffer for vertex locations
  // vertex locations can be obtained from the points member of the
  // shape object.  3 floating point values (x,y,z) per vertex are
  // stored in this array.
  let myVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aVertexPosition);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

  // create, bind, and fill buffer for normal values
  // normals can be obtained from the normals member of the
  // shape object.  3 floating point values (x,y,z) per vertex are
  // stored in this array.
  let myNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, myNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.normals), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aNormal);
  gl.vertexAttribPointer(program.aNormal, 3, gl.FLOAT, false, 0, 0);

  // create, bind, and fill buffer for uv's
  // uvs can be obtained from the uv member of the
  // shape object.  2 floating point values (u,v) per vertex are
  // stored in this array.
  let uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.uv), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(program.aUV);
  gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, false, 0, 0);

  // Setting up element array
  // element indicies can be obtained from the indicies member of the
  // shape object.  3 values per triangle are stored in this
  // array.
  let myIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

  // Do cleanup
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return theVAO;
}

//
// load up the textures you will use in the shader(s)
// The setup for the globe texture is done for you
// Any additional images that you include will need to
// set up as well.
//
function setUpTextures() {
  // get some texture space from the gpu
  texDemo = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texDemo);
  // load the actual image
  var image = document.getElementById('texDemo')
  // bind the texture so we can perform operations on it
  gl.bindTexture(gl.TEXTURE_2D, texDemo);
  // load the texture data
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // set texturing parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  objDemo.texture = texDemo;

  // get some texture space from the gpu
  texKnight = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texKnight);
  // load the actual image
  var image = document.getElementById('texKnight')
  // bind the texture so we can perform operations on it
  gl.bindTexture(gl.TEXTURE_2D, texKnight);
  // load the texture data
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // set texturing parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  objKnight.texture = texKnight;

  // get some texture space from the gpu
  texBench = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texBench);
  // load the actual image
  var image = document.getElementById('texBench')
  // bind the texture so we can perform operations on it
  gl.bindTexture(gl.TEXTURE_2D, texBench);
  // load the texture data
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // set texturing parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  objBench.texture = texBench;

  // get some texture space from the gpu
  texRain = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texRain);
  // load the actual image
  var image = document.getElementById('texRain')
  // bind the texture so we can perform operations on it
  gl.bindTexture(gl.TEXTURE_2D, texRain);
  // load the texture data
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // set texturing parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  objRain.texture = texRain;

  // get some texture space from the gpu
  texBuilding = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texBuilding);
  // load the actual image
  var image = document.getElementById('texBuilding')
  // bind the texture so we can perform operations on it
  gl.bindTexture(gl.TEXTURE_2D, texBuilding);
  // load the texture data
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // set texturing parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  objBuilding.texture = texBuilding;
}

//
// Set up your camera and your projection matrices
//
function setUpCamera() {
    
  // set up your projection
  let projMatrix = glMatrix.mat4.create();
  glMatrix.mat4.perspective(projMatrix, radians(90), 16/9, 0.1, 300.0);
  gl.uniformMatrix4fv (progTexPhong.projT, false, projMatrix);

  // set up your view
  let viewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.lookAt(viewMatrix, [0, 3.5, 5], [0, 3.5, 0], [0, 1, 0]);
  gl.uniformMatrix4fv (progTexPhong.viewT, false, viewMatrix);
}

//
// In this function, you must set up all of the uniform variables
// in the shaders required for the implememtation of the Phong
// Illumination model.
//
// Check out the source of the vertex shader in the HTML file
// assn6-shading.html taking note of the types of each of the
// uniforms.
//
// Note that the program object has member variables that store the
// location of attributes and uniforms in the shaders.  See the function
// initProgram for details.
//
//
//  You should also set up your Model transform here.

function setUpPhong() {
    

  // Recall that you must set the program to be current using
  // the gl useProgram function
  gl.useProgram(progTexPhong);
  
  // set values for all your uniform variables
  // including the model transform
  // but not your view and projection transforms as
  // they are set in setUpCamera()
  gl.uniform3fv(progTexPhong.ambientLight, new Float32Array([0.8, 0.8, 1]));
  gl.uniform3fv(progTexPhong.lightPosition, new Float32Array([0, 10, -2]));
  gl.uniform3fv(progTexPhong.lightColor, new Float32Array([0.8, 0.8, 1]));
  gl.uniform3fv(progTexPhong.specHighlightColor, new Float32Array([0.8, 0.8, 1]));
  gl.uniform1f(progTexPhong.ka, 0.5);
  gl.uniform1f(progTexPhong.kd, 0.75);
  gl.uniform1f(progTexPhong.ks, 0.25);
  gl.uniform1f(progTexPhong.ke, 4);
  
  // set up your model transform...Add transformations
  // if you are moiving, scaling, or rotating the object.
  // Default is no transformations at all (identity matrix).
  //let modelMatrix = glMatrix.mat4.create();
  //gl.uniformMatrix4fv (program.uModelT, false, modelMatrix);
  
  
}

// We call draw to render to our canvas
function draw(now) {
  now *= 0.001;
  deltaTime = now - then;

  // Clear the scene
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // draw your shapes
  drawShapes(now);
  then = now;
  // Clean
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

//
// Draws the current shape with the
// current texture
//
function drawShapes(now) {

  // change vars for animation
  objRain.rotate[2] -= deltaTime*193

  // which program are we using
  var program = progTexPhong;

  // set up your uniform variables for drawing
  gl.useProgram(program);

  var opaqueObjects = [objBuilding, objBench, objKnight, objRain];
  for (let i = 0; i < opaqueObjects.length; i++) {
    // set up texture uniform & other uniforms that you might
    // have added to the shader
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, opaqueObjects[i].texture);
    gl.uniform1i(program.uTheTexture, 0);

    let modelMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(modelMatrix, modelMatrix, opaqueObjects[i].translate);
    glMatrix.mat4.rotateZ(modelMatrix, modelMatrix, radians(opaqueObjects[i].rotate[2]));
    glMatrix.mat4.rotateY(modelMatrix, modelMatrix, radians(opaqueObjects[i].rotate[1]));
    glMatrix.mat4.rotateX(modelMatrix, modelMatrix, radians(opaqueObjects[i].rotate[0]));
    glMatrix.mat4.scale(modelMatrix, modelMatrix, opaqueObjects[i].scale);

    gl.uniformMatrix4fv(program.modelT, false, modelMatrix);

    //Bind the VAO and draw
    gl.bindVertexArray(opaqueObjects[i].VAO);
    gl.drawElements(gl.TRIANGLES, opaqueObjects[i].indices.length, gl.UNSIGNED_SHORT, 0);
  }

  var transparentObjects = [];
  for (let i = 0; i < transparentObjects.length; i++) {
    // set up texture uniform & other uniforms that you might
    // have added to the shader
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, transparentObjects[i].texture);
    gl.uniform1i(program.uTheTexture, 0);

    let modelMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(modelMatrix, modelMatrix, transparentObjects[i].translate);
    glMatrix.mat4.rotateZ(modelMatrix, modelMatrix, radians(transparentObjects[i].rotate[2]));
    glMatrix.mat4.rotateY(modelMatrix, modelMatrix, radians(transparentObjects[i].rotate[1]));
    glMatrix.mat4.rotateX(modelMatrix, modelMatrix, radians(transparentObjects[i].rotate[0]));
    glMatrix.mat4.scale(modelMatrix, modelMatrix, transparentObjects[i].scale);

    gl.uniformMatrix4fv(program.modelT, false, modelMatrix);

    //Bind the VAO and draw
    gl.bindVertexArray(transparentObjects[i].VAO);
    gl.drawElements(gl.TRIANGLES, transparentObjects[i].indices.length, gl.UNSIGNED_SHORT, 0);
  }
  requestAnimationFrame(draw);
}