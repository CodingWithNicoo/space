// Enhanced script.js with realistic shark, multiple fish species, light rays, ambience, and ocean floor reveal
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

// Darker background on scroll + detect end of page for ocean floor
let oceanFloorVisible = false;
window.addEventListener("scroll", () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const factor = window.scrollY / maxScroll;
  const r = 110 - factor * 110;
  const g = 207 - factor * 110;
  const b = 251 - factor * 180;
  document.body.style.background = `rgb(${r},${g},${b})`;

  if (!oceanFloorVisible && factor > 0.98) {
    oceanFloorVisible = true;
  }
});

// Bubble + parallax
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
      depth: Math.random() * 2
    });
  }
}
createBubbles(baseBubbleCount);

function drawBubbles() {
  btx.clearRect(0, 0, w, h);
  bubbleArray.forEach(b => {
    b.y -= b.s * (1 + b.depth * 0.3);
    if (b.y < -20) b.y = h + 20;
    btx.fillStyle = `rgba(255,255,255,${0.15 + b.depth * 0.2})`;
    btx.beginPath();
    btx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    btx.fill();
  });
}

// Fish species (small, black, different shapes)
class Fish {
  constructor(type) {
    this.type = type;
    this.reset();
  }
  reset() {
    this.x = -50;
    this.y = Math.random() * h;
    this.speed = Math.random() * 1.8 + 0.8;
    this.size = Math.random() * 12 + 6;
  }
  draw() {
    this.x += this.speed;
    if (this.x > w + 50) this.reset();

    ftx.fillStyle = "black";

    if (this.type === 0) {
      // classic oval fish
      ftx.beginPath();
      ftx.ellipse(this.x, this.y, this.size, this.size / 2, 0, 0, Math.PI * 2);
      ftx.fill();
    }
    if (this.type === 1) {
      // triangle fish
      ftx.beginPath();
      ftx.moveTo(this.x, this.y);
      ftx.lineTo(this.x - this.size, this.y - this.size / 2);
      ftx.lineTo(this.x - this.size, this.y + this.size / 2);
      ftx.closePath();
      ftx.fill();
    }
    if (this.type === 2) {
      // long fish
      ftx.fillRect(this.x, this.y - 2, this.size * 1.5, 4);
    }

    // tail
    ftx.beginPath();
    ftx.moveTo(this.x - this.size, this.y);
    ftx.lineTo(this.x - this.size * 1.4, this.y - this.size / 3);
    ftx.lineTo(this.x - this.size * 1.4, this.y + this.size / 3);
    ftx.closePath();
    ftx.fill();
  }
}

let fishes = Array.from({ length: 12 }, () => new Fish(Math.floor(Math.random() * 3)));

// Light rays effect
function drawLightRays() {
  ftx.fillStyle = "rgba(255,255,255,0.03)";
  for (let i = 0; i < 5; i++) {
    ftx.beginPath();
    let x = (i * w) / 5 + Math.sin(Date.now() * 0.0003 + i) * 50;
    ftx.moveTo(x, 0);
    ftx.lineTo(x + 80, h);
    ftx.lineTo(x - 80, h);
    ftx.closePath();
    ftx.fill();
  }
}

// Shark (bigger, smoother)
let shark = { active: false, x: -300, y: h * 0.4, speed: 4 };

function drawShark() {
  if (!shark.active) return;
  shark.x += shark.speed;
  if (shark.x > w + 300) shark.active = false;

  ftx.fillStyle = "#1c1c1c";

  // body
  ftx.beginPath();
  ftx.ellipse(shark.x, shark.y, 150, 45, 0, 0, Math.PI * 2);
  ftx.fill();

  // tail
  ftx.beginPath();
  ftx.moveTo(shark.x - 150, shark.y);
  ftx.lineTo(shark.x - 200, shark.y - 50);
  ftx.lineTo(shark.x - 200, shark.y + 50);
  ftx.closePath();
  ftx.fill();

  // top fin
  ftx.beginPath();
  ftx.moveTo(shark.x - 20, shark.y - 45);
  ftx.lineTo(shark.x - 10, shark.y - 90);
  ftx.lineTo(shark.x + 10, shark.y - 45);
  ftx.closePath();
  ftx.fill();
}

// Inactivity system
let lastActivity = Date.now();
function resetInactivity() { lastActivity = Date.now(); }
window.addEventListener("mousemove", resetInactivity);
window.addEventListener("keydown", resetInactivity);
window.addEventListener("scroll", resetInactivity);

function checkInactivity() {
  let inactiveTime = Date.now() - lastActivity;

  if (inactiveTime > 5000) {
    if (extraBubbles < 100) {
      extraBubbles += 3;
      createBubbles(3);
    }
    if (!shark.active && inactiveTime > 9000) {
      shark.active = true;
      shark.x = -300;
      shark.y = h * (0.3 + Math.random() * 0.4);
    }
  }
}

// Ocean floor draw when reaching end
function drawOceanFloor() {
  if (!oceanFloorVisible) return;
  ftx.fillStyle = "#0b0b0b";
  ftx.fillRect(0, h - 80, w, 80);

  ftx.fillStyle = "#151515";
  for (let i = 0; i < 20; i++) {
    ftx.beginPath();
    ftx.arc(Math.random() * w, h - 20 - Math.random() * 50, Math.random() * 8 + 3, 0, Math.PI * 2);
    ftx.fill();
  }
}

function drawFish() {
  ftx.clearRect(0, 0, w, h);
  drawLightRays();
  fishes.forEach(f => f.draw());
  drawShark();
  drawOceanFloor();
}

function animate() {
  drawBubbles();
  drawFish();
  checkInactivity();
  requestAnimationFrame(animate);
}
animate();
