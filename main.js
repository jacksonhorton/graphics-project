// Initialize Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let score = 0;

const loader = new THREE.TextureLoader();
// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.PointLight(0xffffff, 0.5, 100, 1);
directionalLight.position.set(20, 20, 20);
scene.add(directionalLight);

const directionalLight2 = new THREE.PointLight(0xffffff, 0.5, 100, 1);
directionalLight2.position.set(-20, 20, 20);
scene.add(directionalLight2);


// Create a ball (sphere) with a more realistic material
const radius = 1;
const segments = 32;
const geometry = new THREE.SphereGeometry(radius, segments, segments);

const texture = loader.load(' https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/ball.png');
// Create a basketball-like material
const basketballMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa500, // Set the color to orange
    roughness: 0.4, // Adjust roughness as needed
    metalness: 0.2, // Adjust metalness as needed
});

basketballMaterial.map = texture;

const ball = new THREE.Mesh(geometry, basketballMaterial);
scene.add(ball);

// Create a floor
const floorGeometry = new THREE.PlaneGeometry(30, 40, 1, 1);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xfff000, side: THREE.DoubleSide });
const floorTexture = loader.load('https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/basketball-floor-texture.jpg', function (texture) {
    floorMaterial.map = texture; //Assign texture
    floorMaterial.needsUpdate = true; //Update floor object
}, undefined, function (error) {
    console.error('Error: Could not load texture', error);
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal
scene.add(floor);

// Create a basketball hoop using TorusGeometry
const hoopRadius = 3; // Adjust the hoop's radius
const tubeRadius = 0.2; // Adjust the tube's radius
const radialSegments = 16; // Adjust the number of segments
const tubularSegments = 100; // Adjust the number of segments

const hoopGeometry = new THREE.TorusGeometry(hoopRadius, tubeRadius, radialSegments, tubularSegments);
const hoopMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Adjust the color

// Create the hoop mesh
const basketballHoop = new THREE.Mesh(hoopGeometry, hoopMaterial);

// Modify the collisionResponse property of the hoopMaterial
hoopMaterial.collisionResponse = 0.0001; // Adjust this value as needed

basketballHoop.position.set(0, 6, -6);

// Rotate it to be vertical
basketballHoop.rotation.set(Math.PI / 2, 0, 0);

// Add the hoop to the scene
scene.add(basketballHoop);

// Define the backboard dimensions
const backboardWidth = 10; // Adjust the width as needed
const backboardHeight = 4; // Adjust the height as needed
const backboardDepth = 0.2; // Adjust the depth as needed

// Create the backboard geometry
const backboardGeometry = new THREE.BoxGeometry(backboardWidth, backboardHeight, backboardDepth);

// Create a material for the backboard (you can adjust the color)
const backboardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Adjust the color as needed

const backboardTexture = loader.load('https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/backboard.png', function (texture1) {
    backboardMaterial.map = texture1; //Assign texture
    backboardMaterial.needsUpdate = true; //Update backboard object
}, undefined, function (error) {
    console.error('Error: Could not load texture', error);
});

// Create the backboard mesh
const backboardMesh = new THREE.Mesh(backboardGeometry, backboardMaterial);

// Position the backboard relative to the hoop
backboardMesh.position.set(0, 8, -9); // Adjust the position as needed

// Add the backboard to the scene
scene.add(backboardMesh);

const cubeLoader = new THREE.CubeTextureLoader();

//const backgroundTexture = loader.load('https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/space.png'); //load texture for scene background

const cubeMap = cubeLoader.load([
    'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/space/left.png', 'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/space/right.png',
    'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/space/top.png', 'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/space/bottom.png',
    'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/space/back.png', 'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/space/front.png'
])

scene.background = cubeMap; //Generate cubemap

// Set initial positions
ball.position.set(0, 5, 0);
floor.position.set(0, 0, 10); // Position the floor below the ball

// Create a Cannon.js world for physics simulation
const world = new CANNON.World();
world.gravity.set(0, -9.81, 0);

// Add the ball to the Cannon.js world
const ballShape = new CANNON.Sphere(radius);
const ballBody = new CANNON.Body({ mass: 0.6237, shape: ballShape, material: new CANNON.Material() });
ballBody.position.copy(ball.position);
ballBody.linearDamping = 0.4; // Add linear damping
ballBody.angularDamping = 0.4; // Add angular damping
world.addBody(ballBody);

// Add the floor to the Cannon.js world
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({ mass: 0, shape: floorShape, material: new CANNON.Material() });
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // Rotate the floor to be horizontal
world.addBody(floorBody);

// Create a Cannon.js body for the basketball hoop
const hoopShape = new CANNON.Trimesh.createTorus(hoopRadius, tubeRadius, radialSegments, tubularSegments);
const hoopBody = new CANNON.Body({ mass: 0, shape: hoopShape, material: new CANNON.Material() });
hoopBody.position.set(basketballHoop.position.x, basketballHoop.position.y, basketballHoop.position.z);
hoopBody.quaternion.copy(basketballHoop.quaternion);
hoopBody.material.restitution = 0.6;
world.addBody(hoopBody);

// Define the shape of the backboard
const backboardShape = new CANNON.Box(new CANNON.Vec3(backboardWidth / 2, backboardHeight / 2, backboardDepth / 2));

// Create the Cannon.js body for the backboard
const backboardBody = new CANNON.Body({ mass: 0, shape: backboardShape, material: new CANNON.Material() });

// Set the position of the backboard body (same as the backboard mesh)
backboardBody.position.set(backboardMesh.position.x, backboardMesh.position.y, backboardMesh.position.z);
backboardMesh.receiveShadow = true;
// Add the backboard body to the Cannon.js world
world.addBody(backboardBody);


// Create invisible walls
const wallThickness = 0.1; // Adjust the thickness as needed
const wallHeight = 15; // Adjust the height as needed

const courtDepth = 30;
const courtWidth = 30;

const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 30);
const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 30);
const backWallGeometry = new THREE.BoxGeometry(30, wallHeight, wallThickness);
const frontWallGeometry = new THREE.BoxGeometry(30, wallHeight, wallThickness);

const invisibleWallMaterial = new THREE.MeshBasicMaterial({ visible: false });
const visibleWallMaterial = new THREE.MeshBasicMaterial({ visible: true, opacity: 0.5, transparent: true });

const leftWall = new THREE.Mesh(leftWallGeometry, invisibleWallMaterial);
leftWall.position.set(-15, wallHeight / 2, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(rightWallGeometry, invisibleWallMaterial);
rightWall.position.set(15, wallHeight/2, 0);
scene.add(rightWall);

const backWall = new THREE.Mesh(backWallGeometry, invisibleWallMaterial);
backWall.position.set(0, wallHeight/2, -10);
scene.add(backWall);

const frontWall = new THREE.Mesh(frontWallGeometry, invisibleWallMaterial);
frontWall.position.set(0, wallHeight/2, 15);
scene.add(frontWall);

// Create Cannon.js bodies for the walls
const leftWallShape = new CANNON.Box(new CANNON.Vec3(wallThickness / 2, wallHeight, 10));
const leftWallBody = new CANNON.Body({ mass: 0, shape: leftWallShape });
leftWallBody.position.copy(leftWall.position);
world.addBody(leftWallBody);

const rightWallShape = new CANNON.Box(new CANNON.Vec3(wallThickness / 2, wallHeight / 2, 10));
const rightWallBody = new CANNON.Body({ mass: 0, shape: rightWallShape });
rightWallBody.position.copy(rightWall.position);
world.addBody(rightWallBody);

const backWallShape = new CANNON.Box(new CANNON.Vec3(10, wallHeight / 2, wallThickness / 2));
const backWallBody = new CANNON.Body({ mass: 0, shape: backWallShape });
backWallBody.position.copy(backWall.position);
world.addBody(backWallBody);

const frontWallShape = new CANNON.Box(new CANNON.Vec3(10, wallHeight / 2, wallThickness / 2));
const frontWallBody = new CANNON.Body({ mass: 0, shape: frontWallShape });
frontWallBody.position.copy(frontWall.position);
world.addBody(frontWallBody);

// Set collision filters to interact with the ball
ballBody.collisionFilterGroup = 1; // Default group for the ball
ballBody.collisionFilterMask = 1; // Collide with the default group

leftWallBody.collisionFilterGroup = 2; // Custom group for the left wall
leftWallBody.collisionFilterMask = 1; // Collide with the default group (ball)

rightWallBody.collisionFilterGroup = 3; // Custom group for the right wall
rightWallBody.collisionFilterMask = 1; // Collide with the default group (ball)

backWallBody.collisionFilterGroup = 4; // Custom group for the back wall
backWallBody.collisionFilterMask = 1; // Collide with the default group (ball)

frontWallBody.collisionFilterGroup = 5; // Custom group for the front wall
frontWallBody.collisionFilterMask = 1; // Collide with the default group (ball)

// Set restitution (bounciness) properties
ballBody.material.restitution = 0.85; // Adjust the restitution value as needed
floorBody.material.restitution = 1.0; // Adjust the restitution value as needed

// Add collision event listeners for the ball
ballBody.addEventListener("collide", function (e) {
    // Calculate the new velocity based on the collision normal (e.contact.ni) and restitution
    const restitution = 1.0; // Adjust this value as needed
    const speed = ballBody.velocity.length();
    const newVelocity = new CANNON.Vec3().copy(e.contact.ni).mult(speed * restitution);
    ballBody.velocity.copy(newVelocity);
});

// Add collision event listeners for the floor
floorBody.addEventListener("collide", function (e) {
    const randomBounce = bounces[Math.floor(Math.random() * bounces.length)];
    randomBounce.play();
});

backboardBody.addEventListener("collide", function (e) {
    backboard.play();
});

// Set restitution (bounciness) properties
ballBody.material.restitution = 0.8; // Adjust the restitution value as needed
floorBody.material.restitution = 1; // Adjust the restitution value as needed

//Changes Bounciness
const bouncinessInput = document.getElementById("bounciness");
bouncinessInput.addEventListener("input", () => {
    const newBounciness = bouncinessInput.value; // Invert the value as Cannon.js uses negative Y for gravity
    ballBody.material.restitution = newBounciness;
});

// Find the respawn button element by its id
const respawnButton = document.getElementById('respawnButton');

// Add a click event listener to the button
respawnButton.addEventListener('click', () => {
    // Set the ball's position back to its initial position
    ball.position.set(0, 5, 0);
    ballBody.position.copy(ball.position);
    ballBody.velocity.set(0, 0, 0);
    ballBody.angularVelocity.set(0, 0, 0);
});

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;
directionalLight2.castShadow = true;
ball.castShadow = true;
floor.receiveShadow = true;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
const moveSpeed = 0.1;
const cameraRotationSpeed = 0.01;
const cameraZoomSpeed = 0.1;
let isDraggingCamera = false;
let previousMouseX, previousMouseY;

document.addEventListener('mousedown', onMouseDownCamera);
document.addEventListener('mouseup', onMouseUpCamera);
document.addEventListener('mousemove', onMouseMoveCamera);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
// Variables for drag interaction
let isDragging = false;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const intersection = new THREE.Vector3();

//For audio
const audioListener = new THREE.AudioListener();
camera.add(audioListener);

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioCheck = false;

const audioLoader = new THREE.AudioLoader();
const music = new THREE.Audio(audioListener);
const bounceURLS = [
    'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/audio/bounce1.mp3',
    'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/audio/bounce2.mp3',
    'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/audio/bounce3.mp3',
    'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/audio/bounce4.mp3',
    'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/audio/bounce5.mp3'
];
const bounces = [];
const grab = new THREE.Audio(audioListener);
const swish = new THREE.Audio(audioListener);
const whoosh = new THREE.Audio(audioListener);
const backboard = new THREE.Audio(audioListener);

audioLoader.load('https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/audio/music.mp3', function (buffer) {
    music.setBuffer(buffer);
    music.setLoop(true);
    music.setVolume(0.20);
});

for (const soundURL of bounceURLS) {
    const bounce = new THREE.Audio(audioListener);
    audioLoader.load(soundURL, function (buffer) {
        bounce.setBuffer(buffer);
        bounce.setVolume(0.25);
    });
    bounces.push(bounce);
}

audioLoader.load('https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/audio/grab.mp3', function (buffer) {
        grab.setBuffer(buffer);
        grab.setVolume(0.75);
    })

audioLoader.load('https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/audio/swish.mp3', function (buffer) {
        swish.setBuffer(buffer);
        swish.setVolume(0.75);
    })

audioLoader.load('https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/audio/whoosh.mp3', function (buffer) {
        whoosh.setBuffer(buffer);
        whoosh.setVolume(0.5);
})

audioLoader.load('https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/audio/backboard.mp3', function (buffer) {
    backboard.setBuffer(buffer);
    backboard.setVolume(0.5);
})

document.getElementById('audioButton').addEventListener('click', function () {
    if (audioCheck) {
        music.pause();
        audioCheck = false;
    } else {
        music.play();
        audioCheck = true;
    }
});

function onMouseDownCamera(event) {
    if (!mouseCameraControlsEnabled) { return; }
    isDraggingCamera = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
}

function onMouseUpCamera() {
    isDraggingCamera = false;
}

function onMouseMoveCamera(event) {
    if (isDraggingCamera) {
        // Check if the mouse is over the ball
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(ball);

        if (intersects.length === 0) {
            const deltaX = (event.clientX - previousMouseX) * cameraRotationSpeed;
            const deltaY = (event.clientY - previousMouseY) * cameraRotationSpeed;

            // Rotate the camera based on mouse movement
            camera.rotation.y -= deltaX;
            camera.rotation.x -= deltaY;
	    // Update the input values with the new camera rotation
            cameraXInput.value = camera.position.x.toFixed(2);
            cameraYInput.value = camera.position.y.toFixed(2);
            cameraZInput.value = camera.position.z.toFixed(2);
        }

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
}

function onKeyDown(event) {
    if (event.key === 'ArrowUp' || event.key === 'w') {
        moveForward = true;
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        moveBackward = true;
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        moveLeft = true;
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        moveRight = true;
    }
    // Update the input values with the new camera position
    cameraXInput.value = camera.position.x.toFixed(2);
    cameraYInput.value = camera.position.y.toFixed(2);
    cameraZInput.value = camera.position.z.toFixed(2);
}

function onKeyUp(event) {
    if (event.key === 'ArrowUp' || event.key === 'w') {
        moveForward = false;
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        moveBackward = false;
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        moveLeft = false;
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        moveRight = false;
    }
    // Update the input values with the new camera position
    cameraXInput.value = camera.position.x.toFixed(2);
    cameraYInput.value = camera.position.y.toFixed(2);
    cameraZInput.value = camera.position.z.toFixed(2);
}


function onWindowResize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Update the camera's aspect ratio
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    // Update the renderer's size
    renderer.setSize(newWidth, newHeight);
}

// Add the event listener for window resize
window.addEventListener('resize', onWindowResize);

// throw power bar setup code
let lastMouseMove = Date.now();
const powerBar = document.querySelector('.bar');
const powerBarContainer = document.querySelector('.throwPowerBox')

let needsReset = false;
// Add collision detection for the ball and barriers in the animate function
function animate() {
    requestAnimationFrame(animate);
    // Step the physics simulation
    world.step(1 / 30);

    // Update the ball's position based on physics
    ball.position.copy(ballBody.position);

    // Check for collisions with barriers
    const ballPosition = ballBody.position;

    // Check left wall collision
    if (ballPosition.x - radius < -courtWidth/2+0.1) {
        ballPosition.x = -courtWidth/2+0.1 + radius; // Prevent the ball from going beyond the left wall
        ballBody.position.copy(ballPosition);
        ballBody.velocity.x = 0; // Set the ball's horizontal velocity to 0 on collision
    }

    // Check right wall collision
    if (ballPosition.x + radius > courtWidth/2-0.1) {
        ballPosition.x = courtWidth/2-0.1 - radius; // Prevent the ball from going beyond the right wall
        ballBody.position.copy(ballPosition);
        ballBody.velocity.x = 0; // Set the ball's horizontal velocity to 0 on collision
    }

    // Check back wall collision
    if (ballPosition.z - radius < -courtDepth/2+0.1) {
        ballPosition.z = -courtDepth/2+0.1 + radius; // Prevent the ball from going beyond the back wall
        ballBody.position.copy(ballPosition);
        ballBody.velocity.z = 0; // Set the ball's vertical velocity to 0 on collision
    }

    // Check front wall collision
    if (ballPosition.z + radius > courtDepth/2-0.1) {
        ballPosition.z = courtDepth/2-0.1 - radius; // Prevent the ball from going beyond the front wall
            ballBody.position.copy(ballPosition);
        ballBody.velocity.z = 0; // Set the ball's vertical velocity to 0 on collision
    }
    
    // Check if the ball passes through the hoop
    if (
        ballPosition.x >= -hoopRadius &&
        ballPosition.x <= hoopRadius &&
        ballPosition.z <= hoopBody.position.z + hoopRadius &&
        ballPosition.z >= hoopBody.position.z - hoopRadius &&
        ballPosition.y <= hoopBody.position.y + tubeRadius &&
        ballPosition.y >= hoopBody.position.y - tubeRadius) 
    {
        if (!hasScored) {
            // Increase the score
        swish.play();
	    if(player1Active && gameActive) {
		player1Score++;
		console.log(player1Score);
	    } else if(player2Active && gameActive) {
		player2Score++;		
            }
	    document.getElementById("player1Score").textContent = "Player 1: " + player1Score;
  	    document.getElementById("player2Score").textContent = "Player 2: " + player2Score;
            // Set the flag to indicate that the ball has scored in this interaction
            hasScored = true;
	    needsReset = true;
	    // Check if the ball needs to be reset with a delay
        if (needsReset) {
            setTimeout(() => {
            // Reset the ball's position
            ball.position.set(0, 5, 0);
            ballBody.position.copy(ball.position);
            ballBody.velocity.set(0, 0, 0);
            ballBody.angularVelocity.set(0, 0, 0);
            
            // Reset the flag
            needsReset = false;
        }, 1000); // Delay in milliseconds (2000 ms = 2 seconds)
    }
        }
    } else {
        // Reset the hasScored flag when the ball is not in the scoring position
        hasScored = false;
    }
    // Camera movement
    if (moveForward) {
        camera.position.z -= moveSpeed;
    }

    if (moveBackward) {
        camera.position.z += moveSpeed;
    }

    if (moveLeft) {
        camera.position.x -= moveSpeed;
    }

    if (moveRight) {
        camera.position.x += moveSpeed;
    }
    onWindowResize();

    // shot power bar update
    if (isDragging && lastMouseMove + 200 < Date.now()) { // if it has been 100ms since last mouse movement...
        powerBarContainer.style.visibility = 'visible';
        // get height from power bar
        let currentHeight = Number(powerBar.style.height.replace("%",""));
        // increment power
        currentHeight+=1.5;
        // check not greater than 100%
        if (currentHeight > 100) {currentHeight = 100;}
        // update ui
        powerBar.style.height = `${currentHeight}%`;
    }
    else {
        // is not dragging, hide power bar
        if (isDragging) {
            powerBarContainer.style.visibility = 'visible';
        }
        else {
            powerBarContainer.style.visibility = 'hidden';
        }
        powerBar.style.height = "0%";
    }

    renderer.render(scene, camera);
}


// Variables to keep track of game state
let player1Score = 0;
let player2Score = 0;
let player1Active = false;
let player2Active = false;
let gameActive = false;

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    player1Active = false;
    player2Active = false;
    gameActive = false;

    // Display the initial scores
    document.getElementById("player1Score").textContent = "Player 1: " + player1Score;
    document.getElementById("player2Score").textContent = "Player 2: " + player2Score;
}

// Function to start the game
function startGame() {
  resetGame();
  if (gameActive) {
    return; // Game is already active
  }
  
  gameActive = true;
  player1Score = 0;
  player2Score = 0;
  player1Active = true;
  // Display the initial scores
  document.getElementById("player1Score").textContent = "Player 1: " + player1Score;
  document.getElementById("player2Score").textContent = "Player 2: " + player2Score;

  // Indicate player 1's turn
  document.getElementById("winner").textContent = "Player 1's Turn";

  // Start a 30-second timer for player 1
  setTimeout(() => {
    gameActive = false;
    document.getElementById("winner").textContent = "Switching to Player 2";
    gameActive = true;
    player2Active = true;
    player1Active = false;
    setTimeout(() => {
      // Indicate player 2's turn
      document.getElementById("winner").textContent = "Player 2's Turn";

      // Start a 30-second timer for player 2
      setTimeout(() => {
        gameActive = false;

        // Determine the winner and display the result
        if (player1Score > player2Score) {
          document.getElementById("winner").textContent = "Winner: Player 1";
        } else if (player2Score > player1Score) {
          document.getElementById("winner").textContent = "Winner: Player 2";
        } else {
          document.getElementById("winner").textContent = "It's a tie!";
        }
      }, 30000); // 30 seconds for player 2
    }, 1000); // 1-second delay before player 2's turn
  }, 30000); // 30 seconds for player 1
}

// Event listener for the "Start Game" button
document.getElementById("startGameButton").addEventListener("click", startGame);


// camera mouse controls toggle
var checkbox = document.querySelector("input[name=mouseControls]");
var mouseCameraControlsEnabled = checkbox.checked;
checkbox.addEventListener('change', function() {
    mouseCameraControlsEnabled = this.checked;
});

// Set camera position
camera.position.set(0, 12, 17); 

// Set the look-at point
const target = new THREE.Vector3(0, 0, 0); // Point the camera at the center of the scene
camera.lookAt(target);

// Get the input elements
const cameraXInput = document.getElementById('cameraX');
const cameraYInput = document.getElementById('cameraY');
const cameraZInput = document.getElementById('cameraZ');

// Add event listeners to update camera position
cameraXInput.addEventListener('input', updateCameraPosition);
cameraYInput.addEventListener('input', updateCameraPosition);
cameraZInput.addEventListener('input', updateCameraPosition);

// Function to update camera position based on input values
function updateCameraPosition() {
    const x = parseFloat(cameraXInput.value);
    const y = parseFloat(cameraYInput.value);
    const z = parseFloat(cameraZInput.value);

    // Set the camera's position
    camera.position.set(x, y, z);

    // Update the camera's look-at point (optional)
    camera.lookAt(target);
}

// Event listeners for mouse interaction
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousemove', onMouseMove);

function onMouseDown(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.set(x, y);
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(ball);

    if (intersects.length > 0) {
        isDragging = true;
        ballBody.velocity.set(0, 0, 0); // Stop the physics simulation while dragging
        raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), intersection);
        grab.play();
    }
}

function onMouseUp() {
    if (isDragging) {
        isDragging = false;
        
        // Calculate a velocity based on the mouse movement
        const velocity = new THREE.Vector3().subVectors(ball.position, intersection);
        velocity.multiplyScalar(10); // Adjust the force factor here

        let shotPower = Number(powerBar.style.height.replace("%",""));

        let targetVector = distanceToHoop(ball);

        targetVector.x *= shotPower;
        targetVector.y = 5+(.09*shotPower);
        targetVector.z *= shotPower;
        ballBody.applyImpulse(targetVector, ballBody.position);

        // Apply an initial spin (angular velocity) to make the ball roll
        const angularVelocity = new CANNON.Vec3(velocity.y, 0, -velocity.x); // You can adjust this to control the spin
        ballBody.angularVelocity.copy(angularVelocity);
        whoosh.play();
    }
}

function distanceToHoop(body) {
    let distance = new THREE.Vector3(
        (hoopBody.position.x - body.position.x)/1.5/100,
        0,
        (hoopBody.position.z - body.position.z-3)/1.5/100);

    return distance;
}


function onMouseMove(event) {
    // update the time of the last mouse movement
    lastMouseMove = Date.now();

    if (isDragging) {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        mouse.set(x, y);

        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), intersection);
	    // ballBody.position.y = intersection.y;
	    // ball.position.y = intersection.y;
        ballBody.position.copy(intersection);
        ball.position.copy(intersection);
	    ball.position.y = 1;
	    ballBody.position.y = 1;
    }
}

// Find the camera reset button element by its id
const cameraResetButton = document.getElementById('cameraResetButton');

// Add a click event listener to the button
cameraResetButton.addEventListener('click', () => {
    // Reset the camera's position to the initial values
    cameraXInput.value = 0;
    cameraYInput.value = 12;
    cameraZInput.value = 16;

    // Update the camera's position based on the input values
    updateCameraPosition();
});

//Changes Gravity
const gravityInput = document.getElementById("gravity");
gravityInput.addEventListener("input", () => {
    const newGravity = -parseFloat(gravityInput.value); // Invert the value as Cannon.js uses negative Y for gravity
    world.gravity.set(0, newGravity, 0);
});
// Start the animation loop
animate();