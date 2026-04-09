//---- Snow -------------------------------------------------------
function createSnow() {
    const snowflakeCount = 100;
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.position = 'fixed';
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.top = Math.random() * -window.innerHeight + 'px'; // Start above the screen
        snowflake.style.width = '5px';
        snowflake.style.height = '5px';
        snowflake.style.backgroundColor = '#FFFFFF';
        snowflake.style.borderRadius = '50%';
        document.body.appendChild(snowflake);

        const animation = snowflake.animate([
            { transform: 'translateY(0)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px)`, opacity: 0.5 } // Fall below the screen
        ], {
            duration: Math.random() * 3000 + 5000,
            easing: 'linear',
            iterations: Infinity
        });
    }
}
