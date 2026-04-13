function createWhackAMole() {
    // Create main container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10vh';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '90vh';
    container.style.zIndex = '9998';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.backgroundColor = '#1e3b1c'; // Green grass background
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    // Create top bar for whacked moles and timer
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.gap = '15px';
    topBar.style.marginTop = '40px';
    topBar.style.minHeight = '60px';
    topBar.style.padding = '10px 20px';
    topBar.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    topBar.style.borderRadius = '30px';
    topBar.style.alignItems = 'center';
    container.appendChild(topBar);

    // Create timer clock display
    const clockDisplay = document.createElement('div');
    clockDisplay.style.fontFamily = "'Courier New', Courier, monospace";
    clockDisplay.style.fontSize = '28px';
    clockDisplay.style.fontWeight = 'bold';
    clockDisplay.style.color = '#fff';
    clockDisplay.style.textShadow = '0 0 8px rgba(255,255,255,0.4)';
    clockDisplay.style.minWidth = '70px';
    clockDisplay.style.textAlign = 'center';
    clockDisplay.textContent = '0.0';
    topBar.appendChild(clockDisplay);

    // Separator
    const sep = document.createElement('div');
    sep.style.width = '2px';
    sep.style.height = '40px';
    sep.style.backgroundColor = 'rgba(255,255,255,0.3)';
    sep.style.borderRadius = '1px';
    topBar.appendChild(sep);

    // Create best-time target display (shown from the start if a best exists)
    const bestTimeLabel = document.createElement('div');
    bestTimeLabel.style.fontFamily = "'Courier New', Courier, monospace";
    bestTimeLabel.style.fontSize = '13px';
    bestTimeLabel.style.color = 'rgba(255,255,255,0.55)';
    bestTimeLabel.style.position = 'absolute';
    bestTimeLabel.style.bottom = '-22px';
    bestTimeLabel.style.left = '0';
    bestTimeLabel.style.right = '0';
    bestTimeLabel.style.textAlign = 'center';
    bestTimeLabel.style.pointerEvents = 'none';
    const initialBest = localStorage.getItem('whackamole_best_time');
    if (initialBest !== null) {
        bestTimeLabel.textContent = '⏱ Best: ' + parseFloat(initialBest).toFixed(1) + 's';
    }
    topBar.style.position = 'relative';
    topBar.appendChild(bestTimeLabel);

    // Create grid container for holes
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    grid.style.gap = '20px';
    grid.style.margin = 'auto'; // Center vertically and horizontally
    grid.style.pointerEvents = 'auto'; // Allow clicking on moles
    container.appendChild(grid);

    // Game state
    let molesRemaining = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    let visibleColors = [];
    let whackOrder = []; // Track the order moles are whacked
    let holes = [];
    let gameInterval;
    let spawnTimeout;
    let rainbowAnimInterval = null; // For rainbow cycling animation

    // Timer state
    let gameStartTime = null;
    let clockInterval = null;
    let finalTime = 0;
    const BEST_TIME_KEY = 'whackamole_best_time';

    function getBestTime() {
        const stored = localStorage.getItem(BEST_TIME_KEY);
        return stored !== null ? parseFloat(stored) : null;
    }

    function saveBestTime(t) {
        localStorage.setItem(BEST_TIME_KEY, t.toFixed(1));
    }

    function startClock() {
        gameStartTime = performance.now();
        clockInterval = setInterval(() => {
            const elapsed = (performance.now() - gameStartTime) / 1000;
            clockDisplay.textContent = elapsed.toFixed(1);
        }, 100);
    }

    function stopClock() {
        if (clockInterval) {
            clearInterval(clockInterval);
            clockInterval = null;
        }
        if (gameStartTime) {
            finalTime = (performance.now() - gameStartTime) / 1000;
            clockDisplay.textContent = finalTime.toFixed(1);
        }
    }

    const moleSpeeds = {
        'red': 500,
        'orange': 800,
        'yellow': 1100,
        'green': 1500,
        'blue': 2000,
        'purple': 2500
    };

    const colorFilters = {
        'red': 'invert(25%) sepia(99%) saturate(7400%) hue-rotate(352deg) brightness(101%) contrast(106%)',
        'orange': 'invert(52%) sepia(87%) saturate(2250%) hue-rotate(1deg) brightness(105%) contrast(105%)',
        'yellow': 'invert(87%) sepia(82%) saturate(4050%) hue-rotate(356deg) brightness(105%) contrast(103%)',
        'green': 'invert(40%) sepia(84%) saturate(786%) hue-rotate(85deg) brightness(115%) contrast(108%)',
        'blue': 'invert(30%) sepia(87%) saturate(5436%) hue-rotate(212deg) brightness(100%) contrast(108%)',
        'purple': 'invert(26%) sepia(83%) saturate(5043%) hue-rotate(277deg) brightness(100%) contrast(116%)'
    };

    // Setup 9 holes
    for (let i = 0; i < 9; i++) {
        const holeContainer = document.createElement('div');
        holeContainer.style.width = '110px';
        holeContainer.style.height = '110px';
        holeContainer.style.position = 'relative';

        // The visible hole (dark oval at the bottom)
        const holeBackground = document.createElement('div');
        holeBackground.style.width = '100px';
        holeBackground.style.height = '35px';
        holeBackground.style.backgroundColor = '#1f1300';
        holeBackground.style.borderRadius = '50%';
        holeBackground.style.position = 'absolute';
        holeBackground.style.bottom = '0';
        holeBackground.style.left = '5px';
        holeBackground.style.boxShadow = 'inset 0px 5px 10px rgba(0,0,0,1), 0px 0px 0px 4px #5a3a11'; // Brown rim
        holeContainer.appendChild(holeBackground);

        // Mask area for the mole to pop up within
        const mask = document.createElement('div');
        mask.style.width = '100px';
        mask.style.height = '95px';
        mask.style.position = 'absolute';
        mask.style.bottom = '15px';
        mask.style.left = '5px';
        mask.style.overflow = 'hidden';
        holeContainer.appendChild(mask);

        // Add to DOM and tracking array
        grid.appendChild(holeContainer);
        holes.push({
            container: holeContainer,
            mask: mask,
            hasMole: false
        });
    }

    function addWhackedMoleToTopBar(color) {
        const icon = document.createElement('img');
        icon.src = 'images/mole.svg';
        icon.style.width = '50px';
        icon.style.height = '50px';
        icon.style.filter = colorFilters[color];

        // Pop-in animation
        icon.animate([
            { transform: 'scale(0)' },
            { transform: 'scale(1.2)' },
            { transform: 'scale(1)' }
        ], { duration: 400, easing: 'ease-out' });

        topBar.appendChild(icon);
    }

    function showHitEffect(x, y, color) {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.left = (x - 20) + 'px';
        flash.style.top = (y - 20) + 'px';
        flash.style.width = '40px';
        flash.style.height = '40px';
        flash.style.backgroundColor = color;
        flash.style.borderRadius = '50%';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '10001';
        document.body.appendChild(flash);

        flash.animate([
            { transform: 'scale(0.5)', opacity: 1 },
            { transform: 'scale(3)', opacity: 0 }
        ], { duration: 300, easing: 'ease-out' }).onfinish = () => flash.remove();
    }

    function spawnMole() {
        if (molesRemaining.length === 0) return;

        let emptyHoles = holes.filter(h => !h.hasMole);
        if (emptyHoles.length === 0) return;

        let availableColors = molesRemaining.filter(c => !visibleColors.includes(c));
        if (availableColors.length === 0) return;

        let holeObj = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
        let color = availableColors[Math.floor(Math.random() * availableColors.length)];
        let visibilityDuration = moleSpeeds[color];

        visibleColors.push(color);
        holeObj.hasMole = true;

        let moleEl = document.createElement('img');
        moleEl.src = 'images/mole.svg';
        moleEl.style.width = '80px';
        moleEl.style.height = '80px';
        moleEl.style.position = 'absolute';
        moleEl.style.bottom = '-80px'; // start hidden below
        moleEl.style.left = '10px';
        moleEl.style.filter = colorFilters[color];

        moleEl.style.transition = 'bottom 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // bouncy pop up
        moleEl.style.cursor = 'pointer';
        moleEl.style.pointerEvents = 'auto'; // ensure it receives clicks

        holeObj.mask.appendChild(moleEl);

        // Trigger reveal
        setTimeout(() => {
            moleEl.style.bottom = '0px';
        }, 20);

        let isWhacked = false;

        let hideTimer = setTimeout(() => {
            if (!isWhacked) {
                hideMole();
            }
        }, visibilityDuration);

        function hideMole() {
            if (isWhacked) return;
            visibleColors = visibleColors.filter(c => c !== color);
            moleEl.style.bottom = '-80px';
            setTimeout(() => {
                if (moleEl.parentNode) moleEl.parentNode.removeChild(moleEl);
                holeObj.hasMole = false;
            }, 200);
        }

        moleEl.addEventListener('mousedown', (e) => {
            if (isWhacked) return;
            isWhacked = true;
            visibleColors = visibleColors.filter(c => c !== color);
            clearTimeout(hideTimer);

            // Register whack
            let index = molesRemaining.indexOf(color);
            if (index > -1) {
                molesRemaining.splice(index, 1);
                whackOrder.push(color);
                addWhackedMoleToTopBar(color);

                // Play sound mapping based on color
                if (typeof playDingSound === 'function' && typeof noteToFrequency === 'function' && typeof colorSoundLookup !== 'undefined') {
                    const note = colorSoundLookup[color] || 'C5';
                    playDingSound(noteToFrequency([note]), 1);
                }

                showHitEffect(e.clientX, e.clientY, color);
            }

            // Visual feedback for whacking
            moleEl.style.transition = 'bottom 0.1s ease-in, transform 0.1s ease-in';
            moleEl.style.bottom = '-80px';
            moleEl.style.transform = 'scale(0.8)';

            setTimeout(() => {
                if (moleEl.parentNode) moleEl.parentNode.removeChild(moleEl);
                holeObj.hasMole = false;

                if (molesRemaining.length === 0) {
                    setTimeout(winGame, 500);
                }
            }, 100);

            e.preventDefault(); // Stop double-firing from mouse/touch
        });

        // Add touch support
        moleEl.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                moleEl.dispatchEvent(new MouseEvent('mousedown', {
                    clientX: e.touches[0].clientX,
                    clientY: e.touches[0].clientY
                }));
            }
        });
    }

    // Check if whack order matches rainbow (forward or reverse)
    function isRainbowOrder() {
        const rainbow = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
        const reverseRainbow = [...rainbow].reverse();
        if (whackOrder.length !== 6) return false;
        const isForward = whackOrder.every((c, i) => c === rainbow[i]);
        const isReverse = whackOrder.every((c, i) => c === reverseRainbow[i]);
        return isForward || isReverse;
    }

    // Play "For He's a Jolly Good Fellow" melody
    function playJollyGoodFellow() {
        if (typeof playDingSound !== 'function' || typeof noteToFrequency !== 'function') return;
        // "For he's a jolly good fellow" - simplified melody
        // For  he's  a    jol- ly   good  fel- low,  for  he's  a    jol- ly   good  fel-  low
        const notes = [
            'C5', 'E5', 'E5', 'E5', 'D5', 'E5', 'F5', 'F5',
            'E5', 'E5', 'D5', 'D5', 'C5', 'E5', 'D5', 'D5',
            'C5', 'E5', 'E5', 'E5', 'D5', 'E5', 'F5', 'F5',
            'G5', 'G5', 'F5', 'E5', 'D5', 'C5'
        ];
        playDingSound(noteToFrequency(notes), notes.length, 0.2);
    }

    // Start rainbow cycling animation on top bar mole icons
    function startRainbowCycling() {
        const rainbowColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
        // Get all mole icon imgs in the top bar (skip clockDisplay and separator)
        const icons = topBar.querySelectorAll('img');
        if (icons.length === 0) return;

        let offset = 0;
        rainbowAnimInterval = setInterval(() => {
            icons.forEach((icon, i) => {
                const colorIdx = (i + offset) % rainbowColors.length;
                icon.style.transition = 'filter 0.4s ease';
                icon.style.filter = colorFilters[rainbowColors[colorIdx]];
            });
            offset++;
        }, 500);
    }

    function winGame() {
        endGameLoop();
        stopClock();

        const bestTime = getBestTime();
        const isNewRecord = bestTime === null || finalTime < bestTime;
        const gotRainbow = isRainbowOrder();

        if (isNewRecord) {
            saveBestTime(finalTime);
        }

        // Show result message
        if (typeof showFadeText === 'function') {
            if (gotRainbow) {
                showFadeText("🌈 Rainbow Bonus! 🌈", shiftDownPx = 200, duration = 5000);
            } else if (isNewRecord && bestTime !== null) {
                showFadeText("⭐ New Record! ⭐", shiftDownPx = 200, duration = 5000);
            } else {
                showFadeText("Well Done!", shiftDownPx = 200, duration = 5000);
            }
        }

        // Update the best time label in the top bar
        const newBest = isNewRecord ? finalTime : bestTime;
        if (newBest !== null) {
            bestTimeLabel.textContent = '⏱ Best: ' + newBest.toFixed(1) + 's';
            if (isNewRecord) {
                bestTimeLabel.style.color = '#ffd700';
            }
        }

        // Show time result below the top bar
        const resultDiv = document.createElement('div');
        resultDiv.style.textAlign = 'center';
        resultDiv.style.color = '#fff';
        resultDiv.style.fontSize = '18px';
        resultDiv.style.marginTop = '20px';
        resultDiv.style.fontFamily = "'Courier New', Courier, monospace";
        resultDiv.style.pointerEvents = 'none';

        const timeText = finalTime.toFixed(1) + 's';

        if (isNewRecord && bestTime !== null) {
            resultDiv.innerHTML = `<span style="color:#ffd700;font-size:24px;font-weight:bold">${timeText}</span>`
                + `<br><span style="color:#aaa;font-size:14px">Previous best: ${bestTime.toFixed(1)}s</span>`;
        } else if (bestTime !== null) {
            resultDiv.innerHTML = `<span style="font-size:22px">${timeText}</span>`
                + `<br><span style="color:#aaa;font-size:14px">Best: ${newBest.toFixed(1)}s</span>`;
        } else {
            resultDiv.innerHTML = `<span style="font-size:22px">${timeText}</span>`;
        }

        // Animate it in
        resultDiv.animate([
            { opacity: 0, transform: 'translateY(-10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 400, easing: 'ease-out', fill: 'forwards' });

        container.insertBefore(resultDiv, grid);

        // Pulse the clock gold on new record
        if (isNewRecord) {
            clockDisplay.style.color = '#ffd700';
            clockDisplay.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.3)' },
                { transform: 'scale(1)' }
            ], { duration: 600, easing: 'ease-in-out' });
        }

        if (typeof createConfetti === 'function') {
            createConfetti();
        }

        // Sound: rainbow bonus gets the jolly good fellow tune, otherwise normal fanfare
        if (gotRainbow) {
            playJollyGoodFellow();
            startRainbowCycling();
        } else if (typeof playDingSound === 'function' && typeof noteToFrequency === 'function') {
            playDingSound(noteToFrequency(['C5', 'E5', 'G5', 'C6']), 4, 0.15);
        }

        // --- Bring Start/Reset buttons above the game overlay ---
        const contentEl = document.querySelector('.content');
        if (contentEl) {
            contentEl.style.zIndex = '9999';
        }

        // Change Start button to say "Play Again"
        const startBtn = document.getElementById('startPauseBtn');
        if (startBtn) {
            startBtn.textContent = 'Play Again';
        }

        // Hijack the Start button to replay whack-a-mole
        function replayHandler(e) {
            e.stopImmediatePropagation();
            e.preventDefault();

            // Remove this listener
            startBtn.removeEventListener('click', replayHandler, true);

            // Restore button text
            startBtn.textContent = 'Start';

            // Restore content z-index
            if (contentEl) {
                contentEl.style.zIndex = '10';
            }

            // Clean up current game
            endGameLoop();
            stopClock();
            container.remove();

            // Start a fresh game
            cleanupWhackAMole = createWhackAMole();
        }

        if (startBtn) {
            startBtn.addEventListener('click', replayHandler, true);
        }

        // If Reset is clicked, clean up the replay handler too
        const resetBtnEl = document.getElementById('resetBtn');
        function resetCleanup() {
            if (startBtn) startBtn.removeEventListener('click', replayHandler, true);
            if (startBtn) startBtn.textContent = 'Start';
            if (contentEl) contentEl.style.zIndex = '10';
            resetBtnEl.removeEventListener('click', resetCleanup, true);
        }
        if (resetBtnEl) {
            resetBtnEl.addEventListener('click', resetCleanup, true);
        }
    }

    function startGameLoop() {
        // Start the clock
        startClock();

        // Run game loop
        function scheduleNext() {
            // Wait random interval to spawn next mole
            const delay = Math.random() * 600 + 400; // 400-1000ms delay between spawns
            spawnTimeout = setTimeout(() => {
                if (molesRemaining.length > 0) {
                    spawnMole();
                    scheduleNext();
                }
            }, delay);
        }

        scheduleNext();

        // Extra loop sometimes spawning a double mole in case game drags
        gameInterval = setInterval(() => {
            if (molesRemaining.length > 2 && Math.random() > 0.5) {
                spawnMole();
            }
        }, 1500);
    }

    function endGameLoop() {
        clearTimeout(spawnTimeout);
        clearInterval(gameInterval);
    }

    // Start!
    setTimeout(startGameLoop, 500);

    // Return cleanup function
    return function cleanupWhackAMole() {
        endGameLoop();
        stopClock();
        if (rainbowAnimInterval) {
            clearInterval(rainbowAnimInterval);
            rainbowAnimInterval = null;
        }
        container.remove();
    };
}
