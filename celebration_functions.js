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

//---- Ballons -------------------------------------------------------
function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = Math.random() * initial_width + 'px';
    balloon.style.top = initial_height + 'px';
    balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    document.body.appendChild(balloon);

    const animation = balloon.animate([
        { transform: 'translateY(0) rotate(0deg)' },
        { transform: `translateY(-${initial_height + 100}px) rotate(${Math.random() * 20 - 10}deg)` }
    ], {
        duration: 5000 + Math.random() * 5000,
        easing: 'ease-out'
    });

    animation.onfinish = () => balloon.remove();
}

function releaseBalloons() {
    const balloonCount = 20;
    let released = 0;
    const interval = setInterval(() => {
        createBalloon();
        released++;
        if (released >= balloonCount) {
            clearInterval(interval);
        }
    }, 200);
}

//---- Rainbow -------------------------------------------------------
function startRainbowEffect() {
    colorOverlay.style.display = 'block';
    colorOverlay.innerHTML = '';

    colors.forEach((color, index) => {
        const colorColumn = document.createElement('div');
        colorColumn.className = 'color-column';
        colorColumn.style.backgroundColor = color;
        colorColumn.style.left = `${(index * 100) / colors.length}%`;
        colorOverlay.appendChild(colorColumn);

        setTimeout(() => {
            colorColumn.style.height = '100%';
        }, index * 200); // Slight delay between each color

        colorColumn.addEventListener('click', () => revealColorWord(color, colorColumn));
    });
}

function revealColorWord(color, colorColumn) {
    
    let existingWord = colorColumn.querySelector('.color-word');
    if (!existingWord) {
        existingWord = document.createElement('div');
        existingWord.className = 'color-word';
        existingWord.style.color = getContrastColor(color);
        existingWord.style.top = "20%"; 
        colorColumn.appendChild(existingWord);
    }

    const word = colorWords[color];
    const currentLength = existingWord.textContent.length;
    if (currentLength < word.length) {
        existingWord.textContent += word[currentLength];
        existingWord.style.display = 'block';
    }
}

function getContrastColor(color) {
    const colors = {
        'red': '#FFD700', // Gold
        'orange': '#4B0082', // Indigo
        'yellow': '#8B4513', // SaddleBrown
        'green': '#FF69B4', // HotPink
        'blue': '#FFA500', // Orange
        'purple': '#00FF00' // Lime
    };
    return colors[color] || '#FFFFFF';
}

//---- Bubbles -------------------------------------------------------
function createBubbles() {
    for (let i = 0; i < 20; i++) {
        createBubble();
    }
}

function createBubble_0() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    const size = Math.random() * 90 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    bubble.style.left = `${Math.random() * initial_width}px`;
    bubble.style.top = `${Math.random() * initial_height * 0.8}px`;
    
    //const hue = Math.floor(Math.random() * 360);
    //bubble.style.background = `radial-gradient(circle at 30% 30%, hsla(${hue}, 100%, 90%, 0.6), hsla(${hue}, 100%, 50%, 0.2))`;
    //bubble.style.boxShadow = `2px 2px 5px hsla(${hue}, 100%, 80%, 0.3)`;
    
    document.body.appendChild(bubble);
    
    bubble.addEventListener('click', popBubble);
    
    animateBubble(bubble);
}

function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    const size = Math.random() * 70 + 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    //bubble.style.left = `${x}px`;
    //bubble.style.top = `${y}px`;
    
    bubble.style.left = `${Math.random() * initial_width}px`;
    bubble.style.top = `${Math.random() * initial_height * 0.8}px`;
    
    const hue = Math.floor(Math.random() * 360); // Random hue for each bubble
    
    // Create the main bubble gradient
    bubble.style.background = `radial-gradient(circle at 30% 30%, 
        hsla(${hue}, 100%, 80%, 0.4) 0%, 
        hsla(${hue}, 100%, 70%, 0.2) 30%, 
        hsla(${hue}, 100%, 60%, 0.1) 70%, 
        hsla(${hue}, 100%, 50%, 0.05) 100%)`;
    
    // Add shadow effects
    bubble.style.boxShadow = `
        inset 0 0 20px hsla(${hue}, 100%, 80%, 0.2),
        0 0 15px hsla(${hue}, 100%, 70%, 0.2)`;
    
    // Create highlight
    const highlight = document.createElement('div');
    highlight.style.position = 'absolute';
    highlight.style.top = '10%';
    highlight.style.left = '15%';
    highlight.style.width = '30%';
    highlight.style.height = '30%';
    highlight.style.background = `radial-gradient(circle at center, 
        rgba(255, 255, 255, 0.6) 0%, 
        hsla(${hue}, 100%, 90%, 0.1) 100%)`;
    highlight.style.borderRadius = '50%';
    highlight.style.transform = 'rotate(-40deg)';
    
    bubble.appendChild(highlight);
    document.body.appendChild(bubble);
    
    bubble.addEventListener('click', popBubble);
    
    animateBubble(bubble);
}

function animateBubble(bubble) {
    let x = parseFloat(bubble.style.left);
    let y = parseFloat(bubble.style.top);
    const maxX = initial_width - parseFloat(bubble.style.width);
    const maxY = initial_height - parseFloat(bubble.style.height);

    const speed = Math.random() * 0.5 + 0.1;
    let dx = (Math.random() - 0.5) * speed;
    let dy = Math.random() * speed + 0.1;

    function move() {
        x += dx;
        y += dy;

        if (x <= 0 || x >= maxX) dx = -dx;
        if (y <= 0 || y >= maxY) dy = -dy;

        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        if (document.body.contains(bubble)) {
            requestAnimationFrame(move);
        }
    }

    requestAnimationFrame(move);
}

function playBubblePopSound() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    const initial_freq = Math.random() * 3000 + 1000;
    
    // Use a higher frequency for the bubble pop
    oscillator.type = 'saw';
    oscillator.frequency.setValueAtTime(initial_freq, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.04);
    
    // Create a quick attack and decay
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.02);
}

function popBubble(event) {
    playBubblePopSound();
    event.target.remove();
    event.stopPropagation();
}

function removeAllBubbles() {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => bubble.remove());
}
