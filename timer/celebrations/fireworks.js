//---- Fireworks -------------------------------------------------------
function createFirework(x, y, particle_lifetime = 1000) {
    const particles = 100;
    const colors = ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0000ff', '#8a2be2'];
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3; // Increased velocity for more spread
        const lifetime = particle_lifetime + Math.random() * 1000; // Particle lifetime

        const animation = particle.animate([
            { transform: 'scale(1) translate(0, 0)', opacity: 1 },
            { transform: `scale(0.5) translate(${Math.cos(angle) * velocity * lifetime / 16}px, ${Math.sin(angle) * velocity * lifetime / 16}px)`, opacity: 0 }
        ], {
            duration: lifetime,
            easing: 'cubic-bezier(0,0,0.2,1)',
        });

        animation.onfinish = () => particle.remove();
    }
}

function launchFirework() {
    const x = Math.random() * initial_width;
    const y = initial_height;

    const rocket = document.createElement('div');
    rocket.className = 'firework-rocket';
    rocket.style.position = 'fixed';
    rocket.style.left = x + 'px';
    rocket.style.top = y + 'px';
    rocket.style.width = '3px';
    rocket.style.height = '10px';
    rocket.style.backgroundColor = '#ffffff';
    document.body.appendChild(rocket);

    const animation = rocket.animate([
        { transform: 'translateY(0)' },
        { transform: `translateY(-${y * 0.7}px)` }
    ], {
        duration: 1000,
        easing: 'ease-out',
    });

    animation.onfinish = () => {
        rocket.remove();
        createFirework(x, y * 0.3);
    };
}

function launchMultipleFireworks() {
    let count = 0;
    const interval = setInterval(() => {
        launchFirework();
        count++;
        if (count >= 5) {
            clearInterval(interval);
        }
    }, 1000);
}
