const canvas = document.getElementById("game");
const gl = canvas.getContext("webgl");

canvas.width = innerWidth;
canvas.height = innerHeight;

if (!gl) {
  alert("WebGL not supported");
}

// Clear screen
gl.clearColor(0.53, 0.81, 0.92, 1.0); // sky color
gl.clear(gl.COLOR_BUFFER_BIT);
