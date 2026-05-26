const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");
const form = document.querySelector(".contact-form");
const formNote = document.querySelector("[data-form-note]");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const canvas = document.querySelector("#ambient-canvas");
const ctx = canvas.getContext("2d");

if (window.lucide) {
  window.lucide.createIcons();
}

function setMenuState(isOpen) {
  navLinks.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
}

navToggle.addEventListener("click", () => {
  const isOpen = !navLinks.classList.contains("open");
  setMenuState(isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    setMenuState(false);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

document.addEventListener("click", (event) => {
  const clickedInsideMenu = navLinks.contains(event.target);
  const clickedToggle = navToggle.contains(event.target);
  if (!clickedInsideMenu && !clickedToggle) {
    setMenuState(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    setMenuState(false);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        if (entry.target.classList.contains("skill-row")) {
          entry.target.classList.add("is-visible");
        }
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal, .skill-row").forEach((element) => {
  revealObserver.observe(element);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Merci, votre message est pret a etre envoye.";
  form.reset();
});

const pointer = { x: 0.5, y: 0.5 };
const particles = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  particles.length = 0;
  const amount = Math.min(90, Math.floor(window.innerWidth / 18));
  for (let index = 0; index < amount; index += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.8 + 0.7,
      speed: Math.random() * 0.28 + 0.08,
      alpha: Math.random() * 0.42 + 0.12
    });
  }
}

function drawAmbient() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const glowX = pointer.x * window.innerWidth;
  const glowY = pointer.y * window.innerHeight;
  const gradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 430);
  gradient.addColorStop(0, "rgba(240, 48, 48, 0.16)");
  gradient.addColorStop(0.55, "rgba(64, 88, 96, 0.08)");
  gradient.addColorStop(1, "rgba(240, 48, 48, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += Math.sin((particle.y + particle.radius) * 0.012) * 0.22;

    if (particle.y < -10) {
      particle.y = window.innerHeight + 10;
      particle.x = Math.random() * window.innerWidth;
    }

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(240, 48, 48, ${particle.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(drawAmbient);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX / window.innerWidth;
  pointer.y = event.clientY / window.innerHeight;
});

resizeCanvas();
drawAmbient();
