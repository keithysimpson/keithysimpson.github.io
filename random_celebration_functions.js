
function getRandomVelocity(base_velocity_angle, coherence) {
    const speed = 0.2 + 2*Math.random();
    const angle = (1-coherence)*(Math.random() * 2 * Math.PI) + (coherence * base_velocity_angle);
    return {
        dx: speed * Math.cos(angle),
        dy: speed * Math.sin(angle)
    };
}

function createOneImageObject(base_object) {

    // Create the object as an img element
    const object = document.createElement('img');
    object.classList.add('svg-object');
    object.src = base_object.image_url.url; 

    // if it doesn't have a color, use a random color
    if (base_object.image_url.color == 0) {
        // ...color the object, using the base color and a random hue rotation
        object.style.filter = `invert(38%) sepia(74%) saturate(1000%) hue-rotate(${base_object.color + Math.random() * 50}deg) brightness(100%) contrast(99%)`;
    }


    let initial_velocity;

    // choose the starting position of the object
    if (base_object.starting_position == "center") {
        object.style.left = `${initial_width / 2 - 50}px`;
        object.style.top = `${initial_height / 2 - 50}px`;

        initial_velocity = getRandomVelocity(base_object.velocity_angle, 0);

        object.acceleration_dx = 0;
        object.acceleration_dy = 0.005;
    } else if (base_object.starting_position == "random") {
        object.style.left = `${Math.random() *(initial_width - 50)}px`;
        object.style.top  = `${Math.random() *(initial_height - 50)}px`;

        // set the velocity of the object
        initial_velocity = getRandomVelocity(base_object.velocity_angle, base_object.coherence);

        object.acceleration_dx = 0;
        object.acceleration_dy = 0;
    }



    object.velocity_dx = initial_velocity.dx;
    object.velocity_dy = initial_velocity.dy;
    
    // Initialize bounce property
    object.bounce = base_object.bounce;

    // Initialize scale property
    object.currentScale = 1;

    // initialize rotation property
    object.currentRotation = 0; 
    object.rotationSpeed = base_object.rotationSpeed; // Adjust the increment value to control rotation speed

    // select how many times the object need to be clicked before it disappears
    object.total_lives = base_object.total_lives;
    object.lives_left = base_object.total_lives;

    // Add click event listener to object
    object.addEventListener('click', clickSVGOBject);

    document.body.appendChild(object);
    return object;
}

function clickSVGOBject(event) {
    const object = event.currentTarget;

    object.lives_left -= 1;
        
        if (object.lives_left == 0) {
            playDingSound((object.total_lives - object.lives_left) * 660, 1);
            object.remove();
            svgObjects = svgObjects.filter(obj => obj !== object);
        } else {

            if (base_object.click_effect == "grow") {
                

                playDingSound((object.total_lives - object.lives_left) * 660, 1);

                /*
                let happy_birthday_song = [
                    [392, 392, 440, 392, 523.25, 493.88], //  # G G A G C B - "Happy birthday to you"
                    [392, 392, 440, 392, 587.33, 523.25], //  # G G A G D C - "Happy birthday to you"
                    [392, 392, 784, 659.26, 523.25, 493.88, 440], //  # G G G' E C B A - "Happy birthday dear [name]"
                    [698.46, 698.46, 659.26, 523.25], //  # F F E C  - "Happy birthday ..."
                    [ 587.33, 523.25] //  #  D C - "... to you"
                ];

                let this_song = happy_birthday_song[(object.total_lives - object.lives_left) -1];

                playDingSound(this_song,this_song.length,timeGap = 0.2);
                */

                // Increase scale by 10% each click
                object.currentScale *= 2;
                object.style.transform = `scale(${object.currentScale}) rotate(${object.currentRotation}deg)`;
            } else if (base_object.click_effect == "dodge") {
                console.log('base_object.click_effect DODGE');
                playDingSound([500,400], 2,0.2);

                // move the object in a random direction
                let step_size = 100;
                let step_angle = Math.random() * 2 * Math.PI;
                let dx = step_size * Math.cos(step_angle);
                let dy = step_size * Math.sin(step_angle);
                console.log([dx, dy]);
                object.style.left = `${parseFloat(object.style.left) + dx}px`;
                object.style.top = `${parseFloat(object.style.top) + dy}px`;
            }

        }
        event.stopPropagation();

}

function moveSVGObjects() {
    svgObjects.forEach(object => {
        let left = parseFloat(object.style.left);
        let top = parseFloat(object.style.top);

        // new position based on velocity and acceleration
        left += object.velocity_dx + 0.5*object.acceleration_dx;
        top += object.velocity_dy + 0.5*object.acceleration_dy;

        // update the velocity based on acceleration
        object.velocity_dx += object.acceleration_dx;
        object.velocity_dy += object.acceleration_dy;

        // check if the object is out of bounds
        if (object.bounce == 1){
            //--- bounce off the walls
            if (left <= 0 || left >= initial_width - 50) {
                object.velocity_dx *= -1;
                left = Math.max(0, Math.min(left, initial_width - 50));
            }
            if (top <= 0 || top >= initial_height - 50) {
                object.velocity_dy *= -1;
                top = Math.max(0, Math.min(top, initial_height - 50));
            }
        } else {
            //--- wrap around the walls
            if (left <= -50) {
                left = initial_width + 50;
            } else if (left >= initial_width + 50) {
                left = -50;
            }
            if (top <= -50) {
                top = initial_height + 50;
            } else if (top >= initial_height + 50) {
                top = -50;
            }
        }
        
        // update the position of the object
        object.style.left = `${left}px`;
        object.style.top = `${top}px`;

        // Increment the rotation angle
        object.currentRotation += object.rotationSpeed; // Adjust the increment value to control rotation speed
        object.style.transform = `scale(${object.currentScale}) rotate(${object.currentRotation}deg)`;
    });

    animationId = requestAnimationFrame(moveSVGObjects);
}

function pickRandomImage() {
    let random_image = image_url_list[Math.floor(Math.random() * image_url_list.length)];
    let today = new Date();
    let today_string = today.toISOString().slice(0, 10);
    
    // Filter entries that match today's date
    let today_entries = dated_image_list.filter(entry => entry.date === today_string);
    
    if (today_entries.length > 0) {
        let current_hour = today.getHours();
        
        // Check for morning entries (before 2 PM)
        if (current_hour < 14) {
            let morning_entries = today_entries.filter(entry => entry.time_of_day === "morning");
            if (morning_entries.length > 0) {
                random_image = morning_entries[Math.floor(Math.random() * morning_entries.length)];
            }
        } 
        // Check for afternoon entries (2 PM and after)
        else {
            let afternoon_entries = today_entries.filter(entry => entry.time_of_day === "afternoon");
            if (afternoon_entries.length > 0) {
                random_image = afternoon_entries[Math.floor(Math.random() * afternoon_entries.length)];
            }
        }
    }
    
    return random_image;
}

function createAllRandomImageObjects() {
    // This function will create some objects to float around the screen
    // ...lots of aspects of this will be random, so each time you run it, you'll get a different result
    let starting_position_list = ["random", "random", "random", "center", "center","center"];
    let rotation_speed_list = [0,0,0,0,0.1,1,2,5];
    let velocity_angle_list = [0, 0, 0, 
                               90, 90, 90, 
                               180,270,
                               45, 135, 225, 315];
    let coherence_list = [0, 0.5, 0.75, 0.9, 1, 1];

    let lives_list = [3, 3, 3,3, 4, 4, 5, 6];

    let click_effect_list = ["grow","grow","grow","grow","grow", "grow","grow","grow","dodge"];

    // Create a base object with some random choices
    base_object = {
        //--- Pick random image
        image_url: pickRandomImage(),
        //--- Pick starting position
        starting_position: starting_position_list[Math.floor(Math.random() * starting_position_list.length)],
        //--- Pick random velocity angle
        velocity_angle: (2.0 * Math.PI / 360.0) * velocity_angle_list[Math.floor(Math.random() * velocity_angle_list.length)],
        //--- Pick random color
        color: Math.random() * 360,
        //--- Pick if all moving in the same direction
        // this should be randomly selected from [0, 0.5, 1] to represent no coherence, partial coherence, full
        coherence: coherence_list[Math.floor(Math.random() * coherence_list.length)],
        //--- pick random rotation speed
        rotationSpeed: rotation_speed_list[Math.floor(Math.random() * rotation_speed_list.length)],
        //--- pick if it bounces off the walls or wraps around
        bounce: Math.floor(Math.random() * 2),
        //--- pick how many times the object needs to be clicked before it disappears
        // ...mostly this should be 3, but sometimes its 4
        total_lives: lives_list[Math.floor(Math.random() * lives_list.length)],

        click_effect: click_effect_list[Math.floor(Math.random() * click_effect_list.length)]
    };


    for (let i = 0; i < 10; i++) {
        svgObjects.push(createOneImageObject(base_object));
    }
    moveSVGObjects();

}

function add1MoreSVGobject() {
    svgObjects.push(createOneImageObject(base_object));
}
