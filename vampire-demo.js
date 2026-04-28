// 吸血鬼爬行者仿制核心演示
const player = {
  x: 8,
  y: 8,
  hp: 100,
  maxHp: 100,
  exp: 0,
  level: 1,
  dir: 0 // 0上1右2下3左
};
const mapSize = 16;
const tileSize = 28;
const enemies = [];

function createCanvas() {
  const c = document.createElement('canvas');
  c.width = c.height = mapSize * tileSize;
  c.style.background = '#222';
  c.style.display = 'block';
  c.style.margin = '24px auto';
  c.id = 'game-canvas';
  document.querySelector('.container').appendChild(c);
  return c;
}

function draw() {
  const c = document.getElementById('game-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);
  // 地图格子
  for(let i=0;i<mapSize;i++){
    for(let j=0;j<mapSize;j++){
      ctx.strokeStyle = '#333';
      ctx.strokeRect(i*tileSize,j*tileSize,tileSize,tileSize);
    }
  }
  // 玩家
  ctx.fillStyle = '#ffe066';
  ctx.fillRect(player.x*tileSize+4,player.y*tileSize+4,tileSize-8,tileSize-8);
  // 敌人
  ctx.fillStyle = '#e66';
  enemies.forEach(e=>{
    ctx.beginPath();
    ctx.arc(e.x*tileSize+tileSize/2,e.y*tileSize+tileSize/2,10,0,2*Math.PI);
    ctx.fill();
  });
}

function movePlayer(dx,dy) {
  player.x = Math.max(0,Math.min(mapSize-1,player.x+dx));
  player.y = Math.max(0,Math.min(mapSize-1,player.y+dy));
  draw();
}

function spawnEnemy() {
  enemies.push({x:Math.floor(Math.random()*mapSize),y:Math.floor(Math.random()*mapSize)});
}

function setupControls() {
  window.addEventListener('keydown',e=>{
    if(e.key==='w') movePlayer(0,-1);
    if(e.key==='s') movePlayer(0,1);
    if(e.key==='a') movePlayer(-1,0);
    if(e.key==='d') movePlayer(1,0);
  });
}

window.addEventListener('DOMContentLoaded',()=>{
  createCanvas();
  draw();
  setupControls();
  setInterval(spawnEnemy, 3000);
});
