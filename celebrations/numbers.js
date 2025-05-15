// Numbers Celebration
// This file contains the code for a numbers celebration where users can create, drag, and merge numbers.
// The numbers can be added, subtracted, multiplied, or divided based on the selected mode.
// The numbers are displayed in colorful circles, and the user can click to create new numbers.
// The numbers can be merged by dragging them close to each other

let numbersActive = false;
let numbersMode = 'addition'; // 'addition', 'subtraction', 'multiplication', 'division', or 'doubling'
let numberElements = [];
let cleanupNumbers = () => {};

function createNumberCelebration() {
    if (numbersActive) return cleanupNumbers;
    numbersActive = true;
    
    // Create the mode toggle buttons
    const addButton = document.createElement('div');
    addButton.className = 'mode-button';
    addButton.id = 'add-mode-button';
    addButton.innerHTML = '+';
    addButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: ${numbersMode === 'addition' ? '#00aa00' : '#888888'};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transform: ${numbersMode === 'addition' ? 'scale(1.2)' : 'scale(1)'};
        transition: transform 0.2s, background-color 0.2s;
    `;
    
    // Add subtract button
    const subtractButton = document.createElement('div');
    subtractButton.className = 'mode-button';
    subtractButton.id = 'subtract-mode-button';
    subtractButton.innerHTML = '-';
    subtractButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: ${numbersMode === 'subtraction' ? '#00aa00' : '#888888'};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transform: ${numbersMode === 'subtraction' ? 'scale(1.2)' : 'scale(1)'};
        transition: transform 0.2s, background-color 0.2s;
    `;

    // Add doubling button (above multiply/divide on right)
    const doublingButton = document.createElement('div');
    doublingButton.className = 'mode-button';
    doublingButton.id = 'doubling-mode-button';
    doublingButton.innerHTML = '2×';
    doublingButton.style.cssText = `
        position: fixed;
        bottom: 160px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: ${numbersMode === 'doubling' ? '#00aa00' : '#888888'};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transform: ${numbersMode === 'doubling' ? 'scale(1.2)' : 'scale(1)'};
        transition: transform 0.2s, background-color 0.2s;
    `;

    const multiplyButton = document.createElement('div');
    multiplyButton.className = 'mode-button';
    multiplyButton.id = 'multiply-mode-button';
    multiplyButton.innerHTML = '×';
    multiplyButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: ${numbersMode === 'multiplication' ? '#00aa00' : '#888888'};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transform: ${numbersMode === 'multiplication' ? 'scale(1.2)' : 'scale(1)'};
        transition: transform 0.2s, background-color 0.2s;
    `;
    
    // Add divide button
    const divideButton = document.createElement('div');
    divideButton.className = 'mode-button';
    divideButton.id = 'divide-mode-button';
    divideButton.innerHTML = '÷';
    divideButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: ${numbersMode === 'division' ? '#00aa00' : '#888888'};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transform: ${numbersMode === 'division' ? 'scale(1.2)' : 'scale(1)'};
        transition: transform 0.2s, background-color 0.2s;
    `;
    
    document.body.appendChild(addButton);
    document.body.appendChild(subtractButton);
    document.body.appendChild(multiplyButton);
    document.body.appendChild(divideButton);
    document.body.appendChild(doublingButton);
    
    // Create some initial numbers
    if (numbersMode === 'doubling') {
        for (let i = 0; i < 8; i++) {
            // Use random positions for each 1
            const posX = Math.random() * (window.innerWidth - 100);
            const posY = Math.random() * (window.innerHeight - 100);
            createNumberWithValue(1, posX, posY);
        }
    } else {
        for (let i = 0; i < 8; i++) {
            createRandomNumber();
        }
    }
    
    // Add event listener for clicks to create new numbers
    document.addEventListener('click', handleNumberClick);
    
    // Add event listeners to the mode buttons
    addButton.addEventListener('click', (e) => {
        setNumbersMode('addition');
        e.stopPropagation(); // Prevent creating a new number
    });
    
    subtractButton.addEventListener('click', (e) => {
        setNumbersMode('subtraction');
        e.stopPropagation(); // Prevent creating a new number
    });
    
    multiplyButton.addEventListener('click', (e) => {
        setNumbersMode('multiplication');
        e.stopPropagation(); // Prevent creating a new number
    });
    
    divideButton.addEventListener('click', (e) => {
        setNumbersMode('division');
        e.stopPropagation(); // Prevent creating a new number
    });

    doublingButton.addEventListener('click', (e) => {
        setNumbersMode('doubling');
        e.stopPropagation();
    });
    
    // Return cleanup function
    return function() {
        // Set flag to inactive first to prevent new elements from being created
        numbersActive = false;
        
        // Remove all number elements
        numberElements.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        numberElements = [];
        
        // Remove mode buttons - use getElementById to make sure we get them
        const addBtn = document.getElementById('add-mode-button');
        const subtractBtn = document.getElementById('subtract-mode-button');
        const multBtn = document.getElementById('multiply-mode-button');
        const divideBtn = document.getElementById('divide-mode-button');
        const doublingBtn = document.getElementById('doubling-mode-button');
        
        if (addBtn) addBtn.parentNode.removeChild(addBtn);
        if (subtractBtn) subtractBtn.parentNode.removeChild(subtractBtn);
        if (multBtn) multBtn.parentNode.removeChild(multBtn);
        if (divideBtn) divideBtn.parentNode.removeChild(divideBtn);
        if (doublingBtn) doublingBtn.parentNode.removeChild(doublingBtn);
        
        // Remove event listener for clicks
        document.removeEventListener('click', handleNumberClick);
        
        // Reset mode to default for next time
        numbersMode = 'addition';
    };
}

function setNumbersMode(mode) {
    // Remove all numbers from the screen when switching modes
    numberElements.forEach(el => {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
    numberElements = [];
    numbersMode = mode;
    
    // Update button colors
    const addButton = document.getElementById('add-mode-button');
    const subtractButton = document.getElementById('subtract-mode-button');
    const multiplyButton = document.getElementById('multiply-mode-button');
    const divideButton = document.getElementById('divide-mode-button');
    const doublingButton = document.getElementById('doubling-mode-button');
    
    if (addButton && subtractButton && multiplyButton && divideButton && doublingButton) {
        // Update addition button styling
        addButton.style.backgroundColor = mode === 'addition' ? '#00aa00' : '#888888';
        addButton.style.transform = mode === 'addition' ? 'scale(1.2)' : 'scale(1)';
        
        // Update subtraction button styling
        subtractButton.style.backgroundColor = mode === 'subtraction' ? '#00aa00' : '#888888';
        subtractButton.style.transform = mode === 'subtraction' ? 'scale(1.2)' : 'scale(1)';
        
        // Update multiplication button styling
        multiplyButton.style.backgroundColor = mode === 'multiplication' ? '#00aa00' : '#888888';
        multiplyButton.style.transform = mode === 'multiplication' ? 'scale(1.2)' : 'scale(1)';
        
        // Update division button styling
        divideButton.style.backgroundColor = mode === 'division' ? '#00aa00' : '#888888';
        divideButton.style.transform = mode === 'division' ? 'scale(1.2)' : 'scale(1)';

        // Update doubling button styling
        doublingButton.style.backgroundColor = mode === 'doubling' ? '#00aa00' : '#888888';
        doublingButton.style.transform = mode === 'doubling' ? 'scale(1.2)' : 'scale(1)';
    }
    
    // Play a sound when switching modes
    const frequencies = {
        addition: 880,
        subtraction: 770,
        multiplication: 660,
        division: 550,
        doubling: 990
    };
    playDingSound(frequencies[mode] || 440, 1);

    // When switching to doubling mode, add only 1s
    if (mode === 'doubling') {
        for (let i = 0; i < 8; i++) {
            // Use random positions for each 1
            const posX = Math.random() * (window.innerWidth - 100);
            const posY = Math.random() * (window.innerHeight - 100);
            createNumberWithValue(1, posX, posY);
        }
    } else {
        // When switching away from doubling, add random numbers
        for (let i = 0; i < 8; i++) {
            createRandomNumber();
        }
    }
}

// Helper function to format numbers with commas
function formatNumberWithCommas(number) {
    // Round decimal values to 3 places
    if (Number.isFinite(number) && !Number.isInteger(number)) {
        number = parseFloat(number.toFixed(3));
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function handleNumberClick(event) {
    // First check if we're still active - this prevents adding numbers after cleanup
    if (!numbersActive) return;
    
    // Don't create a number if we clicked on an existing number or button
    if (event.target.classList.contains('number') || 
        event.target.classList.contains('mode-button')) {
        return;
    }
    
    if (numbersMode === 'doubling') {
        createNumberWithValue(1, event.clientX, event.clientY);
    } else {
        createRandomNumber(event.clientX, event.clientY);
    }
}

function createRandomNumber(x, y) {
    const number = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const numberElement = document.createElement('div');
    
    // Random position if x and y not specified
    const posX = x || Math.random() * (window.innerWidth - 100);
    const posY = y || Math.random() * (window.innerHeight - 100);
    
    numberElement.className = 'number';
    numberElement.textContent = formatNumberWithCommas(number);
    numberElement.dataset.value = number;
    
    // Generate a random hue for each number
    const hue = Math.floor(Math.random() * 360);
    
    numberElement.style.cssText = `
        position: absolute;
        left: ${posX}px;
        top: ${posY}px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: hsl(${hue}, 80%, 50%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        cursor: move;
        user-select: none;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: transform 0.1s, box-shadow 0.1s;
        z-index: 100;
    `;
    
    document.body.appendChild(numberElement);
    numberElements.push(numberElement);
    
    // Make the number draggable
    makeNumberDraggable(numberElement);
    
    // Play a sound when a new number is created
    playDingSound(440 + number * 40, 1);
    
    return numberElement;
}

function makeNumberDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;
    let originalZIndex;
    
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', handleTouchStart);
    
    function handleTouchStart(e) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        startDrag(mouseEvent);
        e.preventDefault();
    }
    
    function startDrag(e) {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        originalZIndex = element.style.zIndex;
        element.style.zIndex = "1000";
        element.style.transform = "scale(1.1)";
        element.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', handleTouchEnd);
    }
    
    function handleTouchMove(e) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        drag(mouseEvent);
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const left = e.clientX - offsetX;
        const top = e.clientY - offsetY;
        
        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
        
        // Check for overlapping with other numbers
        checkNumberOverlap(element, e.clientX, e.clientY);
    }
    
    function handleTouchEnd(e) {
        const mouseEvent = new MouseEvent('mouseup');
        stopDrag(mouseEvent);
        e.preventDefault();
    }
    
    function stopDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        element.style.zIndex = originalZIndex;
        element.style.transform = "scale(1)";
        element.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', handleTouchEnd);
    }
}

function checkNumberOverlap(draggedElement, x, y) {
    const draggedRect = draggedElement.getBoundingClientRect();
    let merged = false;
    numberElements.forEach(targetElement => {
        if (targetElement === draggedElement) return;
        if (merged) return; // Only allow one merge per drag
        const targetRect = targetElement.getBoundingClientRect();
        
        // Calculate distance between centers
        const dx = (draggedRect.left + draggedRect.width/2) - (targetRect.left + targetRect.width/2);
        const dy = (draggedRect.top + draggedRect.height/2) - (targetRect.top + targetRect.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If centers are close enough, merge the numbers
        if (distance < 40) {
            mergeNumbers(draggedElement, targetElement);
            merged = true;
        }
    });
}

function mergeNumbers(element1, element2) {
    // Get the values of both elements
    const value1 = parseFloat(element1.dataset.value);
    const value2 = parseFloat(element2.dataset.value);
    
    // Doubling mode logic
    if (numbersMode === 'doubling') {
        if (value1 === value2) {
            const newValue = value1 * 2;
            // Animation effect before merging
            element1.style.transform = 'scale(1.2)';
            element2.style.transform = 'scale(1.2)';
            playDingSound([660, 880], 2, 0.1);
            setTimeout(() => {
                // Get the position of the second element (target)
                const rect = element2.getBoundingClientRect();
                const x = rect.left + rect.width/2;
                const y = rect.top + rect.height/2;
                // Remove both elements from the DOM and the array
                numberElements = numberElements.filter(el => el !== element1 && el !== element2);
                element1.parentNode.removeChild(element1);
                element2.parentNode.removeChild(element2);
                // Create a new element with the doubled value
                const newElement = createNumberWithValue(newValue, x, y);
                // Special effects for milestone numbers
                if (Math.abs(newValue) > 50) {
                    launchFirework(x, y, 1000);
                } else if (Math.abs(newValue) > 25) {
                    confettiBurst(x, y);
                }
            }, 200);
        } else {
            // Error chime and shake animation
            playDingSound(220, 1, 0.15);
            element2.animate([
                { transform: 'scale(1)', backgroundColor: element2.style.backgroundColor },
                { transform: 'scale(1.1) translateX(-10px)', backgroundColor: '#ff3333' },
                { transform: 'scale(1.1) translateX(10px)', backgroundColor: '#ff3333' },
                { transform: 'scale(1)', backgroundColor: element2.style.backgroundColor }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
        }
        return;
    }
    // Calculate the new value based on the current mode
    let newValue;
    if (numbersMode === 'addition') {
        newValue = value1 + value2;
    } else if (numbersMode === 'subtraction') {
        newValue = value2 - value1;
    } else if (numbersMode === 'multiplication') {
        newValue = value1 * value2;
    } else { // division mode
        // Prevent division by zero
        if (value2 === 0) {
            // Create an error animation on element2
            element2.animate([
                { transform: 'scale(1)', backgroundColor: 'red' },
                { transform: 'scale(1.2)', backgroundColor: 'red' },
                { transform: 'scale(1)', backgroundColor: element2.style.backgroundColor }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
            return; // Exit without merging
        }
        newValue = value2 / value1;
    }
    
    // Animation effect before merging
    element1.style.transform = 'scale(1.2)';
    element2.style.transform = 'scale(1.2)';
    
    // Play a sound based on the operation
    const baseFrequencies = {
        addition: 440,
        subtraction: 400,
        multiplication: 330,
        division: 300
    };
    const baseFreq = baseFrequencies[numbersMode] || 440;
    playDingSound([baseFreq, baseFreq * 1.2, baseFreq * 1.5], 3, 0.1);
    
    setTimeout(() => {
        // Get the position of the second element (target)
        const rect = element2.getBoundingClientRect();
        const x = rect.left + rect.width/2;
        const y = rect.top + rect.height/2;
        
        // Remove both elements from the DOM and the array
        numberElements = numberElements.filter(el => el !== element1 && el !== element2);
        element1.parentNode.removeChild(element1);
        element2.parentNode.removeChild(element2);
        
        // Create a new element with the combined value
        const newElement = createNumberWithValue(newValue, x, y);
        
        // Special effects for milestone numbers
        if (Math.abs(newValue) > 50) {
            launchFirework(x, y, 1000);
        } else if (Math.abs(newValue) > 25) {
            confettiBurst(x, y);
        }
    }, 200);
}

function createNumberWithValue(value, x, y) {
    const numberElement = document.createElement('div');
    
    numberElement.className = 'number';
    numberElement.textContent = formatNumberWithCommas(value);
    numberElement.dataset.value = value;
    
    // Use value to determine color (higher numbers are more vibrant)
    const hue = (Math.abs(value) * 30) % 360;
    const saturation = Math.min(100, 60 + Math.abs(value));
    const lightness = Math.max(30, 60 - Math.abs(value)/3);
    
    // Adjust size based on value
    const size = Math.min(200, 60 + Math.abs(value)/2);
    
    numberElement.style.cssText = `
        position: absolute;
        left: ${x - size/2}px;
        top: ${y - size/2}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background-color: hsl(${hue}, ${saturation}%, ${lightness}%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${Math.min(28, 18 + Math.abs(value)/10)}px;
        font-weight: bold;
        cursor: move;
        user-select: none;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transform: scale(0);
        z-index: 100;
        ${value < 0 ? 'border: 2px dashed white;' : ''}
    `;

    
    document.body.appendChild(numberElement);
    
    // Animate the new number appearing
    numberElement.animate([
        { transform: 'scale(0)' },
        { transform: 'scale(1.2)' },
        { transform: 'scale(1)' }
    ], {
        duration: 500,
        easing: 'ease-out',
        fill: 'forwards'
    });
    
    numberElements.push(numberElement);
    makeNumberDraggable(numberElement);
    
    return numberElement;
}
