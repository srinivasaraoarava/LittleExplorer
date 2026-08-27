// ============================================================
// Little Explorer World — Landing page interactivity
// ============================================================

(function () {
  const colors = ['#ff6b6b','#ffd166','#06d6a0','#118ab2','#8b5cf6','#f472b6','#22d3ee','#fb923c'];

  function confettiBurst(x, y, count = 26) {
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = x + 'px';
      piece.style.top = y + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 180;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed - 120;
      const rot = (Math.random() * 720 - 360) + 'deg';
      const dur = 800 + Math.random() * 700;
      document.body.appendChild(piece);
      piece.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy + 240}px) rotate(${rot})`, opacity: 0 }
        ],
        { duration: dur, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
      );
      setTimeout(() => piece.remove(), dur + 50);
    }
  }

  // Confetti when card is hovered on-click
  document.querySelectorAll('.open-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      confettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 32);
    });
  });

  // Mascot click => confetti + rotate message
  const mascot = document.getElementById('mascot');
  const messages = [
    "You are a star! ⭐",
    "Curiosity is your superpower! 🦸",
    "Keep exploring! 🧭",
    "You're doing great! 🎉",
    "Dream big! ✨",
    "Learning is magical! 🪄"
  ];
  if (mascot) {
    mascot.addEventListener('click', () => {
      const rect = mascot.getBoundingClientRect();
      confettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
      const bubble = mascot.querySelector('.mascot-bubble');
      const next = messages[Math.floor(Math.random() * messages.length)];
      if (bubble) bubble.textContent = next;
    });
  }

  // Subtle parallax on cards
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-py * 4}deg) rotateY(${px * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
