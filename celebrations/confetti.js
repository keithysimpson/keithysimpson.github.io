//---- Confetti -------------------------------------------------------
function createConfetti() {
    const confettiCount = 100;
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { transform: `translate(0, 0) rotate(0)`, opacity: 1 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${initial_height}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 8000,
            easing: 'cubic-bezier(0,0,0.2,1)',
        });

        animation.onfinish = () => confetti.remove();
    }
}