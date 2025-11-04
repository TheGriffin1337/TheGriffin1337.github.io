const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const TILE_SIZE = 40;
const world = [
  [1, 1, 1, 1],
  [1, 0, 0, 1],
  [1, 0, 2, 1],
  [1, 1, 1, 1],
];

function drawBlock(x, y, type) {
  if (type === 0) return; // air
  ctx.fillStyle = type === 1 ? "#8B4513" : "#228B22"; // brown for dirt, green for grass
  ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawWorld() {
  for (let y = 0; y < world.length; y++) {
    for (let x = 0; x < world[y].length; x++) {
      drawBlock(x, y, world[y][x]);
    }
  }
}

drawWorld();
