//---- star field -------------------------------------------------------
/*
function createSpaceTravel() {
    //const wrapper = document.createElement('div');
    //wrapper.className = 'space-wrapper';
    //document.body.appendChild(wrapper);

    const max_depth = 5000;
    const numStars = 100;
    const stars = [];
    
    function createStar(starArray, startAtRandom = true) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // If startAtRandom is true, place stars throughout space
        // If false, place them at the far end (for replacement stars)
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const z = startAtRandom ? Math.random() * 1500 : 1500;
        
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        
        const scale = (1500 - z) / 1500;
        star.style.transform = `scale(${scale})`;
        star.style.opacity = scale;
        
        document.body.appendChild(star);
        starArray.push({
            element: star,
            x,
            y,
            z
        });
    }
    
    // Create initial stars
    for (let i = 0; i < numStars; i++) {
        createStar( stars, true);
    }

    let animationFrameId;
    const speed = 2;
    
    function updateStars() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const margin = 50; // Margin for when to consider stars "off screen"
        
        stars.forEach((star, index) => {
            // Move star closer
            star.z -= speed * 10;
            
            // Calculate new position based on perspective
            const scale = (1500 - star.z) / 1500;
            
            // Calculate screen position
            const newX = centerX + (star.x - centerX) * scale;
            const newY = centerY + (star.y - centerY) * scale;
            
            // Check if star is off screen
            const isOffScreen = 
                newX < -margin || 
                newX > window.innerWidth + margin || 
                newY < -margin || 
                newY > window.innerHeight + margin;
            
            // Only reset if star is actually off screen
            if (isOffScreen || scale > 2) {
                // Remove old star
                star.element.remove();
                stars.splice(index, 1);
                
                // Create new star at far distance
                createStar(stars, false);
            } else {
                // Update star position and appearance
                star.element.style.left = `${newX}px`;
                star.element.style.top = `${newY}px`;
                star.element.style.transform = `scale(${scale})`;
                star.element.style.opacity = scale;
            }
        });
        
        animationFrameId = requestAnimationFrame(updateStars);
    }
    
    // Start animation
    updateStars();
    

    
    // Return cleanup function
    return () => {
        cancelAnimationFrame(animationFrameId);
        //wrapper.remove();
        stars.forEach(star => star.element.remove());
    };
}
*/

let planet_counter = 0;

function createSpaceTravel() {
    //const max_depth = 5000;
    const numStars = 100;
    const stars = [];
    const planets = [];
    
    function createStar(starArray, startAtRandom = true) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const z = startAtRandom ? Math.random() * 1500 : 1500;
        
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        
        const scale = (1500 - z) / 1500;
        star.style.transform = `scale(${scale})`;
        star.style.opacity = scale;
        
        document.body.appendChild(star);
        starArray.push({
            element: star,
            x,
            y,
            z
        });
    }
    
    function createPlanet(clickX, clickY) {
        // we will pick a planet from the list
        // and increment the planet_counter
        // but on a few random occasions, we will pick a random image

        // chose_planet is a random true or false, but is true most of the time
        let chose_planet = Math.random() > 0.075;

        const planetFiles = [
            {url: 'images/the_sun.svg', size: 400},
            {url: 'images/planet_mercury.svg', size: 20},
            {url: 'images/planet_venus.svg', size: 40},
            {url: 'images/planet_earth.svg', size: 40},
            {url: 'images/planet_mars.svg', size: 35}, 
            {url: 'images/planet_jupiter.svg', size: 100},
            {url: 'images/planet_saturn.svg', size: 55},
            {url: 'images/planet_uranus.svg', size: 50},
            {url: 'images/planet_neptune.svg', size: 50},
        ];

        const randomFiles = [
            {url: 'images/alien_1.svg', size: 20},
            {url: 'images/alien_2.svg', size: 20},
            {url: 'images/alien_3.svg', size: 20},
            {url: 'images/alien_spaceship.svg', size: 20},
            {url: 'images/astronaut.svg', size: 20},
            {url: 'images/55transparent.webp', size: 40},
            {url: 'images/cow.svg', size: 20},
            {url: 'images/asteroid.svg', size: 20},
            {url: 'images/galaxy.svg', size: 20},
            {url: 'images/iss.svg', size: 30},

        ];

        let randomPlanet;

        if (chose_planet) {
            // chose the next planet from the list
            randomPlanet = planetFiles[planet_counter];
            // increment the global variable planet_counter
            planet_counter = (planet_counter + 1) % planetFiles.length;

        } else {
            // chose a random planet from the list
            randomPlanet = randomFiles[Math.floor(Math.random() * randomFiles.length)];
        }
        


        const planet = document.createElement('img');
        planet.className = 'planet';
        
        planet.classList.add('svg-object');
        planet.src = randomPlanet.url; 

        /*
        // Fetch and insert the SVG
        fetch(randomPlanet)
            .then(response => response.text())
            .then(svgContent => {
                planet.innerHTML = svgContent;
                const svgElement = planet.querySelector('svg');
                svgElement.style.display = 'block';
            });

        */

        const z = 1500; // Start from far away
        
        planet.style.left = `${clickX - 25}px`; // Center the planet on click
        planet.style.top = `${clickY - 25}px`;
        //planet.style.width = `${randomPlanet.size}px`;
        planet.style.height = `${randomPlanet.size}px`;
        planet.style.width = 'auto';
        
        document.body.appendChild(planet);
        planets.push({
            element: planet,
            x: clickX,
            y: clickY,
            z
        });
    }



    
    // Create initial stars
    for (let i = 0; i < numStars; i++) {
        createStar(stars, true);
    }
    
    let animationFrameId;
    const speed = 2;
    const max_star_scale = 2;
    const max_planet_scale = 5;

    function updateStars() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const margin = 50;
        
        stars.forEach((star, index) => {
            // Update stars z position based on perspective
            const scale = (1500 - star.z) / 1500;
            const speedFactor = Math.pow(scale, 1.1); // Speed increases as stars get closer
            star.z -= speed * 10 * (1 + speedFactor);
            
            const newX = centerX + (star.x - centerX) * scale;
            const newY = centerY + (star.y - centerY) * scale;
            
            const isOffScreen = 
                newX < -margin || 
                newX > window.innerWidth + margin || 
                newY < -margin || 
                newY > window.innerHeight + margin;
            
            if (isOffScreen) {
                star.element.remove();
                stars.splice(index, 1);
                createStar(stars, false);
            } else {
                star.element.style.left = `${newX}px`;
                star.element.style.top = `${newY}px`;
                star.element.style.transform = `scale(${Math.min(scale, max_star_scale)})`;
                star.element.style.opacity = scale;
            }
        });
        
        // Update planets
        planets.forEach((planet, index) => {
            // Update planets z position based on perspective
            const scale = (1500 - planet.z) / 1500;
            const speedFactor = Math.pow(scale, 1.1); // Speed increases as planets get closer
            planet.z -= speed * 5 * (1 + speedFactor);
            
            const newX = centerX + (planet.x - centerX) * scale;
            const newY = centerY + (planet.y - centerY) * scale;

            //console.log(`scale: ${scale}, speedFactor: ${speedFactor}, z: ${planet.z}, newX: ${newX}, newY: ${newY}`);
            
            const isOffScreen = 
                newX < -margin || 
                newX > window.innerWidth + margin || 
                newY < -margin || 
                newY > window.innerHeight + margin;
            
            if (isOffScreen) {
                planet.element.remove();
                planets.splice(index, 1);
            } else {
                planet.element.style.left = `${newX - 25 * scale}px`;
                planet.element.style.top = `${newY - 25 * scale}px`;
                planet.element.style.transform = `scale(${Math.min(scale, max_planet_scale)})`;
                planet.element.style.opacity = scale;
            }
        });
        
        animationFrameId = requestAnimationFrame(updateStars);
    }
    
    // Start animation
    updateStars();
    
    // Add click handler
    document.addEventListener('click', (event) => {
        createPlanet(event.clientX, event.clientY);
    });
    
    // Return cleanup function
    return () => {
        cancelAnimationFrame(animationFrameId);
        stars.forEach(star => star.element.remove());
        planets.forEach(planet => planet.element.remove());
        document.removeEventListener('click', createPlanet);
    };
}

// Start the space travel effect
//createSpaceTravel();
