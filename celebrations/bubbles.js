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