/*
function createKaleidoscope() {
    // Create container first
    const kaleidoscope = document.createElement('div');
    kaleidoscope.id = 'kaleidoscope-container';
    kaleidoscope.setAttribute('tlg-kaleidoscope-canvas', '');
    kaleidoscope.setAttribute('tlg-kaleidoscope-mode', 'mouse');
    kaleidoscope.setAttribute('tlg-kaleidoscope-segments', '8');
    kaleidoscope.setAttribute('tlg-kaleidoscope-scale', '1.2');
    kaleidoscope.setAttribute('tlg-kaleidoscope-motion', '1.5');
    kaleidoscope.style.width = '100vw';
    kaleidoscope.style.height = '100vh';
    kaleidoscope.style.position = 'relative';

    // Add source images
    const kaleidoscopeImages = document.createElement('div');
    kaleidoscopeImages.className = 'source-images';
    kaleidoscopeImages.style.display = 'none';
    kaleidoscope.appendChild(kaleidoscopeImages);

    // Add image
    const kaleidoscopeImage = document.createElement('img');
    kaleidoscopeImage.setAttribute('tlg-kaleidoscope-image', '');
    kaleidoscopeImage.src = 'images/Beautiful_Rainbow.jpg';
    kaleidoscopeImage.alt = 'Pattern 1';
    kaleidoscopeImages.appendChild(kaleidoscopeImage);

    // Add to the body
    document.body.appendChild(kaleidoscope);
    console.log('Kaleidoscope container created.');

    // Load scripts in sequence
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Script load error: ${src}`));
            document.body.appendChild(script);
        });
    }

    // Load Three.js first, then kaleidoscope library
    loadScript('https://cdn.jsdelivr.net/npm/three@0.126.1/build/three.min.js')
        .then(() => {
            return loadScript('https://cdn.jsdelivr.net/gh/the-lazy-god/tlg-kaleidoscope@v2.0.1/tlg-kaleidoscope.min.js');
        })
        .then(() => {
            // Create our own initialization function that mimics the library's init
            setTimeout(() => {
                const container = document.querySelector('[tlg-kaleidoscope-canvas]');
                if (container && typeof THREE !== 'undefined') {
                    console.log('Creating kaleidoscope manually');
                    
                    // Define our own kaleidoscope class based on the library
                    class Kaleidoscope {
                        constructor(options) {
                            this.scene = new THREE.Scene();
                            this.container = options.dom;
                            // Add minimal required setup
                            this.renderer = new THREE.WebGLRenderer();
                            this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
                            this.container.appendChild(this.renderer.domElement);
                            
                            // Initialize with container attributes
                            this.init();
                        }
                        
                        init() {
                            // Force initialization on the element
                            const event = new Event('kaleidoscope-init');
                            this.container.dispatchEvent(event);
                        }
                    }
                    
                    // Create a new instance
                    new Kaleidoscope({dom: container});
                }
            }, 100);
            
            waitForKaleidoscope();
        })
        .catch(error => {
            console.error('Error loading scripts:', error);
        });

    function waitForKaleidoscope() {
        const checkInterval = setInterval(() => {
            const kaleidoscopeCanvas = document.querySelector('#kaleidoscope-container canvas');
            if (kaleidoscopeCanvas) {
                clearInterval(checkInterval);
                console.log('Kaleidoscope canvas loaded successfully');
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(checkInterval);
            console.error('Kaleidoscope canvas not found after 10 seconds');
            // Debug what's in the container
            console.log('Container contents:', document.querySelector('#kaleidoscope-container').innerHTML);
        }, 10000);
    }
}
    */
function createKaleidoscope() {

    // adapted from https://codepen.io/AAMutlu20/pen/mdYxroj by Andrey Mutlu
    
    // create a canvas element with id 'kaleidoscope-canvas'
    var canvas = document.createElement('canvas');
    canvas.id = 'kaleidoscope-canvas';

    
    var canvas_context = canvas.getContext('2d');

    var ease = 0.1;

    var kaleido_settings = {
        offsetRotation: 0,
        offsetScale: 0.8,
        offsetX: 0,
        offsetY: 0,
        radius: 1100,
        slices: 24,
        zoom: 1
    };

    document.body.appendChild(canvas);
    canvas.width = kaleido_settings.radius * 2;
    canvas.height = kaleido_settings.radius * 2;

    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        var fill = canvas_context.createPattern(img, 'repeat');

        

        function draw() {
            var scale, step, cx;

            scale = kaleido_settings.zoom * (kaleido_settings.radius / Math.min(img.width, img.height));
            step = 2 * Math.PI / kaleido_settings.slices;
            cx = img.width / 2;

            canvas_context.clearRect(0, 0, canvas.width, canvas.height);
            canvas_context.fillStyle = fill;

            for (var i = 0; i <= kaleido_settings.slices; i++) {
                canvas_context.save();
                canvas_context.translate(kaleido_settings.radius, kaleido_settings.radius);
                canvas_context.rotate(i * step);
                canvas_context.beginPath();
                canvas_context.moveTo(-0.5, -0.5);
                canvas_context.arc(0, 0, kaleido_settings.radius, step * -0.51, step * 0.51);
                canvas_context.rotate(Math.PI / 2);
                canvas_context.scale(scale, scale);
                canvas_context.scale([-1, 1][i % 2], 1);
                canvas_context.translate(kaleido_settings.offsetX - cx, kaleido_settings.offsetY);
                canvas_context.rotate(kaleido_settings.offsetRotation);
                canvas_context.scale(kaleido_settings.offsetScale, kaleido_settings.offsetScale);
                canvas_context.fill();

                canvas_context.restore();
            }
        }

        var tx = kaleido_settings.offsetX;
        var ty = kaleido_settings.offsetY;
        var tr = kaleido_settings.offsetRotation;

        // Drag state variables
        var isDragging = false;
        var lastMouseX = 0;
        var lastMouseY = 0;
        var sensitivity = 1.0;

        // Mouse events for dragging
        window.addEventListener('mousedown', function(e) {
            isDragging = true;
            lastMouseX = e.pageX;
            lastMouseY = e.pageY;
            e.preventDefault();
        }, false);

        window.addEventListener('mousemove', function(e) {
            if (isDragging) {
                var deltaX = e.pageX - lastMouseX;
                var deltaY = e.pageY - lastMouseY;
                
                // Move the image in the same direction as the drag
                tx += deltaX * sensitivity;
                ty += deltaY * sensitivity;
                
                lastMouseX = e.pageX;
                lastMouseY = e.pageY;
            }
        }, false);

        window.addEventListener('mouseup', function(e) {
            isDragging = false;
        }, false);

        // Touch events for mobile dragging
        window.addEventListener('touchstart', function(e) {
            isDragging = true;
            var touch = e.touches[0];
            lastMouseX = touch.pageX;
            lastMouseY = touch.pageY;
            e.preventDefault();
        }, false);

        window.addEventListener('touchmove', function(e) {
            if (isDragging && e.touches.length === 1) {
                var touch = e.touches[0];
                var deltaX = touch.pageX - lastMouseX;
                var deltaY = touch.pageY - lastMouseY;
                
                // Move the image in the same direction as the drag
                tx += deltaX * sensitivity;
                ty += deltaY * sensitivity;
                
                lastMouseX = touch.pageX;
                lastMouseY = touch.pageY;
                e.preventDefault();
            }
        }, false);

        window.addEventListener('touchend', function(e) {
            isDragging = false;
        }, false);

        //--- allow changing of the number of slices via clicks on the color sections
        // add event listeners clicks on the element with id 'color-section-red'
        var colorSectionRed = document.getElementById('color-section-red');
        if (colorSectionRed) {
            colorSectionRed.addEventListener('click', function() {
                // decrease the number of slides by 1
                kaleido_settings.slices = Math.max(3, kaleido_settings.slices - 1);
                showFadeText(kaleido_settings.slices, 25 );
                draw();
            });
        }

        // add event listeners clicks on the element with id 'color-section-purple'
        var colorSectionPurple = document.getElementById('color-section-purple');
        if (colorSectionPurple) {
            colorSectionPurple.addEventListener('click', function() {
                // increase the number of slides by 1
                kaleido_settings.slices += 1;
                showFadeText(kaleido_settings.slices, 25 );
                draw();
            });
        }

        //--- allow changing of the image via clicks on the color sections
        // add event listeners clicks on the element with id 'color-section-orange'
        var colorSectionOrange = document.getElementById('color-section-orange');
        if (colorSectionOrange) {
            colorSectionOrange.addEventListener('click', function() {
                // change the image to a new one
                img.src = 'images/Beautiful_Rainbow.jpg';
                //showFadeText('Image changed', 25 );
            });
        }

        // https://images.unsplash.com/photo-1473951574080-01fe45ec8643?q=80&w=2104&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
        // add event listeners clicks on the element with id 'color-section-yellow'
        var colorSectionYellow = document.getElementById('color-section-yellow');
        if (colorSectionYellow) {
            colorSectionYellow.addEventListener('click', function() {
                // change the image to a new one
                img.src = 'https://cdn.myportfolio.com/d4f6685aca7241467add1bd9d72747b0/6d104c70-d45b-46ad-941a-62e34c162fd1.jpg?h=f136716bb0fd936fbb43cc2d911057d1';
                //showFadeText('Image changed', 25 );
            });
        }

        //numberblocks_wallpaper.jpg
        // add event listeners clicks on the element with id 'color-section-green'
        var colorSectionGreen = document.getElementById('color-section-green');
        if (colorSectionGreen) {
            colorSectionGreen.addEventListener('click', function() {
                // change the image to a new one
                img.src = 'images/numberblocks_wallpaper.jpg';
                //showFadeText('Image changed', 25 );
            });
        }

        // add event listeners clicks on the element with id 'color-section-blue'
        var colorSectionBlue = document.getElementById('color-section-blue');
        if (colorSectionBlue) {
            colorSectionBlue.addEventListener('click', function() {
                // change the image to a new one
                img.src = 'images/rainbow_water.jpg';
                //showFadeText('Image changed', 25 );
            });
        }


        //---- Set styles via CSS instead of directly on the element
        const style = document.createElement('style');
        style.textContent = `
            #kaleidoscope-canvas {
            position: fixed;
            margin-left: -${kaleido_settings.radius}px;
            margin-top: -${kaleido_settings.radius}px;
            left: 50%;
            top: 50%;
            z-index: 1;
            }
        `;
        document.head.appendChild(style);

         

        function update() {
            // Remove automatic rotation - let dragging control everything
            // tr -= 0.002;  // Commented out automatic rotation

            kaleido_settings.offsetX += (tx - kaleido_settings.offsetX) * ease;
            kaleido_settings.offsetY += (ty - kaleido_settings.offsetY) * ease;
            // kaleido_settings.offsetRotation += (tr - kaleido_settings.offsetRotation) * ease;  // No auto rotation

            draw();

            requestAnimationFrame(update);
        }

        update();
    };

    img.src = 'images/Beautiful_Rainbow.jpg';
       
    // return a cleanup function, that sets the visibility to hidden
    return function cleanupKaleidoscope() {
        // remove the kaleidoscope-canvas element from the body
        var kaleidoscopeCanvas = document.getElementById('kaleidoscope-canvas');
        if (kaleidoscopeCanvas) {
            kaleidoscopeCanvas.style.visibility = 'hidden';
            kaleidoscopeCanvas.remove();
        }
    };
}
