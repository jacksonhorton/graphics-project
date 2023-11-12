## graphics-project
A live demo of this project is available [here](https://jacksonhorton.github.io/graphics-project/game.html).

<p align="center">
  <img width="500" alt="screenshot" src="https://github.com/jacksonhorton/graphics-project/assets/59177560/0d2a4ea8-1ea4-49d2-9109-1159620c689c">
</p>

# Background
In this project, we used [Cannon.js](https://github.com/schteppe/cannon.js), a lightweight 3d physics engine, to create an arcade style basketball shooter.

# Implemented Features And How to Use Them
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

* Physics- Thanks to the Cannon.js physics engine, the program can simulate the 3D ball bouncing around in a 3D environment.

* Lighting- Using three.js and WebGL, the program uses and simulates lighting from multiple lighting sources. In this instance, 
we used multiple white point lights within the 3D environment.

* 3D Environment and Objects- This program allows the users to interact with a ball 3D object within a 3D environment consisting
 of a floor, four walls, and a basketball hoop.

* Texturing Mapping- This program uses texture mapping to implement textures for the 3D environment and objects. Additionally, 
we implemented cube mapping for the program's background textures.