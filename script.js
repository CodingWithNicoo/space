// Canvas setup
const bubbles = document.getElementById("bubbles");
const fishCanvas = document.getElementById("fish");
const btx = bubbles.getContext("2d");
const ftx = fishCanvas.getContext("2d");

let w, h;
function resize() {
  w = bubbles.width = fishCanvas.width = window.innerWidth;
  h = bubbles.height = window.innerHeight;
  ftx.imageSmoothingEnabled = true;
}
resize();
window.addEventListener("resize", resize);

/* ------------------------------------------
   Burbujas con PARALLAX
------------------------------------------- */
let bubbleArray = [];
function createBubbles(n) {
  for (let i = 0; i < n; i++) {
    bubbleArray.push({
      x: Math.random() * w,
      y: h + Math.random() * h,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 0.7 + 0.3,
      depth: Math.random() * 2
    });
  }
}
createBubbles(40);

function drawBubbles() {
  btx.clearRect(0, 0, w, h);
  bubbleArray.forEach(b => {
    b.y -= b.speed * (1 + b.depth * 0.5);
    if (b.y < -20) b.y = h + 20;

    btx.fillStyle = `rgba(255,255,255,${0.1 + b.depth * 0.2})`;
    btx.beginPath();
    btx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    btx.fill();
  });
}

/* ------------------------------------------
   PECES PEQUEÑOS, SUAVES Y NO PIXELADOS
------------------------------------------- */

class Fish {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = -20;
    this.y = Math.random() * h;
    this.speed = Math.random() * 1 + 0.5;
    this.size = Math.random() * 6 + 3;  // pequeño
  }
  draw() {
    this.x += this.speed;
    if (this.x > w + 20) this.reset();

    ftx.fillStyle = "black";

    // cuerpo elíptico suave
    ftx.beginPath();
    ftx.ellipse(this.x, this.y, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
    ftx.fill();

    // cola curva suave
    ftx.beginPath();
    ftx.moveTo(this.x - this.size, this.y);
    ftx.quadraticCurveTo(
      this.x - this.size * 1.4,
      this.y - this.size * 0.4,
      this.x - this.size * 1.8,
      this.y
    );
    ftx.quadraticCurveTo(
      this.x - this.size * 1.4,
      this.y + this.size * 0.4,
      this.x - this.size,
      this.y
    );
    ftx.fill();
  }
}

let fishes = Array.from({ length: 20 }, () => new Fish());

/* ------------------------------------------
   TIBURÓN POR INACTIVIDAD
------------------------------------------- */

let shark = {
  active: false,
  x: -300,
  y: h * 0.4,
  speed: 4
};

function drawShark() {
  if (!shark.active) return;

  shark.x += shark.speed;
  if (shark.x > w + 300) shark.active = false;

  ftx.fillStyle = "#1c1c1c";

  // cuerpo
  ftx.beginPath();
  ftx.ellipse(shark.x, shark.y, 150, 45, 0, 0, Math.PI * 2);
  ftx.fill();

  // cola
  ftx.beginPath();
  ftx.moveTo(shark.x - 150, shark.y);
  ftx.lineTo(shark.x - 200, shark.y - 50);
  ftx.lineTo(shark.x - 200, shark.y + 50);
  ftx.closePath();
  ftx.fill();

  // aleta superior
  ftx.beginPath();
  ftx.moveTo(shark.x - 20, shark.y - 45);
  ftx.lineTo(shark.x - 10, shark.y - 90);
  ftx.lineTo(shark.x + 10, shark.y - 45);
  ftx.closePath();
  ftx.fill();
}

/* ------------------------------------------
   DETECCIÓN DE INACTIVIDAD
------------------------------------------- */

let lastActivity = Date.now();
function resetInactivity() { lastActivity = Date.now(); }

window.addEventListener("mousemove", resetInactivity);
window.addEventListener("keydown", resetInactivity);
window.addEventListener("scroll", resetInactivity);

function checkInactivity() {
  let inactive = Date.now() - lastActivity;

  if (inactive > 5000) {
    createBubbles(2); // más burbujas
  }

  if (!shark.active && inactive > 9000) {
    shark.active = true;
    shark.x = -300;
    shark.y = h * (0.3 + Math.random() * 0.4);
  }
}

/* ------------------------------------------
   ANIMACIÓN PRINCIPAL
------------------------------------------- */

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
