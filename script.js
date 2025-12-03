document.addEventListener("DOMContentLoaded",()=>{

  /* Música */
  const music=document.getElementById("music");
  const toggle=document.getElementById("musicToggle");

  toggle.onclick=()=>{
    if(music.paused){ music.play(); toggle.textContent="🔈"; }
    else{ music.pause(); toggle.textContent="🔊"; }
  };

  /* Partículas en botones y enlaces */
  document.querySelectorAll("a, button").forEach(el=>{
    el.addEventListener("click",e=>{
      for(let i=0;i<8;i++){
        const p=document.createElement("div");
        p.className="button-particle";
        p.style.left=e.clientX+"px";
        p.style.top=e.clientY+"px";
        document.body.appendChild(p);
        setTimeout(()=>p.remove(),600);
      }
    });
  });

  /* Movimiento de la medusa */
  const jelly=document.getElementById("jelly");
  let x=window.innerWidth/2;
  let y=window.innerHeight/2;
  let vx=1.2;
  let vy=1.4;

  function animateJelly(){
    x+=vx;
    y+=vy;

    if(x<0 || x>window.innerWidth-100) vx*=-1;
    if(y<0 || y>window.innerHeight-140) vy*=-1;

    jelly.style.left=x+"px";
    jelly.style.top=y+"px";

    requestAnimationFrame(animateJelly);
  }

  animateJelly();

});
