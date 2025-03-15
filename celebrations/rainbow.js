//---- Rainbow -------------------------------------------------------
function startRainbowEffect() {
    colorOverlay.style.display = 'block';
    colorOverlay.innerHTML = '';
    
    // Keep track of revealed words
    window.revealedWords = {
        'red': false,
        'orange': false,
        'yellow': false,
        'green': false,
        'blue': false, 
        'purple': false
    };

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
        
        // Check if this word is now fully revealed
        if (existingWord.textContent.length === word.length) {
            window.revealedWords[color] = true;
            
            // Convert text to individual span elements for letter animation
            const letters = existingWord.textContent.split('');
            existingWord.innerHTML = '';
            letters.forEach(letter => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.display = 'inline-block';
                existingWord.appendChild(span);
            });
            
            // Check if all words are revealed
            checkAllWordsRevealed();
        }
    }
}

function checkAllWordsRevealed() {
    // Check if all words have been completely revealed
    const allRevealed = Object.values(window.revealedWords).every(revealed => revealed);
    
    if (allRevealed) {
        // Start the rainbow animation on all revealed words
        startRainbowLetterAnimation();
    }
}

function startRainbowLetterAnimation() {
    // Get all letter spans across all color words
    const letterSpans = document.querySelectorAll('.color-word span');
    const animationDuration = 3000; // 3 seconds for a full color cycle
    
    // Set initial animation state
    letterSpans.forEach((span, index) => {
        span.style.transition = 'color 0.5s ease';
    });
    
    // Start the animation
    let hueOffset = 0;
    
    const rainbowInterval = setInterval(() => {
        letterSpans.forEach((span, index) => {
            // Calculate hue with offset to create wave effect
            // The % 360 ensures the hue stays within the 0-359 range
            const positionOffset = index * 10; // Adjust for more/less spread
            const hue = (hueOffset + positionOffset) % 360;
            span.style.color = `hsl(${hue}, 100%, 50%)`;
        });
        
        // Increment the base hue for next frame
        hueOffset = (hueOffset + 5) % 360; // Speed of the rainbow effect
    }, 50); // Update frequency
    
    // Store the interval ID in the window object so it can be cleared if needed
    window.rainbowAnimationInterval = rainbowInterval;
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