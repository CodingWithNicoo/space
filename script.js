const canvas = document.getElementById('leavesCanvas');
const ctx = canvas.getContext('2d');

let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

// Colores y hojas
const colors = ['#d67d3d','#c88651','#e8b34a','#b85b32','#7d402b'];
const leaves = [];
const leafCount = 60;

for(let i=0;i<leafCount;i++){
  leaves.push({
    x: Math.random()*W,
    y: Math.random()*H,
    size: 20 + Math.random()*30,
    speed: 1 + Math.random()*2,
    angle: Math.random()*Math.PI*2,
    swing: 0.01 + Math.random()*0.03,
    color: colors[Math.floor(Math.random()*colors.length)],
    rotation: Math.random()*360,
    rotationSpeed: 0.5 + Math.random()*1
  });
}

let mouseX = W/2;
let mouseY = H/2;

window.addEventListener('mousemove', (e)=>{
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function drawLeaves(){
  ctx.clearRect(0,0,W,H);
  leaves.forEach((leaf,i)=>{
    // Movimiento y parallax según scroll
    const scrollFactor = window.scrollY * 0.0005 * (i%5+1);
    leaf.y += leaf.speed + scrollFactor;
    leaf.x += Math.sin(leaf.angle)*2 + (mouseX-W/2)*0.0005;
    leaf.angle += leaf.swing;
    leaf.rotation += leaf.rotationSpeed;

    if(leaf.y>H) leaf.y=-leaf.size;
    if(leaf.x>W) leaf.x=0;
    if(leaf.x<0) leaf.x=W;

    ctx.save();
    ctx.translate(leaf.x,leaf.y);
    ctx.rotate(leaf.rotation*Math.PI/180);
    ctx.fillStyle = leaf.color;
    ctx.beginPath();
    ctx.ellipse(0,0,leaf.size*0.5,leaf.size*0.7,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  });
  requestAnimationFrame(drawLeaves);
}

drawLeaves();

// Ajustar canvas al resize
window.addEventListener('resize', ()=>{
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
});
