let idleTime = 0;

function resetIdle() {
  idleTime = 0;
}

// Increment idle time every second
setInterval(() => {
  idleTime++;
  if (idleTime >= 10) { // 10 segundos de inactividad
    document.body.style.background = "radial-gradient(ellipse at bottom, #050505 0%, #111111 100%)";
  } else {
    document.body.style.background = "radial-gradient(ellipse at bottom, #050505 0%, #000000 100%)";
  }
}, 1000);

window.addEventListener('mousemove', resetIdle);
window.addEventListener('keydown', resetIdle);

// Parallax effect on scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelector('.stars').style.transform = `translateY(${scrollY * 0.2}px)`;
  document.querySelector('.stars2').style.transform = `translateY(${scrollY * 0.4}px)`;
  document.querySelector('.stars3').style.transform = `translateY(${scrollY * 0.6}px)`;
});
