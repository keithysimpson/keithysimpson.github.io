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
    
    // get the kaleidoscope canvas element
    let kaleidoscopeContainer = document.querySelector('#kaleidoscope-container');
    if (kaleidoscopeContainer) {
        kaleidoscopeContainer.style.visibility = 'visible';
    } else {
        console.error('Kaleidoscope canvas not found');
    }
       
    // return a cleanup function, that sets the visibility to hidden
    return function cleanupKaleidoscope() {
        let kaleidoscopeContainer = document.querySelector('#kaleidoscope-container');
        kaleidoscopeContainer.style.visibility = 'hidden';
    };
}
