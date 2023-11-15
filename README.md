# graphics-project
A live demo of this project is available [here](https://jacksonhorton.github.io/graphics-project/game.html).

<p align="center">
  <img width="500" alt="screenshot" src="https://github.com/jacksonhorton/graphics-project/assets/97753129/6ad33a6f-8a05-49a5-97cd-c7914249f779">
</p>

## Tools And Software
In this project, we used [Cannon.js](https://github.com/schteppe/cannon.js), a lightweight 3d physics engine, to create an arcade style basketball shooter.
This project also uses [Three.js](https://threejs.org/), a 3D library that assists develops in scenes, lights, shadows, materials, textures, 3d math, and more.

The project was written in WebGL, a JavaScript and HTML API for interactive 2D and 3D graphics for most available web browsers.


## Implemented Features And How To Use Them
* Movable Camera- The user can move around the camera by moving the mouse or by using the arrow keys on a keyboard. 
The option to move the camera with the mouse can be disabled or enabled by clicking a check box in the 
top right UI panel labeled: "Move the camera with mouse".  There are also textbox UI elements labeled: 
"Camera X", "Camera Y", and "Camera Z". The user can optionally change the values within these boxes to 
change the camera position. Lastly, there's a button labeled "Reset Camera", clicking on this button will 
reset the camera back to its original position.

* Audio- This program features audio and music. The music can be easily disabled or enabled by the user by 
clicking on the "Toggle Music" button. Additional audio effects, such as the ball bouncing, the user scoring a 
point, or the ball hitting the backboard, won't be disabled.

* Changable Gravity- The user can change the gravity being used by the physics engine by changing the value within the "Gravity"
 textbox present within the top right UI panel. By default this value is 9.81, or Earth-like gravity, increasing or 
decreasing this value increases and decreases the gravity, respectively.

* Throwable Ball- The user can pick up a 3D ball by clicking and holding the left mouse button. The ball can be thrown 
by releasing the left mouse button, though the longer the user holds onto the ball the further it will be thrown. The user, 
while holding the ball, can move it around by dragging the mouse. The ball's position can be reset to its original position 
at the center of the court by clicking on the "Reset Position" button in the top left.

* Two-Player Throwing Contest- Clicking on the "Start Game" button in the top right will a new game of a throwing contest. 
During the throwing contest, two players will be given 30 seconds to score as many points as possible by throwing the ball 
into the hoop. The contest starts with Player 1's turn before moving on to Player 2's turn. Once, Player 2's turn is complete
 the winner will be the player who scored the most points. The points each player scored can be seen in the top, center UI element.

## Requirements Met
* 3D Environment
* Camera Movement
* Textures
* User Interactivity
* Playable Game
* Collision Detection
* Audio and Music
* Physics Engine

## Sources For Textures
* Ball Texture- [here](https://opengameart.org/content/basket-ball-texture)
