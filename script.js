const canvas = document.getElementById('leavesCanvas');
const ctx = canvas.getContext('2d');

let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

// Crear hojas
const colors = ['#d67d3d', '#c88651', '#e8b34a', '#b85b32', '#7d402b'];
const leaves = [];

for(let i=0; i<50; i++){
  leaves.push({
    x: Math.random()*W,
    y: Math.random()*H,
    size: 20 + Math.random()*30,
    speed: 1 + Math.random()*2,
    angle: Math.random()*360,
    color: colors[Math.floor(Math.random()*colors.length)],
    swing: Math.random()*0.05
  });
}

// Animación hojas
function drawLeaves() {
  ctx.clearRect(0, 0, W, H);
  leaves.forEach(leaf => {
    leaf.y += leaf.speed;
    leaf.x += Math.sin(leaf.angle)*2;
    leaf.angle += leaf.swing;

    if(leaf.y > H) leaf.y = -leaf.size;
    if(leaf.x > W) leaf.x = 0;
    if(leaf.x < 0) leaf.x = W;

    ctx.fillStyle = leaf.color;
    ctx.beginPath();
    ctx.ellipse(leaf.x, leaf.y, leaf.size*0.5, leaf.size*0.7, leaf.angle, 0, Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(drawLeaves);
}

drawLeaves();

// Parallax efecto scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  leaves.forEach((leaf, i) => {
    leaf.y += scrollY * (i%5)*0.002; // Diferente velocidad por hoja
  });
});

// Ajustar canvas al resize
window.addEventListener('resize', () => {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
});
