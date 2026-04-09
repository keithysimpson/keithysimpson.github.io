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