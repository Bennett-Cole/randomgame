// Auto-generated configuration values based on customization parameters
const FIRE_RATE = 300;
const ENEMY_SPEED = 2.5;
const SHIP_SPEED = 5;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let shield = 100;
let playerX = canvas.width / 2;
let lastShot = 0;

let projectiles = [];
let enemies = [];
let particles = [];
let stars = [];

// Populate Starfield
for(let i=0; i<40; i++) {
  stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*1.5+0.5, sp: Math.random()*1+0.2 });
}

// Track mouse positioning
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  playerX = Math.max(24, Math.min(canvas.width - 24, e.clientX - rect.left));
});

function gameLoop(now) {
  ctx.fillStyle = '#0a0b10';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Render Starfield
  ctx.fillStyle = '#ffffff';
  stars.forEach(star => {
    star.y += star.sp;
    if(star.y > canvas.height) { star.y = 0; star.x = Math.random()*canvas.width; }
    ctx.fillRect(star.x, star.y, star.s, star.s);
  });

  // Handle Laser Fire
  if(now - lastShot > FIRE_RATE) {
    projectiles.push({ x: playerX, y: canvas.height - 40 });
    lastShot = now;
  }

  // Update Projectiles
  ctx.fillStyle = '#34a853';
  projectiles = projectiles.filter(p => {
    p.y -= 7;
    ctx.fillRect(p.x - 2, p.y, 4, 12);
    return p.y > 0;
  });

  // Spawn enemy targets
  if(Math.random() < 0.035) {
    enemies.push({ x: Math.random()*(canvas.width-40)+20, y: -20, r: Math.random()*10+10, sp: (Math.random()*1.2+0.8)*ENEMY_SPEED });
  }

  // Update Enemies
  enemies = enemies.filter(e => {
    e.y += e.sp;
    
    // Draw Enemy
    ctx.fillStyle = '#ff4365';
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI*2);
    ctx.fill();

    // Check collision with player
    if(e.y > canvas.height - 45 && e.y < canvas.height - 15 && Math.abs(e.x - playerX) < e.r + 20) {
      shield = Math.max(0, shield - 20);
      document.getElementById('shield-val').innerText = shield;
      return false;
    }
    return e.y < canvas.height + 20;
  });

  // Draw Player
  ctx.fillStyle = '#00f0ff';
  ctx.beginPath();
  ctx.moveTo(playerX, canvas.height - 40);
  ctx.lineTo(playerX - 18, canvas.height - 15);
  ctx.lineTo(playerX + 18, canvas.height - 15);
  ctx.closePath();
  ctx.fill();

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
