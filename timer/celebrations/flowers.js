

//---- Flower Garden -------------------------------------------------------
function createFlowerGarden() {
    const flowerCount = 10;
    
    for (let i = 0; i < flowerCount; i++) {
        setTimeout(() => {
            let flower_x = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
            let flower_y = Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.3;
            // write to console
            console.log(`Flower ${i + 1}: x=${flower_x}, y=${flower_y}`);
            createFlower(
                flower_x, 
                flower_y
            );
        }, i * 500); // Stagger flower creation
    }

    // add a click event to create a flower at the click location
    document.addEventListener('click', (event) => {
        createFlower(event.clientX, event.clientY);
    });

    // return a cleanup function to remove all the flowers and the event listener
    return () => {
        const flowers = document.querySelectorAll('.flower');
        flowers.forEach(flower => flower.remove());
        document.removeEventListener('click', createFlower);
    };

}

function createFlower(x, y) {
    const flowerContainer = document.createElement('div');
    flowerContainer.className = 'container flower animated-flower';
    flowerContainer.style.position = 'absolute';
    flowerContainer.style.left = `${x}px`;
    flowerContainer.style.top = `${y}px`;
    flowerContainer.style.width = '10px';
    flowerContainer.style.height = '10px';
    flowerContainer.style.transform = 'scale(0.5)'; // Start with visible container but no contents
    document.body.appendChild(flowerContainer);
    
    // Choose a random number of petals
    let petalCount_list = [3, 4, 5, 6, 8, 10, 12, 15];
    const petalCount = petalCount_list[Math.floor(Math.random() * petalCount_list.length)];

    const petalColors = [
        'rgba(212, 10, 53, 0.7)',    // Red
        'rgba(255, 105, 180, 0.7)',   // Pink
        'rgba(233, 93, 0, 0.7)',     // Orange Red
        'rgba(255, 165, 0, 0.7)',     // Orange
        'rgba(255, 215, 0, 0.7)',     // Gold
        'rgba(92, 248, 86, 0.7)',    
        'rgba(0, 255, 255, 0.7)',     // Cyan
        'rgba(30, 144, 255, 0.7)',     // Blue
        'rgba(1, 9, 123, 0.7)',       // Dark Blue
        'rgba(138, 43, 226, 0.7)',    // Purple
        'rgba(91, 32, 85, 0.7)',     
    ];
    const petalColor = petalColors[Math.floor(Math.random() * petalColors.length)];
    
    // Create petals (initially hidden with width/height of 0)
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.style.width = '0';
        petal.style.height = '0';
        petal.style.position = 'absolute';
        petal.style.borderTopRightRadius = '300px';
        petal.style.borderBottomLeftRadius = '300px';
        petal.style.transformOrigin = '0% 0%';
        petal.style.transform = `rotate(${i * (360 / petalCount)}deg)`;
        petal.style.background = petalColor;
        petal.style.zIndex = petalCount - i;
        flowerContainer.appendChild(petal);
    }
    
    // Create stem (initially with height 0, positioned to grow upward)
    const stem = document.createElement('div');
    stem.className = 'container stem animated-stem';
    stem.style.position = 'absolute';
    stem.style.zIndex = '-1';
    stem.style.width = '5px';
    stem.style.height = '0';
    stem.style.background = 'rgba(58, 183, 27, 0.9)';
    stem.style.borderRadius = '2px';
    stem.style.transformOrigin = '50% 100%'; // Change transform origin to bottom
    stem.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
    stem.style.left = '-2.5px';  // Center the stem
    stem.style.top = '20px';     // Position below the flower head
    
    // Important: reposition the stem to grow upward
    stem.style.transformOrigin = 'bottom center';
    stem.style.bottom = '-150px'; // Start from below
    stem.style.top = 'auto';      // Override top property
    
    flowerContainer.appendChild(stem);
    
    // Create leaf
    const leaf = document.createElement('div');
    leaf.className = 'container leaf animated-leaf';
    leaf.style.position = 'absolute';
    leaf.style.zIndex = '-1';
    leaf.style.width = '10px';
    leaf.style.height = '10px';
    leaf.style.left = '-30px';
    leaf.style.bottom = '50px';  // Position relative to bottom now
    leaf.style.top = 'auto';     // Override top property
    leaf.style.transform = 'rotate(-110deg) scale(0)';
    flowerContainer.appendChild(leaf);
    
    // Create leaf segments
    const leafSegments = 2;
    for (let i = 0; i < leafSegments; i++) {
        const leafSegment = document.createElement('div');
        leafSegment.style.boxSizing = 'border-box';
        leafSegment.style.position = 'absolute';
        leafSegment.style.borderTopRightRadius = '300px';
        leafSegment.style.borderBottomLeftRadius = '300px';
        leafSegment.style.transformOrigin = '0% 0%';
        leafSegment.style.transform = `rotate(${i * 3}deg)`;
        
        const leaf_size = 5;
        leafSegment.style.width = `${leaf_size}px`;
        leafSegment.style.height = `${leaf_size}px`;
        leafSegment.style.background = `rgba(58, 183, 27, 0.9)`;
        leafSegment.style.zIndex = leafSegments - i;
        
        leaf.appendChild(leafSegment);
    }
    
    // First animate the stem growing upward
    stem.animate([
        { height: '0px' },
        { height: '150px' }
    ], {
        duration: 500,
        fill: 'forwards',
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1.2)'
    });
    
    // Then animate the petals after the stem has mostly grown
    setTimeout(() => {
        // Grow petals
        const petals = Array.from(flowerContainer.children).filter(el => !el.classList.contains('stem') && !el.classList.contains('leaf'));
        for (let i = 0; i < petals.length; i++) {
            setTimeout(() => {
                petals[i].animate([
                    { width: '0px', height: '0px' },
                    { width: '100px', height: '100px' }
                ], {
                    duration: 800,
                    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1.2)',
                    fill: 'forwards'
                });
            }, i * 100); // Staggered effect for petals
        }
        
        // Grow leaf after petals start appearing
        setTimeout(() => {
            leaf.animate([
                { transform: 'rotate(-110deg) scale(0)' },
                { transform: 'rotate(-110deg) scale(0.2)' }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.2, 0.8, 0.2, 1.2)',
                fill: 'forwards'
            });
        }, 500);
        
        // Add simple wiggle animation to the entire flower
        setTimeout(() => {
            flowerContainer.animate([
                { transform: 'scale(0.5) rotate(-2deg)' },
                { transform: 'scale(0.5) rotate(2deg)' },
                { transform: 'scale(0.5) rotate(-2deg)' }
            ], {
                duration: 3000,
                iterations: Infinity,
                easing: 'ease-in-out'
            });
        }, 2000);
    }, 500); // Start petals after stem has had time to grow

    // Add click interaction to make the flower burst with particles
    flowerContainer.addEventListener('click', () => {
        createFlowerBurst(x, y, petalColor);
        event.stopPropagation();

        setTimeout(() => {
            flowerContainer.remove();
        }, 100);
    });
    
    return flowerContainer;
}

function createFlowerBurst(x, y, color) {
    const particleCount = 30;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'flower-particle';
        particle.style.position = 'absolute';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${Math.random() * 15 + 5}px`;
        particle.style.height = `${Math.random() * 15 + 5}px`;
        particle.style.background = color;
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '5px';
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 5;
        const rotationSpeed = Math.random() * 720 - 360;
        
        const animation = particle.animate([
            { 
                transform: 'translate(0, 0) rotate(0deg)',
                opacity: 1
            },
            { 
                transform: `translate(${Math.cos(angle) * velocity * 100}px, ${Math.sin(angle) * velocity * 100}px) rotate(${rotationSpeed}deg)`,
                opacity: 0
            }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        animation.onfinish = () => particle.remove();
        particles.push(particle);
    }
}