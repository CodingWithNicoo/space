const bubbles = document.getElementById("bubbles");
const fishCanvas = document.getElementById("fish");
const btx = bubbles.getContext("2d");
const ftx = fishCanvas.getContext("2d");

let w, h;
function resize() {
  w = bubbles.width = fishCanvas.width = window.innerWidth;
  h = bubbles.height = fishCanvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Darker background on scroll
window.addEventListener("scroll", () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const factor = window.scrollY / maxScroll;
  const r = 110 - factor * 110;
  const g = 207 - factor * 207;
  const b = 251 - factor * 251 + 63;
  document.body.style.background = `rgb(${r},${g},${b})`;
});

// Bubble animation
let bubbleArray = [];
for (let i = 0; i < 40; i++) {
  bubbleArray.push({ x: Math.random() * w, y: h + Math.random() * h, r: Math.random()*4+2, s: Math.random()*1+0.5 });
}
function drawBubbles() {
  btx.clearRect(0,0,w,h);
  btx.fillStyle = "rgba(255,255,255,0.4)";
  bubbleArray.forEach(b => {
    b.y -= b.s;
    if (b.y < -10) b.y = h + 10;
    btx.beginPath();
    btx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    btx.fill();
  });
}

// Fish animation
class Fish {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = -50;
    this.y = Math.random() * h;
    this.speed = Math.random()*2+1;
    this.size = Math.random()*20+20;
  }
  draw() {
    this.x += this.speed;
    if (this.x > w+50) this.reset();
    ftx.fillStyle = "#ffcc66";
    ftx.beginPath();
    ftx.ellipse(this.x, this.y, this.size, this.size/2, 0, 0, Math.PI*2);
    ftx.fill();
    ftx.beginPath();
    ftx.moveTo(this.x - this.size, this.y);
    ftx.lineTo(this.x - this.size*1.6, this.y - this.size/3);
    ftx.lineTo(this.x - this.size*1.6, this.y + this.size/3);
    ftx.closePath();
    ftx.fill();
  }
}
let fishes = Array.from({length:6}, ()=>new Fish());

function drawFish() {
  ftx.clearRect(0,0,w,h);
  fishes.forEach(f => f.draw());
}

function animate() {
  drawBubbles();
  drawFish();
  requestAnimationFrame(animate);
}
animate();
