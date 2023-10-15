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

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(20, 20, 20);
scene.add(directionalLight);


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
const floorGeometry = new THREE.PlaneGeometry(20, 20, 1, 1);
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

basketballHoop.position.set(0, 6, -5);

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
backboardMesh.position.set(0, 8, -8.2); // Adjust the position as needed

// Add the backboard to the scene
scene.add(backboardMesh);

const cubeLoader = new THREE.CubeTextureLoader();

//const backgroundTexture = loader.load('https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/glock.jpg'); //load texture for scene background

const cubeMap = cubeLoader.load([
    'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/glock.jpg', 'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/glock.jpg',
    'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/glock.jpg', 'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/glock.jpg',
    'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/glock.jpg', 'https://raw.githubusercontent.com/jacksonhorton/graphics-project/master/textures/glock.jpg'
])

scene.background = cubeMap; //Generate cubemap

// Set initial positions
ball.position.set(0, 5, 0);
floor.position.set(0, 0, 0); // Position the floor below the ball

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

const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 20);
const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 20);
const backWallGeometry = new THREE.BoxGeometry(20, wallHeight, wallThickness);
const frontWallGeometry = new THREE.BoxGeometry(20, wallHeight, wallThickness);

const invisibleWallMaterial = new THREE.MeshBasicMaterial({ visible: false });

const leftWall = new THREE.Mesh(leftWallGeometry, invisibleWallMaterial);
leftWall.position.set(-10, wallHeight / 2, 0);
scene.add(leftWall);

const rightWall = new THREE.Mesh(rightWallGeometry, invisibleWallMaterial);
rightWall.position.set(10, wallHeight/2, 0);
scene.add(rightWall);

const backWall = new THREE.Mesh(backWallGeometry, invisibleWallMaterial);
backWall.position.set(0, wallHeight/2, -10);
scene.add(backWall);

const frontWall = new THREE.Mesh(frontWallGeometry, invisibleWallMaterial);
frontWall.position.set(0, wallHeight/2, 10);
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

// Add collision event listeners for the ball
ballBody.addEventListener("collide", function (e) {
    // Calculate the new velocity based on the collision normal (e.contact.ni) and restitution
    const restitution = 0.2; // Adjust this value as needed
    const speed = ballBody.velocity.length();
    const newVelocity = new CANNON.Vec3().copy(e.contact.ni).mult(speed * restitution);
    ballBody.velocity.copy(newVelocity);
});

// Set restitution (bounciness) properties
ballBody.material.restitution = 0.6; // Adjust the restitution value as needed
floorBody.material.restitution = 0.6; // Adjust the restitution value as needed

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
ball.castShadow = true;
floor.receiveShadow = true;

// Variables for drag interaction
let isDragging = false;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const intersection = new THREE.Vector3();


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
    if (ballPosition.x - radius < -9.9) {
        ballPosition.x = -9.9 + radius; // Prevent the ball from going beyond the left wall
        ballBody.position.copy(ballPosition);
        ballBody.velocity.x = 0; // Set the ball's horizontal velocity to 0 on collision
    }

    // Check right wall collision
    if (ballPosition.x + radius > 9.9) {
        ballPosition.x = 9.9 - radius; // Prevent the ball from going beyond the right wall
        ballBody.position.copy(ballPosition);
        ballBody.velocity.x = 0; // Set the ball's horizontal velocity to 0 on collision
    }

    // Check back wall collision
    if (ballPosition.z - radius < -9.9) {
        ballPosition.z = -9.9 + radius; // Prevent the ball from going beyond the back wall
        ballBody.position.copy(ballPosition);
        ballBody.velocity.z = 0; // Set the ball's vertical velocity to 0 on collision
    }

    // Check front wall collision
    if (ballPosition.z + radius > 9.9) {
        ballPosition.z = 9.9 - radius; // Prevent the ball from going beyond the front wall
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
            score++;

            // Set the flag to indicate that the ball has scored in this interaction
            hasScored = true;

            // Call the function to update the UI immediately after increasing the score
            updateScoreUI();
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

    onWindowResize();

    renderer.render(scene, camera);
}

function updateScoreUI() {
    // Replace 'scoreDisplay' with the ID or element where you want to display the score
    const scoreDisplay = document.getElementById('scoreboard');
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${score}`;
    }
}

// Set camera position
camera.position.set(0, 12, 17); // Move the camera to (5, 5, 10)

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
    }
}

function onMouseUp() {
    if (isDragging) {
        isDragging = false;

        // Calculate a velocity based on the mouse movement
        const velocity = new THREE.Vector3().subVectors(ball.position, intersection);
        velocity.multiplyScalar(10); // Adjust the force factor here

        let targetVector = new THREE.Vector3(
        hoopBody.position.x - ball.position.x,
        hoopBody.position.y - ball.position.y+6,
        hoopBody.position.z - ball.position.z
        );
        targetVector.x = (Math.random()*4-2) + targetVector.x;
        targetVector.z = (Math.random()*6-3) + targetVector.z;
        // targetVector.z += 6;
        // targetVector.z = (Math.random()*3-1.5) + targetVector.z;
        ballBody.applyImpulse(targetVector, ballBody.position);



        // // Add some randomness to the velocity for realism
        // const randomVelocity = new THREE.Vector3(
        //     velocity.x + (Math.random() - 0.5) * 10, // Adjust the randomness as needed
        //     velocity.z - (Math.random() - 0.5) * 10 // Adjust the randomness as needed
        // );

        // // Apply a force to the ball to simulate the throw with randomness

        // ballBody.applyImpulse(new CANNON.Vec3(randomVelocity.x, randomVelocity.y + 10, randomVelocity.z), ballBody.position);

        // Apply an initial spin (angular velocity) to make the ball roll
        const angularVelocity = new CANNON.Vec3(velocity.y, 0, -velocity.x); // You can adjust this to control the spin
        ballBody.angularVelocity.copy(angularVelocity);
    }
}



function onMouseMove(event) {
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



// Start the animation loop
animate();