// Improved script.js: smaller black fish, parallax bubbles, inactivity bubble boost + shark
const bubbles = document.getElementById("bubbles");
const fishCanvas = document.getElementById("fish");
const btx = bubbles.getContext("2d");
const ftx = fishCanvas.getContext("2d");

let w, h;
function resize() {
  w = bubbles.width = fishCanvas.width = window.innerWidth;
  h = bubbles.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Background darker on scroll
window.addEventListener("scroll", () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const factor = window.scrollY / maxScroll;
  const r = 110 - factor * 110;
  const g = 207 - factor * 207;
  const b = 251 - factor * 251 + 63;
  document.body.style.background = `rgb(${r},${g},${b})`;
});

// Bubble setup
let bubbleArray = [];
let baseBubbleCount = 40;
let extraBubbles = 0;

function createBubbles(count) {
  for (let i = 0; i < count; i++) {
    bubbleArray.push({
      x: Math.random() * w,
      y: h + Math.random() * h,
      r: Math.random() * 3 + 1,
      s: Math.random() * 0.7 + 0.3,
      depth: Math.random() * 2 // parallax depth
    });
  }
}
createBubbles(baseBubbleCount);

function drawBubbles() {
  btx.clearRect(0, 0, w, h);
  bubbleArray.forEach(b => {
    b.y -= b.s * (1 + b.depth * 0.3);
    if (b.y < -20) b.y = h + 20;
    btx.fillStyle = `rgba(255,255,255,${0.2 + b.depth * 0.2})`;
    btx.beginPath();
    btx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    btx.fill();
  });
}

// Fish animation (smaller & black)
class Fish {
  constructor() { this.reset(); }
  reset() {
    this.x = -50;
    this.y = Math.random() * h;
    this.speed = Math.random() * 1.5 + 0.7;
    this.size = Math.random() * 10 + 8;
  }
  draw() {
    this.x += this.speed;
    if (this.x > w + 50) this.reset();
    ftx.fillStyle = "black";
    ftx.beginPath();
    ftx.ellipse(this.x, this.y, this.size, this.size / 2, 0, 0, Math.PI * 2);
    ftx.fill();

    ftx.beginPath();
    ftx.moveTo(this.x - this.size, this.y);
    ftx.lineTo(this.x - this.size * 1.4, this.y - this.size / 3);
    ftx.lineTo(this.x - this.size * 1.4, this.y + this.size / 3);
    ftx.closePath();
    ftx.fill();
  }
}

let fishes = Array.from({ length: 6 }, () => new Fish());

// Shark
let shark = { active: false, x: -300, y: h * 0.4, speed: 4 };

function drawShark() {
  if (!shark.active) return;
  shark.x += shark.speed;
  if (shark.x > w + 300) shark.active = false;

  ftx.fillStyle = "#2b2b2b";
  ftx.beginPath();
  ftx.ellipse(shark.x, shark.y, 120, 40, 0, 0, Math.PI * 2);
  ftx.fill();

  ftx.beginPath();
  ftx.moveTo(shark.x - 120, shark.y);
  ftx.lineTo(shark.x - 170, shark.y - 40);
  ftx.lineTo(shark.x - 170, shark.y + 40);
  ftx.closePath();
  ftx.fill();
}

// Inactivity detection
let lastActivity = Date.now();
function resetInactivity() { lastActivity = Date.now(); }
window.addEventListener("mousemove", resetInactivity);
window.addEventListener("keydown", resetInactivity);
window.addEventListener("scroll", resetInactivity);

function checkInactivity() {
  let inactiveTime = Date.now() - lastActivity;

  if (inactiveTime > 5000) {
    if (extraBubbles < 80) {
      extraBubbles += 2;
      createBubbles(2);
    }
    if (!shark.active && inactiveTime > 8000) {
      shark.active = true;
      shark.x = -300;
      shark.y = h * (0.3 + Math.random() * 0.4);
    }
  }
}

function drawFish() {
  ftx.clearRect(0, 0, w, h);
  fishes.forEach(f => f.draw());
  drawShark();
}

function animate() {
  drawBubbles();
  drawFish();
  checkInactivity();
  requestAnimationFrame(animate);
}
animate();
