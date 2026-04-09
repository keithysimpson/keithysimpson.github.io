// ---- Poo Celebration ------------------------------------------------
// - Large poo emoji in centre: tap for fart sound
// - Tap elsewhere: add a mini poo at that location
// - Tap a mini poo: play fart sound and remove it
// ---------------------------------------------------------------------

let pooCleanupFn = null;

function getRandomPooImage() {
    return Math.random() < 0.5 ? 'images/poop_1.png' : 'images/poop_2.png';
}

function getRandomFartSound() {
    const r = Math.random();
    if (r < 0.40) return 'celebrations/fart_1.mp3';
    if (r < 0.80) return 'celebrations/fart_2.mp3';
    if (r < 0.85) return 'celebrations/fart_3.mp3'; // long
    return 'celebrations/fart_4.mp3'; // squeaky
}

function playFartSound() {
    const audio = new Audio(getRandomFartSound());
    audio.play().catch(() => { }); // ignore autoplay policy errors silently
}

function createPooCelebration() {
    // ---- State ----
    const miniPoos = [];

    // ---- Big central poo ----
    const bigPoo = document.createElement('img');
    bigPoo.src = getRandomPooImage();
    bigPoo.id = 'poo-big';
    bigPoo.style.cssText = `
        position: fixed;
        width: 200px;
        height: 200px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        cursor: pointer;
        transition: transform 0.12s ease;
        filter: drop-shadow(0 8px 24px rgba(0,0,0,0.45));
        pointer-events: all;
        user-select: none;
    `;

    bigPoo.addEventListener('click', (e) => {
        e.stopPropagation();
        playFartSound();
        // Bounce animation
        bigPoo.animate([
            { transform: 'translate(-50%, -50%) scale(1)' },
            { transform: 'translate(-50%, -50%) scale(1.25) rotate(-8deg)' },
            { transform: 'translate(-50%, -50%) scale(0.92) rotate(5deg)' },
            { transform: 'translate(-50%, -50%) scale(1)' }
        ], { duration: 380, easing: 'ease-out' });
    });

    document.body.appendChild(bigPoo);

    // ---- Screen click handler – add mini poo ----
    function onScreenClick(e) {
        // Ignore clicks on the big poo (handled above with stopPropagation)
        addMiniPoo(e.clientX, e.clientY);
    }

    function addMiniPoo(x, y) {
        const size = Math.floor(Math.random() * 40) + 44; // 44–84 px

        const mini = document.createElement('img');
        mini.src = getRandomPooImage();
        mini.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            left: ${x - size / 2}px;
            top:  ${y - size / 2}px;
            z-index: 9999;
            cursor: pointer;
            transition: transform 0.12s ease;
            filter: drop-shadow(0 3px 8px rgba(0,0,0,0.35));
            pointer-events: all;
            user-select: none;
        `;

        // Pop-in animation
        mini.animate([
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1.2)', opacity: 1 },
            { transform: 'scale(1)', opacity: 1 }
        ], { duration: 280, easing: 'ease-out' });

        mini.addEventListener('click', (e) => {
            e.stopPropagation();
            removeMiniPoo(mini);
        });

        document.body.appendChild(mini);
        miniPoos.push(mini);
    }

    function removeMiniPoo(mini) {
        playFartSound();

        // Pop-out animation then remove
        const anim = mini.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(1.3)', opacity: 0 }
        ], { duration: 250, easing: 'ease-in' });

        anim.onfinish = () => {
            mini.remove();
            const idx = miniPoos.indexOf(mini);
            if (idx > -1) miniPoos.splice(idx, 1);
        };
    }

    document.addEventListener('click', onScreenClick);

    // ---- Return cleanup function ----
    return function cleanupPoo() {
        document.removeEventListener('click', onScreenClick);
        bigPoo.remove();
        miniPoos.slice().forEach(m => m.remove());
        miniPoos.length = 0;
    };
}
