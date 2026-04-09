
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
    
    // Variables that need to persist across image loads
    var tx = 0;
    var ty = 0;
    var tr = 0;
    var isDragging = false;
    var lastMouseX = 0;
    var lastMouseY = 0;
    var sensitivity = 1.0;
    var fill;

    function draw() {
        if (!fill) return; // Don't draw if pattern isn't ready yet
        
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

    function update() {
        kaleido_settings.offsetX += (tx - kaleido_settings.offsetX) * ease;
        kaleido_settings.offsetY += (ty - kaleido_settings.offsetY) * ease;

        draw();
        requestAnimationFrame(update);
    }

    img.onload = function() {
        fill = canvas_context.createPattern(img, 'repeat');
        draw(); // Draw immediately when new image loads
    };

    // Set up event listeners ONCE, outside of img.onload
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
    var colorSectionRed = document.getElementById('color-section-red');
    if (colorSectionRed) {
        colorSectionRed.addEventListener('click', function() {
            kaleido_settings.slices = Math.max(3, kaleido_settings.slices - 1);
            showFadeText(kaleido_settings.slices, 25 );
            draw();
        });
    }

    var colorSectionPurple = document.getElementById('color-section-purple');
    if (colorSectionPurple) {
        colorSectionPurple.addEventListener('click', function() {
            kaleido_settings.slices += 1;
            showFadeText(kaleido_settings.slices, 25 );
            draw();
        });
    }

    //--- allow changing of the image via clicks on the color sections
    var colorSectionOrange = document.getElementById('color-section-orange');
    if (colorSectionOrange) {
        colorSectionOrange.addEventListener('click', function() {
            img.src = 'images/Beautiful_Rainbow.jpg';
        });
    }

    var colorSectionYellow = document.getElementById('color-section-yellow');
    if (colorSectionYellow) {
        colorSectionYellow.addEventListener('click', function() {
            //img.src = 'https://cdn.myportfolio.com/d4f6685aca7241467add1bd9d72747b0/6d104c70-d45b-46ad-941a-62e34c162fd1.jpg?h=f136716bb0fd936fbb43cc2d911057d1';
            img.src = 'images/wavey_rainbow_black.jpg';
        });
    }

    var colorSectionGreen = document.getElementById('color-section-green');
    if (colorSectionGreen) {
        colorSectionGreen.addEventListener('click', function() {
            img.src = 'images/numberblocks_wallpaper.jpg';
        });
    }

    var colorSectionBlue = document.getElementById('color-section-blue');
    if (colorSectionBlue) {
        colorSectionBlue.addEventListener('click', function() {
            img.src = 'images/rainbow_water.jpg';
        });
    }

    //--- Create file upload functionality
    function createImageUploadInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.id = 'kaleidoscope-image-upload';
        fileInput.style.display = 'none'; // Hide the input element
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        return fileInput;
    }

    // Create the file input and upload button
    const imageUploadInput = createImageUploadInput();
    
    // Create the upload button
    const uploadButton = document.createElement('div');
    uploadButton.id = 'kaleidoscope-upload-button';
    uploadButton.innerHTML = '+';
    uploadButton.addEventListener('click', function() {
        imageUploadInput.click(); // Trigger file picker
    });
    document.body.appendChild(uploadButton);

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
        
        #kaleidoscope-upload-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background-color: rgba(255, 255, 255, 0.8);
        border: 2px solid #333;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        font-weight: bold;
        color: #333;
        cursor: pointer;
        z-index: 10;
        user-select: none;
        transition: all 0.3s ease;
        }
        
        #kaleidoscope-upload-button:hover {
        background-color: rgba(255, 255, 255, 1);
        transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    // Load initial image and start animation
    img.src = 'images/Beautiful_Rainbow.jpg';
    update();
       
    // return a cleanup function, that sets the visibility to hidden
    return function cleanupKaleidoscope() {
        // remove the kaleidoscope-canvas element from the body
        var kaleidoscopeCanvas = document.getElementById('kaleidoscope-canvas');
        if (kaleidoscopeCanvas) {
            kaleidoscopeCanvas.style.visibility = 'hidden';
            kaleidoscopeCanvas.remove();
        }
        
        // Also remove the upload button and file input
        var uploadButton = document.getElementById('kaleidoscope-upload-button');
        if (uploadButton) {
            uploadButton.remove();
        }
        
        var uploadInput = document.getElementById('kaleidoscope-image-upload');
        if (uploadInput) {
            uploadInput.remove();
        }
    };
}
