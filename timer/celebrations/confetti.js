//---- Confetti -------------------------------------------------------
function createConfetti() {
    const confettiCount = 150; // Increased count
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f', '#fff', '#fc0', '#0fc', '#f0c'];
    const shapes = ['circle', 'square', 'triangle', 'rectangle']; // Different shapes
    
    // Create confetti in batches for staggered effect
    const batchSize = 30;
    let currentBatch = 0;
    
    function createBatch() {
        if (currentBatch >= confettiCount) return;
        
        const batchEnd = Math.min(currentBatch + batchSize, confettiCount);
        
        for (let i = currentBatch; i < batchEnd; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random size between 5px and 15px
            const size = Math.random() * 10 + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            
            // Random color
            const color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.backgroundColor = color;
            
            // Random initial rotation
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Random shape
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'triangle') {
                confetti.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            } else if (shape === 'rectangle') {
                confetti.style.width = `${size * 1.5}px`;
                confetti.style.height = `${size}px`;
            }
            
            // Occasional glitter effect
            if (Math.random() > 0.7) {
                confetti.style.boxShadow = `0 0 ${Math.random() * 5 + 2}px ${color}`;
            }
            
            document.body.appendChild(confetti);
            
            // More natural physics with horizontal drift and rotation
            const horizontalDrift = Math.random() * 200 - 100; // -100px to 100px drift
            const rotationAmount = Math.random() * 1080 - 540; // -540deg to 540deg
            const duration = Math.random() * 3000 + 8000;
            const delay = Math.random() * 500; // Slight delay for each piece
            
            // Add some random swaying
            const keyframes = [
                { 
                    transform: `translate(0, 0) rotate(0)`, 
                    opacity: 1 
                },
                { 
                    transform: `translate(${horizontalDrift * 0.5}px, ${initial_height * 0.85}px) rotate(${rotationAmount * 0.3}deg)`,
                    opacity: 0.9
                },
                { 
                    transform: `translate(${horizontalDrift * 0.7}px, ${initial_height * 0.95}px) rotate(${rotationAmount * 0.6}deg)`,
                    opacity: 0.7 
                },
                { 
                    transform: `translate(${horizontalDrift}px, ${initial_height}px) rotate(${rotationAmount}deg)`, 
                    opacity: 0 
                }
            ];
            
            const animation = confetti.animate(keyframes, {
                duration: duration,
                easing: 'cubic-bezier(0.1, 0.2, 0.3, 1)',
                fill: 'forwards',
                delay: delay
            });
            
            animation.onfinish = () => confetti.remove();
        }
        
        currentBatch = batchEnd;
        
        // Continue with next batch if needed
        if (currentBatch < confettiCount) {
            setTimeout(createBatch, 200); // Stagger batches by 200ms
        }
    }
    
    // Start creating batches
    createBatch();
}

// Add a burst effect that can be used for clicks
function confettiBurst(x, y) {
    const burstCount = 50;
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f', '#fff', '#fc0'];
    
    for (let i = 0; i < burstCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random size
        const size = Math.random() * 8 + 4;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Position at click coordinates
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(confetti);
        
        // Burst in all directions
        const angle = Math.random() * Math.PI * 2; // Random angle in radians
        const distance = Math.random() * 150 + 50; // Distance to travel
        const destX = Math.cos(angle) * distance;
        const destY = Math.sin(angle) * distance;
        
        const animation = confetti.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${destX}px, ${destY}px) scale(1)`, opacity: 1, offset: 0.3 },
            { transform: `translate(${destX}px, ${destY + 100}px) scale(0.5)`, opacity: 0 }
        ], {
            duration: 3000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}