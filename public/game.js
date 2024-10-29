const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

// Define player object
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 20,
  height: 20,
  speed: 5,
  dx: 0,
  dy: 0
};

// Collectibles setup
let collectibles = [];
let score = 0;

function createCollectibles() {
  for (let i = 0; i < 5; i++) {
    let collectible = {
      x: Math.random() * (canvas.width - 20),
      y: Math.random() * (canvas.height - 20),
      width: 10,
      height: 10
    };
    collectibles.push(collectible);
  }
}

function drawCollectibles() {
  collectibles.forEach(collectible => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
  });
}

// Draw player on the canvas
function drawPlayer() {
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Update player position and redraw
function updatePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // Handle canvas boundaries
  player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
  player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));

  // Check for collision with collectibles
  collectibles = collectibles.filter(collectible => {
    if (player.x < collectible.x + collectible.width &&
        player.x + player.width > collectible.x &&
        player.y < collectible.y + collectible.height &&
        player.height + player.y > collectible.y) {
      score += 10;  // Update score
      return false; // Collectible is collected
    }
    return true;
  });

  drawPlayer();
}

// Display score
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText("Score: " + score, 10, 20);
}

// Event listeners for keyboard movement
function keyDown(e) {
  if (e.key === 'ArrowRight' || e.key === 'Right') {
    player.dx = player.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
    player.dx = -player.speed;
  } else if (e.key === 'ArrowUp' || e.key === 'Up') {
    player.dy = -player.speed;
  } else if (e.key === 'ArrowDown' || e.key === 'Down') {
    player.dy = player.speed;
  }
}

function keyUp(e) {
  if (
    e.key === 'Right' || e.key === 'ArrowRight' ||
    e.key === 'Left' || e.key === 'ArrowLeft' ||
    e.key === 'Up' || e.key === 'ArrowUp' ||
    e.key === 'Down' || e.key === 'ArrowDown'
  ) {
    player.dx = 0;
    player.dy = 0;
  }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Initialize collectibles
createCollectibles();

// Game loop to keep updating the game frame
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  drawCollectibles();
  drawScore();
  requestAnimationFrame(update);
}

update();  // Start the game loop

