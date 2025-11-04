const canvas = document.getElementById("game");
const gl = canvas.getContext("webgl");

canvas.width = innerWidth;
canvas.height = innerHeight;

if(!gl){
  alert("WebGL not supported!")
}
