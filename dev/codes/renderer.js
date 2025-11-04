const canvas = document.getElementById("game");
const gl = canvas.getContext("webgl");

canvas.width = innerWidth;
canvas.height = innerHeight;

if (!gl) {
  alert("Twoja przeglądarka nie obsługuje WebGL!");
}

// === Shadery (mini programy na karcie graficznej) ===

// Vertex shader (pozycja w przestrzeni 3D)
const vertexShaderSource = `
attribute vec3 position;
attribute vec3 color;
uniform mat4 matrix;
varying vec3 vColor;

void main() {
  vColor = color;
  gl_Position = matrix * vec4(position, 1.0);
}
`;

// Fragment shader (kolor piksela)
const fragmentShaderSource = `
precision mediump float;
varying vec3 vColor;
void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`;

// === Funkcja pomocnicza do tworzenia shaderów ===
function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

// === Tworzenie shaderów i programu ===
const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// === Dane sześcianu ===
const vertices = new Float32Array([
  // X, Y, Z,   R, G, B
  // Przód
  -1, -1,  1,  0.6, 0.3, 0.1,
   1, -1,  1,  0.6, 0.3, 0.1,
   1,  1,  1,  0.3, 1.0, 0.3,
  -1,  1,  1,  0.3, 1.0, 0.3,

  // Tył
  -1, -1, -1,  0.6, 0.3, 0.1,
   1, -1, -1,  0.6, 0.3, 0.1,
   1,  1, -1,  0.3, 1.0, 0.3,
  -1,  1, -1,  0.3, 1.0, 0.3,
]);

const indices = new Uint16Array([
  0,1,2, 0,2,3,  // front
  1,5,6, 1,6,2,  // right
  5,4,7, 5,7,6,  // back
  4,0,3, 4,3,7,  // left
  3,2,6, 3,6,7,  // top
  4,5,1, 4,1,0   // bottom
]);

// === Bufory ===
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// === Pozycja atrybutów ===
const positionLoc = gl.getAttribLocation(program, "position");
const colorLoc = gl.getAttribLocation(program, "color");

gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 24, 0);
gl.enableVertexAttribArray(positionLoc);

gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 24, 12);
gl.enableVertexAttribArray(colorLoc);

const matrixLoc = gl.getUniformLocation(program, "matrix");

// === Matryce (transformacje 3D) ===
function getProjection(angle, a, zMin, zMax) {
  const ang = Math.tan((angle * 0.5) * Math.PI / 180);
  return [
    0.5 / ang, 0, 0, 0,
    0, 0.5 * a / ang, 0, 0,
    0, 0, -(zMax + zMin) / (zMax - zMin), -1,
    0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
  ];
}

// === Animacja ===
let time = 0;

function draw() {
  time += 0.01;

  const proj = getProjection(40, canvas.width / canvas.height, 1, 100);
  const cos = Math.cos(time);
  const sin = Math.sin(time);

  const moveZ = -6;
  const matrix = new Float32Array([
    cos, 0, sin, 0,
    0,   1, 0,   0,
    -sin,0, cos, 0,
    0,   0, moveZ, 1
  ]);

  gl.uniformMatrix4fv(matrixLoc, false, proj.map((v, i) => matrix[i % 16] * v));

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.53, 0.81, 0.92, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(draw);
}

draw();
