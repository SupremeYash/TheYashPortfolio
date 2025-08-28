const canvas = document.getElementById("stars-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
const numStars = 120;

// generate stars
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    color: Math.random() > 0.8 ? "#80dfff" : "white" // some cyan, mostly white
  });
}

// shooting star variables
let shootingStar = null;

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw each star
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = star.color;
    ctx.shadowColor = star.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    // move star
    star.x += star.vx;
    star.y += star.vy;
    if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
    if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
  }

  // constellation lines
  ctx.strokeStyle = "rgba(0, 255, 255, 0.25)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      let dx = stars[i].x - stars[j].x;
      let dy = stars[i].y - stars[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.stroke();
      }
    }
  }

  // shooting star
  if (shootingStar) {
    ctx.beginPath();
    ctx.moveTo(shootingStar.x, shootingStar.y);
    ctx.lineTo(shootingStar.x - shootingStar.length, shootingStar.y + shootingStar.length);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    shootingStar.x += shootingStar.vx;
    shootingStar.y += shootingStar.vy;
    shootingStar.life--;

    if (shootingStar.life <= 0) shootingStar = null;
  } else if (Math.random() < 0.002) {
    // occasionally spawn shooting star
    shootingStar = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      vx: -6,
      vy: 6,
      length: 80,
      life: 30
    };
  }

  requestAnimationFrame(drawStars);
}

drawStars();

// resize handling
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
