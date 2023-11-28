# graphics-project
A live demo of this project is available [here](https://jacksonhorton.github.io/graphics-project/game.html).

<p align="center">
  <img width="500" alt="screenshot" src="https://github.com/jacksonhorton/graphics-project/assets/97753129/6ad33a6f-8a05-49a5-97cd-c7914249f779">
</p>




# Features

### Two-Player Gamemode
Currently, the only gamemode included in Hoopz is the two-player vs mode. In this mode, the first player gets 30 seconds to make as many shots as possible. Then, the second player gets 30 seconds to shoot as well. Then, the winner is shown on the top of the screen and an audio clip plays to indicate the winner.

### Power Bar and Basketball Shooting
<p align="center">
  <img src="https://github.com/jacksonhorton/graphics-project/assets/59177560/ef9c5e06-e7a7-48cd-81b9-95dc5056e744" width=500 alt="animated" />
</p>
You can control the power of your shot by holding the mouse still. The power indicator will visually show how much power that is applied when the mouse is released. This allows the user to shoot from any spot on the court. If the ball is farther away, you can put more power into the shot compared to if the ball was being shot close to the goal.

### Variable Gravity
The user can change the gravity being used by the physics engine by changing the value within the "Gravity" textbox present within the top right UI panel. By default this value is 9.81, or Earth-like gravity. Increasing or decreasing this value increases and decreases the gravity, respectively. This mechanic adds a fun customization to spice up gameplay.

### Audio
Hoopz features music and sound effects. The music can be disabled or enabled with the "Toggle Music" button. The game also features additional sound effects that are not disabled when the music is diabled. These sound effects include whistles to signal the beginning and end of each player's turn, basketball bounces, rim/goal bounce sounds, etc.

### Camera Mobility
In Hoopz, the camera can moved around by moving the mouse or by using the arrow keys on a keyboard. 
The option to move the camera with the mouse can be disabled or enabled by clicking a check box in the top right UI panel labeled: "Move the camera with mouse".  There are also textbox UI elements labeled: "Camera X", "Camera Y", and "Camera Z". You can manually change the values within these boxes to change the camera position with more granularity. Lastly, there's a "Reset Camera" button in the game controls which resets the camera back to its original position.




# Tools And Software
In this project, we used [Cannon.js](https://github.com/schteppe/cannon.js), a lightweight 3d physics engine, to create an arcade style basketball shooter.
This project also uses [Three.js](https://threejs.org/), a 3D library that assists develops in scenes, lights, shadows, materials, textures, 3d math, and more.

The project was written in WebGL, a JavaScript and HTML API for interactive 2D and 3D graphics for most available web browsers.




# Requirements Met
* 3D Environment
* Camera Movement
* Textures
* User Interactivity
* Playable Game
* Collision Detection
* Audio and Music
* Physics Engine

# Sources For Textures
* Ball Texture: [here](https://opengameart.org/content/basket-ball-texture)
* Space Background Cubemap Texture: [here](https://www.cleanpng.com/png-space-skybox-texture-mapping-cube-mapping-night-sk-776480/)
* Winning Announcements: [here](https://www.myinstants.com/en/index/us/)
* Whistle Sound Effects: [here](https://mixkit.co)
* Floor Texture: [here](https://www.psdgraphics.com/textures/basketball-floor-texture/)
* Ball Bouncing Sounds: [here](https://freesound.org/people/CraterZounds/sounds/207964/) & [here](https://freesound.org/people/qubodup/sounds/60013/)
* Scoring Sound Effect: [here](https://elements.envato.com/basketball-through-net-MVML25D)
