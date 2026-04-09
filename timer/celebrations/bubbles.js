//---- Bubbles -------------------------------------------------------
let activeBubbles = [];
let bubbleAnimationFrame;

function createBubble(event) {
    const x = event ? event.clientX : Math.random() * window.innerWidth;
    const y = event ? event.clientY : Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.2;
    
    // Create bubble element
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Random size 
    const size = Math.random() * 90 + 50;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Set position
    bubble.style.left = `${x - size/2}px`;
    bubble.style.top = `${y - size/2}px`;
    
    // Random light color with increased transparency
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
    const lightness = Math.floor(Math.random() * 20) + 70;  // 70-90%
    bubble.style.backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`;
    
    // Improved reflection effect using gradients
    bubble.style.borderRadius = '50%';
    bubble.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    bubble.style.background = `
        radial-gradient(circle at 30% 30%, 
            hsla(${hue}, ${saturation}%, ${lightness+10}%, 0.4) 0%, 
            hsla(${hue}, ${saturation}%, ${lightness}%, 0.2) 40%, 
            hsla(${hue}, ${saturation}%, ${lightness-10}%, 0.1) 100%)
    `;
    
    // Add shine highlight
    const highlight = document.createElement('div');
    highlight.style.position = 'absolute';
    highlight.style.width = '40%';
    highlight.style.height = '40%';
    highlight.style.borderRadius = '50%';
    highlight.style.background = 'radial-gradient(circle at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0) 100%)';
    highlight.style.top = '20%';
    highlight.style.left = '20%';
    highlight.style.pointerEvents = 'none'; // Make sure it doesn't interfere with clicks
    
    bubble.appendChild(highlight);
    
    // Add to document and store reference
    document.body.appendChild(bubble);
    
    // Add physics properties to bubble
    const physics = {
        x: parseFloat(bubble.style.left),
        y: parseFloat(bubble.style.top),
        // Random velocity between -0.8 and 0.8 px per frame
        vx: (Math.random() - 0.5) * 1.6,
        vy: (Math.random() - 0.5) * 1.6,
        size: size
    };
    
    // Store reference with physics data
    bubble.physics = physics;
    activeBubbles.push(bubble);
    
    // Add click event to pop the bubble
    bubble.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the event from creating a new bubble
        popBubble(bubble);
    });
    
    return bubble;
}

function updateBubbles() {
    // Calculate edges of screen accounting for bubble size
    const leftEdge = 0;
    const rightEdge = window.innerWidth;
    const topEdge = 0;
    const bottomEdge = window.innerHeight;
    
    for (let i = 0; i < activeBubbles.length; i++) {
        const bubble = activeBubbles[i];
        const physics = bubble.physics;
        
        // Update position based on velocity
        physics.x += physics.vx;
        physics.y += physics.vy;
        
        // Bounce off edges
        if (physics.x - physics.size/2 < leftEdge) {
            physics.x = leftEdge + physics.size/2;
            physics.vx *= -0.9; // Slightly damped bounce
        } else if (physics.x + physics.size/2 > rightEdge) {
            physics.x = rightEdge - physics.size/2;
            physics.vx *= -0.9;
        }
        
        if (physics.y - physics.size/2 < topEdge) {
            physics.y = topEdge + physics.size/2;
            physics.vy *= -0.9;
        } else if (physics.y + physics.size/2 > bottomEdge) {
            physics.y = bottomEdge - physics.size/2;
            physics.vy *= -0.9;
        }
        
        // Apply updated position to bubble
        bubble.style.left = `${physics.x - physics.size/2}px`;
        bubble.style.top = `${physics.y - physics.size/2}px`;
        
        // Optional: Very slight rotation for more natural movement
        const angle = Math.atan2(physics.vy, physics.vx) * (180/Math.PI);
        bubble.style.transform = `rotate(${angle * 0.2}deg)`;
    }
    
    // Continue animation loop
    bubbleAnimationFrame = requestAnimationFrame(updateBubbles);
}

function popBubble(bubble) {
    // Play pop sound effect with a random pitch
    const frequency = 500 + Math.random() * 1000;
    playDingSound([frequency], 1);
    
    // Create popping animation
    const popAnimation = bubble.animate([
        { transform: 'scale(1)', opacity: 0.7 },
        { transform: 'scale(1.4)', opacity: 0 }
    ], {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards'
    });
    
    // Remove bubble after animation
    popAnimation.onfinish = () => {
        removeBubbleFromArray(bubble);
        bubble.remove();
    };
}

function removeBubbleFromArray(bubble) {
    const index = activeBubbles.indexOf(bubble);
    if (index > -1) {
        activeBubbles.splice(index, 1);
    }
}

function removeAllBubbles() {
    // Cancel animation loop
    if (bubbleAnimationFrame) {
        cancelAnimationFrame(bubbleAnimationFrame);
        bubbleAnimationFrame = null;
    }
    
    // Clear any generation intervals
    if (window.bubbleGenerationInterval) {
        clearInterval(window.bubbleGenerationInterval);
        window.bubbleGenerationInterval = null;
    }
    
    // Remove all bubble elements
    activeBubbles.forEach(bubble => {
        bubble.remove();
    });
    activeBubbles = [];
}

function createBubbles() {
    // Create initial batch of bubbles
    const bubbleCount = 10;
    for (let i = 0; i < bubbleCount; i++) {
        setTimeout(() => {
            createBubble();
        }, i * 100); // Stagger bubble creation
    }
    
    // Start bubble animation loop
    bubbleAnimationFrame = requestAnimationFrame(updateBubbles);
    
    // Set up click handler to create bubbles when user clicks
    document.addEventListener('click', (event) => {
        // Only create a bubble if the click wasn't on an existing bubble
        // (bubble clicks are already handled with stopPropagation)
        createBubble(event);
    });
    
    // Return cleanup function
    return () => {
        removeAllBubbles();
        document.removeEventListener('click', createBubble);
    };
}